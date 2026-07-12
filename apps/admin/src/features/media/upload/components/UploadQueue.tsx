'use client';

import * as React from 'react';
import { useUploadQueue } from '../hooks/useUploadQueue';
import { UploadCard } from './UploadCard';

export function UploadQueue() {
  const { queue, cancel, complete, retry, isProcessing } = useUploadQueue();

  if (queue.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[60vh] overflow-y-auto rounded-lg border bg-background shadow-lg">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h3 className="text-sm font-medium">Uploads ({queue.length})</h3>
        {isProcessing && <span className="text-xs text-muted-foreground">Processing...</span>}
      </div>
      <div className="divide-y">
        {queue.map((session) => (
          <UploadCard
            key={session.id}
            session={session}
            onCancel={() => cancel(session.id)}
            onComplete={() => complete(session.id)}
            onRetry={() => retry(session.id)}
          />
        ))}
      </div>
    </div>
  );
}
