import {
  LayoutDashboard,
  BookOpen,
  Users,
  CheckSquare,
  Bell,
  MessageSquare,
  Search,
  Activity,
  Settings,
} from 'lucide-react';
import { ROUTES } from './routes';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Knowledge', href: ROUTES.knowledge, icon: BookOpen },
  { label: 'Employees', href: ROUTES.employees, icon: Users },
  { label: 'Tasks', href: ROUTES.tasks, icon: CheckSquare },
  { label: 'Reminders', href: ROUTES.reminders, icon: Bell },
  { label: 'AI Sessions', href: ROUTES.sessions, icon: MessageSquare },
  { label: 'RAG Search', href: ROUTES.ragSearch, icon: Search },
  { label: 'Monitoring', href: ROUTES.monitoring, icon: Activity },
  { label: 'Settings', href: ROUTES.settings, icon: Settings },
];
