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
      className="relative flex min-h-[85vh] flex-col overflow-hidden bg-[#070810] text-white"
    >
      {/* Dynamic Cursor Ambient Radial Light */}
      {!reduce && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${
              mousePos.y * 100
            }%, rgba(59, 130, 246, 0.12), transparent 80%)`,
          }}
        />
      )}

      {/* Engineering Grid & Slow Scanning Light Beam */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35]"
        style={{ backgroundPosition: 'center' }}
      />
      {!reduce && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent opacity-60 animate-grid-scan" />
      )}

      {/* Ambient background orbs with subtle parallax */}
      <div
        className="orb left-[-10%] top-[-10%] h-72 w-72 bg-primary/30 transition-transform duration-500 ease-out"
        style={{
          transform: reduce
            ? undefined
            : `translate3d(${(mousePos.x - 0.5) * 30}px, ${(mousePos.y - 0.5) * 30}px, 0)`,
        }}
      />
      <div
        className="orb right-[-8%] top-[20%] h-80 w-80 bg-violet-500/20 transition-transform duration-500 ease-out"
        style={{
          transform: reduce
            ? undefined
            : `translate3d(${(mousePos.x - 0.5) * -40}px, ${(mousePos.y - 0.5) * -40}px, 0)`,
        }}
      />
      <div
        className="orb bottom-[-15%] left-[30%] h-72 w-72 bg-cyan-400/15 transition-transform duration-500 ease-out"
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
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
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
              <span className="text-gradient">AI, Data & Enterprise Software</span>
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-white/70"
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
                className="group btn-shine-sweep h-12 bg-gradient-to-r from-primary via-blue-600 to-violet-600 px-7 text-base shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(59,130,246,0.45)] active:translate-y-0"
              >
                <Link href="/book-strategy-session">
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Book Strategy Session
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/20 bg-white/5 px-7 text-base text-white backdrop-blur transition-all duration-300 hover:border-primary/50 hover:bg-white/10 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              >
                <Link href="#solutions">Explore Solutions</Link>
              </Button>
            </motion.div>

            {/* Animated Metrics */}
            <motion.dl
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-6"
            >
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-2xl text-white sm:text-3xl">
                    <CountUp value={stat.value} />
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-white/55">
                    {stat.label}
                  </dd>
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