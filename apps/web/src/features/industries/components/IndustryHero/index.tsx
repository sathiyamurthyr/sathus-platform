import Link from 'next/link';
import { SectionIntro } from '@/components/sections/section-intro';
import type { IndustryHero as IndustryHeroData } from '../../types';

interface IndustryHeroProps {
  hero: IndustryHeroData;
}

export function IndustryHero({ hero }: IndustryHeroProps) {
  return (
    <section id="industry-hero" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <SectionIntro
            eyebrow="Industry"
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
        </div>
      </div>
    </section>
  );
}