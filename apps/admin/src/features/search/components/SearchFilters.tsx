'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import type { SearchFilters } from '../hooks/use-search';
import type { SearchSourceType } from '../lib/search-api';

const CONTENT_TYPES: { value: SearchSourceType; label: string }[] = [
  { value: 'page', label: 'Pages' },
  { value: 'product', label: 'Products' },
  { value: 'article', label: 'Articles' },
  { value: 'doc', label: 'Docs' },
  { value: 'media', label: 'Media' },
  { value: 'user', label: 'Users' },
  { value: 'navigation', label: 'Navigation' },
];

const STATUSES = ['draft', 'published', 'scheduled', 'archived'];

export interface SearchFiltersProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  authors?: string[];
  languages?: string[];
  className?: string;
}

function toggleInArray<T>(arr: T[] | undefined, value: T): T[] {
  const current = arr ?? [];
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
}

/** Accessible filters panel for content type, language, author, dates, status and tags. */
export function SearchFilters({ filters, onChange, authors = [], languages = [], className }: SearchFiltersProps) {
  const [tagInput, setTagInput] = React.useState('');

  const update = (patch: Partial<SearchFilters>) => onChange({ ...filters, ...patch });

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !(filters.tags ?? []).includes(tag)) {
      update({ tags: [...(filters.tags ?? []), tag] });
    }
    setTagInput('');
  };

  const hasActiveFilters =
    (filters.sourceTypes?.length ?? 0) > 0 ||
    (filters.languages?.length ?? 0) > 0 ||
    (filters.authors?.length ?? 0) > 0 ||
    (filters.tags?.length ?? 0) > 0 ||
    (filters.status?.length ?? 0) > 0 ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  return (
    <div className={cn('space-y-5', className)}>
      <fieldset className="border-0 p-0">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Content type
        </legend>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((ct) => {
            const active = (filters.sourceTypes ?? []).includes(ct.value);
            return (
              <button
                key={ct.value}
                type="button"
                aria-pressed={active}
                onClick={() => update({ sourceTypes: toggleInArray(filters.sourceTypes, ct.value) })}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-input text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {ct.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="filter-language" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Language
          </label>
          <select
            id="filter-language"
            className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={filters.languages?.[0] ?? ''}
            onChange={(e) =>
              update({ languages: e.target.value ? [e.target.value] : [] })
            }
          >
            <option value="">Any</option>
            {(languages.length > 0 ? languages : ['en', 'es', 'fr', 'de', 'ar']).map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-author" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Author
          </label>
          <select
            id="filter-author"
            className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={filters.authors?.[0] ?? ''}
            onChange={(e) =>
              update({ authors: e.target.value ? [e.target.value] : [] })
            }
          >
            <option value="">Any</option>
            {authors.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="border-0 p-0">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Publish status
        </legend>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => {
            const active = (filters.status ?? []).includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => update({ status: toggleInArray(filters.status, s) })}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-input text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="filter-date-from" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Date from
          </label>
          <Input
            id="filter-date-from"
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={(e) => update({ dateFrom: e.target.value || undefined })}
          />
        </div>
        <div>
          <label htmlFor="filter-date-to" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Date to
          </label>
          <Input
            id="filter-date-to"
            type="date"
            value={filters.dateTo ?? ''}
            onChange={(e) => update({ dateTo: e.target.value || undefined })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="filter-tag" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tags
        </label>
        <div className="flex gap-2">
          <Input
            id="filter-tag"
            placeholder="Add a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
        </div>
        {(filters.tags?.length ?? 0) > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {filters.tags!.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs"
              >
                #{tag}
                <button
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                  onClick={() => update({ tags: filters.tags!.filter((t) => t !== tag) })}
                  className="rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() =>
            onChange({
              sort: filters.sort,
              facets: filters.facets,
              sourceTypes: undefined,
              languages: undefined,
              authors: undefined,
              tags: undefined,
              status: undefined,
              dateFrom: undefined,
              dateTo: undefined,
            })
          }
          className="text-xs text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
