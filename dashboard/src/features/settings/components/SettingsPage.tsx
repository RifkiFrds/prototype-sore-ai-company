'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/PageContainer';
import { Card, Switch, Button } from '@/components/ui';
import { useMockStore } from '@/stores/mock.store';
import { useUIStore } from '@/stores/ui.store';
import { env } from '@/config/env';
import { Database, Moon, Sun, RefreshCw, Server } from 'lucide-react';
import { toast } from 'sonner';

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="ml-4 shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <Card className="p-6 mb-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <Icon className="w-4 h-4 text-gray-400" />
        <p className="text-sm font-semibold text-gray-900">{title}</p>
      </div>
      {children}
    </Card>
  );
}

export function SettingsPage() {
  const { theme, setTheme } = useUIStore();
  const { isUsingMockData, setUseMockData, seedAllMockData, employees, tasks, reminders, documents } = useMockStore();

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" description="Application configuration and preferences" />

      <SectionCard title="Appearance" icon={theme === 'light' ? Sun : Moon}>
        <SettingRow label="Theme" description="Switch between light and dark mode">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 capitalize">{theme}</span>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')}
            />
          </div>
        </SettingRow>
      </SectionCard>

      <SectionCard title="API Configuration" icon={Server}>
        <SettingRow label="Backend URL" description="NestJS API base URL">
          <code className="text-xs font-mono bg-gray-100 px-2.5 py-1 rounded-[6px] text-gray-600">
            {env.apiUrl}
          </code>
        </SettingRow>
        <SettingRow label="API Status" description="Set NEXT_PUBLIC_API_URL in .env.local">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Not verified
          </span>
        </SettingRow>
      </SectionCard>

      <SectionCard title="Mock Data" icon={Database}>
        <SettingRow label="Use Mock Data" description="Toggle between mock data and live backend responses">
          <Switch checked={isUsingMockData} onCheckedChange={setUseMockData} />
        </SettingRow>
        <SettingRow label="Data Summary" description="Current seeded data counts">
          <div className="text-xs text-gray-500 text-right space-y-0.5">
            <p>{employees.length} employees · {tasks.length} tasks</p>
            <p>{reminders.length} reminders · {documents.length} documents</p>
          </div>
        </SettingRow>
        <SettingRow label="Re-seed Data" description="Regenerate all mock data from scratch">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { seedAllMockData(); toast.success('Mock data re-seeded successfully'); }}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-seed
          </Button>
        </SettingRow>
      </SectionCard>

      <SectionCard title="About" icon={Server}>
        <SettingRow label="Product" description="">
          <span className="text-sm text-gray-600">AI Company Assistant Dashboard</span>
        </SettingRow>
        <SettingRow label="Version" description="">
          <span className="text-xs font-mono text-gray-400">v1.0.0</span>
        </SettingRow>
        <SettingRow label="Stack" description="">
          <span className="text-xs text-gray-400">Next.js 16 · Tailwind v4 · Zustand · Recharts</span>
        </SettingRow>
      </SectionCard>
    </div>
  );
}
