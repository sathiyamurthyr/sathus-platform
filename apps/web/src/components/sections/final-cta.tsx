import Link from 'next/link';
import { ArrowRight, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCta() {
  return (
    <section id="final-cta" className="relative scroll-mt-24 overflow-hidden bg-[#070810] text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-[0.3]" />
      <div className="orb left-[10%] top-[-20%] h-72 w-72 bg-primary/25" />
      <div className="orb right-[5%] bottom-[-30%] h-80 w-80 bg-violet-500/20" />

      <div className="container mx-auto px-4 py-20 sm:py-28">
        <div className="relative mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-md sm:p-16">
          <h2 className="font-display text-4xl leading-[1.08] tracking-tight text-white sm:text-5xl">
            Ready to build your next enterprise platform?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/65">
            Bring us a problem worth solving. We will map the architecture, the
            data, and the path to production — in a single strategy session.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="group h-12 px-7 text-base">
              <Link href="/book-strategy-session">
                <CalendarClock className="mr-2 h-4 w-4" />
                Book Strategy Session
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/20 bg-white/5 px-7 text-base text-white backdrop-blur hover:bg-white/10 hover:text-white"
            >
              <Link href="#solutions">Explore Solutions</Link>
            </Button>
          </div>
          <p className="mt-8 text-xs text-white/40">
            No vendor pitch. A working session with our principal engineers.
          </p>
        </div>
      </div>
    </section>
  );
}
