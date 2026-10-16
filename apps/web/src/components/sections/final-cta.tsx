import Link from 'next/link';
import { ArrowRight, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FinalCta() {
  return (
    <section id="final-cta" className="relative scroll-mt-24 overflow-hidden bg-white text-[#292329]">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-[0.3]" />
      <div className="orb left-[10%] top-[-20%] h-72 w-72 bg-[#A20A3A]/05" />
      <div className="orb right-[5%] bottom-[-30%] h-80 w-80 bg-[#FF9933]/05" />

      <div className="container mx-auto px-4 py-20 sm:py-28">
        <div className="relative mx-auto max-w-3xl rounded-3xl border border-[#EDE1E6] bg-[#FAF8F9] p-10 text-center shadow-sm sm:p-16">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#EDE1E6] bg-[#F9EEF2] px-3.5 py-1 text-xs font-semibold text-[#A20A3A]">
            <span>Enterprise Advisory & Implementation</span>
          </div>
          <h2 className="font-display text-4xl leading-[1.08] tracking-tight text-[#292329] sm:text-5xl">
            Ready to build your next enterprise platform?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#635861]">
            Bring us a problem worth solving. We will map the architecture, the
            data, and the path to production — in a single strategy session.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="group h-12 bg-[#A20A3A] hover:bg-[#8C0832] text-white px-7 text-base shadow-sm transition-all duration-300 hover:shadow-md">
              <Link href="/book-strategy-session">
                <CalendarClock className="mr-2 h-4 w-4 text-[#EDC11E]" />
                Book Strategy Session
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 text-[#EDC11E]" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-[#EDE1E6] bg-white px-7 text-base text-[#292329] hover:border-[#A20A3A] hover:text-[#A20A3A]"
            >
              <Link href="#solutions">Explore Solutions</Link>
            </Button>
          </div>
          <p className="mt-8 text-xs text-[#635861]">
            No vendor pitch. A working session with our principal engineers.
          </p>
        </div>
      </div>
    </section>
  );
}
