import { Metadata } from 'next';
import Link from 'next/link';
import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import { CTA } from '@/features/industries/components/CTA';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import {
  financialServicesIndustry,
  fintechIndustry,
  lifeSciencesIndustry,
  healthcareIndustry,
} from '@/features/industries';

const INDUSTRY_REGISTRY = [
  financialServicesIndustry,
  fintechIndustry,
  lifeSciencesIndustry,
  healthcareIndustry,
];

export const metadata: Metadata = generatePageMetadata({
  title: 'Industries — Sathus Technology',
  description: 'Enterprise solutions tailored for financial services, fintech, healthcare, and life sciences industries.',
  path: '/industries',
  keywords: [
    'FinTech software solutions',
    'Financial Services technology',
    'Healthcare data engineering',
    'Life Sciences AI platform',
  ],
});

export default function IndustriesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Industries', url: '/industries' }]} />

      {/* Hero */}
      <section id="industries-hero" className="scroll-mt-24 pt-6 pb-12 sm:pb-16">
        <div className="container mx-auto px-4">
          <SectionIntro
            eyebrow="Industries"
            title="Industries We Serve"
            description="Enterprise solutions tailored for your industry's unique challenges and opportunities."
            align="center"
            className="max-w-3xl mx-auto"
          />
        </div>
      </section>

      {/* Industry Grid */}
      <section id="industry-grid" className="scroll-mt-24 py-24 sm:py-32 bg-muted/20">
        <div className="container mx-auto px-4">
          <SectionIntro
            eyebrow="Our Focus"
            title="Industries"
            description="We specialize in delivering solutions to regulated and complex industries."
            className="max-w-2xl"
          />
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INDUSTRY_REGISTRY.map((industry, i) => (
              <Reveal key={industry.slug} delay={i * 0.05}>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
                >
                  <div className="rounded-xl border border-border bg-background p-6 h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30">
                    <h3 className="text-lg font-semibold text-foreground">{industry.name}</h3>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3 flex-grow">
                      {industry.description}
                    </p>
                  </div>
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