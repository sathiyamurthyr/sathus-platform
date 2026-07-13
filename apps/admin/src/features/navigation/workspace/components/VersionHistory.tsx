'use client';

import * as React from 'react';
import { History, RotateCcw, MessageSquare, GitCompare } from 'lucide-react';
import type { NavigationVersion, NavigationItem, HistoryEntry } from '../navigation-types';

interface VersionHistoryProps {
  versions: NavigationVersion[];
  onRestore: (versionId: string) => void;
  onPreview: (versionId: string) => void;
  currentVersionId?: string;
}

export function VersionHistory({ versions, onRestore, onPreview, currentVersionId }: VersionHistoryProps) {
  const [leftId, setLeftId] = React.useState<string | null>(null);
  const [rightId, setRightId] = React.useState<string | null>(null);
  const [comment, setComment] = React.useState('');
  const [comments, setComments] = React.useState<Array<{ versionId: string; author: string; body: string; createdAt: string }>>([]);

  React.useEffect(() => {
    if (versions.length >= 2) {
      setLeftId(versions[versions.length - 1].id);
      setRightId(versions[0].id);
    } else if (versions.length === 1) {
      setRightId(versions[0].id);
    }
  }, [versions]);

  const left = versions.find((v) => v.id === leftId) ?? null;
  const right = versions.find((v) => v.id === rightId) ?? null;

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
                onClick={() => { setRightId(v.id); onPreview(v.id); }}
                className={`w-full rounded-md border p-3 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${rightId === v.id ? 'border-primary' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">v{v.versionNumber}</span>
                  <span className="text-xs text-muted-foreground">{v.status}</span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{v.label}</p>
                <p className="text-xs text-muted-foreground">{new Date(v.createdAt).toLocaleString()}</p>
                <button
                  type="button"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  onClick={(e) => { e.stopPropagation(); onRestore(v.id); }}
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
            {versions.map((v) => <option key={v.id} value={v.id}>v{v.versionNumber}</option>)}
          </select>
          <label className="text-sm">To</label>
          <select className="h-8 rounded-md border border-input bg-transparent px-2 text-sm" value={rightId ?? ''} onChange={(e) => setRightId(e.target.value || null)}>
            <option value="">Current</option>
            {versions.map((v) => <option key={v.id} value={v.id}>v{v.versionNumber}</option>)}
          </select>
        </div>

        {left && right && (
          <div className="flex items-center justify-between rounded-md border p-3 text-sm">
            <div>
              <p className="font-medium">Comparing v{left.versionNumber} → v{right.versionNumber}</p>
            </div>
            <button type="button" className="inline-flex items-center gap-1 text-xs text-primary hover:underline" onClick={() => onRestore(right.id)}>
              <RotateCcw className="h-3 w-3" /> Restore v{right.versionNumber}
            </button>
          </div>
        )}

        <div className="rounded-md border p-4">
          <h4 className="flex items-center gap-2 text-sm font-medium"><MessageSquare className="h-4 w-4" /> Comments</h4>
          <ul className="mt-2 space-y-2">
            {comments.length === 0 && <li className="text-xs text-muted-foreground">No comments.</li>}
            {comments.map((c, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium">{c.author}</span> <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</span>
                <p className="text-sm">{c.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <input
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setComments((c) => [...c, { versionId: rightId ?? '', author: 'You', body: comment, createdAt: new Date().toISOString() }]); setComment(''); } }}
            />
              <button type="button" className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:bg-primary/90" onClick={() => { setComments((c) => [...c, { versionId: rightId ?? '', author: 'You', body: comment, createdAt: new Date().toISOString() }]); setComment(''); }}>
                Comment
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
