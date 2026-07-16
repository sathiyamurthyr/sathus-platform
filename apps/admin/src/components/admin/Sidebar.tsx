'use client';

import * as React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { navItems, DASHBOARD_ROUTE } from '@/config/navigation';
import { SidebarItem } from './SidebarItem';

export interface SidebarProps {
  className?: string;
  /** Called after a navigation link is clicked (e.g. close mobile drawer). */
  onNavigate?: () => void;
  /** Show the close button (used inside the mobile drawer). */
  showClose?: boolean;
  onClose?: () => void;
}

/**
 * Application sidebar.
 *
 * Presentational shell that owns the brand header, the primary navigation
 * list and a footer status note. Reused for both the persistent desktop
 * rail and the mobile slide-in drawer.
 */
export function Sidebar({
  className,
  onNavigate,
  showClose = false,
  onClose,
}: SidebarProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col border-r border-border bg-card',
        className
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
        <Link
          href={DASHBOARD_ROUTE}
          className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onNavigate}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            S
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Sathus<span className="text-muted-foreground"> Admin</span>
          </span>
        </Link>
        {showClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>

      <nav
        className="admin-scrollbar flex-1 overflow-y-auto px-3 py-4"
        aria-label="Main navigation"
      >
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem key={item.href} item={item} onNavigate={onNavigate} />
          ))}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-border p-4">
        <div className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          Foundation sprint · v1.0
        </div>
      </div>
    </div>
  );
}
