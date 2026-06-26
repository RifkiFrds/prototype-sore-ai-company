import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command, CustomIds } from '../types/discord.types';

const queryCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('query')
    .setDescription('Perform semantic search against company knowledge base (RAG)'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const modal = new ModalBuilder()
      .setCustomId(CustomIds.QUERY_MODAL)
      .setTitle('Search Knowledge Base');

    const queryInput = new TextInputBuilder()
      .setCustomId(CustomIds.QUERY_INPUT_CONTENT)
      .setLabel('Question')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Enter search criteria or question...')
      .setRequired(true);

    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(queryInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
  }
};

export default queryCommand;
