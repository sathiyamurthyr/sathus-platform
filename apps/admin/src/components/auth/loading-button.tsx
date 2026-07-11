'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/ui/button';

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading = false, disabled, children, ...props }, ref) => {
    return (
      <Button ref={ref} disabled={disabled ?? isLoading} {...props}>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {children}
      </Button>
    );
  }
);
LoadingButton.displayName = 'LoadingButton';

export { LoadingButton, type LoadingButtonProps };
