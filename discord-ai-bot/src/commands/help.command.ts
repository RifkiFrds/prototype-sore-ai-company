import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../types/discord.types';

const helpCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Menampilkan dasbor bantuan yang mencantumkan semua perintah dan asisten'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const embed = new EmbedBuilder()
      .setColor(0x00D2FF)
      .setTitle('🤖 Asisten AI Perusahaan — Dasbor Bantuan')
      .setDescription('Selamat datang! Berikut adalah panduan perintah lengkap untuk mengelola sesi, tugas, penyematan dokumen (embeddings), dan detail karyawan.')
      .addFields(
        { name: '💬 Obrolan & Sesi AI', value: '• `/new` — Mulai sesi percakapan AI baru.\n• `/chat` — Buka prompt modal untuk mengajukan pertanyaan kepada Asisten AI Perusahaan.' },
        { name: '📋 Tugas & Notifikasi', value: '• `/tasks` — Tampilkan tugas aktif perusahaan dan penugasan karyawan.\n• `/reminders` — Telusuri jadwal email dan peringatan pengingat notifikasi.' },
        { name: '👤 Direktori Perusahaan', value: '• `/employees` — Lihat daftar direktori karyawan yang dikelompokkan berdasarkan departemen perusahaan.' },
        { name: '📚 Pencarian Pengetahuan (RAG)', value: '• `/query` — Pencarian modal untuk menjalankan pencarian semantik terhadap panduan perusahaan.\n• `/upload` — Instruksikan Agen AI untuk memproses transkrip rapat/dokumen.\n• `/upload-rag` — Unggah dokumen langsung ke basis data vektor (Khusus Admin).' }
      )
      .setTimestamp()
      .setFooter({ text: 'Sistem AI Perusahaan', iconURL: interaction.client.user?.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  }
};

export default helpCommand;
