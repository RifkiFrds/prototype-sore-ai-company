import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ApiService } from '../services/api.service';
import { SessionService } from '../services/session.service';
import { Command } from '../types/discord.types';

const newCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('new')
    .setDescription('Start a new AI chat session'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    try {
      const username = interaction.user.username;
      const timestamp = new Date().toLocaleTimeString();
      const title = `Session - ${username} (${timestamp})`;

      const session = await ApiService.createSession(title);
      SessionService.setSession(interaction.user.id, session.id);

      const embed = new EmbedBuilder()
        .setColor(0x00FF88) // Sleek green gradient color
        .setTitle('✅ New AI Session Created')
        .setDescription(`A new workspace conversation has been initialized for **${username}**.`)
        .addFields(
          { name: 'Session Name', value: session.title, inline: true },
          { name: 'Session ID', value: `\`${session.id}\``, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'AI Company Assistant', iconURL: interaction.client.user?.displayAvatarURL() });

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      console.error('Error starting new session:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF3366) // Dark neon pink/red
        .setTitle('❌ Session Initialization Failed')
        .setDescription(`Failed to start a new chat session:\n\`\`\`${error.message || error}\`\`\``)
        .setTimestamp();

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};

export default newCommand;
