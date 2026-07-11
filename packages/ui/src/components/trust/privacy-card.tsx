'use client';

import * as React from 'react';
import { cn } from '../../lib/cn';

interface PrivacyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  rights?: string[];
}

const PrivacyCard = React.forwardRef<HTMLDivElement, PrivacyCardProps>(
  ({ className, icon, title, description, rights, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
        {rights && rights.length > 0 && (
          <div className="space-y-2">
            {rights.map((right) => (
              <div key={right} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                <span className="text-muted-foreground">{right}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
PrivacyCard.displayName = 'PrivacyCard';

export { PrivacyCard };
