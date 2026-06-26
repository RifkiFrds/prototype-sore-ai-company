import { ModalSubmitInteraction, EmbedBuilder } from 'discord.js';
import { SessionService } from '../../services/session.service';
import { StreamService } from '../../services/stream.service';
import { CustomIds } from '../../types/discord.types';

export async function handleChatPromptModal(interaction: ModalSubmitInteraction): Promise<void> {
  const content = interaction.fields.getTextInputValue(CustomIds.CHAT_INPUT_CONTENT);
  const userId = interaction.user.id;
  const username = interaction.user.username;

  // Immediately defer response to avoid timeout
  await interaction.deferReply();

  try {
    // Retrieve existing or instantiate new session
    const sessionId = await SessionService.getOrCreateSession(userId, username);

    // Initial response placeholder
    const thinkingEmbed = new EmbedBuilder()
      .setColor(0x00A2FF) // Sleek blue thinking status
      .setDescription('🤖 **Thinking...**\nConnecting to company knowledge base...');
    
    const message = await interaction.editReply({ 
      content: '🤖 *Thinking...*', 
      embeds: [] // We stream raw text directly onto content
    });

    // Start streaming directly to the message object
    await StreamService.streamChat(sessionId, content, message);
  } catch (error: any) {
    console.error('Error in chat modal submission:', error);
    const errorEmbed = new EmbedBuilder()
      .setColor(0xFF3366)
      .setTitle('❌ AI Stream Request Failed')
      .setDescription(`An error occurred while processing your message:\n\`\`\`${error.message || error}\`\`\``)
      .setTimestamp();

    await interaction.editReply({ 
      content: '', 
      embeds: [errorEmbed] 
    });
  }
}
