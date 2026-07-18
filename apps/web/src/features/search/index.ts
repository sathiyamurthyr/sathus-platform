// Types
export type {
  SearchCategory,
  SearchResult,
  SearchFilters,
  SearchProvider,
  SearchState,
} from './types';

// Provider
export { MockSearchProvider } from './providers/mock-provider';

// Components
export { SearchDialog } from './components/SearchDialog';
export { SearchInput } from './components/SearchInput';
export { SearchResults } from './components/SearchResults';
export { SearchEmpty } from './components/SearchEmpty';
export { SearchLoading } from './components/SearchLoading';
export { RecentSearches } from './components/RecentSearches';
export { PopularSearches } from './components/PopularSearches';