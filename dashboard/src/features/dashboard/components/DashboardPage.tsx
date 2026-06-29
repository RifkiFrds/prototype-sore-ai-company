'use client';

import * as React from 'react';
import { StatCard } from '@/components/data-display/StatCard';
import { Card, CardContent } from '@/components/ui';
import { useMockStore } from '@/stores/mock.store';
import {
  generateDailyRequestData,
  generateHourlyDistribution,
  generateActivityFeed,
} from '@/lib/mock-generators';
import { formatRelative } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Zap, FileText, CheckSquare, Bell, BookOpen,
  Bot, CheckCircle, AlarmClock,
} from 'lucide-react';

const CHART_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6'];

// ─── Today Summary Banner ─────────────────────────────────────────────────────
function TodaySummaryBanner() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Selamat Pagi' : hour < 17 ? 'Selamat Siang' : 'Selamat Sore';
  const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{greeting}, Admin 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">{dateStr} · SAI Cowork Workspace AI</p>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-[10px] p-3 text-xs text-blue-800 max-w-md">
        <span className="font-semibold block mb-0.5">PT SAI Inspirasi Kolaborasi</span>
        Barrier-free creation space offering flexible coworking, event space, private office & co-living across 8 major cities in Indonesia.
      </div>
    </div>
  );
}

// ─── Stat Cards Row ───────────────────────────────────────────────────────────
function StatCardRow() {
  const { tasks, reminders, documents } = useMockStore();

  const todayRequests = React.useMemo(() => Math.floor(Math.random() * 60) + 20, []);
  const meetingSummaries = React.useMemo(() => Math.floor(Math.random() * 8) + 3, []);
  const activeTasks = tasks.filter((t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;
  const pendingReminders = reminders.filter((r) => r.status === 'PENDING').length;
  const totalDocs = documents.length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      <StatCard
        title="AI Requests Today"
        value={todayRequests}
        icon={Zap}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
        delta={{ value: 12, direction: 'up', period: 'yesterday' }}
      />
      <StatCard
        title="Meeting Summaries"
        value={meetingSummaries}
        icon={FileText}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
        delta={{ value: 5, direction: 'up', period: 'yesterday' }}
      />
      <StatCard
        title="Active Tasks"
        value={activeTasks}
        icon={CheckSquare}
        iconBg="bg-green-50"
        iconColor="text-green-600"
      />
      <StatCard
        title="Pending Reminders"
        value={pendingReminders}
        icon={Bell}
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
      />
      <StatCard
        title="Knowledge Docs"
        value={totalDocs}
        icon={BookOpen}
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
        delta={{ value: 3, direction: 'up', period: 'last week' }}
      />
    </div>
  );
}

// ─── AI Usage Area Chart ──────────────────────────────────────────────────────
function AIUsageChart() {
  const data = React.useMemo(() => generateDailyRequestData(7), []);
  return (
    <Card className="p-6">
      <p className="text-sm font-semibold text-gray-900 mb-4">AI Requests — Last 7 Days</p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.08} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 12 }}
            cursor={{ stroke: '#E5E7EB' }}
          />
          <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} fill="url(#blueGrad)" dot={false} name="Requests" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── Daily Request Bar Chart ──────────────────────────────────────────────────
function DailyRequestChart() {
  const data = React.useMemo(() => generateHourlyDistribution(), []);
  return (
    <Card className="p-6">
      <p className="text-sm font-semibold text-gray-900 mb-4">Hourly Request Distribution</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="hour" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 12 }}
            cursor={{ fill: '#F9FAFB' }}
          />
          <Bar dataKey="requests" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={24} name="Requests" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── Task Completion Donut ────────────────────────────────────────────────────
function TaskCompletionChart() {
  const { tasks } = useMockStore();
  const data = React.useMemo(() => {
    const counts: Record<string, number> = { DONE: 0, IN_PROGRESS: 0, PENDING: 0, OVERDUE: 0 };
    tasks.forEach((t) => { counts[t.status] = (counts[t.status] ?? 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  const COLORS: Record<string, string> = {
    DONE: '#10B981', IN_PROGRESS: '#2563EB', PENDING: '#9CA3AF', OVERDUE: '#EF4444',
  };

  return (
    <Card className="p-6">
      <p className="text-sm font-semibold text-gray-900 mb-4">Task Status Breakdown</p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name] ?? '#9CA3AF'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 12 }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── Recent Activity Feed ─────────────────────────────────────────────────────
const ACTIVITY_COLORS: Record<string, string> = {
  task: 'border-blue-400',
  reminder: 'border-amber-400',
  knowledge: 'border-purple-400',
  session: 'border-green-400',
};
const ACTIVITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  task: CheckCircle,
  reminder: AlarmClock,
  knowledge: BookOpen,
  session: Bot,
};

function RecentActivityFeed() {
  const { tasks, documents } = useMockStore();
  const feed = React.useMemo(() => generateActivityFeed(tasks, documents), [tasks, documents]);

  return (
    <Card className="p-6">
      <p className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</p>
      <div className="space-y-0">
        {feed.map((item, i) => {
          const Icon = ACTIVITY_ICONS[item.type] ?? Bot;
          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 py-3 border-l-2 pl-3 ${ACTIVITY_COLORS[item.type] ?? 'border-gray-200'} ${i < feed.length - 1 ? 'border-b border-b-gray-50' : ''}`}
            >
              <Icon className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-snug truncate">{item.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatRelative(item.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── SAI Cowork Profile Widget ───────────────────────────────────────────────
function SAICoworkProfile() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-[8px] overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-100 shrink-0">
          <img src="/logo.png" alt="SAI Cowork" className="w-full h-full object-contain" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">SAI Cowork Workspace Profile</p>
          <p className="text-xs text-gray-400">PT SAI Inspirasi Kolaborasi</p>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-xs text-gray-600 leading-relaxed">
          <strong>Barrier-Free Creation Space:</strong> Sai Cowork is a coworking and event space provider spread across major cities in Indonesia. Our workspaces are designed to encourage collaboration and productivity for startups, freelancers, and corporations, providing flexible space used as needed.
        </p>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-gray-50 rounded-[10px] p-3 border border-gray-100">
            <span className="text-[10px] text-gray-400 block uppercase font-medium">Headquarters</span>
            <span className="text-xs text-gray-700 font-semibold mt-0.5 block">Soho Capital 40th Floor, Jakarta</span>
          </div>
          <div className="bg-gray-50 rounded-[10px] p-3 border border-gray-100">
            <span className="text-[10px] text-gray-400 block uppercase font-medium">Locations Network</span>
            <span className="text-xs text-gray-700 font-semibold mt-0.5 block">8 Spaces in Indonesia</span>
          </div>
          <div className="bg-gray-50 rounded-[10px] p-3 border border-gray-100">
            <span className="text-[10px] text-gray-400 block uppercase font-medium">Support Contact</span>
            <span className="text-xs text-gray-700 font-semibold mt-0.5 block">+62 838-3383-8884</span>
          </div>
          <div className="bg-gray-50 rounded-[10px] p-3 border border-gray-100">
            <span className="text-[10px] text-gray-400 block uppercase font-medium">Key Services</span>
            <span className="text-xs text-gray-700 font-semibold mt-0.5 block">Meeting Rooms, Private Office, Lounge</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export function DashboardPage() {
  return (
    <div>
      <TodaySummaryBanner />
      <StatCardRow />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
        <AIUsageChart />
        <DailyRequestChart />
        <TaskCompletionChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentActivityFeed />
        <SAICoworkProfile />
      </div>
    </div>
  );
}
