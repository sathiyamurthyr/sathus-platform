'use client';

import * as React from 'react';
import { SearchX } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface SearchEmptyStateProps {
  query?: string;
  className?: string;
  onReset?: () => void;
}

/** Friendly empty state shown when a search returns no results. */
export function SearchEmptyState({ query, className, onReset }: SearchEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">
          {query ? `No results for "${query}"` : 'No results found'}
        </p>
        <p className="text-sm text-muted-foreground">
          Try a different keyword, broaden your filters, or check the spelling.
        </p>
      </div>
      {onReset && (
        <button
          type="button"
          className="rounded-md border border-input px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={onReset}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
