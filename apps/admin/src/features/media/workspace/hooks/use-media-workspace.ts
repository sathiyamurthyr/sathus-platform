'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MediaSearchFilters, BulkActionResult } from '../lib/media-types';

import {
  getFolderTree,
  getMediaAssets,
  getMediaAssetById,
  searchMediaAssets,
  getMediaUsage,
  getMediaRelations,
  getMediaVersions,
  getMediaAudits,
  getMediaShares,
  getMediaPermissions,
  getMediaMetadata,
  archiveMedia,
  restoreMedia,
  deleteMedia,
  updateMediaMetadata,
  createFolder,
  getUploadQueue,
  bulkArchive,
  bulkRestore,
  bulkDelete,
  bulkMove,
  bulkCopy,
  bulkAddTags,
  bulkAddToCollection,
  bulkDownload,
  getOrphanAssets,
  getBrokenReferences,
} from '../lib/media-api';

export function useFolderTree(tenantId?: string) {
  return useQuery({
    queryKey: ['media-folders', tenantId],
    queryFn: () => getFolderTree(tenantId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useMediaAssets(params: {
  folderId?: string;
  type?: string;
  status?: string;
  tagId?: string;
  term?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ['media-assets', params],
    queryFn: () => getMediaAssets(params),
    staleTime: 1000 * 30,
  });
}

export function useMediaAsset(id: string | undefined) {
  return useQuery({
    queryKey: ['media-asset', id],
    queryFn: () => getMediaAssetById(id!),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
}

export function useMediaSearch(filters: MediaSearchFilters, page = 1, pageSize = 25) {
  return useQuery({
    queryKey: ['media-search', filters, page, pageSize],
    queryFn: () => searchMediaAssets(filters, page, pageSize),
    staleTime: 1000 * 30,
    enabled: !!filters.term || !!filters.types?.length || !!filters.tags?.length || !!filters.folderId || !!filters.unused || !!filters.broken,
  });
}

export function useMediaUsage(id: string | undefined) {
  return useQuery({
    queryKey: ['media-usage', id],
    queryFn: () => getMediaUsage(id!),
    enabled: !!id,
  });
}

export function useMediaRelations(id: string | undefined) {
  return useQuery({
    queryKey: ['media-relations', id],
    queryFn: () => getMediaRelations(id!),
    enabled: !!id,
  });
}

export function useMediaVersions(id: string | undefined) {
  return useQuery({
    queryKey: ['media-versions', id],
    queryFn: () => getMediaVersions(id!),
    enabled: !!id,
  });
}

export function useMediaAudits(id: string | undefined) {
  return useQuery({
    queryKey: ['media-audits', id],
    queryFn: () => getMediaAudits(id!),
    enabled: !!id,
  });
}

export function useMediaShares(id: string | undefined) {
  return useQuery({
    queryKey: ['media-shares', id],
    queryFn: () => getMediaShares(id!),
    enabled: !!id,
  });
}

export function useMediaPermissions(id: string | undefined) {
  return useQuery({
    queryKey: ['media-permissions', id],
    queryFn: () => getMediaPermissions(id!),
    enabled: !!id,
  });
}

export function useMediaMetadata(id: string | undefined) {
  return useQuery({
    queryKey: ['media-metadata', id],
    queryFn: () => getMediaMetadata(id!),
    enabled: !!id,
  });
}

export function useUploadQueue() {
  return useQuery({
    queryKey: ['upload-queue'],
    queryFn: getUploadQueue,
    refetchInterval: 2000,
    staleTime: 0,
  });
}

export function useOrphanAssets(page = 1, pageSize = 50) {
  return useQuery({
    queryKey: ['media-orphans', page, pageSize],
    queryFn: () => getOrphanAssets(page, pageSize),
    staleTime: 1000 * 60,
  });
}

export function useBrokenReferences(page = 1, pageSize = 50) {
  return useQuery({
    queryKey: ['media-broken', page, pageSize],
    queryFn: () => getBrokenReferences(page, pageSize),
    staleTime: 1000 * 60,
  });
}

export function useArchiveMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: archiveMedia,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media-assets'] });
      qc.invalidateQueries({ queryKey: ['media-search'] });
      qc.invalidateQueries({ queryKey: ['media-orphans'] });
    },
  });
}

export function useRestoreMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: restoreMedia,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media-assets'] });
      qc.invalidateQueries({ queryKey: ['media-search'] });
    },
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media-assets'] });
      qc.invalidateQueries({ queryKey: ['media-search'] });
      qc.invalidateQueries({ queryKey: ['media-orphans'] });
    },
  });
}

