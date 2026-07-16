'use client';

import * as React from 'react';
import { X, RefreshCw, FolderOpen, CheckCircle2, AlertCircle } from 'lucide-react';

interface UploadCardProps {
  session: {
    id: string;
    fileName: string;
    progress: number;
    status: string;
    errorMessage?: string;
    isFolder: boolean;
    uploadedChunks?: number;
    totalChunks?: number;
  };
  onCancel?: () => void;
  onComplete?: () => void;
  onRetry?: () => void;
  onReset?: () => void;
}

export function UploadCard({ session, onCancel, onComplete, onRetry, onReset }: UploadCardProps) {
  const isCompleted = session.status === 'Completed';
  const isFailed = session.status === 'Failed';
  const isCancelled = session.status === 'Cancelled';
  const isActive = session.status === 'Uploading' || session.status === 'Paused';

  return (
    <div className="rounded-md border bg-card p-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {session.isFolder ? (
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          ) : (
            <div className="h-4 w-4 rounded bg-muted" />
          )}
          <div>
            <p className="text-sm font-medium truncate max-w-[200px]">{session.fileName}</p>
            <p className="text-xs text-muted-foreground">
              {isCompleted ? 'Completed' : isFailed ? 'Failed' : isCancelled ? 'Cancelled' : `${Math.round(session.progress)}%`}
              {session.uploadedChunks !== undefined && session.totalChunks !== undefined && !isCompleted && (
                <span> ({session.uploadedChunks}/{session.totalChunks})</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isFailed && onRetry && (
            <button type="button" onClick={onRetry} className="rounded p-1 hover:bg-muted">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
          {isActive && onCancel && (
            <button type="button" onClick={onCancel} className="rounded p-1 hover:bg-muted">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {isCompleted && onReset && (
            <button type="button" onClick={onReset} className="rounded p-1 hover:bg-muted">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            </button>
          )}
        </div>
      </div>

      {isActive && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${session.progress}%` }} />
        </div>
      )}

      {isFailed && session.errorMessage && (
        <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" />
          {session.errorMessage}
        </div>
      )}
    </div>
  );
}
