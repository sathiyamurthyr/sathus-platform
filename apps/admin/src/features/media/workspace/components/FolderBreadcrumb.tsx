'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FolderBreadcrumbProps {
  folderId?: string;
  folders: Map<string, { id: string; name: string; parentId?: string }>;
  onNavigate: (folderId?: string) => void;
}

export function FolderBreadcrumb({ folderId, folders, onNavigate }: FolderBreadcrumbProps) {
  const crumbs: { id: string; name: string }[] = [];
  let currentId = folderId;

  while (currentId) {
    const folder = folders.get(currentId);
    if (!folder) break;
    crumbs.unshift({ id: folder.id, name: folder.name });
    currentId = folder.parentId;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <Button
        variant="ghost"
        size="sm"
        className="h-auto px-2 py-1 font-medium"
        onClick={() => onNavigate(undefined)}
      >
        Home
      </Button>
      {crumbs.map((crumb) => (
        <React.Fragment key={crumb.id}>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 font-medium"
            onClick={() => onNavigate(crumb.id)}
          >
            {crumb.name}
          </Button>
        </React.Fragment>
      ))}
    </nav>
  );
}