export function useUpdateMediaMetadata() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateMediaMetadata>[1] }) =>
      updateMediaMetadata(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['media-asset', id] });
      qc.invalidateQueries({ queryKey: ['media-assets'] });
      qc.invalidateQueries({ queryKey: ['media-search'] });
    },
  });
}

export function useCreateFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ name, parentFolderId }: { name: string; parentFolderId?: string }) =>
      createFolder(name, parentFolderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media-folders'] });
    },
  });
}

type BulkActionFn = (ids: string[]) => Promise<BulkActionResult>;

export function useBulkAction(name: string, actionFn: BulkActionFn) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: actionFn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media-assets'] });
      qc.invalidateQueries({ queryKey: ['media-search'] });
      qc.invalidateQueries({ queryKey: ['media-orphans'] });
    },
  });
}

export function useBulkArchive() {
  return useBulkAction('bulk-archive', bulkArchive);
}

export function useBulkRestore() {
  return useBulkAction('bulk-restore', bulkRestore);
}

export function useBulkDelete() {
  return useBulkAction('bulk-delete', bulkDelete);
}

export function useBulkMove() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, folderId }: { ids: string[]; folderId: string }) => bulkMove(ids, folderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media-assets'] });
      qc.invalidateQueries({ queryKey: ['media-search'] });
    },
  });
}

export function useBulkCopy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, folderId }: { ids: string[]; folderId: string }) => bulkCopy(ids, folderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media-assets'] });
      qc.invalidateQueries({ queryKey: ['media-search'] });
    },
  });
}

export function useBulkAddTags() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, tagIds }: { ids: string[]; tagIds: string[] }) => bulkAddTags(ids, tagIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media-assets'] });
      qc.invalidateQueries({ queryKey: ['media-search'] });
    },
  });
}

export function useBulkAddToCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, collectionId }: { ids: string[]; collectionId: string }) =>
      bulkAddToCollection(ids, collectionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media-assets'] });
      qc.invalidateQueries({ queryKey: ['media-search'] });
    },
  });
}

export function useBulkDownload() {
  return useMutation({
    mutationFn: bulkDownload,
  });
}

export function usePrefetchMediaAsset() {
  const qc = useQueryClient();
  return (id: string) => {
    qc.prefetchQuery({
      queryKey: ['media-asset', id],
      queryFn: () => getMediaAssetById(id),
      staleTime: 1000 * 30,
    });
  };
}

export function useMediaWorkspaceState() {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [currentFolderId, setCurrentFolderId] = React.useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list' | 'masonry'>('grid');
  const [searchFilters, setSearchFilters] = React.useState<MediaSearchFilters>({});
  const [sortField, setSortField] = React.useState<'name' | 'createdAt' | 'updatedAt' | 'size' | 'type'>('updatedAt');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const [inspectorAssetId, setInspectorAssetId] = React.useState<string | undefined>(undefined);
  const [isInspectorOpen, setIsInspectorOpen] = React.useState(true);
  const [activeView, setActiveView] = React.useState<'all' | 'favorites' | 'recent' | 'shared' | 'trash' | 'collections' | 'orphans' | 'broken'>('all');

  const toggleSelect = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = React.useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = React.useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = React.useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const selectionCount = selectedIds.size;

  return {
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    isSelected,
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
    setSortDirection,
    inspectorAssetId,
    setInspectorAssetId,
    isInspectorOpen,
    setIsInspectorOpen,
    activeView,
    setActiveView,
  };
}
