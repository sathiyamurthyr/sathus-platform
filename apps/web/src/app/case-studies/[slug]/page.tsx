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
import { getCaseStudyBySlug } from '@/features/case-studies/data';

const SITE_URL = 'https://sathus.in';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for each case study page
export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return {};
  }

  const canonicalUrl = `/case-studies/${caseStudy.slug}`;

  return {
    title: caseStudy.seo.title,
    description: caseStudy.seo.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: caseStudy.seo.title,
      description: caseStudy.seo.description,
      url: `${SITE_URL}${canonicalUrl}`,
      type: 'article',
      publishedTime: caseStudy.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: caseStudy.seo.title,
      description: caseStudy.seo.description,
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
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
        name: 'Case Studies',
        item: `${SITE_URL}/case-studies`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: caseStudy.title,
        item: `${SITE_URL}/case-studies/${caseStudy.slug}`,
      },
    ],
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.title,
    description: caseStudy.seo.description,
    datePublished: caseStudy.publishedAt,
    industry: caseStudy.industry,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <CaseStudyHero caseStudy={caseStudy} />
      <ChallengeSection caseStudy={caseStudy} />
      <SolutionSection caseStudy={caseStudy} />
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