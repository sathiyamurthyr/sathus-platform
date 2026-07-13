'use client';

import * as React from 'react';
import type { VersionDto } from '../navigation-types';

interface PublishDialogProps {
  open: boolean;
  versions: VersionDto[];
  currentVersionId?: string;
  onClose: () => void;
  onPublish: (versionId: string) => void;
  onSchedule: (versionId: string, date: Date) => void;
  publishing: boolean;
}

export function PublishDialog({ open, versions, currentVersionId, onClose, onPublish, onSchedule, publishing }: PublishDialogProps) {
  const [mode, setMode] = React.useState<'publish' | 'schedule'>('publish');
  const [selectedVersionId, setSelectedVersionId] = React.useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = React.useState('');

  React.useEffect(() => {
    if (open) {
      const current = versions.find((v) => v.id === currentVersionId);
      setSelectedVersionId(current?.id ?? versions[0]?.id ?? null);
      setMode('publish');
      setScheduleDate('');
    }
  }, [open, currentVersionId, versions]);

  if (!open) return null;

  const handleSchedule = () => {
    if (!selectedVersionId || !scheduleDate) return;
    onSchedule(selectedVersionId, new Date(scheduleDate));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal>
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">Publish Menu</h3>

        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium">Select Version</label>
          <select
            className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm"
            value={selectedVersionId ?? ''}
            onChange={(e) => setSelectedVersionId(e.target.value)}
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id}>
                v{v.versionNumber} - {v.label} ({v.status})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="publish-mode" checked={mode === 'publish'} onChange={() => setMode('publish')} />
            Publish Now
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="publish-mode" checked={mode === 'schedule'} onChange={() => setMode('schedule')} />
            Schedule
          </label>
        </div>

        {mode === 'schedule' && (
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium">Publish At (UTC)</label>
            <input
              type="datetime-local"
              className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted">Cancel</button>
          {mode === 'publish' ? (
            <button type="button" className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90" onClick={() => selectedVersionId && onPublish(selectedVersionId)} disabled={!selectedVersionId || publishing}>
              {publishing ? 'Publishing...' : 'Publish'}
            </button>
          ) : (
            <button type="button" className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90" onClick={handleSchedule} disabled={!selectedVersionId || !scheduleDate}>
              Schedule
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
