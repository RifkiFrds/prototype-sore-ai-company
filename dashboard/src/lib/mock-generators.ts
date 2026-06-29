import type {
  Employee,
  Task,
  Reminder,
  ChatSession,
  ChatMessage,
  KnowledgeDocument,
  DailyRequest,
  HourlyData,
  TokenUsage,
  WeeklyTrend,
  ToolBreakdown,
  UserActivity,
  SystemHealth,
  ActivityFeedItem,
} from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedRandom<T>(options: { value: T; weight: number }[]): T {
  const total = options.reduce((sum, o) => sum + o.weight, 0);
  let r = Math.random() * total;
  for (const o of options) {
    r -= o.weight;
    if (r <= 0) return o.value;
  }
  return options[options.length - 1].value;
}

function daysFromNow(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString();
}

function uuid(): string {
  return crypto.randomUUID();
}

// ─── Employee Seed ────────────────────────────────────────────────────────────

const RAW_EMPLOYEES = [
  { employeeId: 'EMP-001', fullName: 'Togu Sibarani',    email: 'togu.sibarani@saicowork.com',   phone: '081234567001', department: 'Management',  position: 'Direktur Utama',              status: 'ACTIVE' },
  { employeeId: 'EMP-002', fullName: 'Hanifa',           email: 'hanifa@saicowork.com',           phone: '081234567002', department: 'Management',  position: 'Komisaris',                   status: 'ACTIVE' },
  { employeeId: 'EMP-003', fullName: 'Andi Permana',     email: 'andi.permana@saicowork.com',     phone: '081234567003', department: 'Operations',  position: 'Manajer Operasional',         status: 'ACTIVE' },
  { employeeId: 'EMP-004', fullName: 'Sari Dewi',        email: 'sari.dewi@saicowork.com',        phone: '081234567004', department: 'Marketing',   position: 'Manajer Pemasaran',           status: 'ACTIVE' },
  { employeeId: 'EMP-005', fullName: 'Budi Hartono',     email: 'budi.hartono@saicowork.com',     phone: '081234567005', department: 'Finance',     position: 'Manajer Keuangan',            status: 'ACTIVE' },
  { employeeId: 'EMP-006', fullName: 'Rina Anggraeni',   email: 'rina.anggraeni@saicowork.com',   phone: '081234567006', department: 'HR',          position: 'Manajer SDM',                 status: 'ACTIVE' },
  { employeeId: 'EMP-007', fullName: 'Fajar Ramadhan',   email: 'fajar.ramadhan@saicowork.com',   phone: '081234567007', department: 'IT',          position: 'Manajer IT',                  status: 'ACTIVE' },
  { employeeId: 'EMP-008', fullName: 'Dian Puspita',     email: 'dian.puspita@saicowork.com',     phone: '081234567008', department: 'Operations',  position: 'Supervisor Customer Service', status: 'ACTIVE' },
  { employeeId: 'EMP-009', fullName: 'Ahmad Fauzi',      email: 'ahmad.fauzi@saicowork.com',      phone: '081234567009', department: 'Operations',  position: 'Supervisor Operasional',      status: 'ACTIVE' },
  { employeeId: 'EMP-010', fullName: 'Linda Kusuma',     email: 'linda.kusuma@saicowork.com',     phone: '081234567010', department: 'Marketing',   position: 'Staff Pemasaran',             status: 'ACTIVE' },
  { employeeId: 'EMP-011', fullName: 'Riko Pradana',     email: 'riko.pradana@saicowork.com',     phone: '081234567011', department: 'Sales',       position: 'Sales Executive',             status: 'ACTIVE' },
  { employeeId: 'EMP-012', fullName: 'Maya Setiawan',    email: 'maya.setiawan@saicowork.com',    phone: '081234567012', department: 'Finance',     position: 'Staff Keuangan',              status: 'ACTIVE' },
  { employeeId: 'EMP-013', fullName: 'Hendra Gunawan',   email: 'hendra.gunawan@saicowork.com',   phone: '081234567013', department: 'IT',          position: 'Software Engineer',           status: 'ACTIVE' },
  { employeeId: 'EMP-014', fullName: 'Putri Rahayu',     email: 'putri.rahayu@saicowork.com',     phone: '081234567014', department: 'HR',          position: 'HR Staff',                    status: 'ACTIVE' },
  { employeeId: 'EMP-015', fullName: 'Wahyu Santoso',    email: 'wahyu.santoso@saicowork.com',    phone: '081234567015', department: 'Marketing',   position: 'Digital Marketing',           status: 'ACTIVE' },
  { employeeId: 'EMP-016', fullName: 'Dewi Lestari',     email: 'dewi.lestari@saicowork.com',     phone: '081234567016', department: 'Sales',       position: 'Account Manager',             status: 'ACTIVE' },
  { employeeId: 'EMP-017', fullName: 'Bagas Nugroho',    email: 'bagas.nugroho@saicowork.com',    phone: '081234567017', department: 'IT',          position: 'Backend Developer',           status: 'ACTIVE' },
  { employeeId: 'EMP-018', fullName: 'Ayu Maharani',     email: 'ayu.maharani@saicowork.com',     phone: '081234567018', department: 'Finance',     position: 'Accounting Staff',            status: 'ACTIVE' },
  { employeeId: 'EMP-019', fullName: 'Rizky Hakim',      email: 'rizky.hakim@saicowork.com',      phone: '081234567019', department: 'Operations',  position: 'Logistik Staff',              status: 'ACTIVE' },
  { employeeId: 'EMP-020', fullName: 'Fitria Handayani', email: 'fitria.handayani@saicowork.com', phone: '081234567020', department: 'Marketing',   position: 'Content Creator',             status: 'ACTIVE' },
  { employeeId: 'EMP-021', fullName: 'Yusuf Ibrahim',    email: 'yusuf.ibrahim@saicowork.com',    phone: '081234567021', department: 'Sales',       position: 'Sales Representative',        status: 'ACTIVE' },
  { employeeId: 'EMP-022', fullName: 'Nadia Putri',      email: 'nadia.putri@saicowork.com',      phone: '081234567022', department: 'HR',          position: 'Recruiter',                   status: 'ACTIVE' },
  { employeeId: 'EMP-023', fullName: 'Gilang Pratama',   email: 'gilang.pratama@saicowork.com',   phone: '081234567023', department: 'IT',          position: 'Frontend Developer',          status: 'ACTIVE' },
  { employeeId: 'EMP-024', fullName: 'Rini Cahyani',     email: 'rini.cahyani@saicowork.com',     phone: '081234567024', department: 'Finance',     position: 'Tax Staff',                   status: 'ACTIVE' },
  { employeeId: 'EMP-025', fullName: 'Doni Kurniawan',   email: 'doni.kurniawan@saicowork.com',   phone: '081234567025', department: 'Operations',  position: 'Warehouse Staff',             status: 'ACTIVE' },
  { employeeId: 'EMP-026', fullName: 'Tiara Wulandari',  email: 'tiara.wulandari@saicowork.com',  phone: '081234567026', department: 'Marketing',   position: 'Brand Manager',               status: 'ACTIVE' },
  { employeeId: 'EMP-027', fullName: 'Andika Prasetya',  email: 'andika.prasetya@saicowork.com',  phone: '081234567027', department: 'Sales',       position: 'Business Development',        status: 'ACTIVE' },
  { employeeId: 'EMP-028', fullName: 'Sinta Rahmawati',  email: 'sinta.rahmawati@saicowork.com',  phone: '081234567028', department: 'HR',          position: 'Payroll Staff',               status: 'ACTIVE' },
  { employeeId: 'EMP-029', fullName: 'Kevin Pratama',    email: 'kevin.pratama@saicowork.com',    phone: '081234567029', department: 'IT',          position: 'DevOps Engineer',             status: 'ACTIVE' },
  { employeeId: 'EMP-030', fullName: 'Melisa Anggraini', email: 'melisa.anggraini@saicowork.com', phone: '081234567030', department: 'Finance',     position: 'Budget Analyst',              status: 'ACTIVE' },
  { employeeId: 'EMP-031', fullName: 'Eko Prasetyo',     email: 'eko.prasetyo@saicowork.com',     phone: '081234567031', department: 'Operations',  position: 'Procurement Staff',           status: 'ACTIVE' },
  { employeeId: 'EMP-032', fullName: 'Laras Sari',       email: 'laras.sari@saicowork.com',       phone: '081234567032', department: 'Marketing',   position: 'Event Coordinator',           status: 'ACTIVE' },
  { employeeId: 'EMP-033', fullName: 'Farhan Aziz',      email: 'farhan.aziz@saicowork.com',      phone: '081234567033', department: 'Sales',       position: 'Sales Analyst',               status: 'ACTIVE' },
  { employeeId: 'EMP-034', fullName: 'Vina Maharani',    email: 'vina.maharani@saicowork.com',    phone: '081234567034', department: 'HR',          position: 'Training Specialist',         status: 'ACTIVE' },
  { employeeId: 'EMP-035', fullName: 'Ridwan Fauzi',     email: 'ridwan.fauzi@saicowork.com',     phone: '081234567035', department: 'IT',          position: 'Data Analyst',                status: 'ACTIVE' },
  { employeeId: 'EMP-036', fullName: 'Citra Permata',    email: 'citra.permata@saicowork.com',    phone: '081234567036', department: 'Finance',     position: 'Internal Audit',              status: 'INACTIVE' },
  { employeeId: 'EMP-037', fullName: 'Taufik Hidayat',   email: 'taufik.hidayat@saicowork.com',   phone: '081234567037', department: 'Operations',  position: 'Fleet Manager',               status: 'ACTIVE' },
  { employeeId: 'EMP-038', fullName: 'Wulan Pertiwi',    email: 'wulan.pertiwi@saicowork.com',    phone: '081234567038', department: 'Marketing',   position: 'SEO Specialist',              status: 'ACTIVE' },
  { employeeId: 'EMP-039', fullName: 'Arief Budiman',    email: 'arief.budiman@saicowork.com',    phone: '081234567039', department: 'Sales',       position: 'Key Account Manager',         status: 'ACTIVE' },
  { employeeId: 'EMP-040', fullName: 'Nurul Hidayah',    email: 'nurul.hidayah@saicowork.com',    phone: '081234567040', department: 'HR',          position: 'Employee Relations',          status: 'ACTIVE' },
  { employeeId: 'EMP-041', fullName: 'Dimas Setyawan',   email: 'dimas.setyawan@saicowork.com',   phone: '081234567041', department: 'IT',          position: 'System Administrator',        status: 'ACTIVE' },
  { employeeId: 'EMP-042', fullName: 'Ratna Sari',       email: 'ratna.sari@saicowork.com',       phone: '081234567042', department: 'Finance',     position: 'Cash Flow Analyst',           status: 'ACTIVE' },
  { employeeId: 'EMP-043', fullName: 'Bintang Putra',    email: 'bintang.putra@saicowork.com',    phone: '081234567043', department: 'Operations',  position: 'Quality Control',             status: 'ACTIVE' },
  { employeeId: 'EMP-044', fullName: 'Sella Agustina',   email: 'sella.agustina@saicowork.com',   phone: '081234567044', department: 'Marketing',   position: 'Social Media Manager',        status: 'ACTIVE' },
  { employeeId: 'EMP-045', fullName: 'Hasan Basri',      email: 'hasan.basri@saicowork.com',      phone: '081234567045', department: 'Sales',       position: 'Regional Sales Manager',      status: 'ACTIVE' },
  { employeeId: 'EMP-046', fullName: 'Indah Permata',    email: 'indah.permata@saicowork.com',    phone: '081234567046', department: 'HR',          position: 'Compensation Specialist',     status: 'ACTIVE' },
  { employeeId: 'EMP-047', fullName: 'Yoga Pratama',     email: 'yoga.pratama@saicowork.com',     phone: '081234567047', department: 'IT',          position: 'Cloud Engineer',              status: 'ACTIVE' },
  { employeeId: 'EMP-048', fullName: 'Anita Rahma',      email: 'anita.rahma@saicowork.com',      phone: '081234567048', department: 'Finance',     position: 'Treasurer',                   status: 'ACTIVE' },
  { employeeId: 'EMP-049', fullName: 'Rama Wijaya',      email: 'rama.wijaya@saicowork.com',      phone: '081234567049', department: 'Operations',  position: 'Compliance Officer',          status: 'ACTIVE' },
  { employeeId: 'EMP-050', fullName: 'Kartika Sari',     email: 'kartika.sari@saicowork.com',     phone: '081234567050', department: 'Marketing',   position: 'Product Manager',             status: 'INACTIVE' },
] as const;

