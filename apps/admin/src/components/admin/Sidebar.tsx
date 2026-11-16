'use client';

import * as React from 'react';
import Link from 'next/link';
import { X, LogOut } from 'lucide-react';

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
          {/* Official Sathus Brand Emblem */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white border border-border/80 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/sathus-logo.png"
              alt="Sathus"
              className="h-7 w-7 object-contain"
            />
          </div>
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

      <div className="shrink-0 border-t border-border p-3 space-y-2">
        <button
          type="button"
          onClick={async () => {
            try {
              await fetch('/api/auth/logout', { method: 'POST' });
            } catch {
              // Ignore
            }
            if (typeof window !== 'undefined') {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('sathus_admin_uid');
              window.location.href = '/login';
            }
          }}
          className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors outline-none"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
        <div className="rounded-md bg-muted/40 px-3 py-1.5 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>Sathus Technology</span>
          <span>v1.0</span>
        </div>
      </div>
    </div>
  );
}
