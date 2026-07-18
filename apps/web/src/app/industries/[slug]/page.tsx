import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IndustryHero } from '@/features/industries/components/IndustryHero';
import { IndustryOverview } from '@/features/industries/components/IndustryOverview';
import { IndustryChallenges } from '@/features/industries/components/IndustryChallenges';
import { SolutionsGrid } from '@/features/industries/components/SolutionsGrid';
import { ReferenceArchitecture } from '@/features/industries/components/ReferenceArchitecture';
import { TechnologyStack } from '@/features/industries/components/TechnologyStack';
import { BusinessOutcomes } from '@/features/industries/components/BusinessOutcomes';
import { CaseStudies } from '@/features/industries/components/CaseStudies';
import { FAQ } from '@/features/industries/components/FAQ';
import { CTA } from '@/features/industries/components/CTA';
import { financialServicesIndustry } from '@/features/industries/data/financial-services';
import type { Industry } from '@/features/industries/types';

const SITE_URL = 'https://sathus.in';

// Industry registry - will be expanded as more industries are added
const INDUSTRY_REGISTRY: Record<string, Industry> = {
  'financial-services': financialServicesIndustry,
};

interface IndustryPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for each industry page
export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = INDUSTRY_REGISTRY[slug];

  if (!industry) {
    return {};
  }

  const canonicalUrl = `/industries/${industry.slug}`;

  return {
    title: industry.seo?.title || industry.name,
    description: industry.seo?.description || industry.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: industry.seo?.title || industry.name,
      description: industry.seo?.description || industry.description,
      url: `${SITE_URL}${canonicalUrl}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: industry.seo?.title || industry.name,
      description: industry.seo?.description || industry.description,
    },
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = INDUSTRY_REGISTRY[slug];

  if (!industry) {
    notFound();
  }

  // JSON-LD schemas
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Industries',
        item: `${SITE_URL}/industries`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: industry.name,
        item: `${SITE_URL}/industries/${industry.slug}`,
      },
    ],
  };

  const industryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Industry',
    name: industry.name,
    description: industry.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(industryJsonLd) }}
      />
      <IndustryHero hero={industry.hero} />
      <IndustryOverview overview={industry.overview} />
      <IndustryChallenges challenges={industry.challenges} />
      <SolutionsGrid solutions={industry.solutions} />
      <ReferenceArchitecture architecture={industry.architecture} />
      <TechnologyStack technologies={industry.technologies} />
      <BusinessOutcomes outcomes={industry.outcomes} />
      <CaseStudies caseStudies={industry.caseStudies} />
      <FAQ faqs={industry.faqs} />
      <CTA />
    </>
  );
}