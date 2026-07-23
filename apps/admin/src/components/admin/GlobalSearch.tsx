'use client';

import * as React from 'react';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * Global search placeholder.
 *
 * Intentionally non-functional for the foundation sprint — it mirrors the
 * final control's appearance and accessibility contract so the layout and
 * behaviour are locked in before the search service exists.
 */
export function GlobalSearch({ className }: { className?: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        'h-9 w-full justify-start gap-2 text-muted-foreground sm:w-64 md:w-72',
        className
      )}
      aria-label="Search"
      title="Search"
    >
      <Search className="h-4 w-4" aria-hidden="true" />
      <span className="text-sm">Search…</span>
      <kbd className="ml-auto hidden items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
        ⌘K
      </kbd>
    </Button>
  );
}
