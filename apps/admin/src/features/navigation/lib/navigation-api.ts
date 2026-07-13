const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

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

export async function getTrees(platform?: string) {
  const qs = platform ? `?platform=${encodeURIComponent(platform)}` : '';
  return request<import('@/types/navigation-data').TreeSummary[]>(`/api/v1/navigation${qs}`);
}

export async function getTree(id: string) {
  return request<import('@/types/navigation-data').TreeSummary>(`/api/v1/navigation/${id}`);
}

export async function createTree(data: { platform: string; name: string; defaultLocale: string; description?: string }) {
  return request<import('@/types/navigation-data').TreeSummary>('/api/v1/navigation', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function archiveTree(id: string) {
  return request<void>(`/api/v1/navigation/${id}`, { method: 'DELETE' });
}

export async function getMenus(treeId: string) {
  return request<import('@/types/navigation-data').MenuSummary[]>(`/api/v1/navigation/admin/menus?treeId=${treeId}`);
}

export async function createMenu(data: { treeId: string; name: string; menuType: string; locale?: string }) {
  return request<import('@/types/navigation-data').MenuSummary>('/api/v1/navigation/admin/menus', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMenu(id: string) {
  return request<import('@/types/navigation-data').MenuDetail>(`/api/v1/navigation/admin/menus/${id}`);
}

export async function archiveMenu(id: string) {
  return request<void>(`/api/v1/navigation/admin/menus/${id}/archive`, { method: 'POST' });
}

export async function restoreMenu(id: string) {
  return request<void>(`/api/v1/navigation/admin/menus/${id}/restore`, { method: 'POST' });
}

export async function cloneMenu(id: string, data?: { newName?: string; locale?: string }) {
  return request<import('@/types/navigation-data').MenuSummary>(`/api/v1/navigation/admin/menus/${id}/clone`, {
    method: 'POST',
    body: JSON.stringify(data ?? {}),
  });
}

export async function createNode(menuId: string, data: Record<string, unknown>) {
  return request<import('@/types/navigation-data').NavigationNode>(`/api/v1/navigation/admin/menus/${menuId}/nodes`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateNode(menuId: string, nodeId: string, data: Record<string, unknown>) {
  return request<import('@/types/navigation-data').NavigationNode>(`/api/v1/navigation/admin/menus/${menuId}/nodes/${nodeId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteNode(menuId: string, nodeId: string) {
  return request<void>(`/api/v1/navigation/admin/menus/${menuId}/nodes/${nodeId}`, { method: 'DELETE' });
}

export async function moveNode(menuId: string, nodeId: string, data: { newParentId?: string; newOrder: number }) {
  return request<import('@/types/navigation-data').NavigationNode>(`/api/v1/navigation/admin/menus/${menuId}/nodes/${nodeId}/move`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function copyNode(menuId: string, nodeId: string, data: { newParentId?: string }) {
  return request<import('@/types/navigation-data').NavigationNode>(`/api/v1/navigation/admin/menus/${menuId}/nodes/${nodeId}/copy`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createVersion(menuId: string, label: string) {
  return request<import('@/types/navigation-data').VersionDto>(`/api/v1/navigation/admin/menus/${menuId}/versions`, {
    method: 'POST',
    body: JSON.stringify({ label }),
  });
}

export async function getVersions(menuId: string) {
  return request<import('@/types/navigation-data').VersionDto[]>(`/api/v1/navigation/admin/menus/${menuId}/versions`);
}

export async function publishMenu(menuId: string, versionId: string) {
  return request<import('@/types/navigation-data').PublishResult>(`/api/v1/navigation/admin/menus/${menuId}/versions/${versionId}/publish`, {
    method: 'POST',
  });
}

export async function schedulePublish(menuId: string, versionId: string, data: { scheduledAt: Date }) {
  return request<import('@/types/navigation-data').VersionDto>(`/api/v1/navigation/admin/menus/${menuId}/versions/${versionId}/schedule`, {
    method: 'POST',
    body: JSON.stringify({ ...data, scheduledAt: data.scheduledAt.toISOString() }),
  });
}

export async function previewMenu(menuId: string, versionId: string) {
  return request<import('@/types/navigation-data').NavigationItem[]>(`/api/v1/navigation/admin/menus/${menuId}/versions/${versionId}/preview`, {
    method: 'POST',
  });
}

export async function rollbackMenu(menuId: string, data: { versionId: string }) {
  return request<import('@/types/navigation-data').VersionDto>(`/api/v1/navigation/admin/menus/${menuId}/rollback`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function searchNavigation(filters: { term?: string; menuType?: string; route?: string; title?: string; permission?: string }) {
  const qs = new URLSearchParams();
  if (filters.term) qs.set('term', filters.term);
  if (filters.menuType) qs.set('menuType', filters.menuType);
  if (filters.route) qs.set('route', filters.route);
  if (filters.title) qs.set('title', filters.title);
  if (filters.permission) qs.set('permission', filters.permission);
  qs.set('page', '1');
  qs.set('pageSize', '50');
  return request<import('@/types/navigation-data').SearchResult[]>(`/api/v1/navigation/search?${qs.toString()}`);
}

export async function getHistory(treeId: string, menuId?: string) {
  const qs = menuId ? `?menuId=${menuId}` : '';
  return request<import('@/types/navigation-data').HistoryEntry[]>(`/api/v1/navigation/${treeId}/history${qs}`);
}

export async function getBrokenRoutes(menuId: string) {
  return request<import('@/types/navigation-data').BrokenRoute[]>(`/api/v1/navigation/admin/menus/${menuId}/broken`);
}

export async function getPublishedMenu(treeId: string, menuType: string, locale: string) {
  return request<import('@/types/navigation-data').NavigationItem[]>(`/api/v1/navigation/admin/menus/${treeId}/published/${encodeURIComponent(menuType)}/${encodeURIComponent(locale)}`);
}
