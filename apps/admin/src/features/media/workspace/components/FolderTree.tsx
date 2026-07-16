'use client';

import * as React from 'react';
import { ChevronRight, FolderOpen, Folder, Star, Clock, Share2, Trash2, FolderTree as FolderTreeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FolderTreeNode } from '../lib/media-types';

type ActiveView = 'all' | 'favorites' | 'recent' | 'shared' | 'trash' | 'collections' | 'orphans' | 'broken' | string;

export function FolderTree({
  tree,
  selectedId,
  onSelect,
  activeView,
  onViewChange,
  className,
}: {
  tree: FolderTreeNode[];
  selectedId?: string;
  onSelect: (id?: string) => void;
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  className?: string;
}) {
  const views: { id: ActiveView; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'All Assets', icon: FolderOpen },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'shared', label: 'Shared', icon: Share2 },
    { id: 'trash', label: 'Trash', icon: Trash2 },
    { id: 'collections', label: 'Collections', icon: FolderTreeIcon },
  ];

  return (
    <div className={cn('space-y-1', className)}>
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = activeView === view.id;
        return (
          <button
            key={view.id}
            onClick={() => {
              if (view.id === 'all') {
                onViewChange('all');
                onSelect(undefined);
              } else {
                onViewChange(view.id);
                onSelect(undefined);
              }
            }}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
              isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{view.label}</span>
          </button>
        );
      })}
      <div className="pt-2">
        <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Folders</p>
        <div className="space-y-1">
          <button
            onClick={() => {
              onViewChange('all');
              onSelect(undefined);
            }}
            className={cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
              activeView === 'all' && !selectedId ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
            )}
          >
            <FolderOpen className="h-4 w-4" />
            <span>All Assets</span>
          </button>
          {tree.map((node) => (
            <TreeNode key={node.id} node={node} selectedId={selectedId} onSelect={onSelect} onViewChange={onViewChange} activeView={activeView} level={0} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TreeNode({
  node,
  selectedId,
  onSelect,
  onViewChange,
  activeView,
  level,
}: {
  node: FolderTreeNode;
  selectedId?: string;
  onSelect: (id: string) => void;
  onViewChange: (view: ActiveView) => void;
  activeView: ActiveView;
  level: number;
}) {
  const [expanded, setExpanded] = React.useState(true);
  const hasChildren = node.children.length > 0;
  const isActive = activeView === node.id;

  return (
    <div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn('flex h-4 w-4 items-center justify-center rounded-sm hover:bg-muted', !hasChildren && 'invisible')}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <ChevronRight className={cn('h-3 w-3 transition-transform', expanded && 'rotate-90')} />
        </button>
        <button
          onClick={() => {
            onViewChange(node.id);
            onSelect(node.id);
          }}
          className={cn(
            'flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
            isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
          )}
          style={{ paddingLeft: level * 12 + 8 }}
        >
          {expanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
          <span className="truncate">{node.name}</span>
        </button>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} onViewChange={onViewChange} activeView={activeView} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
