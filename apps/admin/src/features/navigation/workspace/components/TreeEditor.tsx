'use client';

import * as React from 'react';
import { GripVertical, ChevronRight, ChevronDown, Plus, Trash2, Copy, RotateCcw } from 'lucide-react';
import type { NavigationNode } from '../navigation-types';

interface TreeNodeProps {
  node: NavigationNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: (parentId: string) => void;
  onMove: (nodeId: string, newParentId: string | undefined, newOrder: number) => void;
  onDelete: (nodeId: string) => void;
  onCopy: (nodeId: string) => void;
}

function TreeNode({ node, depth, selectedId, onSelect, onAdd, onMove, onDelete, onCopy }: TreeNodeProps) {
  const [expanded, setExpanded] = React.useState(node.isExpanded ?? depth < 2);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div
        className={`group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors ${
          selectedId === node.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(node.id)}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('application/navigation-node', node.id);
          e.dataTransfer.effectAllowed = 'move';
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }}
        onDrop={(e) => {
          e.preventDefault();
          const sourceId = e.dataTransfer.getData('application/navigation-node');
          if (sourceId && sourceId !== node.id) {
            onMove(sourceId, node.id, 0);
          }
        }}
        role="treeitem"
        aria-expanded={hasChildren ? expanded : undefined}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(node.id); }
          if (e.key === 'ArrowRight' && hasChildren) setExpanded(true);
          if (e.key === 'ArrowLeft' && hasChildren) setExpanded(false);
        }}
      >
        <button type="button" className="h-4 w-4 shrink-0 cursor-grab opacity-0 group-hover:opacity-100" aria-label="Drag" onClick={(e) => e.stopPropagation()}>
          <GripVertical className="h-3 w-3" />
        </button>

        <button type="button" className="h-4 w-4 shrink-0" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} aria-label={expanded ? 'Collapse' : 'Expand'}>
          {hasChildren ? (expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />) : <span className="inline-block h-3 w-3" />}
        </button>

        <span className="flex-1 truncate">{node.displayName}</span>

        <div className="hidden items-center gap-1 group-hover:flex">
          <button type="button" className="h-6 w-6 rounded hover:bg-muted" onClick={(e) => { e.stopPropagation(); onAdd(node.id); }} aria-label="Add child">
            <Plus className="h-3 w-3" />
          </button>
          <button type="button" className="h-6 w-6 rounded hover:bg-muted" onClick={(e) => { e.stopPropagation(); onCopy(node.id); }} aria-label="Copy">
            <Copy className="h-3 w-3" />
          </button>
          <button type="button" className="h-6 w-6 rounded hover:bg-muted" onClick={(e) => { e.stopPropagation(); onDelete(node.id); }} aria-label="Delete">
            <Trash2 className="h-3 w-3 text-destructive" />
          </button>
        </div>
      </div>

      {expanded && hasChildren && (
        <div role="group">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} onAdd={onAdd} onMove={onMove} onDelete={onDelete} onCopy={onCopy} />
          ))}
        </div>
      )}
    </div>
  );
}

interface TreeEditorProps {
  nodes: NavigationNode[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onCreateNode: (parentId?: string) => void;
  onMoveNode: (nodeId: string, newParentId: string | undefined, newOrder: number) => void;
  onDeleteNode: (nodeId: string) => void;
  onCopyNode: (nodeId: string) => void;
}

export function TreeEditor({ nodes, selectedNodeId, onSelectNode, onCreateNode, onMoveNode, onDeleteNode, onCopyNode }: TreeEditorProps) {
  const rootNodes = React.useMemo(() => nodes.filter((n) => !n.parentId).sort((a, b) => a.sortOrder - b.sortOrder), [nodes]);

  return (
    <div className="h-full overflow-y-auto admin-scrollbar p-2" role="tree" aria-label="Navigation tree">
      <div className="mb-2 flex items-center justify-between px-2">
        <span className="text-xs font-medium text-muted-foreground">Nodes</span>
        <button type="button" className="rounded-md p-1 text-xs hover:bg-muted" onClick={() => onCreateNode(undefined)} aria-label="Add root node">
          <Plus className="h-3 w-3" />
        </button>
      </div>
      {rootNodes.length === 0 ? (
        <p className="px-2 text-xs text-muted-foreground">No nodes yet. Add a root node to start.</p>
      ) : (
        rootNodes.map((node) => (
          <TreeNode key={node.id} node={node} depth={0} selectedId={selectedNodeId} onSelect={onSelectNode} onAdd={onCreateNode} onMove={onMoveNode} onDelete={onDeleteNode} onCopy={onCopyNode} />
        ))
      )}
    </div>
  );
}
