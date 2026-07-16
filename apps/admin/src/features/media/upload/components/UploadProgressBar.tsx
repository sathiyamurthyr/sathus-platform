'use client';

import * as React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressBarProps {
  progress: number;
  bytesUploaded: number;
  bytesTotal: number;
  speedBytesPerSecond: number;
  estimatedRemaining?: number;
}

export function UploadProgressBar({ progress, bytesUploaded, bytesTotal, speedBytesPerSecond, estimatedRemaining }: UploadProgressBarProps) {
  const speed = formatBytes(speedBytesPerSecond);
  const uploaded = formatBytes(bytesUploaded);
  const total = formatBytes(bytesTotal);
  const remaining = estimatedRemaining ? formatDuration(estimatedRemaining) : '--:--';

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{Math.round(progress)}%</span>
        <span className="text-muted-foreground">{uploaded} / {total}</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{speed}/s</span>
        <span>Remaining: {remaining}</span>
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
