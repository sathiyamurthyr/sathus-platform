'use client';

import * as React from 'react';
import { History } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface RecentSearchesProps {
  items: string[];
  onSelect: (term: string) => void;
  onClear: () => void;
  className?: string;
}

/** Lists recent search terms as chips with a clear-all action. */
export function RecentSearches({ items, onSelect, onClear, className }: RecentSearchesProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <History className="h-3.5 w-3.5" aria-hidden="true" />
          Recent searches
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Clear
        </button>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((term) => (
          <li key={term}>
            <button
              type="button"
              onClick={() => onSelect(term)}
              className="rounded-full border border-input px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {term}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
