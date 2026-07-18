import { Metadata } from 'next';
import Link from 'next/link';
import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import { CTA } from '@/features/industries/components/CTA';
import {
  financialServicesIndustry,
} from '@/features/industries/data/financial-services';

const SITE_URL = 'https://sathus.in';

// Industry registry - will be expanded as more industries are added
const INDUSTRY_REGISTRY = [
  financialServicesIndustry,
];

export const metadata: Metadata = {
  title: 'Industries',
  description:
    'Enterprise solutions tailored for financial services, healthcare, manufacturing, retail, and other industries.',
  alternates: {
    canonical: '/industries',
  },
  openGraph: {
    title: 'Industries — Sathus Technology',
    description:
      'Industry-specific solutions engineered for measurable business outcomes.',
    url: `${SITE_URL}/industries`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Industries — Sathus Technology',
    description:
      'Industry-specific solutions engineered for measurable business outcomes.',
  },
};

export default function IndustriesPage() {
  return (
    <>
      {/* Hero */}
      <section id="industries-hero" className="scroll-mt-24 py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <SectionIntro
            eyebrow="Industries"
            title="Industries We Serve"
            description="Enterprise solutions tailored for your industry's unique challenges and opportunities."
            align="center"
          />
        </div>
      </section>

      {/* Industry Grid */}
      <section id="industry-grid" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <SectionIntro
            eyebrow="Our Focus"
            title="Industries"
            description="We specialize in delivering solutions to regulated and complex industries."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INDUSTRY_REGISTRY.map((industry, i) => (
              <Reveal key={industry.slug} delay={i * 0.05}>
                <Link href={`/industries/${industry.slug}`} className="block">
                  <div className="rounded-xl border border-border bg-background p-6 transition-colors duration-300 hover:bg-muted/40">
                    <h3 className="text-lg font-semibold text-foreground">{industry.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
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