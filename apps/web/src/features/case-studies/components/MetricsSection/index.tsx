import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import type { CaseStudy } from '../../types';

interface MetricsSectionProps {
  caseStudy: CaseStudy;
}

export function MetricsSection({ caseStudy }: MetricsSectionProps) {
  if (!caseStudy.metrics || caseStudy.metrics.length === 0) return null;

  return (
    <section id="metrics" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Metrics"
          title="Key Results"
          description="Measurable outcomes from our solution."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caseStudy.metrics.map((metric, i) => (
            <Reveal key={metric.id} delay={i * 0.05}>
              <div className="rounded-xl border border-border bg-background p-6 text-center">
                <div className="font-display text-4xl text-primary">{metric.value}</div>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{metric.label}</h3>
                {metric.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{metric.description}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}