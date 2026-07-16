'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTrees,
  getTree,
  createTree,
  archiveTree,
  getMenus,
  createMenu,
  getMenu,
  archiveMenu,
  restoreMenu,
  cloneMenu,
  createNode,
  updateNode,
  deleteNode,
  moveNode,
  copyNode,
  getVersions,
  createVersion,
  publishMenu,
  schedulePublish,
  previewMenu,
  rollbackMenu,
  searchNavigation,
  getHistory,
  getBrokenRoutes,
  getPublishedMenu,
} from '../../lib/navigation-api';
import type { NavWorkspaceState, TreeSummary, MenuSummary, MenuDetail, NavigationVersion, NavigationItem, HistoryEntry, BrokenRoute } from '../navigation-types';

export function useWorkspaceState() {
  const [state, setState] = React.useState<NavWorkspaceState>({
    selectedTreeId: null,
    selectedMenuId: null,
    selectedNodeId: null,
    activeTab: 'tree',
    filter: { search: '', menuType: '', status: '' },
    viewMode: 'tree',
    isDragging: false,
  });

  const set = React.useCallback(<K extends keyof NavWorkspaceState>(key: K, value: NavWorkspaceState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setActiveTab = React.useCallback((tab: NavWorkspaceState['activeTab']) => set('activeTab', tab), [set]);
  const setFilter = React.useCallback((filter: Partial<NavWorkspaceState['filter']>) => setState((prev) => ({ ...prev, filter: { ...prev.filter, ...filter } })), []);
  const setSelectedTree = React.useCallback((treeId: string | null) => set('selectedTreeId', treeId), [set]);
  const setSelectedMenu = React.useCallback((menuId: string | null) => set('selectedMenuId', menuId), [set]);
  const setSelectedNode = React.useCallback((nodeId: string | null) => set('selectedNodeId', nodeId), [set]);
  const setViewMode = React.useCallback((view: 'tree' | 'list') => set('viewMode', view), [set]);
  const setIsDragging = React.useCallback((isDragging: boolean) => set('isDragging', isDragging), [set]);

  return {
    ...state,
    setActiveTab,
    setFilter,
    setSelectedTree,
    setSelectedMenu,
    setSelectedNode,
    setViewMode,
    setIsDragging,
  };
}

export function useTrees(platform?: string) {
  return useQuery({
    queryKey: ['nav-trees', platform],
    queryFn: () => getTrees(platform),
    staleTime: 1000 * 60 * 2,
  });
}

export function useMenus(treeId: string) {
  return useQuery({
    queryKey: ['nav-menus', treeId],
    queryFn: () => getMenus(treeId),
    enabled: !!treeId,
    staleTime: 1000 * 30,
  });
}

export function useMenuDetail(menuId: string) {
  return useQuery({
    queryKey: ['nav-menu', menuId],
    queryFn: () => getMenu(menuId),
    enabled: !!menuId,
    staleTime: 1000 * 30,
  });
}

export function useVersions(menuId: string) {
  return useQuery({
    queryKey: ['nav-versions', menuId],
    queryFn: () => getVersions(menuId),
    enabled: !!menuId,
    staleTime: 1000 * 30,
  });
}

export function usePreview(menuId: string, versionId: string) {
  return useQuery({
    queryKey: ['nav-preview', menuId, versionId],
    queryFn: () => previewMenu(menuId, versionId),
    enabled: !!menuId && !!versionId,
    staleTime: 1000 * 30,
  });
}

export function useHistory(treeId: string, menuId?: string) {
  return useQuery({
    queryKey: ['nav-history', treeId, menuId],
    queryFn: () => getHistory(treeId, menuId),
    enabled: !!treeId,
    staleTime: 1000 * 60,
  });
}

export function useBrokenRoutes(menuId: string) {
  return useQuery({
    queryKey: ['nav-broken', menuId],
    queryFn: () => getBrokenRoutes(menuId),
    enabled: !!menuId,
    staleTime: 1000 * 60,
  });
}

export function useSearchNavigation(filters: { term?: string; menuType?: string; route?: string; title?: string; permission?: string }) {
  return useQuery({
    queryKey: ['nav-search', filters],
    queryFn: () => searchNavigation(filters),
    enabled: !!(filters.term || filters.menuType || filters.route || filters.title || filters.permission),
    staleTime: 1000 * 30,
  });
}

export function useCreateTree() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTree,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['nav-trees'] }),
  });
}

