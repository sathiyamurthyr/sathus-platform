'use client';

import * as React from 'react';
import { FolderTree } from '@/features/media/workspace/components/FolderTree';
import { FolderBreadcrumb } from '@/features/media/workspace/components/FolderBreadcrumb';
import { MediaToolbar } from '@/features/media/workspace/components/MediaToolbar';
import { MediaGrid } from '@/features/media/workspace/components/MediaGrid';
import { MediaList } from '@/features/media/workspace/components/MediaList';
import { SelectionToolbar } from '@/features/media/workspace/components/SelectionToolbar';
import { InspectorPanel } from '@/features/media/workspace/components/InspectorPanel';
import { UploadQueuePanel } from '@/features/media/workspace/components/UploadQueuePanel';
import { EmptyState } from '@/features/media/workspace/components/EmptyState';
import { ErrorState } from '@/features/media/workspace/components/ErrorState';
import { LoadingSkeleton } from '@/features/media/workspace/components/LoadingSkeleton';
import { UploadManager } from '../upload/components/UploadManager';
import type { FolderTreeNode } from './lib/media-types';
import { useFolderTree, useMediaAssets, useMediaAsset, useMediaSearch, useMediaUsage, useMediaRelations, useMediaVersions, useMediaAudits, useMediaMetadata, useUploadQueue, useBulkArchive, useBulkRestore, useBulkDelete, useBulkMove, useBulkCopy, useBulkDownload, useOrphanAssets, useBrokenReferences, useMediaWorkspaceState } from './hooks/use-media-workspace';
import { XCircle } from 'lucide-react';

