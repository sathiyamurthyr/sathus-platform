import Image from 'next/image';
import { SectionIntro } from '@/components/sections/section-intro';
import type { ArchitectureDiagram as ArchitectureDiagramData } from '../../types';

interface ArchitectureDiagramProps {
  architecture: ArchitectureDiagramData;
}

export function ArchitectureDiagram({ architecture }: ArchitectureDiagramProps) {
  return (
    <section id="architecture" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Architecture"
          title={architecture.title}
          description={architecture.description}
        />
        <div className="mt-12">
          <div className="rounded-2xl border border-border bg-background p-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted/30">
              <Image
                src={architecture.imageUrl}
                alt={architecture.imageAlt}
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
