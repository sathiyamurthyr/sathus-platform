'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface RememberMeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const RememberMeCheckbox = React.forwardRef<HTMLInputElement, RememberMeCheckboxProps>(
  ({ checked, onChange, disabled, className, ...props }, ref) => {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <input
          ref={ref}
          type="checkbox"
          id="remember-me"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 rounded border border-input bg-transparent accent-primary"
          aria-label="Remember me"
          {...props}
        />
        <label htmlFor="remember-me" className="text-sm text-muted-foreground">
          Remember me
        </label>
      </div>
    );
  }
);
RememberMeCheckbox.displayName = 'RememberMeCheckbox';

export { RememberMeCheckbox, type RememberMeCheckboxProps };
