'use client';

import * as React from 'react';
import { Save, Trash2, Plus, X, Link as LinkIcon, Eye, EyeOff, GripVertical } from 'lucide-react';
import { NODE_ITEM_TYPES, TARGET_TYPES, REFERENCE_KINDS } from '@/types/navigation';
import type { NavigationNode } from '../navigation-types';

interface NodeEditorProps {
  node: NavigationNode | null;
  onSave: (data: Partial<NavigationNode>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export function NodeEditor({ node, onSave, onDelete, onClose }: NodeEditorProps) {
  const isNew = !node;
  const [form, setForm] = React.useState({
    displayName: node?.displayName ?? '',
    itemType: (node?.itemType ?? 'Link') as string,
    routePath: node?.routePath ?? '',
    targetType: (node?.targetType ?? 'Internal') as string,
    targetUrl: node?.targetUrl ?? '',
    referenceKind: (node?.referenceKind ?? 'None') as string,
    referenceId: node?.referenceId ?? '',
    icon: node?.icon ?? '',
    cssClass: node?.cssClass ?? '',
    isExpanded: node?.isExpanded ?? false,
    isHidden: node?.isHidden ?? false,
    isEnabled: node?.isEnabled ?? true,
  });

  React.useEffect(() => {
    if (node) {
      setForm({
        displayName: node.displayName,
        itemType: node.itemType,
        routePath: node.routePath ?? '',
        targetType: node.targetType,
        targetUrl: node.targetUrl ?? '',
        referenceKind: node.referenceKind,
        referenceId: node.referenceId ?? '',
        icon: node.icon ?? '',
        cssClass: node.cssClass ?? '',
        isExpanded: node.isExpanded,
        isHidden: node.isHidden,
        isEnabled: node.isEnabled,
      });
    }
  }, [node?.id]);

  const update = (patch: Record<string, unknown>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Record<string, unknown> = {
      displayName: form.displayName,
      itemType: form.itemType,
      routePath: form.routePath || null,
      targetType: form.targetType,
      targetUrl: form.targetUrl || null,
      referenceKind: form.referenceKind,
      referenceId: form.referenceId ? form.referenceId : null,
      icon: form.icon || null,
      cssClass: form.cssClass || null,
      isExpanded: form.isExpanded,
      isHidden: form.isHidden,
      isEnabled: form.isEnabled,
    };
    onSave(data);
  };

  if (!node && !isNew) return null;

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">{isNew ? 'New Node' : 'Edit Node'}</h3>
        <button type="button" onClick={onClose} className="rounded-md p-1 hover:bg-muted" aria-label="Close panel">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto p-4 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium">Display Name</label>
          <input
            className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
            value={form.displayName}
            onChange={(e) => update({ displayName: e.target.value })}
            required
            maxLength={256}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Item Type</label>
          <select
            className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
            value={form.itemType}
            onChange={(e) => update({ itemType: e.target.value })}
          >
            {NODE_ITEM_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Route Path</label>
          <div className="relative">
            <LinkIcon className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              className="h-8 w-full rounded-md border border-input bg-transparent pl-7 pr-2 text-sm"
              value={form.routePath}
              onChange={(e) => update({ routePath: e.target.value })}
              placeholder="/products/widget"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Target Type</label>
          <select
            className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
            value={form.targetType}
            onChange={(e) => update({ targetType: e.target.value })}
          >
            {TARGET_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {form.targetType === 'External' && (
          <div>
            <label className="mb-1 block text-xs font-medium">Target URL</label>
            <input
              className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
              value={form.targetUrl}
              onChange={(e) => update({ targetUrl: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium">Reference Kind</label>
          <select
            className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
            value={form.referenceKind}
            onChange={(e) => update({ referenceKind: e.target.value })}
          >
            {REFERENCE_KINDS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {form.referenceKind !== 'None' && form.referenceKind !== 'External' && (
          <div>
            <label className="mb-1 block text-xs font-medium">Reference ID</label>
            <input
              className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
              value={form.referenceId}
              onChange={(e) => update({ referenceId: e.target.value })}
              placeholder="UUID"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium">Icon</label>
          <input
            className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm"
            value={form.icon}
            onChange={(e) => update({ icon: e.target.value })}
            placeholder="lucide-react icon name"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={form.isExpanded} onChange={(e) => update({ isExpanded: e.target.checked })} />
            Expanded
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={form.isHidden} onChange={(e) => update({ isHidden: e.target.checked })} />
            <EyeOff className="h-3 w-3" />
            Hidden
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={form.isEnabled} onChange={(e) => update({ isEnabled: e.target.checked })} />
            Enabled
          </label>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-3 w-3" />
            Save
          </button>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-md border border-destructive px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </form>
    </aside>
  );
}