export function seedEmployees(): Employee[] {
  return RAW_EMPLOYEES.map((e) => ({
    ...e,
    id: uuid(),
    department: e.department as Employee['department'],
    status: e.status as Employee['status'],
  }));
}

// ─── Document Seed ────────────────────────────────────────────────────────────

const DOCUMENT_TEMPLATES = [
  { name: 'Data Metrik Operasional',   fileType: 'JSON', totalChunks: 12, sizeBytes: 3185 },
  { name: 'Direktori Karyawan',        fileType: 'JSON', totalChunks: 18, sizeBytes: 5594 },
  { name: 'Katalog Produk',            fileType: 'JSON', totalChunks: 22, sizeBytes: 5496 },
  { name: 'Log Kinerja Sales',         fileType: 'CSV',  totalChunks: 25, sizeBytes: 3502 },
  { name: 'Log Pergerakan Barang',     fileType: 'CSV',  totalChunks: 20, sizeBytes: 3527 },
  { name: 'Master Data Barang',        fileType: 'JSON', totalChunks: 30, sizeBytes: 6138 },
  { name: 'Profil Klien',              fileType: 'JSON', totalChunks: 28, sizeBytes: 8220 },
  { name: 'Purchase Request',          fileType: 'JSON', totalChunks: 24, sizeBytes: 6145 },
  { name: 'Rapor Performance Vendor',  fileType: 'JSON', totalChunks: 19, sizeBytes: 5097 },
  { name: 'Rate Card Layanan',         fileType: 'JSON', totalChunks: 15, sizeBytes: 5299 },
  { name: 'Riwayat Interaksi Leads',   fileType: 'JSON', totalChunks: 27, sizeBytes: 6633 },
  { name: 'SOP dan Kebijakan',         fileType: 'TXT',  totalChunks: 32, sizeBytes: 7509 },
  { name: 'Transkrip Rapat',           fileType: 'TXT',  totalChunks: 29, sizeBytes: 6968 },
  { name: 'SOP Procurement v2',        fileType: 'PDF',  totalChunks: 16, sizeBytes: 450000 },
  { name: 'Company Policy 2026',       fileType: 'PDF',  totalChunks: 21, sizeBytes: 890000 },
  { name: 'Employee Handbook',         fileType: 'PDF',  totalChunks: 38, sizeBytes: 1200000 },
  { name: 'IT Security Policy',        fileType: 'PDF',  totalChunks: 14, sizeBytes: 340000 },
  { name: 'Financial Report Q1 2026',  fileType: 'DOCX', totalChunks: 11, sizeBytes: 280000 },
  { name: 'Vendor Agreement Template', fileType: 'DOCX', totalChunks: 9,  sizeBytes: 195000 },
  { name: 'Marketing Strategy 2026',   fileType: 'DOCX', totalChunks: 17, sizeBytes: 420000 },
];

