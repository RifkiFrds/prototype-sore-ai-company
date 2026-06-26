import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ApiService } from '../services/api.service';
import { Command } from '../types/discord.types';

const remindersCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('reminders')
    .setDescription('List all scheduled email/notification alerts and reminders'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    try {
      const reminders = await ApiService.getReminders();

      const embed = new EmbedBuilder()
        .setColor(0xFFB000) // Urgent orange/amber
        .setTitle('🔔 Task Reminder Alerts')
        .setTimestamp()
        .setFooter({ text: 'Reminder Scheduler System', iconURL: interaction.client.user?.displayAvatarURL() });

      if (reminders.length === 0) {
        embed.setDescription('No scheduled reminders found in the database.');
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      embed.setDescription(`Showing scheduled alerts and notification triggers (${reminders.length}):`);

      reminders.forEach((reminder, index) => {
        const remindTimeStr = new Date(reminder.remindAt).toLocaleString();
        const sentStatus = reminder.sent ? '✅ Sent' : '⏳ Scheduled';
        
        embed.addFields({
          name: `${index + 1}. Alert for: "${reminder.taskTitle}"`,
          value: `📧 **Notify To**: ${reminder.email}\n🚨 **Trigger Type**: \`${reminder.type}\`\n⏰ **Trigger Time**: ${remindTimeStr}\n📊 **Status**: ${sentStatus}`,
          inline: false
        });
      });

      await interaction.editReply({ embeds: [embed] });

    } catch (error: any) {
      console.error('Error fetching reminders:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF3366)
        .setTitle('❌ Fetch Reminders Failed')
        .setDescription(`Could not retrieve scheduled reminders:\n\`\`\`${error.message || error}\`\`\``)
        .setTimestamp();

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};

export default remindersCommand;
