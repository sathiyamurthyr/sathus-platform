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

/** Logical content sources that can be indexed and searched. */
export type SearchSourceType =
  | 'page'
  | 'product'
  | 'article'
  | 'doc'
  | 'media'
  | 'user'
  | 'navigation';

/** A highlighted fragment for a single field. */
export interface SearchHighlightResponse {
  field: string;
  fragments: string[];
}

/** A single search hit returned by the search endpoint. */
export interface SearchResultItem {
  id: string;
  title: string;
  snippet: string;
  url: string;
  sourceType: SearchSourceType;
  score?: number;
  highlights?: SearchHighlightResponse[];
  author?: string;
  language?: string;
  status?: string;
  tags?: string[];
  publishedAt?: string;
  thumbnailUrl?: string;
}

/** A single value within a facet along with its hit count. */
export interface FacetValue {
  value: string;
  label?: string;
  count: number;
}

/** A facet group (e.g. content type, language) with its available values. */
export interface SearchFacetResponse {
  key: string;
  label: string;
  values: FacetValue[];
}

/** Paginated response envelope for the search endpoint. */
export interface SearchResultResponse {
  query: string;
  total: number;
  page: number;
  pageSize: number;
  tookMs: number;
  items: SearchResultItem[];
  facets: SearchFacetResponse[];
}

/** An autocomplete suggestion. */
export interface SearchSuggestionResponse {
  text: string;
  type?: SearchSourceType | 'query';
  count?: number;
}

/** Status of an individual search index. */
export interface SearchIndexStatusResponse {
  indexId: string;
  indexName?: string;
  documentCount: number;
  status: 'healthy' | 'building' | 'degraded' | 'failed' | 'idle';
  lastBuiltAt?: string;
  isRebuilding?: boolean;
  sizeBytes?: number;
}

/** Request body to index (upsert) a single document. */
export interface IndexDocumentRequest {
  id: string;
  title: string;
  content: string;
  url: string;
  sourceType: SearchSourceType;
  language?: string;
  author?: string;
  tags?: string[];
  status?: string;
  publishedAt?: string;
}

/** Request body to trigger a full index rebuild. */
export interface RebuildIndexRequest {
  indexId?: string;
  sourceTypes?: SearchSourceType[];
  language?: string;
}

/** Options for the suggest endpoint. */
export interface SuggestQuery {
  text: string;
  limit?: number;
  sourceTypes?: SearchSourceType[];
  language?: string;
}

/** Query parameters accepted by the search endpoint. */
export interface SearchQuery {
  text: string;
  page?: number;
  pageSize?: number;
  sourceTypes?: SearchSourceType[];
  languages?: string[];
  authors?: string[];
  tags?: string[];
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
  facets?: Record<string, string[]>;
  sort?: 'relevance' | 'newest' | 'oldest';
}

function buildSearchParams(query: SearchQuery): string {
  const qs = new URLSearchParams();
  if (query.text) qs.set('q', query.text);
  if (query.page != null) qs.set('page', String(query.page));
  if (query.pageSize != null) qs.set('pageSize', String(query.pageSize));
  if (query.sort) qs.set('sort', query.sort);
  if (query.sourceTypes?.length) qs.set('sourceTypes', query.sourceTypes.join(','));
  if (query.languages?.length) qs.set('languages', query.languages.join(','));
  if (query.authors?.length) qs.set('authors', query.authors.join(','));
  if (query.tags?.length) qs.set('tags', query.tags.join(','));
  if (query.status?.length) qs.set('status', query.status.join(','));
  if (query.dateFrom) qs.set('dateFrom', query.dateFrom);
  if (query.dateTo) qs.set('dateTo', query.dateTo);
  if (query.facets) {
    for (const [key, values] of Object.entries(query.facets)) {
      if (values?.length) qs.set(`facet.${key}`, values.join(','));
    }
  }
  return qs.toString();
}

export async function search(query: SearchQuery): Promise<SearchResultResponse> {
  const qs = buildSearchParams(query);
  return request<SearchResultResponse>(`/api/v1/search${qs ? `?${qs}` : ''}`);
}

export async function suggest(
  query: string,
  opts?: { limit?: number; sourceTypes?: SearchSourceType[]; language?: string }
): Promise<SearchSuggestionResponse[]> {
  const qs = new URLSearchParams();
  if (query) qs.set('q', query);
  if (opts?.limit != null) qs.set('limit', String(opts.limit));
  if (opts?.sourceTypes?.length) qs.set('sourceTypes', opts.sourceTypes.join(','));
  if (opts?.language) qs.set('language', opts.language);
  return request<SearchSuggestionResponse[]>(`/api/v1/search/suggest?${qs.toString()}`);
}

export async function indexDocument(req: IndexDocumentRequest): Promise<void> {
  return request<void>('/api/v1/search/index', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

export async function rebuildIndex(req: RebuildIndexRequest): Promise<void> {
  return request<void>('/api/v1/search/rebuild', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

export async function getStatus(indexId?: string): Promise<SearchIndexStatusResponse[]> {
  const qs = indexId ? `?indexId=${encodeURIComponent(indexId)}` : '';
  return request<SearchIndexStatusResponse[]>(`/api/v1/search/status${qs}`);
}

export async function deleteDocument(id: string): Promise<void> {
  return request<void>(`/api/v1/search/index/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}