export function seedDocuments(): KnowledgeDocument[] {
  return DOCUMENT_TEMPLATES.map((d, i) => ({
    id: uuid(),
    name: d.name,
    fileType: d.fileType as KnowledgeDocument['fileType'],
    status: i < 17 ? 'READY' : 'PROCESSING' as KnowledgeDocument['status'],
    uploadDate: daysFromNow(-randomInt(1, 90)),
    totalChunks: d.totalChunks,
    sizeBytes: d.sizeBytes,
  }));
}

// ─── Task Generator ───────────────────────────────────────────────────────────

const TASK_TITLES = [
  'Persiapkan proposal pengadaan vendor baru',
  'Follow up klien PT Maju Jaya mengenai kontrak',
  'Buat laporan kinerja Q2 2026',
  'Review SOP operasional gudang',
  'Koordinasi meeting mingguan tim Sales',
  'Update database produk di sistem ERP',
  'Rekap absensi karyawan bulan ini',
  'Audit dokumen finansial triwulan',
  'Siapkan materi onboarding karyawan baru',
  'Evaluasi kinerja vendor pengiriman',
  'Buat quotation untuk klien ABC',
  'Review dan approval purchase request',
  'Persiapkan presentasi board meeting',
  'Implementasi update sistem keamanan IT',
  'Analisis data penjualan minggu lalu',
  'Rekrut kandidat untuk posisi Sales Executive',
  'Negosiasi kontrak dengan supplier baru',
  'Monitoring pengiriman barang ke Surabaya',
  'Update konten marketing Q3',
  'Verifikasi laporan expense karyawan',
  'Jadwalkan training untuk tim baru',
  'Finalisasi budget operasional semester 2',
  'Siapkan dokumen audit eksternal',
  'Review proposal desain ulang website',
  'Koordinasi event company gathering',
  'Buat progress report project implementasi',
  'Follow up pembayaran invoice yang tertunda',
  'Evaluasi tool produktivitas baru',
  'Update peta persediaan barang di gudang',
  'Susun rencana ekspansi pasar Bandung',
];

