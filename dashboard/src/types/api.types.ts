// ─── Chat / Session ──────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  toolsUsed?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

// ─── Employee ─────────────────────────────────────────────────────────────────

export type Department =
  | 'Marketing'
  | 'Sales'
  | 'Finance'
  | 'HR'
  | 'IT'
  | 'Operations'
  | 'Management';

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone?: string;
  department: Department;
  position: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// ─── Task ─────────────────────────────────────────────────────────────────────

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'OVERDUE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId: string;
  assignee?: Employee;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  sourceSessionId?: string;
  source: 'AI' | 'MANUAL';
}

export interface TaskFilters {
  status?: TaskStatus;
  assigneeId?: string;
  search?: string;
}

// ─── Reminder ─────────────────────────────────────────────────────────────────

export type ReminderStatus = 'PENDING' | 'SENT' | 'DISMISSED';
export type ScheduleType = 'H-1' | 'H-3' | 'H-7' | 'CUSTOM';

export interface Reminder {
  id: string;
  title: string;
  taskId?: string;
  taskTitle?: string;
  assigneeId: string;
  assignee?: Employee;
  scheduleType: ScheduleType;
  scheduledAt: string;
  status: ReminderStatus;
  channel: 'DISCORD';
}

export interface ReminderFilters {
  status?: ReminderStatus;
  assigneeId?: string;
}

// ─── Knowledge / RAG ─────────────────────────────────────────────────────────

export type DocumentStatus = 'PROCESSING' | 'READY' | 'ERROR';
export type FileType = 'PDF' | 'DOCX' | 'TXT' | 'CSV' | 'JSON';

export interface KnowledgeDocument {
  id: string;
  name: string;
  fileType: FileType;
  status: DocumentStatus;
  uploadDate: string;
  totalChunks: number;
  sizeBytes: number;
}

export interface RAGChunkResult {
  chunkId: string;
  documentName: string;
  content: string;
  similarityScore: number;
  metadata: Record<string, unknown>;
}

export interface RAGQueryResult {
  results: RAGChunkResult[];
}

// ─── Monitoring ───────────────────────────────────────────────────────────────

export type ServiceStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'UNKNOWN';

export interface ServiceHealth {
  name: string;
  status: ServiceStatus;
  latency?: number;
  connections?: number;
  memory?: string;
  documents?: number;
  queueDepth?: number;
  uptime?: number[];
}

export interface SystemHealth {
  services: ServiceHealth[];
  updatedAt: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface DailyRequest {
  date: string;
  count: number;
}

export interface HourlyData {
  hour: string;
  requests: number;
}

export interface TokenUsage {
  date: string;
  inputTokens: number;
  outputTokens: number;
}

export interface WeeklyTrend {
  week: string;
  requests: number;
  tokens: number;
}

export interface ToolBreakdown {
  tool: string;
  count: number;
  percentage: number;
}

export interface UserActivity {
  name: string;
  requestCount: number;
}

export interface ActivityFeedItem {
  id: string;
  type: 'task' | 'reminder' | 'knowledge' | 'session';
  message: string;
  timestamp: string;
}
