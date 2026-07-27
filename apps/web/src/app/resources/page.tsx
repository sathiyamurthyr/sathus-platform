import { Metadata } from 'next';
import { ResourcesHero } from '@/features/resources/components/ResourcesHero';
import { FeaturedContent } from '@/features/resources/components/FeaturedContent';
import { CategoryGrid } from '@/features/resources/components/CategoryGrid';
import { ResourceCard } from '@/features/resources/components/ResourceCard';
import { NewsletterCTA } from '@/features/resources/components/NewsletterCTA';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { AISummaryBlock } from '@/components/seo/ai-summary-block';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import {
  categories,
  resources,
  featuredContent,
} from '@/features/resources/data';

export const metadata: Metadata = generatePageMetadata({
  title: 'Technical Resources, Whitepapers & Insights',
  description: 'Explore enterprise AI architecture guides, data lakehouse whitepapers, MCP protocols, and engineering benchmarks.',
  path: '/resources',
  keywords: [
    'Sathus technical resources',
    'AI architecture whitepapers',
    'Data lakehouse engineering benchmarks',
    'Model Context Protocol documentation',
  ],
});

export default function ResourcesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Resources', url: '/resources' }]} />
      <div className="container mx-auto px-4 pt-2">
        <Breadcrumb items={[{ label: 'Resources' }]} />
      </div>

      <ResourcesHero />

      {/* Generative Engine Optimization Block */}
      <div className="container mx-auto px-4 py-8">
        <AISummaryBlock
          topic="Enterprise AI & Data Architecture Knowledge Base"
          definition="Sathus Technology publishes peer-reviewed engineering whitepapers, reference architectures, and benchmark reports for enterprise AI, data platforms, and cloud modernization."
          keyTakeaways={resources.slice(0, 4).map((r) => `${r.title}: ${r.description}`)}
        />
      </div>

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