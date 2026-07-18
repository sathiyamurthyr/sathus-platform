import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { SearchInput } from '@/features/search/components/SearchInput';
import { SearchResults } from '@/features/search/components/SearchResults';
import { SearchEmpty } from '@/features/search/components/SearchEmpty';
import { SearchLoading } from '@/features/search/components/SearchLoading';
import { MockSearchProvider } from '@/features/search/providers/mock-provider';
import type { SearchResult } from '@/features/search/types';

const SITE_URL = 'https://sathus.in';
const searchProvider = new MockSearchProvider();

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search across solutions, industries, products, and documentation.',
  alternates: {
    canonical: '/search',
  },
  openGraph: {
    title: 'Search — Sathus Technology',
    description: 'Find what you are looking for across our platform.',
    url: `${SITE_URL}/search`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search — Sathus Technology',
    description: 'Find what you are looking for across our platform.',
  },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  const query = q;

  // For server-side rendering, we would use the provider
  // For now, we render the client-side search
  return (
    <div className="container mx-auto px-4 py-20">
      <SectionIntro
        eyebrow="Search"
        title="Search Results"
        description="Find solutions, industries, and resources across our platform."
      />
      <div className="mt-8 max-w-2xl">
        <SearchInput value={query} onChange={() => {}} placeholder="Search..." />
      </div>
    </div>
  );
}