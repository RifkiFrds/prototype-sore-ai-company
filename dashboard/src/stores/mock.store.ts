'use client';

import { create } from 'zustand';
import type { Employee, Task, Reminder, ChatSession, KnowledgeDocument } from '@/types';
import {
  seedEmployees,
  seedDocuments,
  generateTasks,
  generateReminders,
  generateSessions,
} from '@/lib/mock-generators';

interface MockState {
  employees: Employee[];
  tasks: Task[];
  reminders: Reminder[];
  sessions: ChatSession[];
  documents: KnowledgeDocument[];
  isSeeded: boolean;
  isUsingMockData: boolean;
  seedAllMockData: () => void;
  setUseMockData: (flag: boolean) => void;
}

export const useMockStore = create<MockState>()((set) => ({
  employees: [],
  tasks: [],
  reminders: [],
  sessions: [],
  documents: [],
  isSeeded: false,
  isUsingMockData: true,

  seedAllMockData: () => {
    const employees = seedEmployees();
    const documents = seedDocuments();
    const tasks = generateTasks(employees, 150);
    const reminders = generateReminders(tasks, 200);
    const sessions = generateSessions(20);
    set({ employees, documents, tasks, reminders, sessions, isSeeded: true });
  },

  setUseMockData: (flag) => set({ isUsingMockData: flag }),
}));
