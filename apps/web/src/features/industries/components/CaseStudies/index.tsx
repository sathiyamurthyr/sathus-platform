import Link from 'next/link';
import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import type { CaseStudyReference } from '../../types';

interface CaseStudiesProps {
  caseStudies: CaseStudyReference[];
}

export function CaseStudies({ caseStudies }: CaseStudiesProps) {
  if (!caseStudies || caseStudies.length === 0) return null;

  return (
    <section id="case-studies" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Case Studies"
          title="Success Stories"
          description="Real-world examples of our work in this industry."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((caseStudy, i) => (
            <Reveal key={caseStudy.id} delay={i * 0.05}>
              <Link href={`/case-studies/${caseStudy.slug}`} className="block">
                <div className="rounded-xl border border-border bg-background p-6 transition-colors duration-300 hover:bg-muted/40">
                  <h3 className="text-lg font-semibold text-foreground">{caseStudy.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{caseStudy.industry}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}