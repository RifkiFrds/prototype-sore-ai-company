'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/PageContainer';
import { DataTable, Column } from '@/components/data-display/DataTable';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { Avatar, Badge, Button, Input, Select } from '@/components/ui';
import { useMockStore } from '@/stores/mock.store';
import type { Reminder } from '@/types';
import { formatDate, formatRelative } from '@/lib/utils';
import { Search, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

function ScheduleChip({ scheduleType }: { scheduleType: string }) {
  const color = scheduleType === 'H-1'
    ? 'bg-red-50 text-red-600'
    : scheduleType === 'H-3'
      ? 'bg-amber-50 text-amber-600'
      : 'bg-gray-100 text-gray-500';
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold', color)}>
      {scheduleType}
    </span>
  );
}

export function ReminderPage() {
  const { reminders } = useMockStore();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');

  const filtered = React.useMemo(() => {
    return reminders.filter((r) => {
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.assignee?.fullName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [reminders, search, statusFilter]);

  const columns: Column<Reminder>[] = [
    {
      key: 'title',
      header: 'Reminder',
      accessor: (r) => <p className="text-sm text-gray-900 truncate max-w-[220px]">{r.title}</p>,
    },
    {
      key: 'taskTitle',
      header: 'Linked Task',
      accessor: (r) => (
        <p className="text-sm text-gray-500 truncate max-w-[200px]">{r.taskTitle ?? '—'}</p>
      ),
    },
    {
      key: 'assignee',
      header: 'Assignee',
      accessor: (r) =>
        r.assignee ? (
          <div className="flex items-center gap-2">
            <Avatar name={r.assignee.fullName} size="sm" />
            <span className="text-sm text-gray-700">{r.assignee.fullName}</span>
          </div>
        ) : (
          <span className="text-gray-300 text-sm">—</span>
        ),
    },
    {
      key: 'scheduleType',
      header: 'Schedule',
      accessor: (r) => <ScheduleChip scheduleType={r.scheduleType} />,
    },
    {
      key: 'scheduledAt',
      header: 'Scheduled',
      accessor: (r) => <span className="text-sm text-gray-500">{formatDate(r.scheduledAt)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (r) => <StatusBadge status={r.status} dot />,
    },
    {
      key: 'channel',
      header: 'Channel',
      accessor: (r) => <Badge variant="secondary">{r.channel}</Badge>,
    },
  ];

  const stats = {
    pending: reminders.filter((r) => r.status === 'PENDING').length,
    sent: reminders.filter((r) => r.status === 'SENT').length,
    dismissed: reminders.filter((r) => r.status === 'DISMISSED').length,
  };

  return (
    <div>
      <PageHeader
        title="Reminder Alerts"
        description={`${reminders.length} total · ${stats.pending} pending · ${stats.sent} sent`}
      />

      <div className="flex items-center gap-3 mb-5">
        {[
          { label: 'Pending',   count: stats.pending,   color: 'bg-amber-50 text-amber-700' },
          { label: 'Sent',      count: stats.sent,      color: 'bg-green-50 text-green-700' },
          { label: 'Dismissed', count: stats.dismissed, color: 'bg-gray-100 text-gray-500' },
        ].map((s) => (
          <div key={s.label} className={`px-3 py-1.5 rounded-[8px] text-xs font-medium ${s.color}`}>
            {s.count} {s.label}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search reminders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-36">
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="SENT">Sent</option>
          <option value="DISMISSED">Dismissed</option>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(r) => r.id}
        pageSize={15}
        emptyTitle="No reminders found"
        emptyDescription="Reminders are created automatically when AI assigns tasks."
      />
    </div>
  );
}
