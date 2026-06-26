# 🤖 Discord AI Company Assistant (Frontend Bot)

Discord Bot ini berfungsi sebagai **User Interface (I/O)** interaktif untuk berinteraksi dengan **NestJS Backend AI Company Assistant**. Bot ini memproses input user (perintah suara/teks, unggahan berkas, interaksi modal & tombol) dan meneruskannya ke backend untuk pemrosesan AI tingkat lanjut (RAG & Agent Automation).

---

## 🛠️ Fitur Utama Bot

### 1. 💬 AI Chats & Sessions
*   **`/new`**: Membuat sesi percakapan baru dengan AI. Sesi ini akan tersimpan otomatis untuk melacak riwayat chat.
*   **`/chat`**: Membuka modal Discord untuk mengirimkan pesan ke AI. Mendukung **real-time streaming (SSE)** di mana bot akan mengedit pesannya secara dinamis (termasuk menampilkan reasoning/thinking process).

### 2. 📋 Task & Reminder Board
*   **`/tasks`**: Menampilkan daftar tugas (*Task Assignment*) aktif yang dibuat otomatis oleh AI Agent berdasarkan transkrip rapat.
*   **`/reminders`**: Melihat daftar pengingat (*Notification Alerts*) terjadwal (H-1 & H-12 jam) yang dikirim via email/sistem.

### 3. 👤 Corporate Directory
*   **`/employees`**: Menampilkan direktori karyawan perusahaan secara rapi yang dikelompokkan berdasarkan departemen (Marketing, Sales, Finance, dll.).

### 4. 📚 Knowledge & Document Processing (RAG)
*   **`/query`**: Melakukan pencarian semantik langsung ke database vektor (PostgreSQL pgvector) untuk menemukan berkas kebijakan, SOP, atau dokumen kantor.
*   **`/upload`**: Mengunggah dokumen/transkrip rapat (`.txt`, `.pdf`, `.docx`) disertai instruksi agar dieksekusi oleh AI Agent (misal: merangkum rapat, membagi tugas ke karyawan, dan menjadwalkan alarm).
*   **`/upload-rag`** *(Admin Only)*: Mengunggah dokumen pengetahuan baru langsung untuk dijadikan database referensi RAG.

---

## 🏗️ Folder Architecture

Arsitektur bot dirancang modular, scalable, dan type-safe untuk mempermudah penambahan fitur baru tanpa menyentuh core registry:

```
discord-bot/
├── src/
│   ├── commands/          # Registrasi metadata & eksekusi Slash Commands
│   ├── interactions/      # Handler interaksi komponen Discord (Modal, Button, dll.)
│   ├── registry/          # Auto-discovery & Deployment command ke Discord API
│   ├── events/            # Handling Event Discord (Ready, InteractionCreate)
│   ├── services/          # HTTP Client (Fetch) & parser Server-Sent Events (SSE)
│   ├── state/             # In-memory local caching (Sesi user)
│   ├── types/             # TypeScript interfaces untuk API DTO & Discord types
│   ├── config/            # Konfigurasi token & Environment Variables
│   └── index.ts           # Bootstrapper utama bot
├── .env                   # Environment tokens
├── package.json
└── tsconfig.json
```

---

## ⚙️ Cara Setup & Instalasi

### 1. Prasyarat
*   Node.js (v18 ke atas)
*   Discord Bot Token & Client ID (bisa didapatkan di [Discord Developer Portal](https://discord.com/developers/applications))
*   NestJS Backend berjalan (default: `http://localhost:3000`)

### 2. Konfigurasi Environment (`.env`)
Buat berkas `.env` di dalam folder `discord-ai-bot/` dan sesuaikan nilainya:

```env
DISCORD_TOKEN="YOUR_DISCORD_BOT_TOKEN"
DISCORD_CLIENT_ID="YOUR_DISCORD_APPLICATION_CLIENT_ID"
DISCORD_GUILD_ID="YOUR_TEST_GUILD_OR_SERVER_ID"

# URL API Backend NestJS
API_BASE_URL="http://localhost:3000/api"
```

### 3. Instalasi Dependency
Jalankan perintah berikut di dalam terminal pada direktori `discord-ai-bot/`:

```bash
npm install
```

---

## 🚀 Menjalankan Aplikasi

### Mode Development
Jalankan bot dalam mode hot-reload menggunakan `ts-node`:

```bash
npm run dev
```

Saat berhasil berjalan, bot akan memicu otomatis **Command Registry** untuk mendaftarkan seluruh slash command yang berada di folder `src/commands/` ke Guild/Server Discord Anda.

```
Ready! Logged in as Company AI Assistant#xxxx
Loaded command: chat
Loaded command: new
...
Successfully reloaded 8 application (/) commands.
```

### Mode Produksi
Lakukan build TypeScript ke JavaScript, lalu jalankan:

```bash
npm run build
npm start
```

---

## 🛡️ Penanganan Rate-Limit & Keamanan

1.  **SSE Streaming Throttling**: Discord membatasi frekuensi pengeditan pesan (*Rate Limit*). Bot ini dilengkapi penunda pembaruan otomatis sebesar **1500ms** di `stream.service.ts` agar text buffer dari AI terkumpul terlebih dahulu sebelum dikirim secara berkala ke Discord API.
2.  **Validasi Berkas Ganda**: Bot melakukan pengecekan ukuran berkas (maksimal **10MB**) dan tipe ekstensi (`.txt`, `.pdf`, `.docx`) secara lokal di sisi bot sebelum mengirim data ke backend, memberikan respon *fail-fast* instan jika berkas tidak didukung.
3.  **Role Permission**: Perintah sensitif seperti `/upload-rag` dibatasi menggunakan opsi `.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)` agar hanya admin server yang dapat mengunggah berkas referensi perusahaan.