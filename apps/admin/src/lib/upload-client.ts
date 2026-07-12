import type { UploadSession, UploadProgress, UploadChunk, UploadResult, UploadError } from '@/types/upload';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
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
    throw new Error((error as UploadError).message ?? `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function startUpload(data: {
  fileName: string;
  fileExtension: string;
  mimeType: string;
  size: number;
  checksum?: string;
  chunkSize?: number;
  folderId?: string;
  parentSessionId?: string;
  isFolder?: boolean;
  folderPath?: string;
  metadata?: Record<string, string>;
}): Promise<UploadSession> {
  return request<UploadSession>('/api/v1/uploads/start', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function uploadChunk(sessionId: string, chunkIndex: number, data: ArrayBuffer, checksum?: string): Promise<UploadChunk> {
  const form = new FormData();
  const blob = new Blob([data]);
  form.append('data', blob, `chunk-${chunkIndex}`);
  form.append('chunkIndex', String(chunkIndex));
  form.append('sessionId', sessionId);
  if (checksum) form.append('checksum', checksum);

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const response = await fetch(`${API_BASE}/api/v1/uploads/chunk`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Chunk upload failed' }));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }

  return response.json() as Promise<UploadChunk>;
}

export async function completeUpload(sessionId: string): Promise<UploadResult> {
  return request<UploadResult>('/api/v1/uploads/complete', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
}

export async function cancelUpload(sessionId: string): Promise<UploadResult> {
  return request<UploadResult>('/api/v1/uploads/cancel', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
}

export async function resumeUpload(sessionId: string): Promise<UploadSession> {
  return request<UploadSession>('/api/v1/uploads/resume', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });
}

export async function getUploadSession(id: string): Promise<UploadSession> {
  return request<UploadSession>(`/api/v1/uploads/${id}`);
}

export async function getUploadProgress(id: string): Promise<UploadProgress> {
  return request<UploadProgress>(`/api/v1/uploads/${id}/progress`);
}

export async function computeFileChecksum(file: File, algorithm = 'sha256'): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `${algorithm}:${hashHex}`;
}
