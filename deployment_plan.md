# Deployment Plan - VPS Production

## Objective
Deploy ulang AI Company Assistant (Prototype Ecosystem) ke VPS production dengan arsitektur baru.

## Target Arsitektur VPS
`/home/ubuntu`
└── `apps`
    ├── `infrastructure`
    │   ├── `nginx-proxy-manager`
    │   ├── `postgres`
    │   └── `redis`
    │
    ├── `jatricarshop`
    ├── `portocms`
    └── `prototipe-assistant`
        ├── `backend`
        └── `discord-ai-bot`

## Scope Project
Project terdiri dari 2 aplikasi utama:

### 1. Backend (NestJS)
* **Tech Stack**: NestJS, Prisma, PostgreSQL + pgvector, BullMQ, Redis, AI Engine (Sumopod).
* **Fungsi**: REST API, AI Agent, RAG Engine, Queue, Reminder, Embedding, Employee Directory.

### 2. Discord Bot
* **Tech Stack**: discord.js.
* **Fungsi**: Frontend, Slash Commands, Upload File, Streaming Chat, Menampilkan hasil AI.

### Shared Infrastructure
* PostgreSQL + pgvector
* Redis
* Nginx Proxy Manager
* Docker Network
*(Catatan: Infrastructure tidak berada di dalam folder project)*

---

## Roadmap Deployment

### Phase 1: Infrastructure
* PostgreSQL + pgvector
* Redis
* Docker Network
* **Deliverable**: Semua container infrastructure running.

### Phase 2: Backend
* Deploy NestJS
* **Deliverable**: Backend dapat diakses di `/api`.

### Phase 3: Database
* Prisma db push
* Seed karyawan
* Upload & embed mock docs (`uploadMockDocs`)
* **Deliverable**: Semua tabel dan embedding berhasil dibuat.

### Phase 4: Discord Bot
* Deploy Discord Bot
* **Deliverable**: Bot online.

### Phase 5: Nginx Proxy Manager
* Expose host: `api.company.com` atau `assistant.company.com`.

### Phase 6: CI/CD
* GitHub Actions -> Pull -> Docker Build -> Restart Container.

---

## Hal Yang Perlu Diverifikasi Sebelum Deploy

### Backend
* [ ] Dockerfile production
* [ ] docker-compose
* [ ] Prisma Schema
* [ ] Migration
* [ ] Healthcheck

### Discord Bot
* [ ] Dockerfile
* [ ] Environment
* [ ] Auto Restart

### PostgreSQL
* [ ] Menggunakan pgvector
* [ ] Volume persistence
* [ ] Backup

### Redis
* [ ] Persistence
* [ ] Password (opsional)

### Network
* [ ] Semua service berada dalam Docker Network yang sama.

---

## Target Arsitektur Akhir
```text
Internet
   │
   ▼
Nginx Proxy Manager
   │
   ▼
NestJS Backend (Docker)
   │
   ├───────────────┐
   ▼               ▼
PostgreSQL      Redis
(pgvector)         ▲
   ▲               │
   └───────────────┘
      Discord Bot
```
