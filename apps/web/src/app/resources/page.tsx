import { Metadata } from 'next';
import { ResourcesHero } from '@/features/resources/components/ResourcesHero';
import { FeaturedContent } from '@/features/resources/components/FeaturedContent';
import { CategoryGrid } from '@/features/resources/components/CategoryGrid';
import { ResourceCard } from '@/features/resources/components/ResourceCard';
import { NewsletterCTA } from '@/features/resources/components/NewsletterCTA';
import {
  categories,
  resources,
  featuredContent,
} from '@/features/resources/data';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Explore our collection of guides, tutorials, and insights.',
  alternates: {
    canonical: '/resources',
  },
  openGraph: {
    title: 'Resources — Sathus Technology',
    description: 'Explore our collection of guides, tutorials, and insights.',
    url: `${SITE_URL}/resources`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resources — Sathus Technology',
    description: 'Explore our collection of guides, tutorials, and insights.',
  },
};

export default function ResourcesPage() {
  return (
    <>
      <ResourcesHero />
      <FeaturedContent featured={featuredContent} />
      <CategoryGrid categories={categories} />
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Latest Articles</h2>
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