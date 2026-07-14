'use client';

import * as React from 'react';
import { Command, Search, CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SearchBar } from './SearchBar';
import type { SavedSearch } from '../hooks/use-search';

export interface CommandPaletteAction {
  id: string;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  href?: string;
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions?: CommandPaletteAction[];
  recentSearches?: string[];
  savedSearches?: SavedSearch[];
  onGlobalSearch: (term: string) => void;
  onSelectRecent: (term: string) => void;
  onSelectSaved: (item: SavedSearch) => void;
}

interface Row {
  id: string;
  label: string;
  group: string;
  icon: React.ReactNode;
  onActivate: () => void;
  hint?: string;
}

export function CommandPalette({
  open,
  onOpenChange,
  actions = [],
  recentSearches = [],
  savedSearches = [],
  onGlobalSearch,
  onSelectRecent,
  onSelectSaved,
}: CommandPaletteProps) {
  const [term, setTerm] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      const t = setTimeout(() => document.getElementById('command-palette-input')?.focus(), 0);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(t);
        document.body.style.overflow = prevOverflow;
        previouslyFocused.current?.focus?.();
      };
    }
  }, [open]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [term, open]);

  const rows = React.useMemo<Row[]>(() => {
    const result: Row[] = [];
    const trimmed = term.trim();

    if (trimmed) {
      result.push({
        id: 'global-search',
        group: 'Search',
        label: `Search for "${trimmed}"`,
        icon: <Search className="h-4 w-4" aria-hidden="true" />,
        onActivate: () => onGlobalSearch(trimmed),
      });
    }

    for (const action of actions) {
      result.push({
        id: `action-${action.id}`,
        group: 'Actions',
        label: action.label,
        hint: action.hint,
        icon: action.icon ?? <Command className="h-4 w-4" aria-hidden="true" />,
        onActivate: () => {
          action.onSelect?.();
          if (!action.href) onOpenChange(false);
        },
      });
    }

    for (const s of savedSearches) {
      result.push({
        id: `saved-${s.id}`,
        group: 'Saved',
        label: s.label,
        icon: <Search className="h-4 w-4" aria-hidden="true" />,
        onActivate: () => onSelectSaved(s),
      });
    }

    for (const r of recentSearches) {
      result.push({
        id: `recent-${r}`,
        group: 'Recent',
        label: r,
        icon: <Search className="h-4 w-4" aria-hidden="true" />,
        onActivate: () => onSelectRecent(r),
      });
    }

    const q = trimmed.toLowerCase();
    if (!q) return result;
    return result.filter((r) => r.label.toLowerCase().includes(q));
  }, [term, actions, savedSearches, recentSearches, onGlobalSearch, onSelectRecent, onSelectSaved, onOpenChange]);

  const close = React.useCallback(() => onOpenChange(false), [onOpenChange]);

  const activateActiveOrGlobal = React.useCallback(
    (value: string) => {
      const row = rows[activeIndex];
      if (row) {
        row.onActivate();
      } else if (value.trim()) {
        onGlobalSearch(value.trim());
      } else {
        close();
      }
    },
    [rows, activeIndex, onGlobalSearch, close]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, rows.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  if (!open) return null;

  let lastGroup = '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[12vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-popover shadow-lg"
        onKeyDown={onKeyDown}
      >
        <div className="border-b border-border px-3 py-2">
          <SearchBar
            id="command-palette-input"
            value={term}
            onChange={setTerm}
            onSearch={activateActiveOrGlobal}
            placeholder="Search or jump to…"
            className="[&_input]:h-9"
          />
        </div>

        <ul
          id="command-palette-listbox"
          role="listbox"
          aria-label="Commands"
          className="max-h-80 overflow-y-auto p-1"
        >
          {rows.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results found
            </li>
          )}
          {rows.map((row, index) => {
            const showGroup = row.group !== lastGroup;
            lastGroup = row.group;
            return (
              <React.Fragment key={row.id}>
                {showGroup && (
                  <li
                    role="presentation"
                    className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {row.group}
                  </li>
                )}
                <li
                  id={`command-row-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm',
                    index === activeIndex ? 'bg-accent text-accent-foreground' : 'text-foreground'
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    row.onActivate();
                  }}
                >
                  <span className="text-muted-foreground">{row.icon}</span>
                  <span className="flex-1 truncate">{row.label}</span>
                  {row.hint && <span className="text-xs text-muted-foreground">{row.hint}</span>}
                  {index === activeIndex && (
                    <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowUp className="h-3 w-3" aria-hidden="true" />
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
            navigate
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
            select
          </span>
          <span className="ml-auto">Sathus Command</span>
        </div>
      </div>
    </div>
  );
}
