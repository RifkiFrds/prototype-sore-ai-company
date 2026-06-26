import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ApiService } from '../services/api.service';
import { Command } from '../types/discord.types';

const employeesCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('employees')
    .setDescription('Display the corporate employee directory grouped by department'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    try {
      const employees = await ApiService.getEmployees();

      const embed = new EmbedBuilder()
        .setColor(0x7F00FF) // Corporate purple color
        .setTitle('👤 Corporate Employee Directory')
        .setTimestamp()
        .setFooter({ text: 'Employee Directory Module', iconURL: interaction.client.user?.displayAvatarURL() });

      if (employees.length === 0) {
        embed.setDescription('No employee entries found in the directory database.');
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      // Group employees by department
      const grouped: { [dept: string]: typeof employees } = {};
      employees.forEach(emp => {
        const dept = emp.departemen || 'Other';
        if (!grouped[dept]) {
          grouped[dept] = [];
        }
        grouped[dept].push(emp);
      });

      // Add each department block to the embed fields
      for (const [dept, list] of Object.entries(grouped)) {
        const deptEmpList = list.map(emp => {
          const genderIcon = emp.jenisKelamin === 'L' || emp.jenisKelamin === 'MALE' ? '👨' : '👩';
          return `${genderIcon} **${emp.namaLengkap}** - *${emp.jabatan}* (ID: ${emp.idKaryawan})\n📧 ${emp.email}`;
        }).join('\n\n');

        embed.addFields({
          name: `🏢 ${dept} Department (${list.length})`,
          value: deptEmpList.length > 1024 ? deptEmpList.substring(0, 1020) + '...' : deptEmpList,
          inline: false
        });
      }

      await interaction.editReply({ embeds: [embed] });

    } catch (error: any) {
      console.error('Error fetching employees:', error);
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF3366)
        .setTitle('❌ Fetch Directory Failed')
        .setDescription(`Could not retrieve corporate directory entries:\n\`\`\`${error.message || error}\`\`\``)
        .setTimestamp();

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};

export default employeesCommand;
