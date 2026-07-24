'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CalendarClock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlatformVisualization } from '@/components/sections/platform-visualization';
import { CountUp } from '@/components/ui/count-up';

const STATS = [
  { value: 'ISO 27001', label: 'Aligned security program' },
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
      className="relative flex min-h-[85vh] flex-col overflow-hidden bg-[#0D0B10] text-white"
    >
      {/* Subtle Ambient Radial Lighting */}
      {!reduce && (
        <>
          {/* Low opacity Burgundy behind left section (max 8-10%) */}
          <div
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle, rgba(148, 0, 58, 0.08) 0%, transparent 70%)',
            }}
          />
          {/* AI Blue Radial Glow behind AI Core (right side) */}
          <div
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle, rgba(79, 124, 255, 0.15) 0%, transparent 70%)',
            }}
          />
        </>
      )}

      {/* Engineering Grid & Subtle Light Beam */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35]"
        style={{ backgroundPosition: 'center' }}
      />
      {!reduce && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#4F7CFF]/10 via-transparent to-transparent opacity-40 animate-grid-scan" />
      )}

      {/* Ambient background orbs - restrained executive AI glow */}
      <div
        className="orb left-[-10%] top-[-10%] h-72 w-72 bg-[#94003A]/08 transition-transform duration-500 ease-out"
        style={{
          transform: reduce
            ? undefined
            : `translate3d(${(mousePos.x - 0.5) * 30}px, ${(mousePos.y - 0.5) * 30}px, 0)`,
        }}
      />
      <div
        className="orb right-[-8%] top-[20%] h-80 w-80 bg-[#4F7CFF]/12 transition-transform duration-500 ease-out"
        style={{
          transform: reduce
            ? undefined
            : `translate3d(${(mousePos.x - 0.5) * -40}px, ${(mousePos.y - 0.5) * -40}px, 0)`,
        }}
      />
      <div
        className="orb bottom-[-15%] left-[30%] h-72 w-72 bg-[#E7B631]/05 transition-transform duration-500 ease-out"
        style={{
          transform: reduce
            ? undefined
            : `translate3d(${(mousePos.x - 0.5) * 20}px, ${(mousePos.y - 0.5) * 20}px, 0)`,
        }}
      />

      <div className="container mx-auto flex flex-1 flex-col justify-center px-4">
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Editorial copy */}
          <div className="relative">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 15 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(231,182,49,0.25)] bg-[rgba(148,0,58,0.15)] px-3 py-1 text-xs font-medium text-[#E7B631] backdrop-blur"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#37D5FF] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4F7CFF]" />
              </span>
              Enterprise AI · Data · Cloud — built for regulated industries
            </motion.div>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 font-display text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Engineering the Future of{' '}
              <span className="text-ai-gradient font-semibold">AI</span>,{' '}
              <span className="text-ai-gradient font-semibold">Data</span> & Enterprise Software
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-[#D6D6D6]"
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
                className="group btn-shine-sweep h-12 bg-gradient-to-r from-[#94003A] via-[#B5004A] to-[#94003A] text-white px-7 text-base shadow-[0_10px_30px_rgba(231,182,49,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(231,182,49,0.35)] active:translate-y-0"
              >
                <Link href="/book-strategy-session">
                  <CalendarClock className="mr-2 h-4 w-4 text-[#E7B631]" />
                  Book Strategy Session
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 text-[#E7B631]" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-[#E7B631] bg-transparent px-7 text-base text-white backdrop-blur transition-all duration-300 hover:border-[#E7B631] hover:bg-[#94003A] hover:text-white hover:shadow-[0_0_20px_rgba(79,124,255,0.3)]"
              >
                <Link href="#solutions">Explore Solutions</Link>
              </Button>
            </motion.div>

            {/* Animated Metrics */}
            <motion.dl
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-[#40202C] pt-6"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="group/stat relative pb-2 transition-all duration-300">
                  <dt className="font-display text-2xl text-[#E7B631] sm:text-3xl transition-transform duration-300 group-hover/stat:-translate-y-0.5">
                    <CountUp value={stat.value} />
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-[#D6D6D6]">
                    {stat.label}
                  </dd>
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#4F7CFF] to-[#37D5FF] transition-all duration-300 group-hover/stat:w-full" />
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
        <div className="flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            SOC 2 Type II · GDPR · HIPAA-ready controls
          </span>
          <span className="text-center">Architected for financial services, healthcare & public sector</span>
        </div>
      </div>
    </section>
  );
}