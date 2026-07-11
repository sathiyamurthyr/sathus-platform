import * as React from 'react';
import { cn } from '../../lib/cn';

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    id: string;
    title: string;
    description?: string;
    date?: string;
    icon?: React.ReactNode;
    status?: 'completed' | 'active' | 'pending';
  }[];
}

const statusStyles = {
  completed: 'bg-success text-success-foreground',
  active: 'bg-primary text-primary-foreground',
  pending: 'bg-muted text-muted-foreground',
};

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, items, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative flex flex-col gap-0', className)}
        {...props}
      >
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />
        {items.map((item) => (
          <div key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background">
              {item.icon ? (
                item.icon
              ) : (
                <div className={cn('h-2.5 w-2.5 rounded-full', statusStyles[item.status || 'pending'])} />
              )}
            </div>
            <div className="flex flex-col gap-1 pt-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                {item.date && (
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
);
Timeline.displayName = 'Timeline';

export { Timeline };
