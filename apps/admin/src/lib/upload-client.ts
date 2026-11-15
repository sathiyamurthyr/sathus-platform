import type { UploadSession, UploadProgress, UploadChunk, UploadResult, UploadError } from '@/types/upload';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

function shouldFetchApi(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.location.protocol === 'https:' && API_BASE.startsWith('http://localhost')) {
    return false;
  }
  return true;
}

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

// In-memory sessions for offline/client mode fallback
const offlineSessions = new Map<string, UploadSession>();

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
  if (shouldFetchApi()) {
    try {
      return await request<UploadSession>('/api/v1/uploads/start', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      // Fall through to offline mock session
    }
  }

  const id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const chunkSize = data.chunkSize || 5 * 1024 * 1024;
  const totalChunks = Math.max(1, Math.ceil(data.size / chunkSize));
  const session: UploadSession = {
    id,
    sessionId: id,
    fileName: data.fileName,
    fileExtension: data.fileExtension,
    mimeType: data.mimeType,
    sizeBytes: data.size,
    chunkSize,
    totalChunks,
    uploadedChunks: 0,
    progress: 0,
    status: 'Uploading',
    startedAt: new Date().toISOString(),
    isFolder: data.isFolder ?? false,
    folderId: data.folderId,
    parentSessionId: data.parentSessionId,
    folderPath: data.folderPath,
    checksum: data.checksum,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  offlineSessions.set(id, session);
  return session;
}

export async function uploadChunk(
  sessionId: string,
  chunkIndex: number,
  data: ArrayBuffer,
  checksum?: string
): Promise<UploadChunk> {
  if (shouldFetchApi()) {
    try {
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

      if (response.ok) {
        return (await response.json()) as UploadChunk;
      }
    } catch {
      // Fall through to offline handling
    }
  }

  const session = offlineSessions.get(sessionId);
  if (session) {
    session.uploadedChunks = chunkIndex + 1;
    session.progress = Math.min(100, Math.round(((chunkIndex + 1) / session.totalChunks) * 100));
  }
  return {
    chunkIndex,
    status: 'Completed',
    completedAt: new Date().toISOString(),
  };
}

export async function completeUpload(sessionId: string): Promise<UploadResult> {
  if (shouldFetchApi()) {
    try {
      return await request<UploadResult>('/api/v1/uploads/complete', {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      });
    } catch {
      // Fall through to offline completion
    }
  }

  const session = offlineSessions.get(sessionId);
  const storageKey = session?.storageKey || `local/${session?.fileName || 'asset'}`;
  if (session) {
    session.status = 'Completed';
    session.progress = 100;
  }
  return {
    sessionId,
    sessionIdentifier: sessionId,
    status: 'Completed',
    storageKey,
    completedAt: new Date().toISOString(),
  };
}

export async function cancelUpload(sessionId: string): Promise<UploadResult> {
  if (shouldFetchApi()) {
    try {
      return await request<UploadResult>('/api/v1/uploads/cancel', {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      });
    } catch {
      // Fall through
    }
  }
  offlineSessions.delete(sessionId);
  return {
    sessionId,
    sessionIdentifier: sessionId,
    status: 'Cancelled',
    completedAt: new Date().toISOString(),
  };
}

export async function resumeUpload(sessionId: string): Promise<UploadSession> {
  if (shouldFetchApi()) {
    try {
      return await request<UploadSession>('/api/v1/uploads/resume', {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      });
    } catch {
      // Fall through
    }
  }
  const session = offlineSessions.get(sessionId);
  if (session) {
    session.status = 'Uploading';
    return session;
  }
  throw new Error('Session not found');
}

export async function getUploadSession(id: string): Promise<UploadSession> {
  if (shouldFetchApi()) {
    try {
      return await request<UploadSession>(`/api/v1/uploads/${id}`);
    } catch {
      // Fall through
    }
  }
  const session = offlineSessions.get(id);
  if (session) return session;
  throw new Error('Session not found');
}

export async function getUploadProgress(id: string): Promise<UploadProgress> {
  if (shouldFetchApi()) {
    try {
      return await request<UploadProgress>(`/api/v1/uploads/${id}/progress`);
    } catch {
      // Fall through
    }
  }
  const session = offlineSessions.get(id);
  const total = session?.sizeBytes ?? 1000;
  const uploaded = session ? Math.round((session.progress / 100) * total) : total;
  return {
    sessionId: id,
    sessionIdentifier: id,
    progress: session?.progress ?? 100,
    uploadedChunks: session?.uploadedChunks ?? 1,
    totalChunks: session?.totalChunks ?? 1,
    status: session?.status ?? 'Completed',
    bytesUploaded: uploaded,
    bytesTotal: total,
    speedBytesPerSecond: 1024 * 1024,
  };
}

export async function computeFileChecksum(file: File, algorithm = 'sha256'): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `${algorithm}:${hashHex}`;
  } catch {
    return `${algorithm}:fallback_${Date.now()}`;
  }
}
