import { SectionIntro } from '@/components/sections/section-intro';
import type { IndustryOverview as IndustryOverviewData } from '../../types';

interface IndustryOverviewProps {
  overview: IndustryOverviewData;
}

export function IndustryOverview({ overview }: IndustryOverviewProps) {
  return (
    <section id="overview" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Overview"
          title={overview.title}
          description={overview.description}
        />
      </div>
    </section>
  );
}