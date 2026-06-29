'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/PageContainer';
import { DataTable, Column } from '@/components/data-display/DataTable';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { Avatar, Badge, Button, Drawer, DropdownMenu, Input, Select } from '@/components/ui';
import { useMockStore } from '@/stores/mock.store';
import type { Task } from '@/types';
import { formatDate, formatRelative, isOverdue } from '@/lib/utils';
import { Search, MoreHorizontal, Eye, Edit2, Calendar, User, Bot, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ─── Task Detail Drawer ───────────────────────────────────────────────────────
function TaskDetailDrawer({ task, onClose }: { task: Task | null; onClose: () => void }) {
  if (!task) return null;
  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE';
  return (
    <Drawer open={!!task} onClose={onClose} title="Task Detail" width="w-[480px]">
      <div className="p-6 space-y-5">
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="text-sm font-semibold text-gray-900 leading-snug">{task.title}</h2>
            <StatusBadge status={task.status} />
          </div>
          {task.description && (
            <p className="text-sm text-gray-500 leading-relaxed">{task.description}</p>
          )}
        </div>

        <div className="space-y-3 pt-3 border-t border-gray-100">
          {task.assignee && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="w-4 h-4" /> Assigned To
              </div>
              <div className="flex items-center gap-2">
                <Avatar name={task.assignee.fullName} size="sm" />
                <span className="text-sm font-medium text-gray-700">{task.assignee.fullName}</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" /> Due Date
            </div>
            <span className={cn('text-sm font-medium', overdue ? 'text-red-600' : 'text-gray-700')}>
              {formatDate(task.dueDate)} {overdue && '(Overdue)'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Bot className="w-4 h-4" /> Source
            </div>
            <Badge variant="secondary">{task.source}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              Created
            </div>
            <span className="text-sm text-gray-400">{formatRelative(task.createdAt)}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => toast.info('Status update endpoint coming soon')}
          >
            <Edit2 className="w-4 h-4" /> Update Status
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

// ─── Task Page ────────────────────────────────────────────────────────────────
export function TaskPage() {
  const { tasks } = useMockStore();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const filtered = React.useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.assignee?.fullName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tasks, search, statusFilter]);

  const columns: Column<Task>[] = [
    {
      key: 'title',
      header: 'Task',
      sortable: true,
      accessor: (t) => (
        <p className="text-sm text-gray-900 line-clamp-2 max-w-[280px]">{t.title}</p>
      ),
    },
    {
      key: 'assignee',
      header: 'Assigned To',
      accessor: (t) =>
        t.assignee ? (
          <div className="flex items-center gap-2.5">
            <Avatar name={t.assignee.fullName} size="sm" />
            <span className="text-sm text-gray-700">{t.assignee.fullName}</span>
          </div>
        ) : (
          <span className="text-gray-300 text-sm">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (t) => <StatusBadge status={t.status} />,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      accessor: (t) => {
        const overdue = isOverdue(t.dueDate) && t.status !== 'DONE';
        return (
          <span className={cn('text-sm', overdue ? 'text-red-600 font-medium' : 'text-gray-500')}>
            {formatDate(t.dueDate)}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      header: 'Created',
      accessor: (t) => <span className="text-xs text-gray-400">{formatRelative(t.createdAt)}</span>,
    },
    {
      key: 'source',
      header: 'Source',
      accessor: (t) => <Badge variant="secondary">{t.source}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      accessor: (t) => (
        <DropdownMenu
          trigger={
            <button className="p-1.5 rounded-[6px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          }
          items={[
            { label: 'View Detail', icon: <Eye className="w-3.5 h-3.5" />, onClick: () => setSelectedTask(t) },
            { label: 'Update Status', icon: <Edit2 className="w-3.5 h-3.5" />, onClick: () => { setSelectedTask(t); } },
          ]}
        />
      ),
    },
  ];

  const stats = React.useMemo(() => ({
    pending: tasks.filter((t) => t.status === 'PENDING').length,
    inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    done: tasks.filter((t) => t.status === 'DONE').length,
    overdue: tasks.filter((t) => t.status === 'OVERDUE').length,
  }), [tasks]);

  return (
    <div>
      <PageHeader
        title="Task Monitor"
        description={`${tasks.length} total tasks · ${stats.overdue} overdue`}
      />

      {/* Quick Stats */}
      <div className="flex items-center gap-3 mb-5">
        {[
          { label: 'Pending',     count: stats.pending,    color: 'bg-gray-100 text-gray-600' },
          { label: 'In Progress', count: stats.inProgress, color: 'bg-blue-50 text-blue-700' },
          { label: 'Done',        count: stats.done,       color: 'bg-green-50 text-green-700' },
          { label: 'Overdue',     count: stats.overdue,    color: 'bg-red-50 text-red-700' },
        ].map((s) => (
          <div key={s.label} className={`px-3 py-1.5 rounded-[8px] text-xs font-medium ${s.color}`}>
            {s.count} {s.label}
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search tasks or assignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="OVERDUE">Overdue</option>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(t) => t.id}
        onRowClick={setSelectedTask}
        pageSize={15}
        emptyTitle="No tasks found"
        emptyDescription="Try adjusting your search or status filter."
      />

      <TaskDetailDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  );
}
