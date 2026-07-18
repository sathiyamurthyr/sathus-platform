import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import type { CaseStudy } from '../../types';

interface OutcomeSectionProps {
  caseStudy: CaseStudy;
}

export function OutcomeSection({ caseStudy }: OutcomeSectionProps) {
  if (!caseStudy.outcomes || caseStudy.outcomes.length === 0) return null;

  return (
    <section id="outcomes" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Outcomes"
          title="Business Outcomes"
          description="Results delivered to the client."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caseStudy.outcomes.map((outcome, i) => (
            <Reveal key={outcome.id} delay={i * 0.05}>
              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="text-lg font-semibold text-foreground">{outcome.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{outcome.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}