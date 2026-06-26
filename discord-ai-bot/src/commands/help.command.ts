import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types/discord.types';

const helpCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show helper dashboard listing all commands and assistants'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const embed = new EmbedBuilder()
      .setColor(0x00D2FF)
      .setTitle('🤖 AI Company Assistant — Help Dashboard')
      .setDescription('Welcome! Here is the complete command guide for managing sessions, tasks, document embeddings, and employee details.')
      .addFields(
        { name: '💬 AI Chats & Sessions', value: '• `/new` — Start a new AI conversation session.\n• `/chat` — Open modal prompt to ask the AI Company Assistant questions.' },
        { name: '📋 Tasks & Notifications', value: '• `/tasks` — Display active company tasks and employee assignments.\n• `/reminders` — Browse scheduled email and notification reminder alerts.' },
        { name: '👤 Corporate Directory', value: '• `/employees` — View the employee directory list grouped by corporate departments.' },
        { name: '📚 Knowledge Search (RAG)', value: '• `/query` — Modal lookup to execute semantic search against company guidelines.\n• `/upload` — Instruct the AI Agent to process meeting transcripts/documents.\n• `/upload-rag` — Upload document directly into vector database (Admin Only).' }
      )
      .setTimestamp()
      .setFooter({ text: 'AI Corporate System', iconURL: interaction.client.user?.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  }
};

export default helpCommand;
