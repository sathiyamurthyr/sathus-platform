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
import { BreadcrumbJsonLd, FAQPageJsonLd } from '@/components/seo/json-ld';
import { AISummaryBlock } from '@/components/seo/ai-summary-block';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import {
  financialServicesIndustry,
  fintechIndustry,
  lifeSciencesIndustry,
  healthcareIndustry,
} from '@/features/industries';
import type { Industry } from '@/features/industries/types';

const INDUSTRY_REGISTRY: Record<string, Industry> = {
  'financial-services': financialServicesIndustry,
  'fintech': fintechIndustry,
  'life-sciences': lifeSciencesIndustry,
  'healthcare': healthcareIndustry,
};

interface IndustryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = INDUSTRY_REGISTRY[slug];

  if (!industry) {
    return {};
  }

  return generatePageMetadata({
    title: `${industry.name} Engineering Solutions`,
    description: industry.description,
    path: `/industries/${industry.slug}`,
    keywords: [
      industry.name,
      'enterprise technology solutions',
      'Sathus Technology',
      ...industry.solutions.map((s) => s.title),
    ],
  });
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = INDUSTRY_REGISTRY[slug];

  if (!industry) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Industries', url: '/industries' },
    { name: industry.name, url: `/industries/${industry.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {industry.faqs && industry.faqs.length > 0 && (
        <FAQPageJsonLd faqs={industry.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      )}

      <IndustryHero hero={industry.hero} />
      <IndustryOverview overview={industry.overview} />

      {/* AI Search Engine Overview Block */}
      <div className="container mx-auto px-4 py-8">
        <AISummaryBlock
          topic={`${industry.name} Enterprise Architecture`}
          definition={industry.description}
          keyTakeaways={industry.solutions ? industry.solutions.map((s) => `${s.title}: ${s.description}`) : []}
          faqs={industry.faqs ? industry.faqs.slice(0, 5).map((f) => ({ question: f.question, answer: f.answer })) : []}
        />
      </div>

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