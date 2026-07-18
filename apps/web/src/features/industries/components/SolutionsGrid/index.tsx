import Link from 'next/link';
import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import type { IndustrySolution } from '../../types';

interface SolutionsGridProps {
  solutions: IndustrySolution[];
}

export function SolutionsGrid({ solutions }: SolutionsGridProps) {
  return (
    <section id="solutions" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Solutions"
          title="Recommended Sathus Solutions"
          description="Our solutions tailored for this industry."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, i) => (
            <Reveal key={solution.id} delay={i * 0.05}>
              <Link href={solution.href} className="block">
                <div className="rounded-xl border border-border bg-background p-6 transition-colors duration-300 hover:bg-muted/40">
                  <h3 className="text-lg font-semibold text-foreground">{solution.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{solution.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}