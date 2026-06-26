import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ApiService } from '../services/api.service';
import { Command } from '../types/discord.types';

const uploadRagCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('upload-rag')
    .setDescription('Upload a document into the RAG vector database (Admin only)')
    .addAttachmentOption(option => 
      option.setName('file')
        .setDescription('Upload document (.txt, .docx, .pdf)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Restrict access to admin only

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const fileOption = interaction.options.getAttachment('file', true);

    // Fail-safe file validation (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (fileOption.size > MAX_SIZE) {
      const sizeMb = (fileOption.size / (1024 * 1024)).toFixed(2);
      await interaction.editReply({
        content: `❌ **File Size Limit Exceeded**: Your file is **${sizeMb}MB**. The maximum allowed size is **10MB**.`
      });
      return;
    }

    // Mime-types / Extension validation
    const allowedExtensions = ['.txt', '.docx', '.pdf'];
    const fileName = fileOption.name.toLowerCase();
    const hasValidExt = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExt) {
      await interaction.editReply({
        content: `❌ **Invalid File Format**: Only text files, PDF, or DOCX are supported (${allowedExtensions.join(', ')}).`
      });
      return;
    }

    try {
      // Download the attachment into a Buffer
      const downloadResponse = await fetch(fileOption.url);
      if (!downloadResponse.ok) {
        throw new Error(`Failed to download attachment: ${downloadResponse.statusText}`);
      }
      const arrayBuffer = await downloadResponse.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      // Submit to NestJS RAG uploader
      const result = await ApiService.uploadRagDocument(fileBuffer, fileOption.name);

      // Embed output confirmation
      const embed = new EmbedBuilder()
        .setColor(0x00FF88)
        .setTitle('📄 Document Uploaded to Knowledge RAG')
        .setDescription(result.message || 'Processing in background.')
        .addFields(
          { name: 'Document ID', value: `\`${result.documentId}\``, inline: true },
          { name: 'Initial Status', value: `\`${result.status}\``, inline: true },
          { name: 'Source Name', value: fileOption.name }
        )
        .setTimestamp()
        .setFooter({ text: 'RAG Knowledge Uploader', iconURL: interaction.client.user?.displayAvatarURL() });

      await interaction.editReply({ embeds: [embed] });

    } catch (error: any) {
      console.error('Error uploading RAG document:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF3366)
        .setTitle('❌ RAG Upload Failed')
        .setDescription(`An error occurred during upload processing:\n\`\`\`${error.message || error}\`\`\``)
        .setTimestamp();

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};

export default uploadRagCommand;
