'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';

import { Alert, type AlertProps } from '@/components/ui/alert';

interface ErrorAlertProps extends Omit<AlertProps, 'variant' | 'title' | 'icon'> {
  message: string;
}

function ErrorAlert({ message, className, ...props }: ErrorAlertProps) {
  return (
    <Alert
      variant="destructive"
      title="Error"
      icon={<AlertCircle className="h-4 w-4" />}
      className={className}
      {...props}
    >
      {message}
    </Alert>
  );
}

export { ErrorAlert, type ErrorAlertProps };
