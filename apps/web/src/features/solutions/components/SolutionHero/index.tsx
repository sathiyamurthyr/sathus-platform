import Link from 'next/link';
import { SectionIntro } from '@/components/sections/section-intro';
import type { SolutionHero as SolutionHeroData } from '../../types';

interface SolutionHeroProps {
  hero: SolutionHeroData;
}

export function SolutionHero({ hero }: SolutionHeroProps) {
  return (
    <section id="solution-hero" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <SectionIntro
            eyebrow="Solution"
            title={hero.title}
            description={hero.description}
          />
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href={hero.primaryCta.href}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {hero.primaryCta.text}
            </Link>
            <Link
              href={hero.secondaryCta.href}
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {hero.secondaryCta.text}
            </Link>
          </div>
          {hero.stats && hero.stats.length > 0 && (
            <dl className="mt-12 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
              {hero.stats.map((stat, i) => (
                <div key={i} className="border-t border-border pt-4">
                  <dt className="font-display text-3xl text-foreground">
                    {stat.value}
                    {stat.valueLabel && (
                      <span className="block text-xs font-normal text-muted-foreground">
                        {stat.valueLabel}
                      </span>
                    )}
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{stat.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}