import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  image?: string;
  href?: string;
  price?: string;
  badge?: string;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, title, description, image, href, price, badge, ...props }, ref) => {
    const content = (
      <>
        {image && (
          <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {badge && (
              <span className="absolute left-3 top-3 rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                {badge}
              </span>
            )}
          </div>
        )}
        {!image && badge && (
          <span className="sathus-badge mb-3 w-fit bg-primary/10 text-primary text-xs font-medium">
            {badge}
          </span>
        )}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          {price && (
            <span className="text-lg font-bold text-card-foreground">{price}</span>
          )}
          <span className="flex items-center text-sm font-medium text-primary">
            View details
            <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </div>
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn(
            'group flex flex-col rounded-lg border bg-card shadow-sm transition-colors hover:border-primary/20 hover:shadow-md',
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
          'flex flex-col rounded-lg border bg-card p-0 shadow-sm',
          className
        )}
        {...props}
      >
        {content}
      </div>
    );
  }
);
ProductCard.displayName = 'ProductCard';

export { ProductCard };
