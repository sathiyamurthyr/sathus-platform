'use client';

import * as React from 'react';
import { Link2, GitBranch } from 'lucide-react';
import type { MediaUsage } from '../lib/media-types';

export function RelationshipPanel({ relations }: { relations: MediaUsage[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Relations</h3>
      <div className="flex items-center gap-2 rounded-lg border border-border p-3">
        <GitBranch className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-2xl font-bold">{relations.length}</p>
          <p className="text-xs text-muted-foreground">Direct relations</p>
        </div>
      </div>
      <div className="space-y-2">
        {relations.map((rel) => (
          <div key={rel.id} className="flex items-center gap-2 rounded-md border border-border p-2">
            <Link2 className="h-4 w-4 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{rel.title ?? rel.referenceType}</p>
              <p className="truncate text-xs text-muted-foreground">{rel.context}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
