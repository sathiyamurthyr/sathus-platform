import { SectionIntro } from '@/components/sections/section-intro';
import type { CaseStudy } from '../../types';

interface QuoteSectionProps {
  caseStudy: CaseStudy;
}

export function QuoteSection({ caseStudy }: QuoteSectionProps) {
  if (!caseStudy.testimonial) return null;

  return (
    <section id="testimonial" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Testimonial"
          title="What Our Client Says"
          align="center"
        />
        <div className="mt-12 max-w-3xl mx-auto">
          <blockquote className="rounded-2xl border border-border bg-background p-8 text-center">
            <p className="text-lg italic text-foreground">
              &ldquo;{caseStudy.testimonial.quote}&rdquo;
            </p>
            <footer className="mt-6">
              <div className="font-semibold text-foreground">{caseStudy.testimonial.author}</div>
              <div className="text-sm text-muted-foreground">
                {caseStudy.testimonial.title}, {caseStudy.testimonial.company}
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}