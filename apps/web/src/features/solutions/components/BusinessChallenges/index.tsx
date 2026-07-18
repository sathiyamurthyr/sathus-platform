import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import type { Challenge } from '../../types';

interface BusinessChallengesProps {
  challenges: Challenge[];
}

export function BusinessChallenges({ challenges }: BusinessChallengesProps) {
  return (
    <section id="business-challenges" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Challenges"
          title="Business Challenges We Solve"
          description="Common obstacles that prevent enterprises from realizing the full value of AI initiatives."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
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