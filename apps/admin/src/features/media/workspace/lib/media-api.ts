import type {
  MediaAsset,
  MediaFolder,
  FolderTreeResponse,
  MediaListResponse,
  MediaSearchFilters,
  MediaUsage,
  MediaVersion,
  MediaAudit,
  MediaShare,
  MediaPermission,
  MediaMetadata,
  UploadQueueItem,
  BulkActionResult,
} from './media-types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

function shouldFetchApi(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.location.protocol === 'https:' && API_BASE.startsWith('http://localhost')) {
    return false;
  }
  return true;
}

function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...getAuthHeaders(), ...init?.headers },
    credentials: 'include',
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error((error as { message?: string }).message ?? `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

const DEFAULT_FOLDERS: FolderTreeResponse = {
  roots: [
    { id: 'branding', name: 'Logos & Branding', slug: 'branding', sortOrder: 0, children: [] },
    { id: 'invoices', name: 'Invoices & Documents', slug: 'invoices', sortOrder: 1, children: [] },
    { id: 'servers', name: 'Server Architecture', slug: 'servers', sortOrder: 2, children: [] },
    { id: 'products', name: 'Product Graphics', slug: 'products', sortOrder: 3, children: [] },
  ],
};

const SEED_ASSETS: MediaAsset[] = [
  {
    id: 'asset_sathus_logo',
    fileName: 'sathus-logo.png',
    fileExtension: 'png',
    mimeType: 'image/png',
    sizeBytes: 114342,
    checksum: 'sha256:sathuslogo001',
    storageKey: '/brand/sathus-logo.png',
    title: 'Sathus Technology Official Brand Emblem',
    type: 'Image',
    status: 'Ready',
    language: 'en',
    tags: [{ id: 't1', name: 'Branding', slug: 'branding' }],
    usageCount: 24,
    versionCount: 1,
    metadataCount: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'asset_sathus_seal',
    fileName: 'sathus-seal.png',
    fileExtension: 'png',
    mimeType: 'image/png',
    sizeBytes: 196000,
    checksum: 'sha256:sathusseal001',
    storageKey: '/brand/sathus-seal.png',
    title: 'Sathus Technology Official Round Seal & Stamp',
    type: 'Image',
    status: 'Ready',
    language: 'en',
    tags: [
      { id: 't1', name: 'Branding', slug: 'branding' },
      { id: 't3', name: 'Legal', slug: 'legal' },
    ],
    usageCount: 18,
    versionCount: 1,
    metadataCount: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'asset_server_spec',
    fileName: 'server-architecture-topology.png',
    fileExtension: 'png',
    mimeType: 'image/png',
    sizeBytes: 85200,
    checksum: 'sha256:serverarch002',
    storageKey: 'servers/server-architecture-topology.png',
    title: 'Enterprise Application & DB Server Topology',
    type: 'Image',
    status: 'Ready',
    language: 'en',
    tags: [{ id: 't2', name: 'Infrastructure', slug: 'infra' }],
    usageCount: 5,
    versionCount: 1,
    metadataCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getStoredMediaAssets(): MediaAsset[] {
  if (typeof window === 'undefined') return SEED_ASSETS;
  try {
    const raw = localStorage.getItem('sathus_media_assets');
    if (!raw) {
      localStorage.setItem('sathus_media_assets', JSON.stringify(SEED_ASSETS));
      return SEED_ASSETS;
    }
    const parsed: MediaAsset[] = JSON.parse(raw);
    const hasLogo = parsed.some((a) => a.id === 'asset_sathus_logo' || a.fileName === 'sathus-logo.png');
    const hasSeal = parsed.some((a) => a.id === 'asset_sathus_seal' || a.fileName === 'sathus-seal.png');
    if (!hasLogo || !hasSeal) {
      const merged = [
        ...SEED_ASSETS.filter((s) => !parsed.some((p) => p.id === s.id)),
        ...parsed,
      ];
      localStorage.setItem('sathus_media_assets', JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch {
    return SEED_ASSETS;
  }
}

export function saveStoredMediaAssets(assets: MediaAsset[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('sathus_media_assets', JSON.stringify(assets));
  } catch (err) {
    console.warn('[Media] Failed to persist assets to localStorage:', err);
  }
}

export async function getFolderTree(tenantId?: string): Promise<FolderTreeResponse> {
  if (shouldFetchApi()) {
    try {
      const qs = tenantId ? `?tenantId=${tenantId}` : '';
      return await request<FolderTreeResponse>(`/api/v1/media/folders${qs}`);
    } catch {
      // Fall through
    }
  }
  return DEFAULT_FOLDERS;
}

export async function getMediaAssets(params: {
  folderId?: string;
  type?: string;
  status?: string;
  tagId?: string;
  term?: string;
  page?: number;
  pageSize?: number;
}): Promise<MediaListResponse> {
  if (shouldFetchApi()) {
    try {
      const qs = new URLSearchParams();
      if (params.folderId) qs.set('folderId', params.folderId);
      if (params.type) qs.set('type', params.type);
      if (params.status) qs.set('status', params.status);
      if (params.tagId) qs.set('tagId', params.tagId);
      if (params.term) qs.set('term', params.term);
      if (params.page) qs.set('page', String(params.page));
      if (params.pageSize) qs.set('pageSize', String(params.pageSize));
      const query = qs.toString();
      return await request<MediaListResponse>(`/api/v1/media${query ? `?${query}` : ''}`);
    } catch {
      // Fall through
    }
  }

  let assets = getStoredMediaAssets();
  if (params.term) {
    const t = params.term.toLowerCase();
    assets = assets.filter((a) => (a.title || a.fileName).toLowerCase().includes(t));
  }
  if (params.type) {
    assets = assets.filter((a) => a.type === params.type);
  }
  if (params.folderId) {
    assets = assets.filter((a) => a.folderId === params.folderId);
  }
  return {
    items: assets,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 25,
    total: assets.length,
  };
}

export async function getMediaAssetById(id: string): Promise<MediaAsset> {
  return request<MediaAsset>(`/api/v1/media/${id}`);
}

export async function searchMediaAssets(filters: MediaSearchFilters, page = 1, pageSize = 25): Promise<MediaListResponse> {
  const qs = new URLSearchParams();
  if (filters.term) qs.set('term', filters.term);
  if (filters.types?.length) qs.set('types', filters.types.join(','));
  if (filters.tags?.length) qs.set('tags', filters.tags.join(','));
  if (filters.folderId) qs.set('folderId', filters.folderId);
  if (filters.status) qs.set('status', filters.status);
  if (filters.language) qs.set('language', filters.language);
  if (filters.from) qs.set('from', filters.from);
  if (filters.to) qs.set('to', filters.to);
  qs.set('page', String(page));
  qs.set('pageSize', String(pageSize));
  return request<MediaListResponse>(`/api/v1/media/search?${qs.toString()}`);
}

export async function getMediaUsage(id: string): Promise<MediaUsage[]> {
  return request<MediaUsage[]>(`/api/v1/media/${id}/usage`);
}

export async function getMediaRelations(id: string): Promise<MediaUsage[]> {
  return request<MediaUsage[]>(`/api/v1/media/${id}/relations`);
}

export async function getMediaVersions(id: string): Promise<MediaVersion[]> {
  return request<MediaVersion[]>(`/api/v1/media/${id}/versions`);
}

export async function getMediaAudits(id: string): Promise<MediaAudit[]> {
  return request<MediaAudit[]>(`/api/v1/media/${id}/audits`);
}

export async function getMediaShares(id: string): Promise<MediaShare[]> {
  return request<MediaShare[]>(`/api/v1/media/${id}/shares`);
}

export async function getMediaPermissions(id: string): Promise<MediaPermission[]> {
  return request<MediaPermission[]>(`/api/v1/media/${id}/permissions`);
}

export async function getMediaMetadata(id: string): Promise<MediaMetadata[]> {
  return request<MediaMetadata[]>(`/api/v1/media/${id}/metadata`);
}

export async function archiveMedia(id: string): Promise<void> {
  if (shouldFetchApi()) {
    try {
      await request<void>(`/api/v1/media/${id}/archive`, { method: 'POST' });
      return;
    } catch {
      // Fall through
    }
  }
  const assets = getStoredMediaAssets().map((a) =>
    a.id === id ? { ...a, status: 'Archived' as const } : a
  );
  saveStoredMediaAssets(assets);
}

export async function restoreMedia(id: string): Promise<void> {
  if (shouldFetchApi()) {
    try {
      await request<void>(`/api/v1/media/${id}/restore`, { method: 'POST' });
      return;
    } catch {
      // Fall through
    }
  }
  const assets = getStoredMediaAssets().map((a) =>
    a.id === id ? { ...a, status: 'Ready' as const } : a
  );
  saveStoredMediaAssets(assets);
}

export async function deleteMedia(id: string): Promise<void> {
  if (shouldFetchApi()) {
    try {
      await request<void>(`/api/v1/media/${id}`, { method: 'DELETE' });
      return;
    } catch {
      // Fall through
    }
  }
  const assets = getStoredMediaAssets().filter((a) => a.id !== id);
  saveStoredMediaAssets(assets);
}

export async function updateMediaMetadata(id: string, data: {
  altText?: string;
  language?: string;
  title?: string;
  description?: string;
  folderId?: string;
}): Promise<MediaAsset> {
  return request<MediaAsset>(`/api/v1/media/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function createFolder(name: string, parentFolderId?: string): Promise<MediaFolder> {
  return request<MediaFolder>('/api/v1/media/folders', {
    method: 'POST',
    body: JSON.stringify({ name, parentFolderId }),
  });
}

export async function getUploadQueue(): Promise<UploadQueueItem[]> {
  return request<UploadQueueItem[]>('/api/v1/uploads/queue');
}

export async function bulkArchive(ids: string[]): Promise<BulkActionResult> {
  return request<BulkActionResult>('/api/v1/media/bulk/archive', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}

export async function bulkRestore(ids: string[]): Promise<BulkActionResult> {
  return request<BulkActionResult>('/api/v1/media/bulk/restore', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}

export async function bulkDelete(ids: string[]): Promise<BulkActionResult> {
  return request<BulkActionResult>('/api/v1/media/bulk/delete', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}

export async function bulkMove(ids: string[], folderId: string): Promise<BulkActionResult> {
  return request<BulkActionResult>('/api/v1/media/bulk/move', {
    method: 'POST',
    body: JSON.stringify({ ids, folderId }),
  });
}

export async function bulkCopy(ids: string[], folderId: string): Promise<BulkActionResult> {
  return request<BulkActionResult>('/api/v1/media/bulk/copy', {
    method: 'POST',
    body: JSON.stringify({ ids, folderId }),
  });
}

export async function bulkAddTags(ids: string[], tagIds: string[]): Promise<BulkActionResult> {
  return request<BulkActionResult>('/api/v1/media/bulk/tags', {
    method: 'POST',
    body: JSON.stringify({ ids, tagIds }),
  });
}

export async function bulkAddToCollection(ids: string[], collectionId: string): Promise<BulkActionResult> {
  return request<BulkActionResult>('/api/v1/media/bulk/collections', {
    method: 'POST',
    body: JSON.stringify({ ids, collectionId }),
  });
}

export async function bulkDownload(ids: string[]): Promise<{ urls: string[] }> {
  return request<{ urls: string[] }>('/api/v1/media/bulk/download', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
}

export async function getOrphanAssets(page = 1, pageSize = 50): Promise<MediaListResponse> {
  return request<MediaListResponse>(`/api/v1/media/orphans?page=${page}&pageSize=${pageSize}`);
}

export async function getBrokenReferences(page = 1, pageSize = 50): Promise<MediaListResponse> {
  return request<MediaListResponse>(`/api/v1/media/broken?page=${page}&pageSize=${pageSize}`);
}
