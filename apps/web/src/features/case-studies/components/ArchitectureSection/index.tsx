import Image from 'next/image';
import { SectionIntro } from '@/components/sections/section-intro';
import type { CaseStudy } from '../../types';

interface ArchitectureSectionProps {
  caseStudy: CaseStudy;
}

export function ArchitectureSection({ caseStudy }: ArchitectureSectionProps) {
  return (
    <section id="architecture" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Architecture"
          title={caseStudy.architecture.title}
          description={caseStudy.architecture.description}
        />
        <div className="mt-12">
          <div className="rounded-2xl border border-border bg-background p-6">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted/30">
              <Image
                src={caseStudy.architecture.imageUrl}
                alt={caseStudy.architecture.imageAlt}
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}