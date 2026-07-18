import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import type { IndustryChallenge } from '../../types';

interface IndustryChallengesProps {
  challenges: IndustryChallenge[];
}

export function IndustryChallenges({ challenges }: IndustryChallengesProps) {
  return (
    <section id="challenges" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Challenges"
          title="Business Challenges"
          description="Common challenges faced by organizations in this industry."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, i) => (
            <Reveal key={challenge.id} delay={i * 0.05}>
              <div className="rounded-xl border border-border bg-background p-6">
                <h3 className="text-lg font-semibold text-foreground">{challenge.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{challenge.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}