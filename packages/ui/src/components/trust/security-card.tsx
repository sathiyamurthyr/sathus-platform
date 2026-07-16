'use client';

import * as React from 'react';
import { cn } from '../../lib/cn';

interface SecurityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  items?: string[];
  badge?: string;
}

const SecurityCard = React.forwardRef<HTMLDivElement, SecurityCardProps>(
  ({ className, icon, title, description, items, badge, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20',
          className
        )}
        {...props}
      >
        {badge && (
          <span className="sathus-badge mb-4 w-fit bg-success/10 text-success text-xs font-medium">
            {badge}
          </span>
        )}
        <div className="flex gap-4">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
            {items && items.length > 0 && (
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }
);
SecurityCard.displayName = 'SecurityCard';

export { SecurityCard };
