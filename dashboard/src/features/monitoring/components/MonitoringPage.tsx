'use client';

import * as React from 'react';
import { PageHeader } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { generateSystemStatus } from '@/lib/mock-generators';
import type { ServiceHealth, SystemHealth } from '@/types';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Brain, Database, Zap, GitBranch, Layers, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'AI Provider': Brain,
  PostgreSQL:    Database,
  Redis:         Zap,
  pgvector:      GitBranch,
  'Embed Queue': Layers,
};

const STATUS_BORDER: Record<string, string> = {
  ONLINE:   'border-l-4 border-l-green-500',
  DEGRADED: 'border-l-4 border-l-amber-400',
  OFFLINE:  'border-l-4 border-l-red-500',
  UNKNOWN:  'border-l-4 border-l-gray-300',
};

function ServiceCard({ service }: { service: ServiceHealth }) {
  const Icon = SERVICE_ICONS[service.name] ?? Layers;
  const uptimeData = (service.uptime ?? []).map((v, i) => ({ h: i, v }));

  return (
    <Card className={cn('p-5', STATUS_BORDER[service.status] ?? '')}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[8px] bg-gray-50">
            <Icon className="w-4 h-4 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{service.name}</p>
          </div>
        </div>
        <StatusBadge status={service.status} dot />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
        {service.latency !== undefined && (
          <>
            <span className="text-gray-400">Latency</span>
            <span className="text-right font-medium text-gray-700">{service.latency} ms</span>
          </>
        )}
        {service.connections !== undefined && (
          <>
            <span className="text-gray-400">Connections</span>
            <span className="text-right font-medium text-gray-700">{service.connections}</span>
          </>
        )}
        {service.memory && (
          <>
            <span className="text-gray-400">Memory</span>
            <span className="text-right font-medium text-gray-700">{service.memory}</span>
          </>
        )}
        {service.documents !== undefined && (
          <>
            <span className="text-gray-400">Documents</span>
            <span className="text-right font-medium text-gray-700">{service.documents}</span>
          </>
        )}
        {service.queueDepth !== undefined && (
          <>
            <span className="text-gray-400">Queue Depth</span>
            <span className="text-right font-medium text-gray-700">{service.queueDepth}</span>
          </>
        )}
      </div>

      {/* Sparkline */}
      {uptimeData.length > 0 && (
        <ResponsiveContainer width="100%" height={32}>
          <LineChart data={uptimeData}>
            <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

export function MonitoringPage() {
  const [health, setHealth] = React.useState<SystemHealth>(() => generateSystemStatus());
  const [lastUpdated, setLastUpdated] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setHealth(generateSystemStatus());
      setLastUpdated(new Date());
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  function refresh() {
    setHealth(generateSystemStatus());
    setLastUpdated(new Date());
  }

  return (
    <div>
      <PageHeader
        title="System Monitoring"
        description={`Last updated: ${lastUpdated.toLocaleTimeString('id-ID')} · Auto-refresh every 30s`}
        action={
          <button
            onClick={refresh}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-[8px] hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        }
      />

      <div className="mb-3 px-3 py-2 rounded-[8px] bg-amber-50 border border-amber-200 text-xs text-amber-700 inline-flex items-center gap-2">
        <span className="font-semibold">Demo Mode</span> — displaying mock data. Add <code className="font-mono bg-amber-100 px-1 rounded">GET /api/system/health</code> endpoint to enable live data.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
        {health.services.map((svc) => (
          <ServiceCard key={svc.name} service={svc} />
        ))}
      </div>
    </div>
  );
}