export function generateTasks(employees: Employee[], count = 150): Task[] {
  const tasks: Task[] = [];
  for (let i = 0; i < count; i++) {
    const emp = randomPick(employees);
    const status = weightedRandom([
      { value: 'PENDING' as const,     weight: 40 },
      { value: 'IN_PROGRESS' as const, weight: 35 },
      { value: 'DONE' as const,        weight: 20 },
      { value: 'OVERDUE' as const,     weight: 5 },
    ]);
    tasks.push({
      id: uuid(),
      title: TASK_TITLES[i % TASK_TITLES.length] + (i >= TASK_TITLES.length ? ` (${Math.floor(i / TASK_TITLES.length) + 1})` : ''),
      description: `Task yang dibuat otomatis oleh AI berdasarkan hasil rapat dan instruksi tim ${emp.department}.`,
      assigneeId: emp.id,
      assignee: emp,
      status,
      dueDate: status === 'OVERDUE' ? daysFromNow(-randomInt(1, 14)) : daysFromNow(randomInt(-5, 30)),
      createdAt: daysFromNow(-randomInt(0, 60)),
      source: 'AI',
      sourceSessionId: uuid(),
    });
  }
  return tasks;
}

// ─── Reminder Generator ───────────────────────────────────────────────────────

export function generateReminders(tasks: Task[], count = 200): Reminder[] {
  const reminders: Reminder[] = [];
  let taskIdx = 0;
  while (reminders.length < count) {
    const task = tasks[taskIdx % tasks.length];
    const scheduleCount = randomInt(1, 2);
    for (let s = 0; s < scheduleCount && reminders.length < count; s++) {
      const scheduleType = weightedRandom([
        { value: 'H-1' as const, weight: 50 },
        { value: 'H-3' as const, weight: 30 },
        { value: 'H-7' as const, weight: 20 },
      ]);
      const daysBefore = scheduleType === 'H-1' ? 1 : scheduleType === 'H-3' ? 3 : 7;
      const scheduledAt = new Date(task.dueDate);
      scheduledAt.setDate(scheduledAt.getDate() - daysBefore);

      reminders.push({
        id: uuid(),
        title: `Reminder: ${task.title}`,
        taskId: task.id,
        taskTitle: task.title,
        assigneeId: task.assigneeId,
        assignee: task.assignee,
        scheduleType,
        scheduledAt: scheduledAt.toISOString(),
        status: weightedRandom([
          { value: 'PENDING' as const,   weight: 60 },
          { value: 'SENT' as const,      weight: 30 },
          { value: 'DISMISSED' as const, weight: 10 },
        ]),
        channel: 'DISCORD',
      });
    }
    taskIdx++;
  }
  return reminders.slice(0, count);
}

