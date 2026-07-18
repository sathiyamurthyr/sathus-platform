import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SolutionHero } from '@/features/solutions/components/SolutionHero';
import { BusinessChallenges } from '@/features/solutions/components/BusinessChallenges';
import { Capabilities } from '@/features/solutions/components/Capabilities';
import { ArchitectureDiagram } from '@/features/solutions/components/ArchitectureDiagram';
import { TechnologyStack } from '@/features/solutions/components/TechnologyStack';
import { DeliveryMethodology } from '@/features/solutions/components/DeliveryMethodology';
import { BusinessOutcomes } from '@/features/solutions/components/BusinessOutcomes';
import { CaseStudies } from '@/features/solutions/components/CaseStudies';
import { Faq } from '@/features/solutions/components/Faq';
import { FinalCTA } from '@/features/solutions/components/FinalCTA';
import { aiEngineeringSolution } from '@/features/solutions/data/ai-engineering';
import type { Solution } from '@/features/solutions/types';

const SITE_URL = 'https://sathus.in';

// Solution registry - will be expanded as more solutions are added
const SOLUTION_REGISTRY: Record<string, Solution> = {
  'ai-engineering': aiEngineeringSolution,
};

// Generate metadata for each solution page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = SOLUTION_REGISTRY[slug];

  if (!solution) {
    return {};
  }

  const canonicalUrl = `/solutions/${solution.slug}`;

  return {
    title: solution.title,
    description: solution.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${solution.title} — Sathus Technology`,
      description: solution.description,
      url: `${SITE_URL}${canonicalUrl}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${solution.title} — Sathus Technology`,
      description: solution.description,
    },
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = SOLUTION_REGISTRY[slug];

  if (!solution) {
    notFound();
  }

  return (
    <>
      <SolutionHero hero={solution.hero} />
      <BusinessChallenges challenges={solution.challenges} />
      <Capabilities capabilities={solution.capabilities} />
      <ArchitectureDiagram architecture={solution.architecture} />
      <TechnologyStack technologies={solution.technologies} />
      <DeliveryMethodology methodology={solution.methodology} />
      <BusinessOutcomes outcomes={solution.outcomes} />
      <CaseStudies caseStudies={solution.caseStudies} />
      <Faq faqs={solution.faqs} />
      <FinalCTA />
    </>
  );
}
