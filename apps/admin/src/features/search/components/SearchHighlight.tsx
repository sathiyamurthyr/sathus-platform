'use client';

import * as React from 'react';

export interface SearchHighlightProps {
  text: string;
  /** Terms to highlight. A single query string or pre-split terms. */
  query?: string | string[];
  className?: string;
}

function splitTerms(query: string | string[] | undefined): string[] {
  if (!query) return [];
  if (Array.isArray(query)) {
    return query.map((t) => t.trim()).filter(Boolean);
  }
  return query
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
}

/**
 * Renders text with `<mark>` wrapping any case-insensitive matches of the
 * provided query terms. Purely presentational and XSS-safe (no raw HTML).
 */
export function SearchHighlight({ text, query, className }: SearchHighlightProps) {
  const terms = React.useMemo(() => splitTerms(query), [query]);

  if (terms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const escaped = terms
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const termSet = new Set(terms.map((t) => t.toLowerCase()));

  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        termSet.has(part.toLowerCase()) ? (
          <mark key={index} className="rounded bg-primary/20 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </span>
  );
}