// ─── Session Generator ────────────────────────────────────────────────────────

const SESSION_TITLES = [
  'Rapat Koordinasi Tim Sales', 'Follow Up Proposal Vendor X', 'Briefing Karyawan Baru',
  'Review Laporan Keuangan', 'Planning Marketing Q3', 'Evaluasi Kinerja Tim',
  'Diskusi Ekspansi Pasar', 'Update Project Status', 'Meeting dengan Klien ABC',
  'Analisis Kompetitor', 'Persiapan Company Profile', 'Training Sistem Baru',
  'Review SOP Procurement', 'Briefing Board Meeting', 'Koordinasi IT Deployment',
  'Discussion Strategy 2027', 'Rekap Sales Mingguan', 'Planning Event 2026',
  'Review Budget Q3', 'Onboarding Karyawan',
];

const AI_TOOLS = ['Meeting Summarizer', 'Task Assignment', 'Proposal Generator', 'Business Insight', 'Follow Up Generator'];
const DISCORD_USERS = ['rifki#1234', 'admin#5678', 'hr_team#9012', 'it_ops#3456', 'manager#7890'];

export function generateSessions(count = 20): ChatSession[] {
  return SESSION_TITLES.slice(0, count).map((title) => {
    const msgCount = randomInt(4, 12);
    const messages: ChatMessage[] = [];
    for (let i = 0; i < msgCount; i++) {
      const isUser = i % 2 === 0;
      messages.push({
        id: uuid(),
        role: isUser ? 'user' : 'assistant',
        content: isUser
          ? `${randomPick(['Tolong', 'Bisa', 'Mohon bantuan untuk'])} ${title.toLowerCase()}.`
          : `Baik, saya sudah memproses permintaan Anda mengenai ${title.toLowerCase()}. Berikut hasilnya...`,
        createdAt: daysFromNow(-randomInt(1, 30)),
        toolsUsed: !isUser ? [randomPick(AI_TOOLS)] : undefined,
      });
    }
    return {
      id: uuid(),
      title,
      createdAt: daysFromNow(-randomInt(1, 30)),
      updatedAt: daysFromNow(-randomInt(0, 1)),
      messages,
    };
  });
}

