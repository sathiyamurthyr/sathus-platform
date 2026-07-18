import { SectionIntro } from '@/components/sections/section-intro';
import type { CaseStudy } from '../../types';

interface ChallengeSectionProps {
  caseStudy: CaseStudy;
}

export function ChallengeSection({ caseStudy }: ChallengeSectionProps) {
  return (
    <section id="challenge" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Challenge"
          title="The Problem"
          description={caseStudy.challenge}
        />
      </div>
    </section>
  );
}