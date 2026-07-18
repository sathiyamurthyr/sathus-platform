import Link from 'next/link';
import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import type { CaseStudy } from '../../types';

interface RelatedSolutionsProps {
  caseStudy: CaseStudy;
}

// Solution name mapping
const SOLUTION_NAMES: Record<string, string> = {
  'ai-engineering': 'AI Engineering',
  'data-engineering': 'Data Engineering',
  'enterprise-applications': 'Enterprise Applications',
  'cloud-modernization': 'Cloud Modernization',
  'product-engineering': 'Product Engineering',
  'digital-transformation': 'Digital Transformation',
};

export function RelatedSolutions({ caseStudy }: RelatedSolutionsProps) {
  if (!caseStudy.relatedSolutions || caseStudy.relatedSolutions.length === 0) return null;

  return (
    <section id="related-solutions" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Related"
          title="Related Solutions"
          description="Other solutions that may interest you."
        />
        <div className="mt-12 flex flex-wrap gap-3">
          {caseStudy.relatedSolutions.map((solution, i) => (
            <Reveal key={solution} delay={i * 0.05}>
              <Link
                href={`/solutions/${solution}`}
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {SOLUTION_NAMES[solution] || solution}
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}