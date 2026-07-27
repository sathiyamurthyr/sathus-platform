import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseStudyHero } from '@/features/case-studies/components/CaseStudyHero';
import { ChallengeSection } from '@/features/case-studies/components/ChallengeSection';
import { SolutionSection } from '@/features/case-studies/components/SolutionSection';
import { ArchitectureSection } from '@/features/case-studies/components/ArchitectureSection';
import { TechnologySection } from '@/features/case-studies/components/TechnologySection';
import { MetricsSection } from '@/features/case-studies/components/MetricsSection';
import { TimelineSection } from '@/features/case-studies/components/TimelineSection';
import { OutcomeSection } from '@/features/case-studies/components/OutcomeSection';
import { QuoteSection } from '@/features/case-studies/components/QuoteSection';
import { RelatedSolutions } from '@/features/case-studies/components/RelatedSolutions';
import { CTA } from '@/features/case-studies/components/CTA';
import { BreadcrumbJsonLd, ArticleJsonLd } from '@/components/seo/json-ld';
import { AISummaryBlock } from '@/components/seo/ai-summary-block';
import { getCaseStudyBySlug } from '@/features/case-studies/data';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return {};
  }

  return generatePageMetadata({
    title: `${caseStudy.title} — Enterprise Case Study`,
    description: caseStudy.seo.description,
    path: `/case-studies/${caseStudy.slug}`,
    ogType: 'article',
    publishedTime: caseStudy.publishedAt,
    keywords: [
      caseStudy.title,
      caseStudy.client.industry,
      'Sathus Technology case study',
      ...caseStudy.techStack.map((t) => t.name),
    ],
  });
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Case Studies', url: '/case-studies' },
    { name: caseStudy.title, url: `/case-studies/${caseStudy.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ArticleJsonLd
        headline={caseStudy.title}
        description={caseStudy.seo.description}
        url={`/case-studies/${caseStudy.slug}`}
        datePublished={caseStudy.publishedAt}
      />

      <CaseStudyHero caseStudy={caseStudy} />
      <ChallengeSection caseStudy={caseStudy} />
      <SolutionSection caseStudy={caseStudy} />

      {/* AI Overview Block */}
      <div className="container mx-auto px-4 py-8">
        <AISummaryBlock
          topic={caseStudy.title}
          definition={caseStudy.summary}
          keyTakeaways={caseStudy.outcomes ? caseStudy.outcomes.map((o) => `${o.title}: ${o.metric}`) : []}
        />
      </div>

      <ArchitectureSection caseStudy={caseStudy} />
      <TechnologySection caseStudy={caseStudy} />
      <MetricsSection caseStudy={caseStudy} />
      <TimelineSection caseStudy={caseStudy} />
      <OutcomeSection caseStudy={caseStudy} />
      <QuoteSection caseStudy={caseStudy} />
      <RelatedSolutions caseStudy={caseStudy} />
      <CTA />
    </>
  );
}