import { Metadata } from 'next';
import Link from 'next/link';
import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import { CaseStudyCard } from '@/features/case-studies/components/CaseStudyCard';
import { CTA } from '@/features/case-studies/components/CTA';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import {
  caseStudies,
  getFeaturedCaseStudies,
  getIndustries,
} from '@/features/case-studies/data';

export const metadata: Metadata = generatePageMetadata({
  title: 'Enterprise Case Studies & Client Success Stories',
  description: 'Real-world examples of how Sathus Technology delivers measurable AI, data platform, and cloud modernization outcomes for enterprise clients.',
  path: '/case-studies',
  keywords: [
    'Sathus case studies',
    'Core banking modernization case study',
    'Clinical data lakehouse case study',
    'Enterprise AI agent platform case study',
  ],
});

export default function CaseStudiesPage() {
  const featured = getFeaturedCaseStudies();
  const industries = getIndustries();

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Case Studies', url: '/case-studies' }]} />

      {/* Hero */}
      <section id="case-studies-hero" className="scroll-mt-24 pt-6 pb-10 sm:pb-12">
        <div className="container mx-auto px-4">
          <SectionIntro
            eyebrow="Case Studies"
            title="Success Stories"
            description="Real-world examples of how we have delivered measurable outcomes for enterprise clients across industries."
            align="center"
          />
        </div>
      </section>

      {/* Featured Case Studies */}
      <section id="featured" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <SectionIntro
            eyebrow="Featured"
            title="Featured Case Studies"
            description="Highlighted success stories from our portfolio."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
            ))}
          </div>
        </div>
      </section>

      {/* All Case Studies */}
      <section id="all-case-studies" className="scroll-mt-24 py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <SectionIntro
            eyebrow="All Studies"
            title="All Case Studies"
            description="Browse our complete portfolio of enterprise solutions."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} />
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section id="filters" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <SectionIntro
            eyebrow="Filters"
            title="Filter by Industry"
            description="Find case studies relevant to your industry."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {industries.map((industry) => (
              <Reveal key={industry}>
                <Link
                  href={`/case-studies?industry=${encodeURIComponent(industry)}`}
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {industry}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}