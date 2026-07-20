import type { SearchProvider, SearchResult, SearchFilters, SearchCategory } from '../types';

// Mock search data
const MOCK_RESULTS: SearchResult[] = [
  {
    id: 'ai-engineering',
    title: 'AI Engineering',
    description: 'Production-grade agentic systems with evaluation harnesses, observability, and human-in-the-loop controls.',
    category: 'solutions',
    url: '/solutions/ai-engineering',
    badge: 'New',
  },
  {
    id: 'data-engineering',
    title: 'Data Engineering',
    description: 'Governed lakehouses and streaming pipelines that turn raw events into trustworthy, query-ready intelligence.',
    category: 'solutions',
    url: '/solutions/data-engineering',
  },
  {
    id: 'financial-services',
    title: 'Financial Services',
    description: 'Enterprise solutions for banks, insurance companies, and financial institutions.',
    category: 'industries',
    url: '/industries/financial-services',
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'HIPAA-compliant solutions for healthcare providers and life sciences.',
    category: 'industries',
    url: '/industries/healthcare',
  },
  {
    id: 'cloud-modernization',
    title: 'Cloud Modernization',
    description: 'Re-platform to cloud-native architectures on Azure and AWS with zero-downtime migration paths.',
    category: 'solutions',
    url: '/solutions/cloud-modernization',
  },
  {
    id: 'product-engineering',
    title: 'Product Engineering',
    description: 'Embedded product squads that take concepts from discovery to GA with a real delivery cadence.',
    category: 'solutions',
    url: '/solutions/product-engineering',
  },
  {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    description: 'Outcome-based roadmaps and durable platform thinking that drives operating-model change.',
    category: 'solutions',
    url: '/solutions/digital-transformation',
  },
  {
    id: 'enterprise-applications',
    title: 'Enterprise Applications',
    description: 'Domain-driven applications — custom or composable — that fit the way your organization works.',
    category: 'solutions',
    url: '/solutions/enterprise-applications',
  },
];

const POPULAR_SEARCHES = [
  'AI Engineering',
  'Data Engineering',
  'Cloud Modernization',
  'Financial Services',
  'Machine Learning',
];

const RECENT_SEARCHES_KEY = 'sathus-recent-searches';

export class MockSearchProvider implements SearchProvider {
  async search(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (!query.trim()) {
      return [];
    }

    const normalizedQuery = query.toLowerCase();

    return MOCK_RESULTS.filter((result) => {
      // Text match
      const matchesQuery =
        result.title.toLowerCase().includes(normalizedQuery) ||
        (result.description?.toLowerCase().includes(normalizedQuery) ?? false) ||
        (result.snippet?.toLowerCase().includes(normalizedQuery) ?? false);

      // Category filter
      if (filters?.category && result.category !== filters.category) {
        return false;
      }

      return matchesQuery;
    }).sort((a, b) => (b.score || 0) - (a.score || 0));
  }

  async getPopularSearches(): Promise<string[]> {
    return POPULAR_SEARCHES;
  }

  async getRecentSearches(): Promise<string[]> {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  async saveRecentSearch(query: string): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const recent = await this.getRecentSearches();
      const updated = [query, ...recent.filter((q) => q !== query)].slice(0, 5);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore errors
    }
  }
}