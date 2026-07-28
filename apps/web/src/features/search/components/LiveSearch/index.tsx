'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Sparkles, History, ArrowRight, Layers, Briefcase, FileText, ShieldCheck, Tag } from 'lucide-react';
import { MockSearchProvider } from '../../providers/mock-provider';
import type { SearchResult, SearchCategory } from '../../types';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

const provider = new MockSearchProvider();

const CATEGORIES: Array<{ id: string; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'all', label: 'All Results', icon: Layers },
  { id: 'solutions', label: 'Solutions', icon: Layers },
  { id: 'industries', label: 'Industries', icon: Briefcase },
  { id: 'blog', label: 'Blog & Papers', icon: FileText },
  { id: 'trust-center', label: 'Trust & Compliance', icon: ShieldCheck },
];

export function LiveSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = React.useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [popularSearches, setPopularSearches] = React.useState<string[]>([]);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  // Load initial popular & recent searches
  React.useEffect(() => {
    provider.getPopularSearches().then(setPopularSearches);
    provider.getRecentSearches().then(setRecentSearches);
  }, []);

  // Execute search whenever query or category changes
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      provider
        .search(query, { category: selectedCategory as SearchCategory })
        .then((res) => {
          setResults(res);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, selectedCategory]);

  const handleSelectQuery = (term: string) => {
    setQuery(term);
    provider.saveRecentSearch(term);
    provider.getRecentSearches().then(setRecentSearches);
    router.replace(`/search?q=${encodeURIComponent(term)}`, { scroll: false });
  };

  const handleResultClick = (result: SearchResult) => {
    if (query.trim()) {
      provider.saveRecentSearch(query.trim());
    }
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    router.replace('/search', { scroll: false });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Search Input Bar */}
      <div className="relative group">
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/50 to-primary/20 blur opacity-30 group-hover:opacity-75 transition duration-300" />
        <div className="relative flex items-center rounded-2xl border border-border/80 bg-card px-4 py-3 shadow-xl">
          <Search className="h-5 w-5 text-primary mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              router.replace(e.target.value ? `/search?q=${encodeURIComponent(e.target.value)}` : '/search', {
                scroll: false,
              });
            }}
            placeholder="Search solutions, engineering whitepapers, pricing, compliance..."
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-base focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={clearQuery}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                  : 'bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Empty State / Popular & Recent Searches when no query */}
      {!query.trim() && (
        <div className="space-y-6 pt-4">
          {recentSearches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <History className="h-3.5 w-3.5 text-primary" />
                Recent Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectQuery(term)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-card text-xs font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Popular Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSelectQuery(term)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-primary/20 bg-primary/5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                >
                  <Tag className="h-3 w-3" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {query.trim() && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {isLoading
                ? 'Searching platform index...'
                : `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
            </span>
            {selectedCategory !== 'all' && (
              <span className="font-semibold text-primary">Category: {selectedCategory}</span>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl border border-border/50 bg-card/50 animate-pulse p-4 space-y-2">
                  <div className="h-4 w-1/3 bg-muted rounded" />
                  <div className="h-3 w-3/4 bg-muted/60 rounded" />
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">No matching results found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try searching for general terms like "AI Engineering", "Lakehouse", "Pricing", or "SOC 2".
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <div className="space-y-3">
                {results.map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      href={result.url}
                      onClick={() => handleResultClick(result)}
                      className="group block rounded-2xl border border-border/70 bg-card p-5 hover:border-primary/50 hover:bg-card/90 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                              {result.title}
                            </span>
                            {result.badge && (
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                                {result.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {result.description}
                          </p>
                          {result.snippet && (
                            <p className="text-[11px] font-mono text-muted-foreground/80 pt-1">
                              Keywords: {result.snippet}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );
}
