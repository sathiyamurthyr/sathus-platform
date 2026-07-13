export type MediaType = 'Image' | 'Video' | 'Audio' | 'Document' | 'Archive' | 'Other';
export type MediaStatus = 'Pending' | 'Processing' | 'Ready' | 'Error' | 'Archived' | 'Deleted';
export type MediaViewMode = 'grid' | 'list' | 'masonry';
export type SortField = 'name' | 'createdAt' | 'updatedAt' | 'size' | 'type';
export type SortDirection = 'asc' | 'desc';

export interface MediaAsset {
  id: string;
  fileName: string;
  fileExtension: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
  storageKey: string;
  altText?: string;
  type: MediaType;
  status: MediaStatus;
  language: string;
  width?: number;
  height?: number;
  durationSeconds?: number;
  hash?: string;
  folderId?: string;
  ownerId?: string;
  tenantId?: string;
  title?: string;
  description?: string;
  tags: MediaTag[];
  usageCount: number;
  versionCount: number;
  metadataCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MediaTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  tenantId?: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentFolderId?: string;
  tenantId?: string;
  sortOrder: number;
  children: MediaFolder[];
  assetCount?: number;
}

export interface MediaCollection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverAssetId?: string;
  isPublished: boolean;
  assetCount: number;
}

export interface MediaUsage {
  id: string;
  assetId: string;
  context: string;
  referenceType: string;
  referenceId: string;
  url?: string;
  title?: string;
}

export interface MediaVersion {
  id: string;
  assetId: string;
  versionNumber: number;
  fileName: string;
  fileExtension: string;
  mimeType: string;
  sizeBytes: number;
  checksum: string;
  storageKey: string;
  note?: string;
  createdAt: string;
}

export interface MediaAudit {
  id: string;
  assetId?: string;
  action: string;
  actorId?: string;
  details?: string;
  ipAddress?: string;
  correlationId?: string;
  createdAt: string;
}

export interface MediaShare {
  id: string;
  assetId: string;
  shareType: 'User' | 'Link';
  sharedWith: string;
  accessLevel: 'View' | 'Edit';
  token?: string;
  expiresAt?: string;
  isRevoked: boolean;
}

export interface MediaPermission {
  id: string;
  assetId?: string;
  folderId?: string;
  tenantId?: string;
  principalId: string;
  principalType: 'User' | 'Role';
  permission: string;
  grantedBy?: string;
  expiresAt?: string;
}

export interface MediaMetadata {
  id: string;
  assetId: string;
  key: string;
  value: string;
  language?: string;
}

export interface FolderTreeNode {
  id: string;
  name: string;
  slug: string;
  parentFolderId?: string;
  sortOrder: number;
  children: FolderTreeNode[];
}

export interface FolderTreeResponse {
  roots: FolderTreeNode[];
}

export interface MediaListResponse {
  items: MediaAsset[];
  page: number;
  pageSize: number;
  total: number;
}

export interface MediaSearchFilters {
  term?: string;
  types?: MediaType[];
  tags?: string[];
  folderId?: string;
  status?: MediaStatus;
  language?: string;
  from?: string;
  to?: string;
  owner?: string;
  favorites?: boolean;
  unused?: boolean;
  broken?: boolean;
}

export interface BulkActionResult {
  successCount: number;
  failureCount: number;
  failures: Array<{ id: string; reason: string }>;
}

export interface UploadQueueItem {
  id: string;
  sessionId: string;
  fileName: string;
  fileExtension: string;
  mimeType: string;
  sizeBytes: number;
  progress: number;
  status: 'Pending' | 'Uploading' | 'Paused' | 'Completed' | 'Failed' | 'Cancelled';
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  folderId?: string;
}

export interface PermissionCheck {
  canRead: boolean;
  canUpload: boolean;
  canDelete: boolean;
  canArchive: boolean;
  canShare: boolean;
  canRestore: boolean;
}
