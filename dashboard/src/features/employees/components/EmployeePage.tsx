'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/PageContainer';
import { DataTable, Column } from '@/components/data-display/DataTable';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { Avatar, Badge, Button, Dialog, Drawer, DropdownMenu, Input, Label, Select, Switch } from '@/components/ui';
import { useMockStore } from '@/stores/mock.store';
import type { Employee } from '@/types';
import { UserPlus, Search, MoreHorizontal, Pencil, Eye, Trash2, Phone, Mail, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const DEPT_COLORS: Record<string, string> = {
  Marketing:   'bg-purple-50 text-purple-700',
  Sales:       'bg-blue-50 text-blue-700',
  Finance:     'bg-green-50 text-green-700',
  HR:          'bg-orange-50 text-orange-700',
  IT:          'bg-cyan-50 text-cyan-700',
  Operations:  'bg-gray-100 text-gray-600',
  Management:  'bg-indigo-50 text-indigo-700',
};

const ALL_DEPTS = ['All', 'Management', 'Marketing', 'Sales', 'Finance', 'HR', 'IT', 'Operations'];

// ─── Employee Detail Drawer ───────────────────────────────────────────────────
function EmployeeDetailDrawer({ emp, onClose }: { emp: Employee | null; onClose: () => void }) {
  const { tasks } = useMockStore();
  if (!emp) return null;
  const empTasks = tasks.filter((t) => t.assigneeId === emp.id).slice(0, 5);
  return (
    <Drawer open={!!emp} onClose={onClose} title="Employee Profile" width="w-[420px]">
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
          <Avatar name={emp.fullName} size="lg" />
          <div>
            <p className="text-base font-semibold text-gray-900">{emp.fullName}</p>
            <p className="text-sm text-gray-500">{emp.position}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${DEPT_COLORS[emp.department] ?? 'bg-gray-100 text-gray-600'}`}>
                {emp.department}
              </span>
              <StatusBadge status={emp.status} />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Contact</p>
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" /> {emp.email}
          </div>
          {emp.phone && (
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" /> {emp.phone}
            </div>
          )}
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Building2 className="w-4 h-4 text-gray-400" /> {emp.department}
          </div>
        </div>
        {empTasks.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Active Tasks</p>
            {empTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <p className="text-sm text-gray-700 truncate max-w-[220px]">{t.title}</p>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
}

// ─── Employee Page ────────────────────────────────────────────────────────────
export function EmployeePage() {
  const { employees } = useMockStore();
  const [search, setSearch] = React.useState('');
  const [deptFilter, setDeptFilter] = React.useState('All');
  const [drawerEmp, setDrawerEmp] = React.useState<Employee | null>(null);

  const filtered = React.useMemo(() => {
    return employees.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch = e.fullName.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q);
      const matchDept = deptFilter === 'All' || e.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [employees, search, deptFilter]);

  const columns: Column<Employee>[] = [
    {
      key: 'employee',
      header: 'Employee',
      accessor: (e) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={e.fullName} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{e.fullName}</p>
            <p className="text-xs text-gray-400 truncate">{e.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'employeeId',
      header: 'ID',
      accessor: (e) => <span className="text-xs font-mono text-gray-500">{e.employeeId}</span>,
    },
    {
      key: 'department',
      header: 'Department',
      accessor: (e) => (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${DEPT_COLORS[e.department] ?? 'bg-gray-100 text-gray-600'}`}>
          {e.department}
        </span>
      ),
    },
    {
      key: 'position',
      header: 'Position',
      accessor: (e) => <span className="text-sm text-gray-600">{e.position}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (e) => <StatusBadge status={e.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      accessor: (e) => (
        <DropdownMenu
          trigger={
            <button className="p-1.5 rounded-[6px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          }
          items={[
            { label: 'View Profile', icon: <Eye className="w-3.5 h-3.5" />, onClick: () => setDrawerEmp(e) },
            { label: 'Edit', icon: <Pencil className="w-3.5 h-3.5" />, onClick: () => toast.info('Employee CRUD endpoints coming soon') },
            { label: 'Delete', icon: <Trash2 className="w-3.5 h-3.5" />, onClick: () => toast.info('Employee CRUD endpoints coming soon'), danger: true },
          ]}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Employee Directory"
        description={`${employees.filter((e) => e.status === 'ACTIVE').length} active of ${employees.length} total employees`}
        action={
          <Button onClick={() => toast.info('Employee CRUD endpoints coming soon')}>
            <UserPlus className="w-4 h-4" /> Add Employee
          </Button>
        }
      />

      {/* Department Filter Chips */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {ALL_DEPTS.map((dept) => (
          <button
            key={dept}
            onClick={() => setDeptFilter(dept)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              deptFilter === dept
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name, email, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(e) => e.id}
        onRowClick={setDrawerEmp}
        emptyTitle="No employees found"
        emptyDescription="Try adjusting your search or department filter."
      />

      <EmployeeDetailDrawer emp={drawerEmp} onClose={() => setDrawerEmp(null)} />
    </div>
  );
}
