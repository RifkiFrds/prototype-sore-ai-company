'use client';

import * as React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageContainer';
import { DataTable, Column } from '@/components/data-display/DataTable';
import { Badge, Button, Dialog, DropdownMenu, Input } from '@/components/ui';
import { useMockStore } from '@/stores/mock.store';
import type { ChatSession } from '@/types';
import { formatRelative, formatDateTime } from '@/lib/utils';
import { Search, Eye, Trash2, MoreHorizontal, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';

function MessageCountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
      <MessageSquare className="w-3 h-3" />
      {count}
    </span>
  );
}

function DeleteSessionDialog({ session, onClose }: { session: ChatSession | null; onClose: () => void }) {
  if (!session) return null;
  return (
    <Dialog open={!!session} onClose={onClose} title="Delete Session" size="sm">
      <p className="text-sm text-gray-600 mb-1">
        Delete session <span className="font-medium text-gray-900">"{session.title}"</span>?
      </p>
      <p className="text-xs text-gray-400 mb-5">This will permanently remove all {session.messages.length} messages.</p>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={() => { toast.error('Delete session called on real backend'); onClose(); }}>
          <Trash2 className="w-4 h-4" /> Delete
        </Button>
      </div>
    </Dialog>
  );
}

export function SessionPage() {
  const { sessions } = useMockStore();
  const [search, setSearch] = React.useState('');
  const [deleteSession, setDeleteSession] = React.useState<ChatSession | null>(null);

  const filtered = React.useMemo(() => {
    return sessions.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));
  }, [sessions, search]);

  const columns: Column<ChatSession>[] = [
    {
      key: 'title',
      header: 'Session',
      sortable: true,
      accessor: (s) => (
        <Link href={ROUTES.sessionDetail(s.id)} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline truncate block max-w-[280px]">
          {s.title}
        </Link>
      ),
    },
    {
      key: 'messages',
      header: 'Messages',
      accessor: (s) => <MessageCountBadge count={s.messages.length} />,
    },
    {
      key: 'createdAt',
      header: 'Started',
      sortable: true,
      accessor: (s) => <span className="text-sm text-gray-500">{formatRelative(s.createdAt)}</span>,
    },
    {
      key: 'updatedAt',
      header: 'Last Activity',
      accessor: (s) => <span className="text-xs text-gray-400">{formatRelative(s.updatedAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      accessor: (s) => (
        <DropdownMenu
          trigger={
            <button className="p-1.5 rounded-[6px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          }
          items={[
            { label: 'View History', icon: <Eye className="w-3.5 h-3.5" />, onClick: () => {} },
            { label: 'Delete', icon: <Trash2 className="w-3.5 h-3.5" />, onClick: () => setDeleteSession(s), danger: true },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="AI Sessions"
        description={`${sessions.length} conversation sessions`}
      />
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search sessions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(s) => s.id}
        pageSize={15}
        emptyTitle="No sessions found"
        emptyDescription="AI sessions are created when users run /new in Discord."
      />
      <DeleteSessionDialog session={deleteSession} onClose={() => setDeleteSession(null)} />
    </div>
  );
}
