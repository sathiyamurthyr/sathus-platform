'use client';

import * as React from 'react';
import { FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyState({
  title = 'No assets found',
  description = 'Try adjusting your search or filters, or upload new assets.',
  action,
  actionLabel,
}: {
  title?: string;
  description?: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileX className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && actionLabel && (
        <Button onClick={action} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
