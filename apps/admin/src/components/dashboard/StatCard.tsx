import * as React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import type { Stat } from '@/types/admin';

export interface StatCardProps {
  stat: Stat;
  className?: string;
}

/**
 * Compact metric tile used in the dashboard stat grid.
 * Shows a label, an icon, the headline value and an optional trend.
 */
export function StatCard({ stat, className }: StatCardProps) {
  const Icon = stat.icon;
  const isPositive = stat.changeType === 'positive';
  const isNegative = stat.changeType === 'negative';
  const TrendIcon = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : null;

  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
        {stat.change && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium',
              isPositive && 'text-success',
              isNegative && 'text-destructive',
              !isPositive && !isNegative && 'text-muted-foreground'
            )}
          >
            {TrendIcon && <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />}
            {stat.change}
          </span>
        )}
      </div>

      {stat.hint && <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>}
    </Card>
  );
}
