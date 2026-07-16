'use client';

import * as React from 'react';
import { MediaCard } from './MediaCard';
import type { MediaAsset, MediaViewMode } from '../lib/media-types';

export function MediaGrid({
  assets,
  viewMode,
  selectedIds,
  onSelect,
  onDoubleClick,
}: {
  assets: MediaAsset[];
  viewMode: MediaViewMode;
  selectedIds: Set<string>;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onDoubleClick: (id: string) => void;
}) {
  const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: 48 });
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const parentRef = React.useRef<HTMLDivElement>(null);
  const itemHeight = viewMode === 'list' ? 72 : 220;
  const itemsPerRow = viewMode === 'list' ? 1 : 6;
  const totalRows = Math.ceil(assets.length / itemsPerRow);

  React.useEffect(() => {
    const parent = parentRef.current;
    if (!parent || viewMode === 'list') return;

    const handleScroll = () => {
      const scrollTop = parent.scrollTop;
      const viewportHeight = parent.clientHeight;
      const startRow = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
      const endRow = Math.min(totalRows, Math.ceil((scrollTop + viewportHeight) / itemHeight) + 2);
      const startIndex = startRow * itemsPerRow;
      const endIndex = Math.min(assets.length, endRow * itemsPerRow);
      setVisibleRange({ start: startIndex, end: endIndex });
    };

    handleScroll();
    parent.addEventListener('scroll', handleScroll, { passive: true });
    return () => parent.removeEventListener('scroll', handleScroll);
  }, [assets.length, itemHeight, itemsPerRow, totalRows, viewMode]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const cols = viewMode === 'list' ? 1 : (parentRef.current?.clientWidth ?? 800) > 1280 ? 6 : parentRef.current?.clientWidth ?? 800 > 1024 ? 5 : parentRef.current?.clientWidth ?? 800 > 768 ? 4 : parentRef.current?.clientWidth ?? 800 > 640 ? 3 : 2;
        let nextIndex = focusedIndex;
        if (e.key === 'ArrowDown') nextIndex = Math.min(assets.length - 1, focusedIndex + cols);
        else if (e.key === 'ArrowUp') nextIndex = Math.max(0, focusedIndex - cols);
        else if (e.key === 'ArrowRight') nextIndex = Math.min(assets.length - 1, focusedIndex + 1);
        else if (e.key === 'ArrowLeft') nextIndex = Math.max(0, focusedIndex - 1);

        setFocusedIndex(nextIndex);
        if (nextIndex >= 0) {
          onDoubleClick(assets[nextIndex].id);
          const el = parentRef.current?.querySelector(`[data-asset-id="${assets[nextIndex].id}"]`);
          el?.scrollIntoView({ block: 'nearest' });
        }
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < assets.length) {
          onSelect(assets[focusedIndex].id, e as unknown as React.MouseEvent);
        }
      }
    },
    [assets, focusedIndex, onDoubleClick, onSelect, viewMode]
  );

  const visibleAssets = assets.slice(visibleRange.start, visibleRange.end);
  const totalHeight = totalRows * itemHeight;
  const offsetY = Math.floor(visibleRange.start / itemsPerRow) * itemHeight;

  if (assets.length === 0) return null;

  if (viewMode === 'list') {
    return (
      <div
        ref={parentRef}
        className="h-full overflow-auto admin-scrollbar"
        role="listbox"
        aria-label="Media assets"
        onKeyDown={handleKeyDown}
      >
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

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto admin-scrollbar"
      role="listbox"
      aria-label="Media assets"
      onKeyDown={handleKeyDown}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          {visibleAssets.map((asset) => (
            <MediaCard
              key={asset.id}
              asset={asset}
              viewMode="grid"
              isSelected={selectedIds.has(asset.id)}
              onSelect={onSelect}
              onDoubleClick={onDoubleClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
