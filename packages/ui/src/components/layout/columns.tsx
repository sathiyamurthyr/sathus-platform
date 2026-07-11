import * as React from 'react';
import { cn } from '../../lib/cn';

interface ColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number;
  span?: number;
  offset?: number;
  order?: number;
}

const Columns = React.forwardRef<HTMLDivElement, ColumnsProps>(
  ({ className, cols = 1, span, offset, order, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          `col-span-${cols}`,
          span && `md:col-span-${span}`,
          offset && `md:col-start-${offset}`,
          order && `md:order-${order}`,
          className
        )}
        {...props}
      />
    );
  }
);
Columns.displayName = 'Columns';

export { Columns };
