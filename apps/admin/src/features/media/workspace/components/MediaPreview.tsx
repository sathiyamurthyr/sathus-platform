'use client';

import * as React from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MediaAsset } from '../lib/media-types';

export function MediaPreview({ asset, onClose }: { asset: MediaAsset; onClose: () => void }) {
  const previewUrl = `/api/v1/media/preview/${asset.storageKey}`;
  const isImage = asset.mimeType.startsWith('image/');
  const isVideo = asset.mimeType.startsWith('video/');
  const isAudio = asset.mimeType.startsWith('audio/');
  const isPdf = asset.mimeType === 'application/pdf';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Preview</h3>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close preview">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex aspect-video items-center justify-center rounded-lg border border-border bg-muted">
        {isImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={asset.altText ?? asset.fileName} className="max-h-full max-w-full object-contain" />
        )}
        {isVideo && (
          <video src={previewUrl} controls className="max-h-full max-w-full" aria-label={`Preview of ${asset.fileName}`} />
        )}
        {isAudio && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl">🎵</span>
            </div>
            <audio src={previewUrl} controls className="w-full" aria-label={`Preview of ${asset.fileName}`} />
          </div>
        )}
        {isPdf && (
          <iframe src={previewUrl} title={asset.fileName} className="h-full w-full rounded-lg" />
        )}
        {!isImage && !isVideo && !isAudio && !isPdf && (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-4xl">📄</span>
            <p className="text-sm">Preview not available</p>
          </div>
        )}
      </div>
      <Button variant="outline" size="sm" className="w-full gap-2" asChild>
        <a href={previewUrl} download>
          <Download className="h-4 w-4" />
          Download
        </a>
      </Button>
    </div>
  );
}
