import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import type { CaseStudy } from '../../types';

interface CaseStudiesProps {
  caseStudies: CaseStudy[];
}

export function CaseStudies({ caseStudies }: CaseStudiesProps) {
  return (
    <section id="case-studies" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Case Studies"
          title="Success Stories"
          description="Real-world examples of how we've delivered AI solutions for enterprise clients."
        />
        <div className="mt-12 space-y-12">
          {caseStudies.map((caseStudy, i) => (
            <Reveal key={caseStudy.id} delay={i * 0.05}>
              <div className="rounded-2xl border border-border bg-background p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">{caseStudy.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {caseStudy.client} • {caseStudy.industry} • {caseStudy.duration}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:justify-end">
                    {caseStudy.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Challenge
                    </h4>
                    <p className="mt-1.5 text-sm text-foreground/80">{caseStudy.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Solution
                    </h4>
                    <p className="mt-1.5 text-sm text-foreground/80">{caseStudy.solution}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Outcome
                    </h4>
                    <p className="mt-1.5 text-sm font-medium text-primary">{caseStudy.outcome}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}