'use client';

import * as React from 'react';
import { History } from 'lucide-react';
import type { MediaVersion } from '../lib/media-types';

export function VersionPanel({ versions }: { versions: MediaVersion[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Versions</h3>
      <div className="flex items-center gap-2 rounded-lg border border-border p-3">
        <History className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-2xl font-bold">{versions.length}</p>
          <p className="text-xs text-muted-foreground">Versions</p>
        </div>
      </div>
      <div className="space-y-2">
        {versions.map((version) => (
          <div key={version.id} className="rounded-md border border-border p-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">v{version.versionNumber}</p>
              <span className="text-xs text-muted-foreground">{new Date(version.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-1 truncate text-xs text-muted-foreground">{version.fileName}</p>
            <p className="text-xs text-muted-foreground">
              {(version.sizeBytes / 1024).toFixed(1)} KB · {version.mimeType}
            </p>
            {version.note && <p className="mt-1 text-xs italic text-muted-foreground">{version.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
