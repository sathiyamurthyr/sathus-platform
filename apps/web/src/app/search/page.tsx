import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { LiveSearch } from '@/features/search/components/LiveSearch';
import { Suspense } from 'react';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Platform Search — Sathus Technology',
  description: 'Search across engineering solutions, industry platforms, technical whitepapers, pricing, and compliance docs.',
  alternates: {
    canonical: '/search',
  },
  openGraph: {
    title: 'Platform Search — Sathus Technology',
    description: 'Find solutions, engineering research, and platform resources across Sathus Technology.',
    url: `${SITE_URL}/search`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Platform Search — Sathus Technology',
    description: 'Find solutions, engineering research, and platform resources across Sathus Technology.',
  },
};

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 pt-3 pb-12 space-y-8">
      <SectionIntro
        eyebrow="Enterprise Knowledge Base"
        title="Search Sathus Platform"
        description="Instant site-wide search across engineering whitepapers, solutions, pricing models, and compliance standards."
      />
      <Suspense fallback={
        <div className="max-w-4xl mx-auto h-32 rounded-2xl border border-border bg-card/50 animate-pulse flex items-center justify-center text-xs text-muted-foreground">
          Loading search engine...
        </div>
      }>
        <LiveSearch />
      </Suspense>
    </div>
  );
}