'use client';

import * as React from 'react';
import { Activity } from 'lucide-react';
import type { MediaAudit } from '../lib/media-types';

export function ActivityTimeline({ audits }: { audits: MediaAudit[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Activity</h3>
      <div className="flex items-center gap-2 rounded-lg border border-border p-3">
        <Activity className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-2xl font-bold">{audits.length}</p>
          <p className="text-xs text-muted-foreground">Events</p>
        </div>
      </div>
      <div className="space-y-3">
        {audits.map((audit, index) => (
          <div key={audit.id} className="flex gap-3">
            <div className="relative">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
              {index < audits.length - 1 && <div className="absolute inset-x-0 top-3 mx-auto h-full w-px bg-border" />}
            </div>
            <div className="flex-1 pb-3">
              <p className="text-xs font-medium capitalize">{audit.action.replace(/([A-Z])/g, ' $1').trim()}</p>
              {audit.details && <p className="mt-0.5 text-xs text-muted-foreground">{audit.details}</p>}
              <p className="mt-1 text-xs text-muted-foreground">{new Date(audit.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
