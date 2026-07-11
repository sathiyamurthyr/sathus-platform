import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  badge?: string;
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, icon, title, description, href, badge, ...props }, ref) => {
    const content = (
      <>
        {badge && (
          <span className="sathus-badge mb-4 w-fit bg-primary/10 text-primary text-xs font-medium">
            {badge}
          </span>
        )}
        {icon && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <h3 className="mb-2 text-xl font-semibold text-card-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        {href && (
          <div className="mt-4 flex items-center text-sm font-medium text-primary">
            Learn more
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        )}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn(
            'group block rounded-lg border bg-card p-6 shadow-sm transition-colors hover:border-primary/20 hover:shadow-md',
            className
          )}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'block rounded-lg border bg-card p-6 shadow-sm',
          className
        )}
        {...props}
      >
        {content}
      </div>
    );
  }
);
FeatureCard.displayName = 'FeatureCard';

export { FeatureCard };
