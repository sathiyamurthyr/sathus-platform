import { Metadata } from 'next';
import { ResourcesHero } from '@/features/resources/components/ResourcesHero';
import { FeaturedContent } from '@/features/resources/components/FeaturedContent';
import { CategoryGrid } from '@/features/resources/components/CategoryGrid';
import { ResourceCard } from '@/features/resources/components/ResourceCard';
import { NewsletterCTA } from '@/features/resources/components/NewsletterCTA';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import {
  categories,
  resources,
  featuredContent,
} from '@/features/resources/data';

const SITE_URL = siteConfig.url;

export const metadata: Metadata = {
  title: 'Resources & Insights',
  description: 'Explore technical architecture guides, whitepapers, case studies, and engineering benchmarks.',
  alternates: {
    canonical: '/resources',
  },
  openGraph: {
    title: 'Resources & Insights — Sathus Technology',
    description: 'Explore technical architecture guides, whitepapers, case studies, and engineering benchmarks.',
    url: `${SITE_URL}/resources`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resources & Insights — Sathus Technology',
    description: 'Explore technical architecture guides, whitepapers, case studies, and engineering benchmarks.',
  },
};

export default function ResourcesPage() {
  return (
    <>
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Resources' }]} />
      </div>
      <ResourcesHero />
      <FeaturedContent featured={featuredContent} />
      <CategoryGrid categories={categories} />
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Latest Technical Articles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      </div>
      <NewsletterCTA />
    </>
  );
}