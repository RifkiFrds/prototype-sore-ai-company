# 🏢 AI Company Assistant (Prototype Ecosystem)

Ekosistem prototipe ini menggabungkan **NestJS (Backend)** dengan **Discord Bot (Frontend)** untuk menghadirkan asisten kecerdasan buatan (AI) terintegrasi bagi perusahaan. Sistem ini memungkinkan otomatisasi alur kerja seperti pembuatan penawaran harga, draf proposal, pengingat tugas otomatis, pencarian semantik (RAG), hingga ringkasan transkrip rapat langsung melalui obrolan Discord.

---

## 🏗️ System Architecture

```
[ Discord Client (User) ]
           │ (Slash Commands / Modals / File Uploads)
           ▼
[ Discord Bot (Frontend) ]
           │ (REST API & Server-Sent Events / SSE)
           ▼
[ NestJS Server (Backend) ]
     ├── AI Engine (Sumopod / DeepSeek-R1 / OpenAI API)
     ├── Database (PostgreSQL + pgvector extension)
     └── Task Scheduler & Queue (BullMQ + Redis)
```

Sistem ini memisahkan beban kerja dengan jelas: **Discord Bot** bertindak murni sebagai I/O interface (penerima perintah dan penampil respons), sedangkan seluruh pemrosesan logika AI, RAG, dan penjadwalan berjalan di **NestJS Backend**.

---

## 🚀 Panduan Setup Cepat (Ecosystem Startup)

Ikuti langkah-langkah di bawah ini untuk menjalankan seluruh ekosistem di mesin lokal Anda.

### 📋 Prasyarat Sistem
*   Node.js (v18 ke atas)
*   Docker & Docker Compose
*   Redis (berjalan di port `6379`)
*   Discord Application Token (untuk bot)

---

### Langkah 1: Jalankan Database PostgreSQL dengan Vector Extension

Gunakan perintah Docker berikut untuk menjalankan instansi PostgreSQL yang dilengkapi ekstensi `pgvector` pada port `5434`:

```bash
docker run --name prototipe_postgres_vector -e POSTGRES_PASSWORD=postgres -p 5434:5432 -d pgvector/pgvector:pg17
```

Setelah kontainer aktif, masuk dan buat database baru bernama `prototipe_sore` serta aktifkan ekstensinya:

```bash
# Untuk Windows (PowerShell/CMD) atau Linux
docker exec -it prototipe_postgres_vector psql -U postgres -c "CREATE DATABASE prototipe_sore;"
docker exec -it prototipe_postgres_vector psql -U postgres -d prototipe_sore -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

---

### Langkah 2: Setup & Jalankan NestJS Backend

1.  Buka direktori backend:
    ```bash
    cd backend
    ```
2.  Salin berkas konfigurasi `.env`:
    ```bash
    cp .env.example .env
    ```
    Sesuaikan variabel berikut, pastikan `SUMOPOD_API_KEY` telah terisi dengan kunci API Anda.
3.  Instal dependensi backend:
    ```bash
    npm install
    ```
4.  Sinkronisasikan skema database Prisma:
    ```bash
    npx prisma db push
    ```
5.  Lakukan seeding data direktori karyawan:
    ```bash
    npx ts-node prisma/seed.ts
    ```
6.  Unggah & buat embedding dokumen referensi perusahaan (RAG):
    ```bash
    npx ts-node prisma/uploadMockDocs.ts
    ```
7.  Jalankan server backend:
    ```bash
    npm run start:dev
    ```
    Backend Anda sekarang aktif di: `http://localhost:3000/api`

---

### Langkah 3: Setup & Jalankan Discord Bot (Frontend)

1.  Buka direktori bot (dalam terminal baru):
    ```bash
    cd discord-ai-bot
    ```
2.  Buat berkas `.env` dan masukkan token bot Anda:
    ```env
    DISCORD_TOKEN="TOKEN_BOT_DISCORD_ANDA"
    DISCORD_CLIENT_ID="ID_CLIENT_DISCORD_ANDA"
    DISCORD_GUILD_ID="ID_SERVER_DISCORD_ANDA"
    API_BASE_URL="http://localhost:3000/api"
    ```
3.  Instal dependensi bot:
    ```bash
    npm install
    ```
4.  Jalankan bot dalam mode development:
    ```bash
    npm run dev
    ```
    Bot akan login ke Discord dan secara otomatis mendaftarkan semua perintah slash (`/`) ke server uji coba Anda.

---

## 📊 Matriks Fitur & Endpoint Mapping

| Fitur Discord | Tipe Aksi | HTTP Method | Endpoint Backend | Payload / Parameter |
| :--- | :--- | :--- | :--- | :--- |
| `/new` | REST | `POST` | `/api/chats` | `{ "title": string }` |
| `/chat` | REST | `POST` | `/api/chats/:id/messages` | `{ "content": string }` |
| `/chat` *(Streaming)* | SSE | `GET` | `/api/chats/:id/messages/stream` | `?content=<pesan>` |
| `/upload` | REST | `POST` | `/api/agent/run` | multipart: `prompt` + `file` |
| `/tasks` | REST | `GET` | `/api/agent/tasks` | *None* |
| `/reminders` | REST | `GET` | `/api/agent/reminders` | *None* |
| `/employees` | REST | `GET` | `/api/agent/employees` | *None* |
| `/query` | REST | `POST` | `/api/rag/query` | `{ "query": string, "topK?": number }` |
| `/upload-rag` | REST | `POST` | `/api/rag/upload` | multipart: `file` (maks 10MB) |
| `/help` | Local | *N/A* | *N/A* | Menampilkan ringkasan menu bantuan |