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
    let activeMessage = messageToEdit;

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
      const contentParts: string[] = [''];
      let currentPartIndex = 0;
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
        if (currentPartIndex === 0) {
          if (contentParts[0]) {
            text += contentParts[0];
          } else if (isDone) {
            text += '🤖 *No response content received.*';
          } else {
            // Keep the initial "Thinking..." message, don't edit yet
            return;
          }
        } else {
          if (contentParts[currentPartIndex]) {
            text += contentParts[currentPartIndex];
          } else if (!isDone) {
            text += '🤖 *Generating response...*';
          }
        }

        // Clip text if it exceeds Discord's 2000 character limit
        if (text.length > 2000) {
          text = text.substring(0, 1990) + '... (truncated)';
        }

        if (text && text !== lastEditedText) {
          try {
            await activeMessage.edit({ content: text });
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
            // Ignore thinking process completely to prevent cluttering the interface and wasting character limits
            break;
          case 'content':
            if (msg.data && msg.data.chunk) {
              let currentPartText = contentParts[currentPartIndex] + msg.data.chunk;

              // Auto-chunking threshold at 1900 chars (giving buffer for formatting / embeds)
              if (currentPartText.length > 1900) {
                const allowedLength = 1900;
                let splitIdx = allowedLength;

                // Search window to find a space or newline in the last 100 chars
                const searchWindow = currentPartText.substring(allowedLength - 100, allowedLength);
                const lastSpace = Math.max(searchWindow.lastIndexOf(' '), searchWindow.lastIndexOf('\n'));
                if (lastSpace !== -1) {
                  splitIdx = (allowedLength - 100) + lastSpace;
                }

                const keep = currentPartText.substring(0, splitIdx);
                const overflow = currentPartText.substring(splitIdx);

                contentParts[currentPartIndex] = keep;
                // Flush current message with finalized content
                await triggerMessageUpdate(true);

                currentPartIndex++;
                contentParts[currentPartIndex] = overflow;

                // Send a new follow-up message to continue streaming the response
                try {
                  if (activeMessage.channel && 'send' in activeMessage.channel) {
                    activeMessage = await (activeMessage.channel as any).send({
                      content: '🤖 *Generating response...*'
                    });
                    lastEditedText = '🤖 *Generating response...*';
                  } else {
                    throw new Error('Channel is not sendable (missing send method)');
                  }
                } catch (discordError: any) {
                  console.error('Failed to send follow-up message:', discordError.message);
                }
              } else {
                contentParts[currentPartIndex] = currentPartText;
              }
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
        if (done) {
          buffer += decoder.decode(); // Flush any remaining bytes
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // SSE messages are separated by double newlines (\n\n or \r\n\r\n)
        const normalizedBuffer = buffer.replace(/\r\n/g, '\n');
        const blocks = normalizedBuffer.split('\n\n');
        
        // Save the incomplete last block back to the buffer
        buffer = blocks.pop() || '';

        for (const block of blocks) {
          const lines = block.split('\n');
          let eventName = currentEvent;
          let dataBuffer = '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (trimmed.startsWith('event:')) {
              eventName = trimmed.substring(6).trim();
            } else if (trimmed.startsWith('data:')) {
              dataBuffer += (dataBuffer ? '\n' : '') + trimmed.substring(5).trim();
            }
          }

          if (dataBuffer) {
            currentEvent = eventName;
            try {
              const dataObj = JSON.parse(dataBuffer);
              await handleSseMessage({ event: eventName, data: dataObj });
            } catch (err) {
              // If it's not JSON, pass the raw string/buffer
              await handleSseMessage({ event: eventName, data: dataBuffer });
            }
          }
        }
      }

      // Handle any remaining content left in buffer
      if (buffer.trim()) {
        const normalizedBuffer = buffer.replace(/\r\n/g, '\n');
        const blocks = normalizedBuffer.split('\n\n');
        for (const block of blocks) {
          const lines = block.split('\n');
          let eventName = currentEvent;
          let dataBuffer = '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (trimmed.startsWith('event:')) {
              eventName = trimmed.substring(6).trim();
            } else if (trimmed.startsWith('data:')) {
              dataBuffer += (dataBuffer ? '\n' : '') + trimmed.substring(5).trim();
            }
          }

          if (dataBuffer) {
            try {
              const dataObj = JSON.parse(dataBuffer);
              await handleSseMessage({ event: eventName, data: dataObj });
            } catch {
              await handleSseMessage({ event: eventName, data: dataBuffer });
            }
          }
        }
      }

      // Final forced message update to ensure all text is flushed
      isDone = true;
      await triggerMessageUpdate(true);

    } catch (error: any) {
      console.error('SSE Stream subscription error:', error);
      try {
        await activeMessage.edit({
          content: `❌ **Error while streaming response:** ${error.message || 'An unexpected error occurred.'}`
        });
      } catch (discordError) {
        console.error('Failed to send final error message to channel:', discordError);
      }
      throw error;
    }
  }
}
