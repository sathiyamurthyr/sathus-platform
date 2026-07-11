import * as React from 'react';
import { cn } from '../../lib/cn';

interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  badge?: string;
  actions?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  size?: 'default' | 'lg' | 'xl';
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  ({ className, title, description, badge, actions, align = 'center', size = 'default', ...props }, ref) => {
    const alignClasses = {
      left: 'text-left items-start',
      center: 'text-center items-center',
      right: 'text-right items-end',
    };

    const sizeClasses = {
      default: 'py-16 md:py-24',
      lg: 'py-24 md:py-32',
      xl: 'py-32 md:py-40',
    };

    const titleSizes = {
      default: 'text-4xl md:text-5xl',
      lg: 'text-5xl md:text-6xl',
      xl: 'text-6xl md:text-7xl',
    };

    return (
      <section
        ref={ref}
        className={cn(
          'relative flex flex-col gap-6',
          alignClasses[align],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {badge && (
          <span className="sathus-badge bg-primary/10 text-primary text-xs font-medium">
            {badge}
          </span>
        )}
        <h1 className={cn('text-balance font-bold tracking-tight text-foreground', titleSizes[size])}>
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-muted-foreground text-lg leading-relaxed">
            {description}
          </p>
        )}
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </section>
    );
  }
);
Hero.displayName = 'Hero';

export { Hero };
