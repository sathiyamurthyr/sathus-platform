'use client';

import * as React from 'react';
import {
  search,
  type SearchFacetResponse,
  type SearchQuery,
  type SearchResultResponse,
} from '../lib/search-api';
import {
  addRecent,
  createSavedSearch,
  loadRecent,
  loadSaved,
  saveRecent,
  saveSaved,
  type StoredSavedSearch,
} from '../lib/search-storage';

export type SavedSearch = StoredSavedSearch;

export interface SearchFilters {
  sourceTypes?: SearchQuery['sourceTypes'];
  languages?: string[];
  authors?: string[];
  tags?: string[];
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
  sort?: SearchQuery['sort'];
  facets?: Record<string, string[]>;
}

export interface UseSearchOptions {
  debounceMs?: number;
  pageSize?: number;
  autoSearch?: boolean;
}

export interface UseSearchResult {
  query: string;
  setQuery: (q: string) => void;
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  results: SearchResultResponse | null;
  facets: SearchFacetResponse[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  runSearch: (base?: Partial<SearchQuery>) => void;
  recentSearches: string[];
  savedSearches: SavedSearch[];
  saveSearch: (label: string, base?: Partial<SearchQuery>) => void;
  removeSaved: (id: string) => void;
  clearRecent: () => void;
}

function createDebounce<A extends unknown[]>(fn: (...args: A) => void, wait: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: A) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
  };
  return debounced;
}

function buildQuery(query: string, filters: SearchFilters, page: number, pageSize?: number): SearchQuery {
  return {
    text: query,
    page,
    pageSize,
    sourceTypes: filters.sourceTypes,
    languages: filters.languages,
    authors: filters.authors,
    tags: filters.tags,
    status: filters.status,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    sort: filters.sort,
    facets: filters.facets,
  };
}

export function useSearch(options: UseSearchOptions = {}): UseSearchResult {
  const { debounceMs = 300, pageSize = 20, autoSearch = true } = options;

  const [query, setQueryState] = React.useState('');
  const [filters, setFilters] = React.useState<SearchFilters>({ sort: 'relevance' });
  const [page, setPage] = React.useState(1);
  const [results, setResults] = React.useState<SearchResultResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [savedSearches, setSavedSearches] = React.useState<SavedSearch[]>([]);

  const abortRef = React.useRef<AbortController | null>(null);
  const filtersRef = React.useRef(filters);
  filtersRef.current = filters;

  React.useEffect(() => {
    setRecentSearches(loadRecent());
    setSavedSearches(loadSaved());
  }, []);

  const runSearch = React.useCallback(
    (base?: Partial<SearchQuery>) => {
      const controller = new AbortController();
      abortRef.current?.abort();
      abortRef.current = controller;

      const merged: SearchQuery = {
        ...buildQuery(query, filtersRef.current, page, pageSize),
        ...base,
      };

      setLoading(true);
      setError(null);

      search(merged)
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return;
          setError(err instanceof Error ? err.message : 'Search failed');
          setLoading(false);
        });
    },
    [query, page, pageSize]
  );

  const debouncedRun = React.useMemo(
    () => createDebounce((base?: Partial<SearchQuery>) => runSearch(base), debounceMs),
    [runSearch, debounceMs]
  );

  React.useEffect(() => {
    if (!autoSearch) return;
    debouncedRun();
    return () => debouncedRun.cancel();
  }, [query, filters, page, autoSearch, debouncedRun]);

  const recordRecent = React.useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const next = addRecent(prev, trimmed);
      saveRecent(next);
      return next;
    });
  }, []);

  const saveSearch = React.useCallback(
    (label: string, base?: Partial<SearchQuery>) => {
      const entry = createSavedSearch(label, {
        ...buildQuery(query, filtersRef.current, 1, pageSize),
        ...base,
      });
      setSavedSearches((prev) => {
        const next = [entry, ...prev];
        saveSaved(next);
        return next;
      });
    },
    [query, pageSize]
  );

  const removeSaved = React.useCallback((id: string) => {
    setSavedSearches((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveSaved(next);
      return next;
    });
  }, []);

  const clearRecent = React.useCallback(() => {
    setRecentSearches([]);
    saveRecent([]);
  }, []);

  const setQuery = React.useCallback((q: string) => {
    setPage(1);
    setQueryState(q);
  }, []);

  const facets = results?.facets ?? [];
  const totalPages = results ? Math.max(1, Math.ceil(results.total / (results.pageSize || pageSize))) : 1;

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    facets,
    loading,
    error,
    page,
    totalPages,
    setPage,
    runSearch: () => {
      recordRecent(query);
      runSearch({ page: 1 });
    },
    recentSearches,
    savedSearches,
    saveSearch,
    removeSaved,
    clearRecent,
  };
}
