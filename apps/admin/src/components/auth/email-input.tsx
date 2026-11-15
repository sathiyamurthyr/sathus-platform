'use client';

import * as React from 'react';

import { Input, type InputProps } from '@sathus-platform/uiinput';

const EmailInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      type="email"
      autoComplete="email"
      className={className}
      {...props}
    />
  )
);
EmailInput.displayName = 'EmailInput';

export { EmailInput, type InputProps };
