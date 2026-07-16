'use client';

import * as React from 'react';
import { History, GitCompare, RotateCcw, MessageSquare } from 'lucide-react';
import type { ContentVersion } from '@/types/content';
import { diffLines, type DiffSegment } from '@/lib/diff';
import { listVersions, restoreVersion, addVersionComment } from '@/lib/content-store';

export interface VersionHistoryProps {
  contentItemId: string;
  currentUser: string;
  currentBody: string;
  onRestore: (item: unknown) => void;
}

function DiffView({ segments }: { segments: DiffSegment[] }) {
  return (
    <div className="overflow-hidden rounded-md border bg-muted/30 font-mono text-xs">
      {segments.map((seg, i) => (
        <div
          key={i}
          className={
            seg.type === 'added'
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : seg.type === 'removed'
                ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                : 'text-muted-foreground'
          }
        >
          <span className="select-none px-2 opacity-60">{seg.type === 'added' ? '+' : seg.type === 'removed' ? '-' : ' '}</span>
          <span className="whitespace-pre-wrap">{seg.value || ' '}</span>
        </div>
      ))}
    </div>
  );
}

export function VersionHistory({ contentItemId, currentUser, currentBody, onRestore }: VersionHistoryProps) {
  const [versions, setVersions] = React.useState<ContentVersion[]>([]);
  const [leftId, setLeftId] = React.useState<string | null>(null);
  const [rightId, setRightId] = React.useState<string | null>(null);
  const [commentText, setCommentText] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const refresh = React.useCallback(() => {
    const list = listVersions(contentItemId);
    setVersions(list);
    if (list.length >= 2) {
      setLeftId((prev) => prev ?? list[list.length - 1].id);
      setRightId((prev) => prev ?? list[0].id);
    } else if (list.length === 1) {
      setRightId((prev) => prev ?? list[0].id);
    }
  }, [contentItemId]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const left = versions.find((v) => v.id === leftId) ?? null;
  const right = versions.find((v) => v.id === rightId) ?? null;

  const segments = React.useMemo<DiffSegment[]>(() => {
    const base = left?.body ?? currentBody;
    const next = right?.body ?? currentBody;
    return diffLines(base, next);
  }, [left, right, currentBody]);

  const added = segments.filter((s) => s.type === 'added').length;
  const removed = segments.filter((s) => s.type === 'removed').length;

  const handleRestore = async (version: ContentVersion) => {
    setBusy(true);
    try {
      const restored = restoreVersion(contentItemId, version.id, currentUser);
      refresh();
      onRestore(restored);
    } finally {
      setBusy(false);
    }
  };

  const handleComment = (version: ContentVersion) => {
    if (!commentText.trim()) return;
    addVersionComment(contentItemId, version.id, currentUser, commentText.trim());
    setCommentText('');
    refresh();
  };

  const active = right ?? left;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-medium"><History className="h-4 w-4" /> Versions</h3>
        <ul className="space-y-2">
          {versions.length === 0 && <li className="text-sm text-muted-foreground">No versions yet.</li>}
          {versions.map((v) => (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => setRightId(v.id)}
                className={`w-full rounded-md border p-3 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${rightId === v.id ? 'border-primary' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">v{v.version}</span>
                  <span className="text-xs text-muted-foreground">{v.status}</span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{v.note ?? v.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(v.createdAt).toLocaleString()}</p>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  disabled={busy}
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleRestore(v);
                  }}
                >
                  <RotateCcw className="h-3 w-3" /> Restore
                </button>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3 lg:col-span-2">
        <div className="flex flex-wrap items-center gap-2">
          <GitCompare className="h-4 w-4" />
          <label className="text-sm">From</label>
          <select className="h-8 rounded-md border border-input bg-transparent px-2 text-sm" value={leftId ?? ''} onChange={(e) => setLeftId(e.target.value || null)}>
            <option value="">Current</option>
            {versions.map((v) => <option key={v.id} value={v.id}>v{v.version}</option>)}
          </select>
          <label className="text-sm">To</label>
          <select className="h-8 rounded-md border border-input bg-transparent px-2 text-sm" value={rightId ?? ''} onChange={(e) => setRightId(e.target.value || null)}>
            <option value="">Current</option>
            {versions.map((v) => <option key={v.id} value={v.id}>v{v.version}</option>)}
          </select>
          <span className="text-xs text-emerald-600 dark:text-emerald-400">+{added}</span>
          <span className="text-xs text-rose-600 dark:text-rose-400">-{removed}</span>
        </div>

        {left && right && (
          <div className="flex items-center justify-between rounded-md border p-3 text-sm">
            <div>
              <p className="font-medium">Comparing v{left.version} → v{right.version}</p>
              <p className="text-xs text-muted-foreground">{left.author} → {right.author}</p>
            </div>
            <button type="button" className="inline-flex items-center gap-1 text-xs text-primary hover:underline" disabled={busy} onClick={() => void handleRestore(right)}>
              <RotateCcw className="h-3 w-3" /> Restore v{right.version}
            </button>
          </div>
        )}

        <DiffView segments={segments} />

        {active && (
          <div className="rounded-md border p-4">
            <h4 className="flex items-center gap-2 text-sm font-medium"><MessageSquare className="h-4 w-4" /> Comments</h4>
            <ul className="mt-2 space-y-2">
              {active.comments.length === 0 && <li className="text-xs text-muted-foreground">No comments.</li>}
              {active.comments.map((c) => (
                <li key={c.id} className="text-sm">
                  <span className="font-medium">{c.author}</span> <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
                  <p className="text-sm">{c.body}</p>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <input
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && active) {
                    handleComment(active);
                  }
                }}
              />
              <button type="button" className="rounded-md bg-primary px-3 text-sm text-primary-foreground" onClick={() => active && handleComment(active)}>
                Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
