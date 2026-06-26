import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ApiService } from '../services/api.service';
import { Command } from '../types/discord.types';

const tasksCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('tasks')
    .setDescription('List all company tasks and assignments'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    try {
      const tasks = await ApiService.getTasks();

      const embed = new EmbedBuilder()
        .setColor(0x00A2FF)
        .setTitle('📋 Company Task Board')
        .setTimestamp()
        .setFooter({ text: 'Task Management System', iconURL: interaction.client.user?.displayAvatarURL() });

      if (tasks.length === 0) {
        embed.setDescription('No tasks or assignments found in the system database.');
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      embed.setDescription(`Showing all active and pending task assignments (${tasks.length}):`);

      tasks.forEach((task, index) => {
        const assignedName = task.employee?.namaLengkap || 'Unassigned';
        const statusIcon = task.status === 'COMPLETED' ? '✅' : task.status === 'IN_PROGRESS' ? '⚡' : '⏳';
        const dueDateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline';
        
        embed.addFields({
          name: `${index + 1}. ${task.title} [${statusIcon} ${task.status}]`,
          value: `👤 **Assigned**: ${assignedName}\n📅 **Due Date**: ${dueDateStr}\n📝 **Description**: ${task.description || '*None*'}`,
          inline: false
        });
      });

      await interaction.editReply({ embeds: [embed] });

    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF3366)
        .setTitle('❌ Fetch Tasks Failed')
        .setDescription(`Could not retrieve task list from server:\n\`\`\`${error.message || error}\`\`\``)
        .setTimestamp();

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};

export default tasksCommand;
