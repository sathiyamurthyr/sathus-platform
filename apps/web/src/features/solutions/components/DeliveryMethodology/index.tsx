import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import type { DeliveryMethodology as DeliveryMethodologyData } from '../../types';

interface DeliveryMethodologyProps {
  methodology: DeliveryMethodologyData;
}

export function DeliveryMethodology({ methodology }: DeliveryMethodologyProps) {
  return (
    <section id="delivery-methodology" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Methodology"
          title={methodology.title}
          description={methodology.description}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {methodology.stages.map((stage, i) => (
            <Reveal key={stage.name} delay={i * 0.05}>
              <div className="rounded-xl border border-border bg-background p-6">
                <div className="flex items-baseline gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">{stage.name}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{stage.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}