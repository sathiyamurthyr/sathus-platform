// EPIC-019 Enterprise Search & Knowledge Domain Types

export type SearchEntityType =
  | 'projects'
  | 'tasks'
  | 'files'
  | 'notifications'
  | 'ai_knowledge'
  | 'billing'
  | 'users'
  | 'workspaces'
  | 'documentation'
  | 'solutions'
  | 'products'
  | 'industries'
  | 'technology'
  | 'blog'
  | 'learning'
  | 'trust-center';

export interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  tenantId?: string;
  entityId?: string;
  entityType?: SearchEntityType;
  snippet?: string;
  content?: string;
  score?: number;
  author?: string;
  updatedAt?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  category?: SearchEntityType;
  description?: string;
  badge?: string;
  // AI RAG & Vector Readiness Extensions for EPIC-020
  vectorSimilarityScore?: number;
  ragSnippet?: string;
  knowledgeGraphNodes?: string[];
}

export interface SearchFacet {
  field: string;
  label: string;
  counts: Array<{ value: string; label: string; count: number }>;
}

export interface FacetedSearchFilters {
  entityTypes?: SearchEntityType[];
  dateRange?: 'today' | '7d' | '30d' | 'all';
  owner?: string;
  tags?: string[];
  workspaceId?: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: string;
  filters: FacetedSearchFilters;
  createdAt: string;
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'entity';
  category?: SearchEntityType;
  url?: string;
}

// Backward Compatibility Aliases for Public Website Search
export type SearchCategory = SearchEntityType;
export type SearchResult = SearchResultItem;

export interface SearchFilters {
  category?: SearchCategory;
  contentType?: string;
  tags?: string[];
  featured?: boolean;
  newest?: boolean;
}

export interface SearchProvider {
  search(query: string, filters?: SearchFilters): Promise<SearchResult[]>;
  getPopularSearches(): Promise<string[]>;
  getRecentSearches(): Promise<string[]>;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  filters: SearchFilters;
}