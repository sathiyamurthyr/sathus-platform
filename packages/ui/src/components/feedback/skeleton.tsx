import * as React from 'react';
import { cn } from '../../lib/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, lines = 1, ...props }, ref) => {
    const variantClasses = {
      text: 'rounded-md',
      circular: 'rounded-full',
      rectangular: 'rounded-lg',
    };

    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn('sathus-skeleton', variantClasses.text, className)}
              style={{
                width: i === lines - 1 ? '60%' : '100%',
                height: height || '1rem',
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('sathus-skeleton', variantClasses[variant], className)}
        style={{ width: width || '100%', height: height || (variant === 'text' ? '1rem' : '40px') }}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
