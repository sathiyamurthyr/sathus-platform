'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { SearchInput } from '../SearchInput';
import { SearchResults } from '../SearchResults';
import { SearchEmpty } from '../SearchEmpty';
import { SearchLoading } from '../SearchLoading';
import { RecentSearches } from '../RecentSearches';
import { PopularSearches } from '../PopularSearches';
import { MockSearchProvider } from '../../providers/mock-provider';
import type { SearchResult, SearchFilters } from '../../types';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const searchProvider = new MockSearchProvider();

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [popularSearches, setPopularSearches] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (open) {
      searchProvider.getRecentSearches().then(setRecentSearches);
      searchProvider.getPopularSearches().then(setPopularSearches);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
    }
  }, [open]);

  React.useEffect(() => {
    const debouncedSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchProvider.search(query);
        setResults(searchResults);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(debouncedSearch, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    searchProvider.saveRecentSearch(query);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-background/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Search">
      <div className="w-full max-w-lg mx-4 bg-background border border-border rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Search</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <SearchInput value={query} onChange={setQuery} autoFocus />
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <SearchLoading />
          ) : results.length > 0 ? (
            <SearchResults results={results} onSelect={handleSelect} />
          ) : query ? (
            <SearchEmpty query={query} />
          ) : (
            <>
              <RecentSearches searches={recentSearches} onSelect={setQuery} />
              <PopularSearches searches={popularSearches} onSelect={setQuery} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}