import * as React from 'react';
import { cn } from '../../lib/cn';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'wide' | 'narrow' | 'full';
  padding?: 'default' | 'none' | 'sm' | 'lg';
  center?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'default', padding = 'default', center = true, ...props }, ref) => {
    const sizeClasses = {
      narrow: 'max-w-[640px]',
      default: 'max-w-[1024px]',
      wide: 'max-w-[1280px]',
      full: 'max-w-full',
    };

    const paddingClasses = {
      none: '',
      sm: 'px-4',
      default: 'px-4',
      lg: 'px-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          sizeClasses[size],
          center && 'mx-auto',
          paddingClasses[padding],
          className
        )}
        {...props}
      />
    );
  }
);
Container.displayName = 'Container';

export { Container };
