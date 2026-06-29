import * as React from 'react';
import { cn } from '@/lib/utils';

type StatusVariant = {
  bg: string;
  text: string;
  ring?: string;
};

const STATUS_MAP: Record<string, StatusVariant> = {
  // Task / general
  PENDING:     { bg: 'bg-gray-100',   text: 'text-gray-600',  ring: 'ring-gray-200' },
  IN_PROGRESS: { bg: 'bg-blue-50',    text: 'text-blue-700',  ring: 'ring-blue-200' },
  DONE:        { bg: 'bg-green-50',   text: 'text-green-700', ring: 'ring-green-200' },
  OVERDUE:     { bg: 'bg-red-50',     text: 'text-red-700',   ring: 'ring-red-200' },
  // Reminder
  SENT:        { bg: 'bg-green-50',   text: 'text-green-700', ring: 'ring-green-200' },
  DISMISSED:   { bg: 'bg-gray-50',    text: 'text-gray-500',  ring: 'ring-gray-200' },
  // Document
  READY:       { bg: 'bg-green-50',   text: 'text-green-700', ring: 'ring-green-200' },
  PROCESSING:  { bg: 'bg-amber-50',   text: 'text-amber-700', ring: 'ring-amber-200' },
  ERROR:       { bg: 'bg-red-50',     text: 'text-red-700',   ring: 'ring-red-200' },
  // Employee
  ACTIVE:      { bg: 'bg-green-50',   text: 'text-green-700', ring: 'ring-green-200' },
  INACTIVE:    { bg: 'bg-gray-100',   text: 'text-gray-500',  ring: 'ring-gray-200' },
  // Service
  ONLINE:      { bg: 'bg-green-50',   text: 'text-green-700', ring: 'ring-green-200' },
  DEGRADED:    { bg: 'bg-amber-50',   text: 'text-amber-700', ring: 'ring-amber-200' },
  OFFLINE:     { bg: 'bg-red-50',     text: 'text-red-700',   ring: 'ring-red-200' },
  UNKNOWN:     { bg: 'bg-gray-100',   text: 'text-gray-500',  ring: 'ring-gray-200' },
};

interface StatusBadgeProps {
  status: string;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ status, dot = false, className }: StatusBadgeProps) {
  const variant = STATUS_MAP[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', ring: 'ring-gray-200' };
  const label = status.replace(/_/g, ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset',
        variant.bg,
        variant.text,
        variant.ring,
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            status === 'ONLINE' && 'animate-pulse',
            variant.text.replace('text-', 'bg-'),
          )}
        />
      )}
      {label}
    </span>
  );
}
