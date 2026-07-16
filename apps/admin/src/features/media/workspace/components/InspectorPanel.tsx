'use client';

import * as React from 'react';
import { MediaPreview } from './MediaPreview';
import { MetadataPanel } from './MetadataPanel';
import { UsagePanel } from './UsagePanel';
import { RelationshipPanel } from './RelationshipPanel';
import { VersionPanel } from './VersionPanel';
import { ActivityTimeline } from './ActivityTimeline';
import type { MediaAsset, MediaMetadata, MediaUsage, MediaVersion, MediaAudit } from '../lib/media-types';
import { InspectorSkeleton } from './LoadingSkeleton';

export function InspectorPanel({
  asset,
  metadata,
  usage,
  relations,
  versions,
  audits,
  isLoading,
}: {
  asset?: MediaAsset;
  metadata: MediaMetadata[];
  usage: MediaUsage[];
  relations: MediaUsage[];
  versions: MediaVersion[];
  audits: MediaAudit[];
  isLoading?: boolean;
}) {
  const [activeTab, setActiveTab] = React.useState('preview');

  if (isLoading) {
    return <div className="h-full overflow-y-auto admin-scrollbar p-4"><InspectorSkeleton /></div>;
  }

  if (!asset) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-muted-foreground">
        <div>
          <p className="text-sm">Select an asset to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-border px-4 pt-2">
        {['preview', 'metadata', 'usage', 'relations', 'versions', 'activity'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'border-b-2 px-3 py-2 text-xs font-medium transition-colors',
              activeTab === tab
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto admin-scrollbar p-4">
        {activeTab === 'preview' && <MediaPreview asset={asset} onClose={() => {}} />}
        {activeTab === 'metadata' && <MetadataPanel asset={asset} metadata={metadata} />}
        {activeTab === 'usage' && <UsagePanel usage={usage} />}
        {activeTab === 'relations' && <RelationshipPanel relations={relations} />}
        {activeTab === 'versions' && <VersionPanel versions={versions} />}
        {activeTab === 'activity' && <ActivityTimeline audits={audits} />}
      </div>
    </div>
  );
}

function cn(...inputs: (string | undefined | false | null)[]): string {
  return inputs.filter(Boolean).join(' ');
}
