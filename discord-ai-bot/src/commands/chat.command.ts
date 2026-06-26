import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, CustomIds } from '../types/discord.types';

const chatCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Ask the AI Assistant a question'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const modal = new ModalBuilder()
      .setCustomId(CustomIds.CHAT_MODAL)
      .setTitle('Ask Company AI');

    const messageInput = new TextInputBuilder()
      .setCustomId(CustomIds.CHAT_INPUT_CONTENT)
      .setLabel('Message')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Enter your request (e.g. Tolong buatin proposal vendor X)...')
      .setRequired(true);

    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(messageInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  }
};

export default chatCommand;
