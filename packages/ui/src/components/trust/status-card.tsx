'use client';

import * as React from 'react';
import { cn } from '../../lib/cn';
import { motion } from 'motion/react';

interface SystemStatusItem {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
}

interface StatusCardProps extends React.HTMLAttributes<HTMLDivElement> {
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  title: string;
  description?: string;
  lastUpdated?: string;
  services?: SystemStatusItem[];
}

const statusConfig = {
  operational: { color: 'bg-success', label: 'Operational' },
  degraded: { color: 'bg-warning', label: 'Degraded Performance' },
  outage: { color: 'bg-destructive', label: 'Service Outage' },
  maintenance: { color: 'bg-primary', label: 'Maintenance' },
};

const StatusCard = React.forwardRef<HTMLDivElement, StatusCardProps>(
  ({ className, status, title, description, lastUpdated, services, ...props }, ref) => {
    const config = statusConfig[status];

    return (
      <div
        ref={ref}
        className={cn('relative rounded-xl border border-border bg-card p-6 shadow-sm', className)}
        {...props}
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={cn('h-3 w-3 rounded-full', config.color)}
          />
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <span
          className={cn(
            'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold',
            status === 'operational'
              ? 'bg-success/10 text-success border-success/20'
              : status === 'degraded'
              ? 'bg-warning/10 text-warning border-warning/20'
              : status === 'outage'
              ? 'bg-destructive/10 text-destructive border-destructive/20'
              : 'bg-primary/10 text-primary border-primary/20'
          )}
        >
          {config.label}
        </span>
        {description && (
          <p className="text-sm text-muted-foreground mt-4">{description}</p>
        )}
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-2">Last updated: {lastUpdated}</p>
        )}
        {services && services.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs font-medium text-foreground mb-3">Services</p>
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{service.name}</span>
                  <span className={cn('h-2 w-2 rounded-full', statusConfig[service.status].color)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
StatusCard.displayName = 'StatusCard';

export { StatusCard };
