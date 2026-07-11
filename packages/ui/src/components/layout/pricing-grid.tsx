import * as React from 'react';
import { cn } from '../../lib/cn';

interface PricingGridProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  items: React.ReactNode[];
  columns?: 1 | 2 | 3 | 4;
}

const columnClasses = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'lg:grid-cols-4',
};

const PricingGrid = React.forwardRef<HTMLDivElement, PricingGridProps>(
  ({ className, title, description, items, columns = 3, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('py-16 md:py-24', className)}
        {...props}
      >
        {(title || description) && (
          <div className="mb-12 text-center">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance mb-3">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        )}
        <div className="mx-auto max-w-[1280px] px-4">
          <div className={cn('grid gap-6', columnClasses[columns])}>
            {items.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);
PricingGrid.displayName = 'PricingGrid';

export { PricingGrid };
