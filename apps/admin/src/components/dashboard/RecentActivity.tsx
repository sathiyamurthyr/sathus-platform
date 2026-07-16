import * as React from 'react';

import { cn } from '@/lib/utils';
import type { ActivityItem } from '@/types/admin';

export interface RecentActivityProps {
  items: ActivityItem[];
  className?: string;
}

/**
 * Timeline-style feed of recent platform activity (placeholder data).
 */
export function RecentActivity({ items, className }: RecentActivityProps) {
  return (
    <ul className={cn('space-y-1', className)}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-accent/60"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
            <time className="shrink-0 text-xs text-muted-foreground" dateTime={item.timestamp}>
              {item.timestamp}
            </time>
          </li>
        );
      })}
    </ul>
  );
}
