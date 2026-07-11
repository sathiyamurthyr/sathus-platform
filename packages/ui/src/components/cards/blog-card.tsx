import * as React from 'react';
import { cn } from '../../lib/cn';

interface BlogCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  excerpt: string;
  image?: string;
  href?: string;
  date?: string;
  author?: string;
  readTime?: string;
}

const BlogCard = React.forwardRef<HTMLDivElement, BlogCardProps>(
  ({ className, title, excerpt, image, href, date, author, readTime, ...props }, ref) => {
    const content = (
      <>
        {image && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-muted">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 p-2">
          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{excerpt}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {author && <span>{author}</span>}
            {author && date && <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />}
            {date && <span>{date}</span>}
            {readTime && (
              <>
                <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                <span>{readTime}</span>
              </>
            )}
          </div>
        </div>
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn(
            'group flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden transition-colors hover:border-primary/20 hover:shadow-md',
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
          'flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden',
          className
        )}
        {...props}
      >
        {content}
      </div>
    );
  }
);
BlogCard.displayName = 'BlogCard';

export { BlogCard };