export function useCreateMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ treeId, ...rest }: { treeId: string } & Parameters<typeof createMenu>[0]) =>
      createMenu({ treeId, ...rest }),
    onSuccess: (_, { treeId }) => {
      qc.invalidateQueries({ queryKey: ['nav-menus', treeId] });
    },
  });
}

export function useArchiveTree() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: archiveTree,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['nav-trees'] }),
  });
}

export function useArchiveMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: archiveMenu,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['nav-menu'] }),
  });
}

export function useRestoreMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: restoreMenu,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['nav-menu'] }),
  });
}

export function useCloneMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...rest }: { id: string } & Parameters<typeof cloneMenu>[1]) => cloneMenu(id, rest),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['nav-trees'] }),
  });
}

export function useCreateNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, ...rest }: { menuId: string } & Record<string, unknown>) => createNode(menuId, rest),
    onSuccess: (_, { menuId }) => {
      qc.invalidateQueries({ queryKey: ['nav-menu', menuId] });
    },
  });
}

export function useUpdateNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, nodeId, ...rest }: { menuId: string; nodeId: string } & Record<string, unknown>) =>
      updateNode(menuId, nodeId, rest),
    onSuccess: (_, { menuId }) => {
      qc.invalidateQueries({ queryKey: ['nav-menu', menuId] });
    },
  });
}

export function useDeleteNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, nodeId }: { menuId: string; nodeId: string }) => deleteNode(menuId, nodeId),
    onSuccess: (_, { menuId }) => {
      qc.invalidateQueries({ queryKey: ['nav-menu', menuId] });
    },
  });
}

export function useMoveNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, nodeId, ...rest }: { menuId: string; nodeId: string } & { newParentId?: string; newOrder: number }) =>
      moveNode(menuId, nodeId, rest),
    onSuccess: (_, { menuId }) => {
      qc.invalidateQueries({ queryKey: ['nav-menu', menuId] });
    },
  });
}

export function useCopyNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, nodeId, ...rest }: { menuId: string; nodeId: string } & { newParentId?: string }) =>
      copyNode(menuId, nodeId, rest),
    onSuccess: (_, { menuId }) => {
      qc.invalidateQueries({ queryKey: ['nav-menu', menuId] });
    },
  });
}

export function useCreateVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, label }: { menuId: string; label: string }) => createVersion(menuId, label),
    onSuccess: (_, { menuId }) => {
      qc.invalidateQueries({ queryKey: ['nav-versions', menuId] });
    },
  });
}

export function usePublishMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, versionId }: { menuId: string; versionId: string }) => publishMenu(menuId, versionId),
    onSuccess: (_, { menuId }) => {
      qc.invalidateQueries({ queryKey: ['nav-versions', menuId] });
      qc.invalidateQueries({ queryKey: ['nav-preview'] });
    },
  });
}

export function useSchedulePublish() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, versionId, scheduledAt }: { menuId: string; versionId: string; scheduledAt: Date }) => schedulePublish(menuId, versionId, { scheduledAt }),
    onSuccess: (_, { menuId }) => {
      qc.invalidateQueries({ queryKey: ['nav-versions', menuId] });
    },
  });
}

export function useRollbackMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ menuId, ...rest }: { menuId: string } & { versionId: string }) => rollbackMenu(menuId, rest),
    onSuccess: (_, { menuId }) => {
      qc.invalidateQueries({ queryKey: ['nav-versions', menuId] });
    },
  });
}

export function usePublishedMenu(treeId: string, menuType: string, locale: string) {
  return useQuery({
    queryKey: ['nav-published', treeId, menuType, locale],
    queryFn: () => getPublishedMenu(treeId, menuType, locale),
    enabled: !!(treeId && menuType && locale),
    staleTime: 1000 * 60 * 5,
  });
}

export function useNavigationPermissions() {
  return {
    read: 'navigation.read',
    create: 'navigation.create',
    update: 'navigation.update',
    publish: 'navigation.publish',
    delete: 'navigation.delete',
    rollback: 'navigation.rollback',
  };
}
