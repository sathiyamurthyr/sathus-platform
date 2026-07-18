import Link from 'next/link';
import type { SearchResult } from '../../types';

interface SearchResultsProps {
  results: SearchResult[];
  onSelect?: (result: SearchResult) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  solutions: 'Solutions',
  industries: 'Industries',
  products: 'Products',
  technology: 'Technology',
  blog: 'Blog',
  documentation: 'Documentation',
  learning: 'Learning',
  'trust-center': 'Trust Center',
};

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="py-2">
      {results.map((result) => (
        <Link
          key={result.id}
          href={result.url}
          onClick={() => onSelect?.(result)}
          className="flex flex-col px-3 py-2 rounded-md hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{result.title}</span>
            <span className="text-xs text-muted-foreground">
              {CATEGORY_LABELS[result.category] || result.category}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {result.description}
          </p>
          {result.badge && (
            <span className="mt-1 inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary w-fit">
              {result.badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}