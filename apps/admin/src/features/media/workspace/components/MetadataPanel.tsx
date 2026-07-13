'use client';

import * as React from 'react';
import type { MediaAsset, MediaMetadata } from '../lib/media-types';

export function MetadataPanel({ asset, metadata }: { asset: MediaAsset; metadata: MediaMetadata[] }) {
  const fields = [
    { label: 'File Name', value: asset.fileName },
    { label: 'MIME Type', value: asset.mimeType },
    { label: 'Size', value: `${(asset.sizeBytes / 1024 / 1024).toFixed(2)} MB` },
    { label: 'Checksum', value: asset.checksum },
    { label: 'Storage Key', value: asset.storageKey },
    { label: 'Dimensions', value: asset.width && asset.height ? `${asset.width} x ${asset.height}` : 'N/A' },
    { label: 'Duration', value: asset.durationSeconds ? `${asset.durationSeconds.toFixed(2)}s` : 'N/A' },
    { label: 'Status', value: asset.status },
    { label: 'Language', value: asset.language },
    { label: 'Created', value: new Date(asset.createdAt).toLocaleString() },
    { label: 'Updated', value: new Date(asset.updatedAt).toLocaleString() },
    { label: 'Alt Text', value: asset.altText ?? 'None' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Metadata</h3>
      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field.label} className="flex items-start justify-between gap-2">
            <span className="text-xs text-muted-foreground">{field.label}</span>
            <span className="max-w-[60%] truncate text-xs" title={field.value}>{field.value}</span>
          </div>
        ))}
      </div>
      {metadata.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Custom Metadata</h4>
          {metadata.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-2">
              <span className="text-xs text-muted-foreground">{item.key}</span>
              <span className="max-w-[60%] truncate text-xs" title={item.value}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
