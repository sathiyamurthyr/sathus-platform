'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CONTENT_TYPES, CONTENT_STATUSES, SORT_OPTIONS } from '@/types/content';

export interface ContentFiltersProps {
  contentType: string;
  status: string;
  sortBy: string;
  sortDescending: boolean;
  onChange: (patch: Record<string, string | boolean | undefined>) => void;
}

export function ContentFilters({ contentType, status, sortBy, sortDescending, onChange }: ContentFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={contentType}
        onChange={(e) => onChange({ contentType: e.target.value || undefined })}
      >
        <option value="">All Types</option>
        {CONTENT_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      <select
        className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={status}
        onChange={(e) => onChange({ status: e.target.value || undefined })}
      >
        <option value="">All Statuses</option>
        {CONTENT_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={sortBy}
        onChange={(e) => onChange({ sortBy: e.target.value })}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange({ sortDescending: !sortDescending })}
      >
        {sortDescending ? 'Newest' : 'Oldest'}
      </Button>
    </div>
  );
}
