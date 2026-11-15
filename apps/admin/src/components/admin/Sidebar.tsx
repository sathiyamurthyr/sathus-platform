'use client';

import * as React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { platformNavItems, financeNavItems, DASHBOARD_ROUTE } from '@/config/navigation';
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
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#A20A3A] text-sm font-bold text-white shadow-sm">
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
        className="admin-scrollbar flex-1 overflow-y-auto px-3 py-4 space-y-6"
        aria-label="Main navigation"
      >
        <div>
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Platform
          </p>
          <ul className="space-y-1">
            {platformNavItems.map((item) => (
              <SidebarItem key={item.href} item={item} onNavigate={onNavigate} />
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center justify-between px-3 pb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#A20A3A]">
              Finance & Billing
            </p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#A20A3A]/10 text-[#A20A3A] rounded">
              18% GST
            </span>
          </div>
          <ul className="space-y-1">
            {financeNavItems.map((item) => (
              <SidebarItem key={item.href} item={item} onNavigate={onNavigate} />
            ))}
          </ul>
        </div>
      </nav>

      <div className="shrink-0 border-t border-border p-4">
        <div className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          Sathus Technology · v1.0
        </div>
      </div>
    </div>
  );
}
