import type { NavigationNode, MenuDetail, NavigationItem, NavigationVersion, MenuSummary, TreeSummary, NavigationRedirect, BrokenRoute, HistoryEntry, VersionDto, PublishResult, SearchResult } from '@/types/navigation-data';
import type { NodeItemTypeValue, TargetTypeValue, ReferenceKindValue, VisibilityRuleTypeValue } from '@/types/navigation';

export interface DragItem {
  id: string;
  parentId?: string;
  sortOrder: number;
}

export interface TreeFilterState {
  search: string;
  menuType: string;
  status: string;
}

export interface NavWorkspaceState {
  selectedTreeId: string | null;
  selectedMenuId: string | null;
  selectedNodeId: string | null;
  activeTab: 'tree' | 'versions' | 'routes' | 'permissions' | 'localization' | 'preview' | 'history';
  filter: TreeFilterState;
  viewMode: 'tree' | 'list';
  isDragging: boolean;
}

export type { NavigationNode, MenuDetail, NavigationItem, NavigationVersion, MenuSummary, TreeSummary, NavigationRedirect, BrokenRoute, HistoryEntry, VersionDto, PublishResult, SearchResult, NodeItemTypeValue, TargetTypeValue, ReferenceKindValue, VisibilityRuleTypeValue };
