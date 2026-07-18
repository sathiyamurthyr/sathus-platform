import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import type { CaseStudy } from '../../types';

interface TimelineSectionProps {
  caseStudy: CaseStudy;
}

export function TimelineSection({ caseStudy }: TimelineSectionProps) {
  return (
    <section id="timeline" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Timeline"
          title="Delivery Timeline"
          description={`Project completed in ${caseStudy.timeline.duration}.`}
        />
        <div className="mt-12">
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-border" aria-hidden="true" />
            <ul className="space-y-8">
              {caseStudy.timeline.phases.map((phase, i) => (
                <Reveal key={phase.name} delay={i * 0.05}>
                  <li className="relative flex gap-6">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{phase.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{phase.description}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}