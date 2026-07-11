import * as React from 'react';

import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-10 w-10 text-base',
};

/**
 * Image avatar with graceful fallback to initials.
 * Renders as a `span` (decorative) so it can sit inside buttons/menus.
 */
const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const [errored, setErrored] = React.useState(false);
    const showImage = src && !errored;

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-primary/10 font-medium text-primary',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? ''}
            className="h-full w-full object-cover"
            onError={() => setErrored(true)}
          />
        ) : (
          <span aria-hidden="true">{fallback}</span>
        )}
      </span>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar };
