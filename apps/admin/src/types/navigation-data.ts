import type {
  PlatformValue,
  MenuTypeValue,
  NodeItemTypeValue,
  TargetTypeValue,
  ReferenceKindValue,
  VisibilityRuleTypeValue,
  MenuStatusValue,
} from './navigation';

export interface NavigationLocalization {
  languageCode: string;
  displayName: string;
  routePath?: string;
  isFallback: boolean;
}

export interface NavigationPermission {
  permission: string;
  role?: string;
  requirement: string;
  effect: string;
}

export interface VisibilityRule {
  ruleType: string;
  value: string;
  effect: string;
}

export interface NavigationNode {
  id: string;
  parentId?: string;
  displayName: string;
  itemType: NodeItemTypeValue;
  routePath?: string;
  targetType: TargetTypeValue;
  targetUrl?: string;
  referenceKind: ReferenceKindValue;
  referenceId?: string;
  icon?: string;
  cssClass?: string;
  isExpanded: boolean;
  isHidden: boolean;
  isEnabled: boolean;
  sortOrder: number;
  depth: number;
  localizations: NavigationLocalization[];
  permissions: NavigationPermission[];
  visibilityRules: VisibilityRule[];
  children: NavigationNode[];
}

export interface NavigationMenuItem extends NavigationNode {
  nodeId: string;
}

export interface NavigationVersion {
  id: string;
  versionNumber: number;
  label: string;
  status: MenuStatusValue;
  createdBy?: string;
  createdAt: string;
  publishedAt?: string;
  scheduledAt?: string;
  isCurrent: boolean;
}

export interface NavigationRedirect {
  id: string;
  menuId: string;
  sourcePath: string;
  targetPath: string;
  redirectType: number;
  locale: string;
  priority: number;
  isEnabled: boolean;
}

export interface MenuSummary {
  id: string;
  name: string;
  menuType: MenuTypeValue;
  locale: string;
  status: MenuStatusValue;
  nodeCount: number;
  publishedVersionId?: string;
  scheduledPublishAt?: string;
}

export interface TreeSummary {
  id: string;
  platform: string;
  name: string;
  defaultLocale: string;
  description?: string;
  status: MenuStatusValue;
  menus: MenuSummary[];
}

export interface MenuDetail {
  id: string;
  treeId: string;
  name: string;
  menuType: MenuTypeValue;
  locale: string;
  status: MenuStatusValue;
  publishedVersionId?: string;
  scheduledPublishAt?: string;
  nodes: NavigationNode[];
}

export interface NavigationItem {
  id: string;
  nodeId: string;
  parentItemId?: string;
  displayName: string;
  routePath?: string;
  targetUrl?: string;
  targetType: TargetTypeValue;
  itemType: NodeItemTypeValue;
  referenceKind: ReferenceKindValue;
  referenceId?: string;
  sortOrder: number;
  depth: number;
  locale: string;
  icon?: string;
  cssClass?: string;
  isHidden: boolean;
  isEnabled: boolean;
  visibilityRules: VisibilityRule[];
  permissions: NavigationPermission[];
}

export interface VersionDto {
  id: string;
  versionNumber: number;
  label: string;
  status: MenuStatusValue;
  createdBy?: string;
  createdAt: string;
  publishedAt?: string;
  scheduledAt?: string;
  isCurrent: boolean;
}

export interface HistoryEntry {
  id: string;
  operation: string;
  menuId?: string;
  actorId?: string;
  payload: string;
  occurredAt: string;
  versionId?: string;
}

export interface BrokenRoute {
  id: string;
  menuId: string;
  routePath: string;
  targetUrl?: string;
  referenceKind: string;
  resolvedReferenceId?: string;
}

export interface PublishResult {
  menuId: string;
  versionId: string;
  itemCount: number;
  publishedAt: string;
}

export interface SearchResult {
  treeId: string;
  menuId: string;
  nodeId: string;
  displayName: string;
  routePath?: string;
  menuType: MenuTypeValue;
  referenceKind: ReferenceKindValue;
  referenceId?: string;
}
