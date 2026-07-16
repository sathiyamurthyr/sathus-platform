'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const trustBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-primary/20 bg-primary/5 text-primary',
        outline: 'border-border text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface TrustBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof trustBadgeVariants> {
  text: string;
  icon?: React.ReactNode;
}

const TrustBadge = React.forwardRef<HTMLSpanElement, TrustBadgeProps>(
  ({ className, variant, text, icon, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(trustBadgeVariants({ variant, className }))}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {text}
      </span>
    );
  }
);
TrustBadge.displayName = 'TrustBadge';

export { TrustBadge, trustBadgeVariants };
