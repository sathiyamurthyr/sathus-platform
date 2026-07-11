import * as React from 'react';
import { cn } from '../../lib/cn';

interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div';
  size?: 'default' | 'wide' | 'narrow';
  padding?: 'default' | 'none' | 'sm' | 'lg';
}

const SectionContainer = React.forwardRef<HTMLDivElement, SectionContainerProps>(
  ({ className, as: Comp = 'section', size = 'default', padding = 'default', ...props }, ref) => {
    const sizeClasses = {
      narrow: 'max-w-[640px]',
      default: 'max-w-[1024px]',
      wide: 'max-w-[1280px]',
    };

    const paddingClasses = {
      none: '',
      sm: 'py-8 px-4',
      default: 'py-16 px-4',
      lg: 'py-24 px-4',
    };

    return (
      <Comp
        ref={ref}
        className={cn('mx-auto w-full', sizeClasses[size], paddingClasses[padding], className)}
        {...props}
      />
    );
  }
);
SectionContainer.displayName = 'SectionContainer';

export { SectionContainer };
