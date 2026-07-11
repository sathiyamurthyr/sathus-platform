import * as React from 'react';
import { cn } from '../../lib/cn';

interface SectionBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'subtle';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

const SectionBadge = React.forwardRef<HTMLSpanElement, SectionBadgeProps>(
  ({ className, variant = 'default', color = 'primary', ...props }, ref) => {
    const colorClasses = {
      primary: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary text-secondary-foreground',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      danger: 'bg-destructive/10 text-destructive',
    };

    const variantClasses = {
      default: 'border-0',
      outline: 'border border-current',
      subtle: 'bg-opacity-50',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'sathus-badge',
          colorClasses[color],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);
SectionBadge.displayName = 'SectionBadge';

export { SectionBadge };
