export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  knowledge: '/knowledge',
  knowledgeDetail: (id: string) => `/knowledge/${id}`,
  employees: '/employees',
  tasks: '/tasks',
  reminders: '/reminders',
  sessions: '/sessions',
  sessionDetail: (id: string) => `/sessions/${id}`,
  ragSearch: '/rag-search',
  monitoring: '/monitoring',
  settings: '/settings',
} as const;
