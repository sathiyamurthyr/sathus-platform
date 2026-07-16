'use client';

import * as React from 'react';
import { ExternalLink, Calendar, User } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { SearchHighlight } from './SearchHighlight';
import type { SearchResultItem, SearchSourceType } from '../lib/search-api';

const SOURCE_LABELS: Record<SearchSourceType, string> = {
  page: 'Page',
  product: 'Product',
  article: 'Article',
  doc: 'Doc',
  media: 'Media',
  user: 'User',
  navigation: 'Navigation',
};

const SOURCE_VARIANTS: Record<SearchSourceType, BadgeProps['variant']> = {
  page: 'secondary',
  product: 'default',
  article: 'muted',
  doc: 'outline',
  media: 'warning',
  user: 'success',
  navigation: 'secondary',
};

export interface SearchResultsProps {
  items: SearchResultItem[];
  query?: string;
  onItemClick?: (item: SearchResultItem) => void;
  className?: string;
}

function formatDate(value?: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Renders the list of search hits.
 *
 * Note: list rendering is non-virtualized. A virtualization library
 * (@tanstack/react-virtual) is not present in this project; for very large
 * result sets consider adding it and wrapping the list below.
 */
export function SearchResults({ items, query, onItemClick, className }: SearchResultsProps) {
  if (items.length === 0) return null;

  return (
    <ul className={cn('divide-y divide-border', className)} aria-label="Search results">
      {items.map((item) => {
        const date = formatDate(item.publishedAt);
        const isInternal = item.url.startsWith('/');
        return (
          <li key={item.id} className="py-3">
            <article className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Badge variant={SOURCE_VARIANTS[item.sourceType]}>
                  {SOURCE_LABELS[item.sourceType]}
                </Badge>
                {item.status && (
                  <span className="text-xs text-muted-foreground">{item.status}</span>
                )}
              </div>

              <h3 className="text-sm font-semibold leading-snug">
                <a
                  href={item.url}
                  target={isInternal ? undefined : '_blank'}
                  rel={isInternal ? undefined : 'noopener noreferrer'}
                  className="rounded outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={(e) => {
                    if (onItemClick) {
                      e.preventDefault();
                      onItemClick(item);
                    }
                  }}
                >
                  <SearchHighlight text={item.title} query={query} />
                </a>
              </h3>

              {item.snippet && (
                <p className="text-sm text-muted-foreground">
                  <SearchHighlight text={item.snippet} query={query} />
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex max-w-full items-center gap-1 truncate">
                  <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.url}</span>
                </span>
                {item.author && (
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {item.author}
                  </span>
                )}
                {date && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {date}
                  </span>
                )}
                {item.tags?.map((tag) => (
                  <span key={tag} className="rounded bg-muted px-1.5 py-0.5 text-[11px]">
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
