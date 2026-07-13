'use client';

import * as React from 'react';
import { UploadCloud, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { UploadQueueItem } from '../lib/media-types';

export function UploadQueuePanel({ items }: { items: UploadQueueItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="border-t border-border bg-muted/30 p-3">
      <div className="flex items-center gap-2 mb-2">
        <UploadCloud className="h-4 w-4" />
        <span className="text-xs font-medium">Upload Queue</span>
        <span className="text-xs text-muted-foreground">({items.length})</span>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto admin-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 rounded-md border border-border bg-background p-2">
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium">{item.fileName}</p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                <div
                  className="h-1.5 rounded-full bg-primary transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-muted-foreground w-10 text-right">{Math.round(item.progress)}%</span>
            {item.status === 'Uploading' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {item.status === 'Completed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            {item.status === 'Failed' && <XCircle className="h-4 w-4 text-destructive" />}
          </div>
        ))}
      </div>
    </div>
  );
}
