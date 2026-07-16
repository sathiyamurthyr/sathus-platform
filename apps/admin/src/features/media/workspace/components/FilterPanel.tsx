'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, X } from 'lucide-react';
import type { MediaType, MediaStatus } from '../lib/media-types';

export interface FilterPanelFilters {
  types?: MediaType[];
  status?: MediaStatus;
  tags?: string[];
  language?: string;
  owner?: string;
  favorites?: boolean;
  unused?: boolean;
  broken?: boolean;
}

export function FilterPanel({
  filters,
  onFiltersChange,
}: {
  filters: FilterPanelFilters;
  onFiltersChange: (filters: FilterPanelFilters) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const activeCount = React.useMemo(() => {
    let count = 0;
    if (filters.types?.length) count++;
    if (filters.status) count++;
    if (filters.tags?.length) count++;
    if (filters.language) count++;
    if (filters.owner) count++;
    if (filters.favorites) count++;
    if (filters.unused) count++;
    if (filters.broken) count++;
    return count;
  }, [filters]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeCount}
            </span>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="space-y-3 p-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Type</p>
            <div className="flex flex-wrap gap-1">
              {(['Image', 'Video', 'Audio', 'Document', 'Archive', 'Other'] as MediaType[]).map((type) => (
                <Button
                  key={type}
                  variant={filters.types?.includes(type) ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    const current = filters.types ?? [];
                    const next = current.includes(type)
                      ? current.filter((t) => t !== type)
                      : [...current, type];
                    onFiltersChange({ ...filters, types: next.length ? next : undefined });
                  }}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Status</p>
            <div className="flex flex-wrap gap-1">
              {(['Ready', 'Processing', 'Error', 'Pending', 'Archived'] as MediaStatus[]).map((status) => (
                <Button
                  key={status}
                  variant={filters.status === status ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    onFiltersChange({ ...filters, status: filters.status === status ? undefined : status });
                  }}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onFiltersChange({ ...filters, favorites: !filters.favorites })}
            >
              Favorites only
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onFiltersChange({ ...filters, unused: !filters.unused })}
            >
              Unused only
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onFiltersChange({ ...filters, broken: !filters.broken })}
            >
              Broken references
            </Button>
          </div>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() =>
                onFiltersChange({
                  types: undefined,
                  status: undefined,
                  tags: undefined,
                  language: undefined,
                  owner: undefined,
                  favorites: undefined,
                  unused: undefined,
                  broken: undefined,
                })
              }
            >
              <X className="mr-1 h-3 w-3" />
              Clear all filters
            </Button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
