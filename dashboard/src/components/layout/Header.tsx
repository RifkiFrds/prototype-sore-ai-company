'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/stores/ui.store';
import { SIDEBAR_NAV } from '@/constants/sidebar-nav';
import { Moon, Sun, Bot } from 'lucide-react';

function BreadcrumbItem({ label, isLast }: { label: string; isLast: boolean }) {
  return (
    <li className="flex items-center gap-1.5">
      {!isLast && <span className="text-gray-300">/</span>}
      <span className={cn('text-sm', isLast ? 'text-gray-900 font-medium' : 'text-gray-400')}>
        {label}
      </span>
    </li>
  );
}

export function Header() {
  const { sidebarCollapsed, theme, setTheme } = useUIStore();
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => {
    const navItem = SIDEBAR_NAV.find((n) => n.href === `/${seg}`);
    return navItem?.label ?? seg.charAt(0).toUpperCase() + seg.slice(1);
  });

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-14 bg-white/95 border-b border-gray-200 flex items-center justify-between px-6 z-20 transition-all duration-200',
        sidebarCollapsed ? 'left-16' : 'left-60',
      )}
    >
      {/* Breadcrumb */}
      <ol className="flex items-center gap-1.5 list-none">
        <li className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-100 shrink-0">
            <img src="/logo.png" alt="SAI Cowork" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm text-gray-400">SAI Cowork</span>
        </li>
        {breadcrumbs.map((crumb, i) => (
          <BreadcrumbItem key={i} label={crumb} isLast={i === breadcrumbs.length - 1} />
        ))}
      </ol>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-[8px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
          AD
        </div>
      </div>
    </header>
  );
}
