import * as React from 'react';
import { cn } from '../../lib/cn';

interface SectionDividerProps extends React.HTMLAttributes<HTMLHRElement> {
  variant?: 'default' | 'subtle' | 'gradient';
}

const SectionDivider = React.forwardRef<HTMLHRElement, SectionDividerProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'border-border',
      subtle: 'border-muted',
      gradient: 'border-transparent bg-gradient-to-r from-transparent via-border to-transparent h-px',
    };

    return (
      <hr
        ref={ref}
        className={cn('my-8 w-full border-0 border-t', variantClasses[variant], className)}
        {...props}
      />
    );
  }
);
SectionDivider.displayName = 'SectionDivider';

export { SectionDivider };
