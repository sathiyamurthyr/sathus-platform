'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CalendarClock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlatformVisualization } from '@/components/sections/platform-visualization';
import { CountUp } from '@/components/ui/count-up';

const STATS = [
  { value: 'Zero-Trust', label: 'Security-by-design architecture' },
  { value: '99.95%', label: 'Platform availability target' },
  { value: '6', label: 'Regulated industries served' },
];

export function Hero() {
  const reduce = useReducedMotion();
  const [mousePos, setMousePos] = React.useState({ x: 0.5, y: 0.5 });
  const containerRef = React.useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[85vh] flex-col overflow-hidden bg-white text-[#292329]"
    >
      {/* Subtle Ambient Radial Lighting */}
      {!reduce && (
        <>
          {/* Restrained Burgundy radial glow behind left content */}
          <div
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle, rgba(162, 10, 58, 0.04) 0%, transparent 70%)',
            }}
          />
          {/* Restrained Orange radial glow behind visualization */}
          <div
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle, rgba(255, 153, 51, 0.04) 0%, transparent 70%)',
            }}
          />
        </>
      )}

      {/* Engineering Grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.4]"
        style={{ backgroundPosition: 'center' }}
      />

      {/* Ambient background orbs - restrained warm executive glow */}
      <div
        className="orb left-[-10%] top-[-10%] h-72 w-72 bg-[#A20A3A]/05 transition-transform duration-500 ease-out"
        style={{
          transform: reduce
            ? undefined
            : `translate3d(${(mousePos.x - 0.5) * 25}px, ${(mousePos.y - 0.5) * 25}px, 0)`,
        }}
      />
      <div
        className="orb right-[-8%] top-[20%] h-80 w-80 bg-[#FF9933]/05 transition-transform duration-500 ease-out"
        style={{
          transform: reduce
            ? undefined
            : `translate3d(${(mousePos.x - 0.5) * -30}px, ${(mousePos.y - 0.5) * -30}px, 0)`,
        }}
      />
      <div
        className="orb bottom-[-15%] left-[30%] h-72 w-72 bg-[#EDC11E]/05 transition-transform duration-500 ease-out"
        style={{
          transform: reduce
            ? undefined
            : `translate3d(${(mousePos.x - 0.5) * 20}px, ${(mousePos.y - 0.5) * 20}px, 0)`,
        }}
      />

      <div className="container mx-auto flex flex-1 flex-col justify-center px-4 py-8 sm:py-12">
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Editorial copy */}
          <div className="relative">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 15 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#E8E2E5] bg-[#FAF8F9] px-3.5 py-1 text-xs font-medium text-[#A20A3A] shadow-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF9933] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#A20A3A]" />
              </span>
              Enterprise AI · Data · Cloud — built for regulated industries
            </motion.div>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-balance font-display text-4xl leading-[1.08] tracking-tight text-[#292329] sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Engineering the Future of{' '}
              <span className="text-ai-gradient font-semibold">AI</span>,{' '}
              <span className="text-ai-gradient font-semibold">Data</span> & Enterprise Software
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-[#625B60] sm:text-lg"
            >
              Sathus Technology helps enterprises design, build and modernize
              AI-powered products, intelligent data platforms and cloud-native
              applications for regulated industries.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                size="lg"
                className="group btn-shine-sweep h-12 bg-[#A20A3A] hover:bg-[#8C0832] text-white px-7 text-base shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              >
                <Link href="/book-strategy-session">
                  <CalendarClock className="mr-2 h-4 w-4 text-[#EDC11E]" />
                  Book Strategy Session
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 text-[#EDC11E]" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-[#E8E2E5] bg-[#FAF8F9] px-7 text-base text-[#292329] transition-all duration-300 hover:border-[#A20A3A] hover:bg-white hover:text-[#A20A3A]"
              >
                <Link href="#solutions">Explore Solutions</Link>
              </Button>
            </motion.div>

            {/* Animated Metrics */}
            <motion.dl
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 sm:mt-10 grid max-w-xl grid-cols-3 gap-2 sm:gap-6 border-t border-[#E8E2E5] pt-6"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="group/stat relative pb-2 transition-all duration-300">
                  <dt className="font-display text-lg xs:text-xl sm:text-3xl font-semibold text-[#A20A3A] transition-transform duration-300 group-hover/stat:-translate-y-0.5">
                    <CountUp value={stat.value} />
                  </dt>
                  <dd className="mt-1 text-[0.68rem] xs:text-[0.72rem] sm:text-xs leading-tight sm:leading-snug text-[#625B60]">
                    {stat.label}
                  </dd>
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#A20A3A] to-[#FF9933] transition-all duration-300 group-hover/stat:w-full" />
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Platform visualization - vertically centered */}
          <div className="relative flex items-center justify-center">
            <PlatformVisualization />
          </div>
        </div>

        {/* Footer - centered with proper spacing */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 border-t border-[#E8E2E5] pt-8 text-xs text-[#625B60] sm:flex-row sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#10B981]" />
            AES-256 · TLS 1.3 · Zero-Trust Access Controls
          </span>
          <span className="text-center">Architected for financial services, healthcare & public sector</span>
        </div>
      </div>
    </section>
  );
}