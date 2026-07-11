import * as React from 'react';
import { cn } from '../../lib/cn';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  badge?: string;
  align?: 'left' | 'center' | 'right';
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, title, description, badge, align = 'center', ...props }, ref) => {
    const alignClasses = {
      left: 'text-left items-start',
      center: 'text-center items-center',
      right: 'text-right items-end',
    };

    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-3', alignClasses[align], className)}
        {...props}
      >
        {badge && (
          <span className="sathus-badge bg-primary/10 text-primary text-xs font-medium w-fit">
            {badge}
          </span>
        )}
        <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
    );
  }
);
SectionHeader.displayName = 'SectionHeader';

export { SectionHeader };
