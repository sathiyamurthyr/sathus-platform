'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';

interface UploadErrorCardProps {
  error: { code: string; message: string };
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function UploadErrorCard({ error, onRetry, onDismiss }: UploadErrorCardProps) {
  return (
    <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
        <div className="flex-1">
          <p className="text-sm font-medium text-destructive">{error.code}</p>
          <p className="text-xs text-muted-foreground">{error.message}</p>
        </div>
        <div className="flex gap-1">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded px-2 py-1 text-xs hover:bg-muted"
            >
              Retry
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="rounded px-2 py-1 text-xs hover:bg-muted"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
