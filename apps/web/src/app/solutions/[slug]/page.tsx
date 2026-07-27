import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SolutionHero } from '@/features/solutions/components/SolutionHero';
import { SolutionOverview } from '@/features/solutions/components/SolutionOverview';
import { BusinessChallenges } from '@/features/solutions/components/BusinessChallenges';
import { Capabilities } from '@/features/solutions/components/Capabilities';
import { ArchitectureDiagram } from '@/features/solutions/components/ArchitectureDiagram';
import { TechnologyStack } from '@/features/solutions/components/TechnologyStack';
import { DeliveryMethodology } from '@/features/solutions/components/DeliveryMethodology';
import { BusinessOutcomes } from '@/features/solutions/components/BusinessOutcomes';
import { CaseStudies } from '@/features/solutions/components/CaseStudies';
import { Faq } from '@/features/solutions/components/Faq';
import { FinalCTA } from '@/features/solutions/components/FinalCTA';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { ServiceJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { AISummaryBlock } from '@/components/seo/ai-summary-block';
import { getSolutionBySlug } from '@/features/solutions/data';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';

interface SolutionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    return {};
  }

  return generatePageMetadata({
    title: solution.title,
    description: solution.description,
    path: `/solutions/${solution.slug}`,
    keywords: [
      solution.title,
      'engineering solution',
      'enterprise software',
      'Sathus Technology',
      ...solution.capabilities.map((c) => c.title),
    ],
  });
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Solutions', url: '/solutions' },
    { name: solution.title, url: `/solutions/${solution.slug}` },
  ];

  return (
    <>
      <ServiceJsonLd solution={solution} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {solution.faqs && solution.faqs.length > 0 && (
        <FAQPageJsonLd faqs={solution.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      )}

      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb
          items={[
            { label: 'Solutions', href: '/solutions' },
            { label: solution.title },
          ]}
        />
      </div>

      <SolutionHero hero={solution.hero} />
      <SolutionOverview solution={solution} />

      {/* AI Search Engine Block */}
      <div className="container mx-auto px-4 py-8">
        <AISummaryBlock
          topic={solution.title}
          definition={solution.description}
          keyTakeaways={solution.capabilities ? solution.capabilities.map((c) => `${c.title}: ${c.description}`) : []}
          faqs={solution.faqs ? solution.faqs.slice(0, 5).map((f) => ({ question: f.question, answer: f.answer })) : []}
        />
      </div>

      {solution.challenges && <BusinessChallenges challenges={solution.challenges} />}
      {solution.capabilities && <Capabilities capabilities={solution.capabilities} />}
      {solution.architecture && <ArchitectureDiagram architecture={solution.architecture} />}
      {solution.technologies && <TechnologyStack technologies={solution.technologies} />}
      {solution.methodology && <DeliveryMethodology methodology={solution.methodology} />}
      {solution.outcomes && <BusinessOutcomes outcomes={solution.outcomes} />}
      {solution.caseStudies && <CaseStudies caseStudies={solution.caseStudies} />}
      {solution.faqs && <Faq faqs={solution.faqs} />}
      <FinalCTA />
    </>
  );
}
