import type {
  ContentItem,
  Category,
  Tag,
  MediaAsset,
} from '@/types/content';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
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
    throw new Error((error as ErrorResponse).message ?? `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

interface ErrorResponse {
  message?: string;
}

export async function getContentItems(params: {
  page?: number;
  pageSize?: number;
  contentType?: string;
  status?: string;
  categoryId?: string;
  tagId?: string;
  search?: string;
  sortBy?: string;
  sortDescending?: boolean;
}): Promise<ContentItem[]> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
  if (params.contentType) searchParams.set('contentType', params.contentType);
  if (params.status) searchParams.set('status', params.status);
  if (params.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params.tagId) searchParams.set('tagId', params.tagId);
  if (params.search) searchParams.set('search', params.search);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortDescending !== undefined) searchParams.set('sortDescending', String(params.sortDescending));

  const query = searchParams.toString();
  const data = await request<{ items: ContentItem[] }>(`/api/content/items${query ? `?${query}` : ''}`);
  return data.items;
}

export async function getContentItem(id: string): Promise<ContentItem> {
  return request(`/api/content/items/${id}`);
}

export async function getContentItemBySlug(slug: string): Promise<ContentItem> {
  return request(`/api/content/items/slug/${encodeURIComponent(slug)}`);
}

export async function createContentItem(
  data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'> & { body: string }
): Promise<ContentItem> {
  return request('/api/content/items', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateContentItem(
  id: string,
  data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'> & { body: string }
): Promise<ContentItem> {
  return request(`/api/content/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteContentItem(id: string): Promise<void> {
  return request(`/api/content/items/${id}`, {
    method: 'DELETE',
  });
}

export async function publishContentItem(id: string): Promise<void> {
  return request(`/api/content/items/${id}/publish`, {
    method: 'POST',
  });
}

export async function unpublishContentItem(id: string): Promise<void> {
  return request(`/api/content/items/${id}/unpublish`, {
    method: 'POST',
  });
}

export async function getCategories(): Promise<Category[]> {
  const data = await request<{ items: Category[] }>('/api/content/categories');
  return data.items;
}

export async function createCategory(data: { name: string; slug: string; description?: string }): Promise<Category> {
  return request('/api/content/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getTags(): Promise<Tag[]> {
  const data = await request<{ items: Tag[] }>('/api/content/tags');
  return data.items;
}

export async function createTag(data: { name: string; slug: string }): Promise<Tag> {
  return request('/api/content/tags', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const data = await request<{ items: MediaAsset[] }>('/api/content/media');
  return data.items;
}

export async function createMediaAsset(data: {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altText?: string;
}): Promise<MediaAsset> {
  return request('/api/content/media', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ---------------------------------------------------------------------------
// Workflow (FEATURE-10.4.6)
// ---------------------------------------------------------------------------

export type WorkflowAction =
  | 'submit'
  | 'approve'
  | 'reject'
  | 'schedule'
  | 'publish'
  | 'unpublish'
  | 'archive'
  | 'restore';

export async function workflowAction(
  id: string,
  action: WorkflowAction,
  payload?: { approvalNote?: string; scheduledAt?: string; reviewerName?: string }
): Promise<ContentItem> {
  return request(`/api/content/items/${id}/workflow`, {
    method: 'POST',
    body: JSON.stringify({ action, ...payload }),
  });
}

export async function schedulePublish(id: string, scheduledAt: string): Promise<ContentItem> {
  return workflowAction(id, 'schedule', { scheduledAt });
}

export async function archiveContentItem(id: string): Promise<ContentItem> {
  return workflowAction(id, 'archive');
}

export async function restoreContentItem(id: string): Promise<ContentItem> {
  return workflowAction(id, 'restore');
}

// ---------------------------------------------------------------------------
// Version History (FEATURE-10.4.7)
// ---------------------------------------------------------------------------

export async function getContentVersions(id: string): Promise<ContentItem[]> {
  return request(`/api/content/items/${id}/versions`);
}

export async function restoreVersion(id: string, versionId: string): Promise<ContentItem> {
  return request(`/api/content/items/${id}/versions/${versionId}/restore`, {
    method: 'POST',
  });
}

export async function addVersionComment(
  id: string,
  versionId: string,
  body: string
): Promise<void> {
  return request(`/api/content/items/${id}/versions/${versionId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

// ---------------------------------------------------------------------------
// SEO Redirects (FEATURE-10.4.8)
// ---------------------------------------------------------------------------

export async function addRedirect(source: string, targetId: string): Promise<void> {
  return request(`/api/content/redirects`, {
    method: 'POST',
    body: JSON.stringify({ source, targetId }),
  });
}

export async function listRedirects(): Promise<{ source: string; targetId: string }[]> {
  return request(`/api/content/redirects`);
}
