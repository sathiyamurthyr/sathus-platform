'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchResults } from '@/constants';

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return searchResults;
    const q = query.toLowerCase();
    return searchResults.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [query]);

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [filtered.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        window.location.href = filtered[selectedIndex].href;
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl rounded-2xl border bg-background shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b">
              <SearchIcon className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search documentation, products, insights..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="pointer-events-none inline-flex h-7 select-none items-center gap-1 rounded-lg border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground">
                ESC
              </kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <p className="text-sm text-muted-foreground">No results found for &ldquo;{query}&rdquo;</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {query ? 'Results' : 'Quick Links'}
                  </p>
                  {filtered.map((result, i) => (
                    <Link
                      key={result.title}
                      href={result.href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150',
                        i === selectedIndex
                          ? 'bg-muted/80'
                          : 'hover:bg-muted/40'
                      )}
                      onClick={onClose}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/60">
                        <SearchIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground truncate">
                            {result.title}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
                            {result.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{result.description}</p>
                      </div>
                      {i === selectedIndex && (
                        <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between border-t px-5 py-2.5 bg-muted/20">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-[10px]">↵</kbd> Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-[10px]">esc</kbd> Close
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
