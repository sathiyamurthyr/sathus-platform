'use client';

import * as React from 'react';
import { Eye, EyeOff, Link as LinkIcon } from 'lucide-react';
import type { NavigationItem } from '../navigation-types';

interface PreviewPanelProps {
  items: NavigationItem[];
  isLoading: boolean;
}

export function PreviewPanel({ items, isLoading }: PreviewPanelProps) {
  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading preview...</div>;
  }

  if (items.length === 0) {
    return <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No published items.</div>;
  }

  const roots = items.filter((i) => !i.parentItemId).sort((a, b) => a.sortOrder - b.sortOrder);

  const getChildren = (parentId: string) => items.filter((i) => i.parentItemId === parentId).sort((a, b) => a.sortOrder - b.sortOrder);

  const renderItem = (item: NavigationItem, depth: number) => {
    const children = getChildren(item.id);
    return (
      <div key={item.id} role="treeitem">
        <div
          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
            item.isHidden ? 'opacity-50' : ''
          } ${!item.isEnabled ? 'line-through opacity-60' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {item.itemType === 'Link' && <LinkIcon className="h-3 w-3 text-muted-foreground" />}
          {item.itemType === 'Container' && <span className="h-3 w-3 rounded-full bg-primary/20" />}
          {item.itemType === 'Divider' && <span className="h-px w-4 bg-border" />}
          {item.itemType === 'Header' && <span className="text-xs font-semibold">H</span>}
          <span className="flex-1 truncate">{item.displayName}</span>
          {item.routePath && <span className="text-xs text-muted-foreground">{item.routePath}</span>}
          {item.isHidden && <EyeOff className="h-3 w-3 text-muted-foreground" aria-label="Hidden" />}
          {!item.isHidden && item.permissions.length > 0 && <Eye className="h-3 w-3 text-amber-500" aria-label="Permission required" />}
        </div>
        {children.length > 0 && children.map((child) => renderItem(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto admin-scrollbar p-2" role="tree" aria-label="Preview tree">
      {roots.map((item) => renderItem(item, 0))}
    </div>
  );
}
