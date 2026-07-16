import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { QuickAction } from '@/types/admin';

export interface QuickActionCardProps {
  action: QuickAction;
  className?: string;
}

/**
 * A shortcut tile that navigates to a module. Stacks an icon, label and
 * description with a trailing affordance, and is fully keyboard accessible.
 */
export function QuickActionCard({ action, className }: QuickActionCardProps) {
  const Icon = action.icon;

  return (
    <Link
      href={action.href}
      className={cn(
        'group flex items-center gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium">{action.label}</p>
        <p className="truncate text-xs text-muted-foreground">{action.description}</p>
      </div>
      <ArrowRight
        className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}
