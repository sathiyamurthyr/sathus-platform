'use client';

import * as React from 'react';
import { MediaCard } from './MediaCard';
import type { MediaAsset } from '../lib/media-types';

export function MediaList({
  assets,
  selectedIds,
  onSelect,
  onDoubleClick,
}: {
  assets: MediaAsset[];
  selectedIds: Set<string>;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onDoubleClick: (id: string) => void;
}) {
  return (
    <div className="h-full overflow-auto admin-scrollbar">
      <div className="space-y-2 p-1">
        {assets.map((asset) => (
          <MediaCard
            key={asset.id}
            asset={asset}
            viewMode="list"
            isSelected={selectedIds.has(asset.id)}
            onSelect={onSelect}
            onDoubleClick={onDoubleClick}
          />
        ))}
      </div>
    </div>
  );
}