// ─── Analytics Generators ─────────────────────────────────────────────────────

export function generateDailyRequestData(days = 7): DailyRequest[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return { date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }), count: randomInt(15, 85) };
  });
}

export function generateHourlyDistribution(): HourlyData[] {
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  return hours.map((hour) => ({ hour, requests: randomInt(2, 30) }));
}

export function generateTokenUsageData(days = 30): TokenUsage[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return {
      date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      inputTokens: randomInt(2000, 12000),
      outputTokens: randomInt(1000, 8000),
    };
  });
}

export function generateWeeklyTrend(weeks = 12): WeeklyTrend[] {
  return Array.from({ length: weeks }, (_, i) => ({
    week: `W${weeks - i}`,
    requests: randomInt(80, 400),
    tokens: randomInt(50000, 200000),
  })).reverse();
}

export function generateToolBreakdown(): ToolBreakdown[] {
  const tools = [
    { tool: 'Meeting Summarizer', count: randomInt(80, 150) },
    { tool: 'Task Assignment',    count: randomInt(60, 120) },
    { tool: 'Proposal Generator', count: randomInt(20, 60) },
    { tool: 'Business Insight',   count: randomInt(30, 80) },
    { tool: 'RAG Search',         count: randomInt(40, 100) },
  ];
  const total = tools.reduce((s, t) => s + t.count, 0);
  return tools.map((t) => ({ ...t, percentage: Math.round((t.count / total) * 100) }));
}

export function generateTopUsers(employees: Employee[]): UserActivity[] {
  return employees.slice(0, 10).map((emp) => ({
    name: emp.fullName.split(' ')[0],
    requestCount: randomInt(10, 120),
  })).sort((a, b) => b.requestCount - a.requestCount);
}

export function generateSystemStatus(): SystemHealth {
  return {
    services: [
      { name: 'AI Provider',  status: 'ONLINE', latency: randomInt(200, 400),   uptime: Array.from({ length: 24 }, () => randomInt(95, 100)) },
      { name: 'PostgreSQL',   status: 'ONLINE', connections: randomInt(8, 20),   uptime: Array.from({ length: 24 }, () => randomInt(99, 100)) },
      { name: 'Redis',        status: 'ONLINE', memory: `${randomInt(30, 80)} MB`, uptime: Array.from({ length: 24 }, () => randomInt(99, 100)) },
      { name: 'pgvector',     status: 'ONLINE', documents: 20,                    uptime: Array.from({ length: 24 }, () => randomInt(98, 100)) },
      { name: 'Embed Queue',  status: 'ONLINE', queueDepth: randomInt(0, 3),      uptime: Array.from({ length: 24 }, () => randomInt(95, 100)) },
    ],
    updatedAt: new Date().toISOString(),
  };
}

export function generateActivityFeed(tasks: Task[], documents: KnowledgeDocument[]): ActivityFeedItem[] {
  const items: ActivityFeedItem[] = [
    ...tasks.slice(0, 4).map((t) => ({
      id: uuid(),
      type: 'task' as const,
      message: `Task "${t.title.slice(0, 40)}..." ditugaskan ke ${t.assignee?.fullName ?? 'Unknown'}`,
      timestamp: t.createdAt,
    })),
    ...documents.slice(0, 2).map((d) => ({
      id: uuid(),
      type: 'knowledge' as const,
      message: `Dokumen "${d.name}" berhasil diembedding (${d.totalChunks} chunks)`,
      timestamp: d.uploadDate,
    })),
    {
      id: uuid(),
      type: 'session' as const,
      message: 'Sesi AI baru dimulai oleh tim Marketing',
      timestamp: daysFromNow(-randomInt(0, 2)),
    },
    {
      id: uuid(),
      type: 'reminder' as const,
      message: 'Reminder dikirim untuk 5 task yang mendekati deadline',
      timestamp: daysFromNow(-randomInt(0, 1)),
    },
  ];
  return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8);
}
