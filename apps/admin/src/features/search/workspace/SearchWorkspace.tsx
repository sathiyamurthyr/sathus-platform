'use client';

import * as React from 'react';
import {
  Command,
  FileCog,
  Users,
  RefreshCw,
  Save,
  Search as SearchIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSearch, type SearchFilters } from '../hooks/use-search';
import { getStatus, rebuildIndex, type SearchIndexStatusResponse } from '../lib/search-api';
import {
  SearchAutocomplete,
  SearchResults,
  FacetsPanel,
  SearchFilters as SearchFiltersPanel,
  CommandPalette,
  SearchEmptyState,
  RecentSearches,
  SavedSearches,
} from '../components';

const PAGE_SIZE = 20;

export function SearchWorkspace() {
  const search = useSearch({ pageSize: PAGE_SIZE, autoSearch: true });

  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [statuses, setStatuses] = React.useState<SearchIndexStatusResponse[]>([]);
  const [rebuildState, setRebuildState] = React.useState<'idle' | 'building'>('idle');
  const [saveLabel, setSaveLabel] = React.useState('');

  const loadStatus = React.useCallback(async () => {
    try {
      const data = await getStatus();
      setStatuses(data);
    } catch {
      /* status is informational only */
    }
  }, []);

  React.useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const applyFilters = React.useCallback(
    (next: SearchFilters) => {
      search.setPage(1);
      search.setFilters(next);
    },
    [search]
  );

  const handleRebuild = React.useCallback(async () => {
    setRebuildState('building');
    try {
      await rebuildIndex({});
      await loadStatus();
    } finally {
      setRebuildState('idle');
    }
  }, [loadStatus]);

  const quickActions = React.useMemo(
    () => [
      {
        id: 'go-content',
        label: 'Go to Content',
        hint: 'G then C',
        icon: <FileCog className="h-4 w-4" aria-hidden="true" />,
        href: '/admin/content',
      },
      {
        id: 'go-users',
        label: 'Go to Users',
        hint: 'G then U',
        icon: <Users className="h-4 w-4" aria-hidden="true" />,
        href: '/admin/users',
      },
      {
        id: 'rebuild-index',
        label: 'Rebuild search index',
        icon: <RefreshCw className="h-4 w-4" aria-hidden="true" />,
        onSelect: () => {
          void handleRebuild();
        },
      },
    ],
    [handleRebuild]
  );

  const items = search.results?.items ?? [];
  const total = search.results?.total ?? 0;
  const showEmpty = !search.loading && search.results !== null && items.length === 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold">Search</h2>
          <p className="text-sm text-muted-foreground">
            Query the global search index across all Sathus Platform content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-input px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Command className="h-4 w-4" aria-hidden="true" />
            <span>Quick search</span>
            <kbd className="rounded border border-border px-1.5 text-[10px]">⌘K</kbd>
          </button>
          <Button variant="outline" size="sm" onClick={handleRebuild} disabled={rebuildState === 'building'}>
            <RefreshCw className={cn('h-4 w-4', rebuildState === 'building' && 'animate-spin')} aria-hidden="true" />
            Rebuild index
          </Button>
        </div>
      </div>

      <div className="border-b border-border px-4 py-3">
        <SearchAutocomplete
          value={search.query}
          onChange={search.setQuery}
          onSelect={(v) => search.runSearch({ text: v })}
          onSearch={(v) => search.runSearch({ text: v })}
          placeholder="Search pages, products, docs, users…"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {search.results && (
            <span>
              {total} result{total === 1 ? '' : 's'} in {search.results.tookMs}ms
            </span>
          )}
          {statuses.map((s) => (
            <Badge key={s.indexId} variant={s.status === 'healthy' ? 'success' : 'warning'}>
              {s.indexName ?? s.indexId}: {s.status}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="admin-scrollbar hidden w-72 shrink-0 space-y-6 overflow-y-auto border-r border-border p-4 lg:block">
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Filters
            </h3>
            <SearchFiltersPanel filters={search.filters} onChange={applyFilters} />
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Facets
            </h3>
            <FacetsPanel
              facets={search.facets}
              selected={search.filters.facets ?? {}}
              onChange={(key, values) =>
                applyFilters({ ...search.filters, facets: { ...search.filters.facets, [key]: values } })
              }
            />
          </section>
        </aside>

        <div className="admin-scrollbar flex-1 overflow-y-auto p-4">
          {search.error && (
            <div
              role="alert"
              className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {search.error}
            </div>
          )}

          {search.loading && (
            <p className="py-8 text-center text-sm text-muted-foreground">Searching…</p>
          )}

          {showEmpty && (
            <SearchEmptyState query={search.query} onReset={() => applyFilters({ sort: 'relevance' })} />
          )}

          {!search.loading && items.length > 0 && (
            <>
              <SearchResults items={items} query={search.query} />
              {search.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={search.page <= 1}
                    onClick={() => search.setPage(search.page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {search.page} of {search.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={search.page >= search.totalPages}
                    onClick={() => search.setPage(search.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {!search.loading && search.results === null && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <SearchIcon className="mx-auto mb-2 h-6 w-6" aria-hidden="true" />
              Enter a query above or press ⌘K to search.
            </div>
          )}
        </div>

        <aside className="admin-scrollbar hidden w-64 shrink-0 space-y-6 overflow-y-auto border-l border-border p-4 xl:block">
          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                aria-label="Name this search"
                placeholder="Name this search"
                value={saveLabel}
                onChange={(e) => setSaveLabel(e.target.value)}
                className="h-8 flex-1 rounded-md border border-input bg-transparent px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (!search.query.trim()) return;
                  search.saveSearch(saveLabel);
                  setSaveLabel('');
                }}
                disabled={!search.query.trim()}
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                Save
              </Button>
            </div>
            <SavedSearches
              items={search.savedSearches}
              onSelect={(item) => {
                search.setQuery(item.query.text);
                search.setFilters({
                  sort: item.query.sort,
                  facets: item.query.facets,
                  sourceTypes: item.query.sourceTypes,
                  languages: item.query.languages,
                  authors: item.query.authors,
                  tags: item.query.tags,
                  status: item.query.status,
                  dateFrom: item.query.dateFrom,
                  dateTo: item.query.dateTo,
                });
                search.runSearch({ ...item.query, page: 1 });
              }}
              onRemove={search.removeSaved}
            />
          </section>

          <RecentSearches
            items={search.recentSearches}
            onSelect={(term) => search.runSearch({ text: term })}
            onClear={search.clearRecent}
          />
        </aside>
      </div>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        actions={quickActions}
        recentSearches={search.recentSearches}
        savedSearches={search.savedSearches}
        onGlobalSearch={(term) => {
          search.runSearch({ text: term });
          setPaletteOpen(false);
        }}
        onSelectRecent={(term) => {
          search.runSearch({ text: term });
          setPaletteOpen(false);
        }}
        onSelectSaved={(item) => {
          search.setQuery(item.query.text);
          search.setFilters({
            sort: item.query.sort,
            facets: item.query.facets,
            sourceTypes: item.query.sourceTypes,
            languages: item.query.languages,
            authors: item.query.authors,
            tags: item.query.tags,
            status: item.query.status,
            dateFrom: item.query.dateFrom,
            dateTo: item.query.dateTo,
          });
          search.runSearch({ ...item.query, page: 1 });
          setPaletteOpen(false);
        }}
      />
    </div>
  );
}
