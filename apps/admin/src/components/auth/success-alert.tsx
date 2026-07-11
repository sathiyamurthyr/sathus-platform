'use client';

import * as React from 'react';
import { CheckCircle2 } from 'lucide-react';

import { Alert, type AlertProps } from '@/components/ui/alert';

interface SuccessAlertProps extends Omit<AlertProps, 'variant' | 'title' | 'icon'> {
  message: string;
}

function SuccessAlert({ message, className, ...props }: SuccessAlertProps) {
  return (
    <Alert
      variant="success"
      title="Success"
      icon={<CheckCircle2 className="h-4 w-4" />}
      role="status"
      className={className}
      {...props}
    >
      {message}
    </Alert>
  );
}

export { SuccessAlert, type SuccessAlertProps };
