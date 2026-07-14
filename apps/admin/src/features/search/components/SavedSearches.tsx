'use client';

import * as React from 'react';
import { Bookmark, X, Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { SavedSearch } from '../hooks/use-search';

export interface SavedSearchesProps {
  items: SavedSearch[];
  onSelect: (item: SavedSearch) => void;
  onRemove: (id: string) => void;
  className?: string;
}

/** Lists saved searches with per-item remove and re-run actions. */
export function SavedSearches({ items, onSelect, onRemove, className }: SavedSearchesProps) {
  if (items.length === 0) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)}>
        No saved searches yet.
      </p>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
        Saved searches
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            className="group flex items-center gap-2 rounded-md border border-border px-2 py-1.5"
          >
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="flex flex-1 items-center gap-2 rounded text-left text-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="flex-1 truncate">{item.label}</span>
            </button>
            <button
              type="button"
              aria-label={`Remove saved search ${item.label}`}
              onClick={() => onRemove(item.id)}
              className="rounded-sm p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
