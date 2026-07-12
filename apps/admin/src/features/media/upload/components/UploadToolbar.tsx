'use client';

import * as React from 'react';
import { Pause, Play, X, RefreshCw } from 'lucide-react';
import type { UploadSession } from '@/types/upload';

interface UploadToolbarProps {
  session: UploadSession;
  onPause?: () => void;
  onResume?: () => void;
  onCancel?: () => void;
  onRetry?: () => void;
}

export function UploadToolbar({ session, onPause, onResume, onCancel, onRetry }: UploadToolbarProps) {
  const isPaused = session.status === 'Paused';
  const isUploading = session.status === 'Uploading';
  const isFailed = session.status === 'Failed';
  const isCompleted = session.status === 'Completed';

  if (isCompleted) return null;

  return (
    <div className="flex items-center gap-2">
      {isUploading && onPause && (
        <button
          type="button"
          onClick={onPause}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
        >
          <Pause className="h-3 w-3" />
          Pause
        </button>
      )}
      {isPaused && onResume && (
        <button
          type="button"
          onClick={onResume}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
        >
          <Play className="h-3 w-3" />
          Resume
        </button>
      )}
      {isFailed && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      )}
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted text-destructive"
        >
          <X className="h-3 w-3" />
          Cancel
        </button>
      )}
    </div>
  );
}
