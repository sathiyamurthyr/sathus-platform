import { SectionIntro } from '@/components/sections/section-intro';
import type { CaseStudy } from '../../types';

interface CaseStudyHeroProps {
  caseStudy: CaseStudy;
}

export function CaseStudyHero({ caseStudy }: CaseStudyHeroProps) {
  return (
    <section id="case-study-hero" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <SectionIntro
            eyebrow={caseStudy.industry}
            title={caseStudy.title}
            description={caseStudy.challenge}
          />
          <div className="mt-6 flex flex-wrap gap-2">
            {caseStudy.technologies.map((tech) => (
              <span
                key={tech.id}
                className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}