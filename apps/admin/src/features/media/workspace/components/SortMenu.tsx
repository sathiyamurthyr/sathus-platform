'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';

export type SortField = 'name' | 'createdAt' | 'updatedAt' | 'size' | 'type';
export type SortDirection = 'asc' | 'desc';

export function SortMenu({
  sortField,
  sortDirection,
  onSortChange,
}: {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}) {
  const options: { value: SortField; label: string }[] = [
    { value: 'name', label: 'Name' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
    { value: 'size', label: 'Size' },
    { value: 'type', label: 'Type' },
  ];

  const current = options.find((o) => o.value === sortField);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {current?.label ?? 'Sort'}
          {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value, sortField === option.value && sortDirection === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-between"
          >
            <span>{option.label}</span>
            {sortField === option.value && (
              <span className="text-xs text-muted-foreground">{sortDirection === 'asc' ? 'Asc' : 'Desc'}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
