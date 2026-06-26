import { Message } from 'discord.js';

interface SseMessage {
  event: string;
  data: any;
}

export class StreamService {
  private static getBaseUrl(): string {
    const url = process.env.API_BASE_URL || 'http://localhost:3000/api';
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  /**
   * Connects to GET /api/chats/:id/messages/stream and handles SSE updates
   * with rate-limiting throttling for Discord messages.
   */
  public static async streamChat(
    sessionId: string,
    content: string,
    messageToEdit: Message
  ): Promise<void> {
    const url = `${this.getBaseUrl()}/chats/${sessionId}/messages/stream?content=${encodeURIComponent(content)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to establish stream connection: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null, cannot read stream.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let buffer = '';
      let thinkingBuffer = '';
      let contentBuffer = '';
      let isDone = false;
      
      // Throttle configuration
      const THROTTLE_MS = 1500;
      let lastUpdate = 0;
      let lastEditedText = '';
      let updatePending = false;
      let updateTimeout: NodeJS.Timeout | null = null;

      const triggerMessageUpdate = async (force = false) => {
        const now = Date.now();
        
        // If not forced and we're within the throttle window, schedule a deferred update
        if (!force && now - lastUpdate < THROTTLE_MS) {
          if (!updatePending) {
            updatePending = true;
            if (updateTimeout) clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
              updatePending = false;
              triggerMessageUpdate(false);
            }, THROTTLE_MS - (now - lastUpdate));
          }
          return;
        }

        // Cancel any pending deferred updates since we are updating now
        if (updateTimeout) {
          clearTimeout(updateTimeout);
          updateTimeout = null;
        }
        updatePending = false;
        lastUpdate = now;

        // Build status/thinking message representation
        let text = '';
        if (thinkingBuffer) {
          // Format thinking section beautifully inside quotes or italics
          text += `*Thinking...*\n> ${thinkingBuffer.trim().replace(/\n/g, '\n> ')}\n\n`;
        }
        
        if (contentBuffer) {
          text += contentBuffer;
        } else if (!isDone) {
          text += '🤖 *Generating response...*';
        }

        // Clip text if it exceeds Discord's 2000 character limit
        if (text.length > 2000) {
          text = text.substring(0, 1990) + '... (truncated)';
        }

        if (text && text !== lastEditedText) {
          try {
            await messageToEdit.edit({ content: text });
            lastEditedText = text;
          } catch (discordError: any) {
            console.error('Failed to edit Discord message chunk:', discordError.message);
          }
        }
      };

      // Helper function to process complete SSE events
      const handleSseMessage = async (msg: SseMessage) => {
        switch (msg.event) {
          case 'thinking':
            if (msg.data && msg.data.chunk) {
              thinkingBuffer += msg.data.chunk;
              await triggerMessageUpdate();
            }
            break;
          case 'content':
            if (msg.data && msg.data.chunk) {
              contentBuffer += msg.data.chunk;
              await triggerMessageUpdate();
            }
            break;
          case 'status':
            if (msg.data && msg.data.status === 'done') {
              isDone = true;
              await triggerMessageUpdate(true);
            }
            break;
          case 'error':
            throw new Error(msg.data?.message || 'Unknown backend AI error');
        }
      };

      // Read from network stream
      let currentEvent = 'message'; // NestJS default SSE event name is 'message' if not overridden
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Save the incomplete last line back to the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith('event:')) {
            currentEvent = trimmed.substring(6).trim();
          } else if (trimmed.startsWith('data:')) {
            const dataStr = trimmed.substring(5).trim();
            try {
              const dataObj = JSON.parse(dataStr);
              await handleSseMessage({ event: currentEvent, data: dataObj });
            } catch (err) {
              // If it's not JSON, pass the raw string
              await handleSseMessage({ event: currentEvent, data: dataStr });
            }
          }
        }
      }

      // Handle any remaining content left in buffer
      if (buffer.trim()) {
        const trimmed = buffer.trim();
        if (trimmed.startsWith('data:')) {
          const dataStr = trimmed.substring(5).trim();
          try {
            const dataObj = JSON.parse(dataStr);
            await handleSseMessage({ event: currentEvent, data: dataObj });
          } catch {
            await handleSseMessage({ event: currentEvent, data: dataStr });
          }
        }
      }

      // Final forced message update to ensure all text is flushed
      isDone = true;
      await triggerMessageUpdate(true);

    } catch (error: any) {
      console.error('SSE Stream subscription error:', error);
      try {
        await messageToEdit.edit({
          content: `❌ **Error while streaming response:** ${error.message || 'An unexpected error occurred.'}`
        });
      } catch (discordError) {
        console.error('Failed to send final error message to channel:', discordError);
      }
      throw error;
    }
  }
}
