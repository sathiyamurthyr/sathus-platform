'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import type { FacetValue, SearchFacetResponse } from '../lib/search-api';

export interface FacetsPanelProps {
  facets: SearchFacetResponse[];
  selected: Record<string, string[]>;
  onChange: (key: string, values: string[]) => void;
  className?: string;
}

/** Renders facet groups with selectable value checkboxes. */
export function FacetsPanel({ facets, selected, onChange, className }: FacetsPanelProps) {
  if (facets.length === 0) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)}>
        No facets available yet. Run a search to see filters.
      </p>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {facets.map((facet) => {
        const selectedValues = selected[facet.key] ?? [];
        const toggle = (value: string, checked: boolean) => {
          const next = checked
            ? [...selectedValues, value]
            : selectedValues.filter((v) => v !== value);
          onChange(facet.key, next);
        };
        return (
          <fieldset key={facet.key} className="border-0 p-0">
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {facet.label}
            </legend>
            <ul className="space-y-1">
              {facet.values.map((fv: FacetValue) => {
                const checked = selectedValues.includes(fv.value);
                return (
                  <li key={fv.value}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-sm px-1 py-1 text-sm transition-colors hover:bg-accent/50">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        checked={checked}
                        onChange={(e) => toggle(fv.value, e.target.checked)}
                      />
                      <span className="flex-1 truncate">{fv.label ?? fv.value}</span>
                      <span className="text-xs text-muted-foreground">{fv.count}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        );
      })}
    </div>
  );
}
