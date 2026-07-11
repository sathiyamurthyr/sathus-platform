'use client';

import * as React from 'react';
import { Bell } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';
import { useClickOutside } from '@/hooks/use-click-outside';

/**
 * Notifications placeholder.
 *
 * Mirrors the final notification centre's trigger and panel. The panel
 * currently renders an empty state because the notification service is not
 * part of the foundation sprint.
 */
export function NotificationMenu({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
      </Button>

      {open && (
        <div
          role="menu"
          aria-label="Notifications"
          className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-md border bg-popover p-0 text-popover-foreground shadow-md"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            <Badge variant="muted">0 new</Badge>
          </div>
          <div className="px-4 py-2">
            <EmptyState
              icon={<Bell className="h-5 w-5" />}
              title="You're all caught up"
              description="Notifications will appear here once the service is enabled."
              className="py-8"
            />
          </div>
        </div>
      )}
    </div>
  );
}
