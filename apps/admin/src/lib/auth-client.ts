import type { AuthTokens, User, Session, MFASetupResponse } from '@/types/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
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
    clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function login(email: string, password: string, rememberMe: boolean): Promise<AuthTokens> {
  return request<AuthTokens>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe }),
  });
}

export async function register(email: string, password: string, firstName: string, lastName: string): Promise<User> {
  return request<User>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
}

export async function logout(refreshToken: string): Promise<void> {
  return request<void>('/api/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export async function forgotPassword(email: string): Promise<void> {
  return request<void>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  return request<void>('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password: newPassword }),
  });
}

export async function verifyEmail(token: string): Promise<void> {
  return request<void>('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  return request<AuthTokens>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export async function getCurrentUser(): Promise<User> {
  return request<User>('/api/auth/me');
}

export async function getSessions(): Promise<Session[]> {
  return request<Session[]>('/api/auth/sessions');
}

export async function revokeSession(sessionId: string): Promise<void> {
  return request<void>(`/api/auth/sessions/${sessionId}`, {
    method: 'DELETE',
  });
}

export async function enableMFA(): Promise<MFASetupResponse> {
  return request<MFASetupResponse>('/api/auth/mfa/enable', {
    method: 'POST',
  });
}

export async function disableMFA(): Promise<void> {
  return request<void>('/api/auth/mfa/disable', {
    method: 'POST',
  });
}

export async function verifyMFA(code: string): Promise<AuthTokens> {
  return request<AuthTokens>('/api/auth/mfa/verify', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}
