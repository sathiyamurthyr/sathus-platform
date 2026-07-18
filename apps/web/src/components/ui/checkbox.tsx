import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type="checkbox"
          className={cn(
            'peer h-4 w-4 shrink-0 rounded-sm border border-border',
            'bg-background focus-visible:outline-none focus-visible:ring-1',
            'focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
            className
          )}
          ref={ref}
          {...props}
        />
        <Check
          className={cn(
            'absolute top-0 left-0 h-4 w-4 text-primary-foreground opacity-0',
            'peer-checked:opacity-100 pointer-events-none'
          )}
        />
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };