'use client';

import * as React from 'react';
import { Download, Archive, Trash2, Copy, FolderOpen, Tag, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SelectionToolbar({
  count,
  onClear,
  onArchive,
  onRestore,
  onDelete,
  onMove,
  onCopy,
  onTag,
  onShare,
  onDownload,
}: {
  count: number;
  onClear: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
  onMove?: () => void;
  onCopy?: () => void;
  onTag?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-2">
      <span className="text-sm font-medium">{count} selected</span>
      <div className="mx-2 h-4 w-px bg-border" />
      <div className="flex flex-1 items-center gap-1 overflow-x-auto">
        {onDownload && (
          <Button variant="ghost" size="sm" onClick={onDownload} className="gap-1.5">
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}
        {onMove && (
          <Button variant="ghost" size="sm" onClick={onMove} className="gap-1.5">
            <FolderOpen className="h-4 w-4" />
            Move
          </Button>
        )}
        {onCopy && (
          <Button variant="ghost" size="sm" onClick={onCopy} className="gap-1.5">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
        )}
        {onTag && (
          <Button variant="ghost" size="sm" onClick={onTag} className="gap-1.5">
            <Tag className="h-4 w-4" />
            Tag
          </Button>
        )}
        {onShare && (
          <Button variant="ghost" size="sm" onClick={onShare} className="gap-1.5">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
        {onArchive && (
          <Button variant="ghost" size="sm" onClick={onArchive} className="gap-1.5">
            <Archive className="h-4 w-4" />
            Archive
          </Button>
        )}
        {onRestore && (
          <Button variant="ghost" size="sm" onClick={onRestore} className="gap-1.5">
            Restore
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete} className="gap-1.5 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
      <Button variant="ghost" size="icon" onClick={onClear} aria-label="Clear selection">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