export function MediaWorkspace() {
  const {
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    selectionCount,
    currentFolderId,
    setCurrentFolderId,
    viewMode,
    setViewMode,
    searchFilters,
    setSearchFilters,
    sortField,
    setSortField,
    sortDirection,
    inspectorAssetId,
    setInspectorAssetId,
    isInspectorOpen,
    setIsInspectorOpen,
    activeView,
    setActiveView,
  } = useMediaWorkspaceState();

  const folderTreeQuery = useFolderTree();

  const orphanQuery = useOrphanAssets();
  const brokenQuery = useBrokenReferences();

  const assetsQuery = useMediaAssets({
    folderId: currentFolderId,
    type: searchFilters.types?.[0],
    status: searchFilters.status,
    tagId: searchFilters.tags?.[0],
    term: searchFilters.term,
    page: 1,
    pageSize: 100,
  });

  const searchQuery = useMediaSearch(searchFilters, 1, 100);
  const selectedAssetQuery = useMediaAsset(inspectorAssetId);
  const usageQuery = useMediaUsage(inspectorAssetId);
  const relationsQuery = useMediaRelations(inspectorAssetId);
  const versionsQuery = useMediaVersions(inspectorAssetId);
  const auditsQuery = useMediaAudits(inspectorAssetId);
  const metadataQuery = useMediaMetadata(inspectorAssetId);
  const uploadQueueQuery = useUploadQueue();

  const archiveMutation = useBulkArchive();
  const restoreMutation = useBulkRestore();
  const deleteMutation = useBulkDelete();
  const moveMutation = useBulkMove();
  const copyMutation = useBulkCopy();
  const downloadMutation = useBulkDownload();

  const assets = React.useMemo(() => {
    const base = searchQuery.data?.items ?? assetsQuery.data?.items ?? [];
    if (activeView === 'trash') return base.filter((a) => a.status === 'Archived' || a.status === 'Deleted');
    if (activeView === 'orphans') return orphanQuery.data?.items ?? [];
    if (activeView === 'broken') return brokenQuery.data?.items ?? [];
    return base;
  }, [activeView, searchQuery.data, assetsQuery.data, brokenQuery.data, orphanQuery.data]);

  const folders = React.useMemo(() => folderTreeQuery.data?.roots ?? [], [folderTreeQuery.data]);
  const folderMap = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; parentId?: string }>();
    const flatten = (nodes: FolderTreeNode[]) => {
      for (const node of nodes) {
        map.set(node.id, { id: node.id, name: node.name, parentId: node.parentFolderId });
        flatten(node.children);
      }
    };
    flatten(folders);
    return map;
  }, [folders]);

  const isLoading = assetsQuery.isLoading || searchQuery.isLoading || orphanQuery.isLoading || brokenQuery.isLoading;
  const isError = assetsQuery.isError || searchQuery.isError || orphanQuery.isError || brokenQuery.isError;

  const handleAssetDoubleClick = React.useCallback((id: string) => {
    setInspectorAssetId(id);
    setIsInspectorOpen(true);
  }, [setInspectorAssetId, setIsInspectorOpen]);

  const handleAssetClick = React.useCallback((id: string, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      toggleSelect(id);
    } else if (e.shiftKey && selectedIds.size > 0) {
      const lastSelected = Array.from(selectedIds).pop();
      if (lastSelected) {
        const currentIndex = assets.findIndex((a) => a.id === id);
        const lastIndex = assets.findIndex((a) => a.id === lastSelected);
        const [start, end] = [Math.min(currentIndex, lastIndex), Math.max(currentIndex, lastIndex)];
        const idsToSelect = assets.slice(start, end + 1).map((a) => a.id);
        selectAll(idsToSelect);
      }
    } else {
      toggleSelect(id);
    }
  }, [assets, selectedIds, selectAll, toggleSelect]);

  const handleArchive = React.useCallback(async () => {
    if (selectionCount === 0) return;
    await archiveMutation.mutateAsync(Array.from(selectedIds));
    clearSelection();
  }, [archiveMutation, clearSelection, selectedIds, selectionCount]);

  const handleRestore = React.useCallback(async () => {
    if (selectionCount === 0) return;
    await restoreMutation.mutateAsync(Array.from(selectedIds));
    clearSelection();
  }, [restoreMutation, clearSelection, selectedIds, selectionCount]);

  const handleDelete = React.useCallback(async () => {
    if (selectionCount === 0) return;
    await deleteMutation.mutateAsync(Array.from(selectedIds));
    clearSelection();
    if (inspectorAssetId && selectedIds.has(inspectorAssetId)) {
      setInspectorAssetId(undefined);
    }
  }, [deleteMutation, clearSelection, inspectorAssetId, selectedIds, selectionCount, setInspectorAssetId]);

  const handleMove = React.useCallback(async () => {
    if (selectionCount === 0) return;
    const folderId = prompt('Enter destination folder ID:');
    if (!folderId) return;
    await moveMutation.mutateAsync({ ids: Array.from(selectedIds), folderId });
    clearSelection();
  }, [clearSelection, moveMutation, selectedIds, selectionCount]);

  const handleCopy = React.useCallback(async () => {
    if (selectionCount === 0) return;
    const folderId = prompt('Enter destination folder ID:');
    if (!folderId) return;
    await copyMutation.mutateAsync({ ids: Array.from(selectedIds), folderId });
    clearSelection();
  }, [clearSelection, copyMutation, selectedIds, selectionCount]);

  const handleDownload = React.useCallback(async () => {
    if (selectionCount === 0) return;
    const result = await downloadMutation.mutateAsync(Array.from(selectedIds));
    result.urls.forEach((url) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = url.split('/').pop() ?? 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }, [downloadMutation, selectedIds, selectionCount]);

  const handleUpload = React.useCallback(() => {
    setShowUploadManager(true);
  }, []);

  const [showUploadManager, setShowUploadManager] = React.useState(false);

  return (
    <div className="flex h-full">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-border p-3">
            <h2 className="text-sm font-semibold">Media Library</h2>
          </div>
          <div className="flex-1 overflow-y-auto admin-scrollbar p-2">
            <FolderTree tree={folders} selectedId={currentFolderId} onSelect={(id) => { setCurrentFolderId(id); setActiveView('all'); }} activeView={activeView} onViewChange={(view) => setActiveView(view as typeof activeView)} />
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <div className="border-b border-border px-4 py-2">
          <FolderBreadcrumb folderId={currentFolderId} folders={folderMap} onNavigate={(id) => { setCurrentFolderId(id); setActiveView('all'); }} />
        </div>
        <MediaToolbar
          searchTerm={searchFilters.term ?? ''}
          onSearchChange={(term) => setSearchFilters({ ...searchFilters, term })}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={setSortField}
          filters={searchFilters}
          onFiltersChange={setSearchFilters}
          onUpload={handleUpload}
        />
        {selectionCount > 0 && (
          <SelectionToolbar
            count={selectionCount}
            onClear={clearSelection}
            onArchive={handleArchive}
            onRestore={handleRestore}
            onDelete={handleDelete}
            onMove={handleMove}
            onCopy={handleCopy}
            onDownload={handleDownload}
          />
        )}
        <div className="flex-1 overflow-hidden">
          {isLoading && <LoadingSkeleton />}
          {isError && <ErrorState onRetry={() => { assetsQuery.refetch(); searchQuery.refetch(); orphanQuery.refetch(); brokenQuery.refetch(); }} />}
          {!isLoading && !isError && assets.length === 0 && (
            <EmptyState title="No assets found" description="Try adjusting your search or upload new assets." />
          )}
          {!isLoading && !isError && assets.length > 0 && (
            viewMode === 'list' ? (
              <MediaList
                assets={assets}
                selectedIds={selectedIds}
                onSelect={handleAssetClick}
                onDoubleClick={handleAssetDoubleClick}
              />
            ) : (
              <MediaGrid
                assets={assets}
                viewMode={viewMode}
                selectedIds={selectedIds}
                onSelect={handleAssetClick}
                onDoubleClick={handleAssetDoubleClick}
              />
            )
          )}
        </div>
        <UploadQueuePanel items={uploadQueueQuery.data ?? []} />
      </div>

      {isInspectorOpen && (
        <aside className="hidden w-80 shrink-0 border-l border-border bg-card lg:block">
          <InspectorPanel
            asset={selectedAssetQuery.data}
            metadata={metadataQuery.data ?? []}
            usage={usageQuery.data ?? []}
            relations={relationsQuery.data ?? []}
            versions={versionsQuery.data ?? []}
            audits={auditsQuery.data ?? []}
            isLoading={selectedAssetQuery.isLoading}
          />
        </aside>
      )}

      {showUploadManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg border border-border bg-background shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold">Upload Manager</h3>
              <button
                onClick={() => setShowUploadManager(false)}
                className="rounded-md p-1 hover:bg-muted"
                aria-label="Close upload manager"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <UploadManager />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
