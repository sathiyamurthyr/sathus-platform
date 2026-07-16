'use client';

import * as React from 'react';
import { Upload, FolderPlus, LayoutGrid, List, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MediaSearch } from './MediaSearch';
import { FilterPanel, type FilterPanelFilters } from './FilterPanel';
import { SortMenu } from './SortMenu';
import type { SortField, SortDirection } from './SortMenu';

export function MediaToolbar({
  searchTerm,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortField,
  sortDirection,
  onSortChange,
  filters,
  onFiltersChange,
  onUpload,
  onNewFolder,
}: {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  viewMode: 'grid' | 'list' | 'masonry';
  onViewModeChange: (mode: 'grid' | 'list' | 'masonry') => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
  filters: FilterPanelFilters;
  onFiltersChange: (filters: FilterPanelFilters) => void;
  onUpload?: () => void;
  onNewFolder?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-background/80 px-4 py-2 backdrop-blur-sm">
      <div className="flex-1">
        <MediaSearch value={searchTerm} onChange={onSearchChange} />
      </div>
      <div className="flex items-center gap-1">
        {onUpload && (
          <Button onClick={onUpload} size="sm" className="gap-1.5">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        )}
        {onNewFolder && (
          <Button onClick={onNewFolder} variant="outline" size="sm" className="gap-1.5">
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
        )}
        <FilterPanel filters={filters} onFiltersChange={onFiltersChange} />
        <SortMenu sortField={sortField} sortDirection={sortDirection} onSortChange={onSortChange} />
        <div className="ml-1 flex items-center rounded-md border border-border">
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8 rounded-none', viewMode === 'grid' && 'bg-muted')}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8 rounded-none border-x', viewMode === 'list' && 'bg-muted')}
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8 rounded-none', viewMode === 'masonry' && 'bg-muted')}
            onClick={() => onViewModeChange('masonry')}
            aria-label="Masonry view"
          >
            <LayoutTemplate className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
