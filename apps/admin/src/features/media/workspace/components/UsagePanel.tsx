'use client';

import * as React from 'react';
import { BarChart3 } from 'lucide-react';
import type { MediaUsage } from '../lib/media-types';

export function UsagePanel({ usage }: { usage: MediaUsage[] }) {
  const contextCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const u of usage) {
      counts[u.context] = (counts[u.context] ?? 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [usage]);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Usage</h3>
      <div className="flex items-center gap-2 rounded-lg border border-border p-3">
        <BarChart3 className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-2xl font-bold">{usage.length}</p>
          <p className="text-xs text-muted-foreground">Total references</p>
        </div>
      </div>
      {contextCounts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">By Context</h4>
          {contextCounts.map(([context, count]) => (
            <div key={context} className="flex items-center justify-between">
              <span className="text-xs capitalize">{context}</span>
              <span className="text-xs font-medium">{count}</span>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground">Recent References</h4>
        {usage.slice(0, 5).map((item) => (
          <div key={item.id} className="rounded-md border border-border p-2">
            <p className="text-xs font-medium">{item.title ?? item.referenceType}</p>
            <p className="text-xs text-muted-foreground">{item.context}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
