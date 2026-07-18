// Search data models

export type SearchCategory =
  | 'solutions'
  | 'industries'
  | 'products'
  | 'technology'
  | 'blog'
  | 'documentation'
  | 'learning'
  | 'trust-center';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: SearchCategory;
  url: string;
  icon?: string;
  badge?: string;
  score?: number;
  updatedAt?: string;
}

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