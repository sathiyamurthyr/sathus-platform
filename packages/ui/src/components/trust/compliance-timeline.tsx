'use client';

import * as React from 'react';
import { cn } from '../../lib/cn';
import { motion } from 'motion/react';

interface ComplianceTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    id: string;
    title: string;
    description?: string;
    date?: string;
    status: 'planning' | 'in-progress' | 'completed';
    icon?: React.ReactNode;
  }[];
}

const statusStyles = {
  completed: 'bg-success text-success-foreground',
  'in-progress': 'bg-primary text-primary-foreground',
  planning: 'bg-muted text-muted-foreground',
};

const statusLabels = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  planning: 'Planned',
};

const ComplianceTimeline = React.forwardRef<HTMLDivElement, ComplianceTimelineProps>(
  ({ className, items, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('relative flex flex-col', className)} {...props}>
        <div className="absolute left-[22px] top-2 bottom-2 w-px bg-border" />
        <div className="space-y-0">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative flex gap-6 pb-10 last:pb-0"
            >
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 bg-background">
                {item.icon ? (
                  item.icon
                ) : (
                  <div className={cn('h-2.5 w-2.5 rounded-full', statusStyles[item.status])} />
                )}
              </div>
              <div className="flex flex-col gap-1 pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                  <span
                    className={cn(
                      'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                      statusStyles[item.status]
                    )}
                  >
                    {statusLabels[item.status]}
                  </span>
                </div>
                {item.date && (
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                )}
                {item.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
);
ComplianceTimeline.displayName = 'ComplianceTimeline';

export { ComplianceTimeline };
