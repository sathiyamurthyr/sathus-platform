import * as React from 'react';
import { cn } from '../../lib/cn';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'default' | 'sm' | 'lg' | 'xl';
  colsMd?: number;
  colsLg?: number;
  colsXl?: number;
}

const gapClasses = {
  sm: 'gap-2',
  default: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 'default', colsMd, colsLg, colsXl, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid w-full',
          `grid-cols-${cols}`,
          gapClasses[gap],
          colsMd && `md:grid-cols-${colsMd}`,
          colsLg && `lg:grid-cols-${colsLg}`,
          colsXl && `xl:grid-cols-${colsXl}`,
          className
        )}
        {...props}
      />
    );
  }
);
Grid.displayName = 'Grid';

export { Grid };
