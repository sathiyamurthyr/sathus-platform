'use client';

import * as React from 'react';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { ContentItem } from '@/types/content';

export interface DeleteContentDialogProps {
  open: boolean;
  item: ContentItem | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function DeleteContentDialog({ open, item, onClose, onConfirm, loading }: DeleteContentDialogProps) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Delete Content</h2>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete &ldquo;{item.title}&rdquo;? This action can be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
