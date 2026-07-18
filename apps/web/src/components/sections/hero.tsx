import Link from 'next/link';
import { ArrowRight, CalendarClock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlatformVisualization } from '@/components/sections/platform-visualization';

const STATS = [
  { value: 'ISO 27001', label: 'Aligned security program' },
  { value: '99.95%', label: 'Platform availability target' },
  { value: '6', label: 'Regulated industries served' },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col overflow-hidden bg-[#070810] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-[0.35]" />
      <div className="orb left-[-10%] top-[-10%] h-72 w-72 bg-primary/30" />
      <div className="orb right-[-8%] top-[20%] h-80 w-80 bg-violet-500/20" />
      <div className="orb bottom-[-15%] left-[30%] h-72 w-72 bg-cyan-400/15" />

      <div className="container mx-auto flex flex-1 flex-col justify-center px-4">
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Editorial copy */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Enterprise AI · Data · Cloud — built for regulated industries
            </div>

            <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Engineering the Future of{' '}
              <span className="text-gradient">AI, Data &amp; Enterprise Software</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              Sathus Technology helps enterprises design, build and modernize
              AI-powered products, intelligent data platforms and cloud-native
              applications for regulated industries.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="group h-12 px-7 text-base">
                <Link href="/contact">
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Book a Strategy Call
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

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-2xl text-white sm:text-3xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-white/55">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

{/* Platform visualization - vertically centered */}
          <div className="relative flex items-center justify-center">
            <PlatformVisualization />
          </div>
        </div>

<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-8 pb-6 text-xs text-white/50 lg:justify-between">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            SOC 2 Type II · GDPR · HIPAA-ready controls
          </span>
          <span className="lg:ml-auto">Architected for financial services, healthcare & public sector</span>
        </div>
      </div>
    </section>
  );
}
