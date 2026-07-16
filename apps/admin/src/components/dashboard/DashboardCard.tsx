import * as React from 'react';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  /** Extra classes for the content body. */
  bodyClassName?: string;
}

/**
 * Reusable dashboard section container.
 *
 * Renders an optional header (title + description + action slot) and a body.
 * Every dashboard widget is composed from this primitive for visual
 * consistency.
 */
export const DashboardCard = React.forwardRef<HTMLDivElement, DashboardCardProps>(
  ({ className, title, description, action, bodyClassName, children, ...props }, ref) => (
    <Card ref={ref} className={cn('flex flex-col', className)} {...props}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div className="space-y-1">
            {title && <h2 className="text-base font-semibold leading-none">{title}</h2>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </Card>
  )
);
DashboardCard.displayName = 'DashboardCard';
