'use client';

import * as React from 'react';
import { Image, Film, Music, FileText, Archive, FileQuestion, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MediaAsset, MediaViewMode } from '../lib/media-types';
import { formatFileSize, formatDuration } from '../lib/media-utils';

const typeIcons: Record<string, React.ElementType> = {
  Image: Image,
  Video: Film,
  Audio: Music,
  Document: FileText,
  Archive: Archive,
  Other: FileQuestion,
};

export function MediaCard({
  asset,
  viewMode,
  isSelected,
  onSelect,
  onDoubleClick,
}: {
  asset: MediaAsset;
  viewMode: MediaViewMode;
  isSelected: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onDoubleClick: (id: string) => void;
}) {
  const TypeIcon = typeIcons[asset.type] ?? FileQuestion;
  const previewUrl = asset.mimeType.startsWith('image/')
    ? `/api/v1/media/preview/${asset.storageKey}`
    : undefined;

  if (viewMode === 'list') {
    return (
      <div
        data-asset-id={asset.id}
        tabIndex={0}
        className={cn(
          'flex items-center gap-3 rounded-lg border border-border p-3 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
        )}
        onClick={(e) => onSelect(asset.id, e)}
        onDoubleClick={() => onDoubleClick(asset.id)}
        role="option"
        aria-selected={isSelected}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt={asset.altText ?? asset.fileName} className="h-full w-full rounded-md object-cover" loading="lazy" />
          ) : (
            <TypeIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{asset.title ?? asset.fileName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {asset.mimeType} · {formatFileSize(asset.sizeBytes)}
            {asset.durationSeconds ? ` · ${formatDuration(asset.durationSeconds)}` : ''}
          </p>
        </div>
        <div className="shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-asset-id={asset.id}
      tabIndex={0}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
      )}
      onClick={(e) => onSelect(asset.id, e)}
      onDoubleClick={() => onDoubleClick(asset.id)}
      role="option"
      aria-selected={isSelected}
    >
      <div className="aspect-square w-full bg-muted">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={asset.altText ?? asset.fileName} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <TypeIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="truncate text-sm font-medium">{asset.title ?? asset.fileName}</p>
        <p className="truncate text-xs text-muted-foreground">
          {formatFileSize(asset.sizeBytes)}
          {asset.durationSeconds ? ` · ${formatDuration(asset.durationSeconds)}` : ''}
        </p>
        <div className="mt-1 flex flex-wrap gap-1">
          {asset.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="rounded-full px-2 py-0.5 text-xs"
              style={{ backgroundColor: (tag.color ?? '#e5e7eb') + '33', color: tag.color ?? '#374151' }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
