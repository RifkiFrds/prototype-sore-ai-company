import type { TaskFilters, ReminderFilters } from '@/types';

export const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    list: (filters?: TaskFilters) => ['tasks', 'list', filters] as const,
    detail: (id: string) => ['tasks', 'detail', id] as const,
  },
  reminders: {
    all: ['reminders'] as const,
    list: (filters?: ReminderFilters) => ['reminders', 'list', filters] as const,
  },
  employees: {
    all: ['employees'] as const,
    detail: (id: string) => ['employees', 'detail', id] as const,
  },
  documents: {
    all: ['documents'] as const,
    detail: (id: string) => ['documents', 'detail', id] as const,
  },
  sessions: {
    all: ['sessions'] as const,
    detail: (id: string) => ['sessions', 'detail', id] as const,
  },
  rag: {
    query: () => ['rag', 'query'] as const,
  },
  system: {
    health: () => ['system', 'health'] as const,
  },
} as const;
