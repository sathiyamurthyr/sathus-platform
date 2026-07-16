'use client';

import * as React from 'react';
import { Progress } from '@/components/ui/progress';

interface ChunkProgressProps {
  uploadedChunks: number;
  totalChunks: number;
  chunkStatuses?: Array<{ index: number; status: string }>;
}

export function ChunkProgress({ uploadedChunks, totalChunks, chunkStatuses = [] }: ChunkProgressProps) {
  const progress = totalChunks > 0 ? (uploadedChunks / totalChunks) * 100 : 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{uploadedChunks} / {totalChunks} chunks</span>
        <span className="text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: Math.min(totalChunks, 50) }).map((_, i) => {
          const actualIndex = Math.floor(i * totalChunks / 50);
          const status = chunkStatuses.find(c => c.index === actualIndex)?.status;
          const isComplete = status === 'Completed' || actualIndex < uploadedChunks;
          return (
            <span key={i} className={`inline-flex h-2 w-2 rounded-full ${isComplete ? 'bg-green-500' : 'bg-muted'}`} />
          );
        })}
        {totalChunks > 50 && <span className="text-xs text-muted-foreground">+{totalChunks - 50} more</span>}
      </div>
    </div>
  );
}
