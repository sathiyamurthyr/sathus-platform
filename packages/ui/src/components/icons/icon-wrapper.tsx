'use client';

import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '../../lib/cn';

interface IconWrapperProps extends Omit<React.SVGAttributes<SVGElement>, 'ref'> {
  name: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const IconWrapper = React.forwardRef<SVGSVGElement, IconWrapperProps>(
  ({ name, size = 24, color, strokeWidth = 2, className, ...props }, ref) => {
    const LucideIcon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>>)[name];

    if (!LucideIcon) {
      return (
        <svg
          ref={ref}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={cn('text-muted-foreground', className)}
          {...props}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
    }

    return React.createElement(LucideIcon, {
      size: size as number,
      color,
      strokeWidth,
    });
  }
);
IconWrapper.displayName = 'IconWrapper';

export { IconWrapper };
