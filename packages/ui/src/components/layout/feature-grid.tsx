import * as React from 'react';
import { cn } from '../../lib/cn';

interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  badge?: string;
  items: React.ReactNode[];
  columns?: 2 | 3 | 4;
}

const columnClasses = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

const FeatureGrid = React.forwardRef<HTMLDivElement, FeatureGridProps>(
  ({ className, title, description, badge, items, columns = 3, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('py-16 md:py-24', className)}
        {...props}
      >
        <div className="mx-auto max-w-[1280px] px-4">
          {(title || description || badge) && (
            <div className="mb-12 text-center">
              {badge && (
                <span className="sathus-badge bg-primary/10 text-primary text-xs font-medium mb-4">
                  {badge}
                </span>
              )}
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
FeatureGrid.displayName = 'FeatureGrid';

export { FeatureGrid };
