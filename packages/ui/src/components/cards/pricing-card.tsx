import * as React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '../../lib/cn';

interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  price: string;
  period?: string;
  description?: string;
  features?: string[];
  cta?: string;
  href?: string;
  popular?: boolean;
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  ({ className, title, price, period, description, features, cta, href, popular, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex flex-col rounded-lg border bg-card p-6 shadow-sm',
          popular && 'border-primary shadow-md',
          className
        )}
        {...props}
      >
        {popular && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
            Most Popular
          </span>
        )}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-card-foreground">{price}</span>
            {period && (
              <span className="text-muted-foreground text-sm">/{period}</span>
            )}
          </div>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        {features && features.length > 0 && (
          <ul className="mt-6 flex flex-col gap-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {feature}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto pt-6">
          {href ? (
            <a
              href={href}
              className={cn(
                'inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90',
                popular && 'bg-primary text-primary-foreground'
              )}
            >
              {cta || 'Get started'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          ) : (
            <button
              className={cn(
                'inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90',
                popular && 'bg-primary text-primary-foreground'
              )}
            >
              {cta || 'Get started'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);
PricingCard.displayName = 'PricingCard';

export { PricingCard };
