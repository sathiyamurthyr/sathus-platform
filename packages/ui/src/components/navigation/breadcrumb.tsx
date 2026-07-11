import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    label: string;
    href?: string;
    active?: boolean;
  }[];
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn('flex items-center gap-1 text-sm text-muted-foreground', className)}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className="flex items-center gap-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-4 w-4" />}
                {item.href && !isLast ? (
                  <a
                    href={item.href}
                    className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={cn(
                      isLast && 'font-medium text-foreground',
                      !isLast && 'hover:text-foreground transition-colors'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';

export { Breadcrumb };
