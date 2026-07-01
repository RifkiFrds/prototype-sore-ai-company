import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types/discord.types';
import { ApiService } from '../services/api.service';

const uploadStatusCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('upload-status')
    .setDescription('Check embedding and processing status of uploaded knowledge-base files'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ flags: ['Ephemeral'] });

    try {
      const documents = await ApiService.getRagDocuments();

      const embed = new EmbedBuilder()
        .setColor(0x00A2FF)
        .setTitle('📋 Knowledge Base Upload Status')
        .setDescription(documents.length === 0 ? '*No documents have been uploaded yet.*' : `*Here is the current RAG namespace processing summary:*`)
        .setTimestamp()
        .setFooter({ text: 'RAG Document Management System', iconURL: interaction.client.user?.displayAvatarURL() });

      // Limit to 25 fields maximum (Discord Embed constraint)
      const displayDocs = documents.slice(0, 25);
      for (const doc of displayDocs) {
        const status = (doc.status || '').toLowerCase();
        let statusEmoji = '⚙️';
        if (status.includes('indexed') || status.includes('success') || status.includes('done') || status.includes('completed')) {
          statusEmoji = '✅';
        } else if (status.includes('processing') || status.includes('embedding') || status.includes('pending')) {
          statusEmoji = '🔄';
        } else if (status.includes('failed') || status.includes('error')) {
          statusEmoji = '❌';
        }

        const uploadDateStr = doc.createdAt ? new Date(doc.createdAt).toLocaleString() : 'N/A';
        const fileDetails = [
          `🔑 **Namespace**: \`${doc.namespace || 'default'}\``,
          `⚡ **Status**: ${statusEmoji} \`${doc.status || 'unknown'}\``,
          `📅 **Upload Date**: ${uploadDateStr}`
        ].join('\n');

        embed.addFields({
          name: `📄 ${doc.file_name || doc.fileName || 'Unnamed Document'}`,
          value: fileDetails,
          inline: false
        });
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      console.error('Error fetching upload status:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF3366)
        .setTitle('❌ Fetch Status Failed')
        .setDescription(`Unable to fetch upload document status from backend:\n\`\`\`${error.message || error}\`\`\``)
        .setTimestamp();

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};

export default uploadStatusCommand;
