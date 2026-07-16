import * as React from 'react';

import { cn } from '@/lib/utils';
import type { ServiceStatus } from '@/types/admin';

const statusStyles: Record<
  ServiceStatus['status'],
  { dot: string; label: string }
> = {
  operational: { dot: 'bg-success', label: 'Operational' },
  degraded: { dot: 'bg-warning', label: 'Degraded' },
  down: { dot: 'bg-destructive', label: 'Down' },
};

export interface SystemStatusProps {
  services: ServiceStatus[];
  className?: string;
}

/**
 * Health overview of platform services. Each row shows a coloured status
 * dot, the service name and a short detail line.
 */
export function SystemStatus({ services, className }: SystemStatusProps) {
  return (
    <ul className={cn('space-y-3', className)}>
      {services.map((service) => {
        const style = statusStyles[service.status];
        return (
          <li key={service.id} className="flex items-center gap-3">
            <span
              className={cn('h-2.5 w-2.5 shrink-0 rounded-full', style.dot)}
              role="img"
              aria-label={style.label}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{service.name}</p>
              <p className="truncate text-xs text-muted-foreground">{service.detail}</p>
            </div>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              {style.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
