'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui.store';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  const { sidebarCollapsed } = useUIStore();
  return (
    <main
      className={cn(
        'min-h-screen bg-[#FAFAFA] pt-14 transition-all duration-200',
        sidebarCollapsed ? 'ml-16' : 'ml-60',
        className,
      )}
    >
      <div className="p-6">{children}</div>
    </main>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  );
}
