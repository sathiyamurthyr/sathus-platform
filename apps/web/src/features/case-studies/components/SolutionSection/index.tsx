import { SectionIntro } from '@/components/sections/section-intro';
import type { CaseStudy } from '../../types';

interface SolutionSectionProps {
  caseStudy: CaseStudy;
}

export function SolutionSection({ caseStudy }: SolutionSectionProps) {
  return (
    <section id="solution" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Solution"
          title="Our Approach"
          description={caseStudy.solution}
        />
      </div>
    </section>
  );
}