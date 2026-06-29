import * as React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="w-12 h-12 text-gray-200 mb-4" />
      <p className="text-base font-medium text-gray-700 mb-1">{title}</p>
      <p className="text-sm text-gray-400 max-w-xs">{description}</p>
      {action && (
        <div className="mt-5">
          <Button onClick={action.onClick} size="sm">
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
