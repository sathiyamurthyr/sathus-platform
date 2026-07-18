import Link from 'next/link';
import { SectionIntro } from '@/components/sections/section-intro';

interface CTAProps {
  ctaText?: string;
  ctaHref?: string;
}

export function CTA({ ctaText = 'Ready to transform your industry?', ctaHref = '/contact' }: CTAProps) {
  return (
    <section id="cta" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="rounded-2xl bg-primary/5 p-8 sm:p-12 text-center">
          <SectionIntro
            title={ctaText}
            description="Let's discuss how our solutions can drive measurable outcomes for your business."
            align="center"
          />
          <Link
            href={ctaHref}
            className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Start the conversation
          </Link>
        </div>
      </div>
    </section>
  );
}