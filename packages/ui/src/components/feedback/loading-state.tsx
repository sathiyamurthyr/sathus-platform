'use client';

import * as React from 'react';
import { cn } from '../../lib/cn';

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'spinner' | 'dots' | 'skeleton';
  size?: 'default' | 'sm' | 'lg';
  text?: string;
}

const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ className, variant = 'spinner', size = 'default', text, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      default: 'h-8 w-8',
      lg: 'h-12 w-12',
    };

    const dotSizeClasses = {
      sm: 'h-1 w-1',
      default: 'h-2 w-2',
      lg: 'h-3 w-3',
    };

    if (variant === 'dots') {
      return (
        <div
          ref={ref}
          className={cn('flex items-center justify-center gap-1', className)}
          role="status"
          aria-label="Loading"
          {...props}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn('rounded-full bg-muted-foreground', dotSizeClasses[size])}
              style={{
                animation: `loading-dots 1.4s ease-in-out infinite`,
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
          {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
        </div>
      );
    }

    if (variant === 'skeleton') {
      return (
        <div
          ref={ref}
          className={cn('flex items-center justify-center', className)}
          role="status"
          aria-label="Loading"
          {...props}
        >
          <div className="space-y-2 w-full max-w-xs">
            <div className="sathus-skeleton h-4 w-full" />
            <div className="sathus-skeleton h-4 w-4/5" />
            <div className="sathus-skeleton h-4 w-3/5" />
          </div>
          {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center', className)}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <svg
          className={cn('animate-spin text-muted-foreground', sizeClasses[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }
);
LoadingState.displayName = 'LoadingState';

export { LoadingState };
