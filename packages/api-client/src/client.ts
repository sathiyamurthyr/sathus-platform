export type ApiError = {
  message: string;
  status?: number;
};

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(path: string, options?: { signal?: AbortSignal }): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: options?.signal,
    });

    if (!response.ok) {
      throw this.handleError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async post<T>(path: string, body?: unknown, options?: { signal?: AbortSignal }): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    });

    if (!response.ok) {
      throw this.handleError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async put<T>(path: string, body?: unknown, options?: { signal?: AbortSignal }): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: options?.signal,
    });

    if (!response.ok) {
      throw this.handleError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async delete<T>(path: string, options?: { signal?: AbortSignal }): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      signal: options?.signal,
    });

    if (!response.ok) {
      throw this.handleError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  private async handleError(response: Response): Promise<ApiError> {
    let message = `HTTP ${response.status}`;
    try {
      const error = await response.json();
      if (typeof error?.message === 'string') {
        message = error.message;
      }
    } catch {
      // ignore parse errors
    }
    return { message, status: response.status };
  }
}

export function createApiClient(baseUrl: string): ApiClient {
  return new ApiClient(baseUrl);
}
