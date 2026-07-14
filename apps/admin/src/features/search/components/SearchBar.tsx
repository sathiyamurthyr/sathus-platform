'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

/** Controlled, accessible search input with a submit button. */
export function SearchBar({ value, onChange, onSearch, placeholder = 'Search…', className, id = 'search' }: SearchBarProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(value);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn('flex w-full items-center gap-2', className)}
    >
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id={id}
          type="search"
          aria-label="Search"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange('');
              onSearch('');
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="h-9 shrink-0 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Search
      </button>
    </form>
  );
}
