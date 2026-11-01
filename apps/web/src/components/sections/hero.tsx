'use client';

import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Play,
  X,
  ChevronDown,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const CinematicHero3D = dynamic(
  () => import('@/components/sections/cinematic-hero-3d').then((mod) => mod.CinematicHero3D),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-b from-[#2E0B19] via-[#4A1528] to-[#120409]">
        <div className="flex flex-col items-center gap-3">
          <span className="relative flex h-5 w-5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF9933] opacity-75" />
            <span className="relative inline-flex h-5 w-5 rounded-full bg-[#A20A3A]" />
          </span>
          <span className="text-xs font-mono tracking-widest text-[#FFB366]">INITIALIZING 3D UNIVERSE...</span>
        </div>
      </div>
    ),
  }
);

export function Hero() {
  const reduce = useReducedMotion();
  const [storyOpen, setStoryOpen] = React.useState(false);
  const [activeStoryChapter, setActiveStoryChapter] = React.useState(0);

  const storyChapters = [
    {
      title: '01 · The Sathus Engineering Mandate',
      desc: 'We engineer deterministic, accountable enterprise intelligence. Built directly for regulated industries without fragile black-box wrappers.',
      stat: '99.95%',
      statLabel: 'Contractual Availability SLA',
    },
    {
      title: '02 · Autonomous AI Agents & Swarms',
      desc: 'Multi-agent orchestration squads with cryptographic audit trails, LangGraph workflows, and strict Zero-Trust guardrails.',
      stat: '100%',
      statLabel: 'Audited Model Traces',
    },
    {
      title: '03 · Governed Apache Iceberg Lakehouses',
      desc: 'Unified streaming & analytical data architecture eliminating vendor lock-in with open-table standards.',
      stat: '10x',
      statLabel: 'Faster Analytical Queries',
    },
    {
      title: '04 · Mission-Critical Cloud Modernization',
      desc: 'Zero-downtime cutovers, microservices decoupling, and Kubernetes enterprise mesh infrastructure.',
      stat: 'Zero',
      statLabel: 'Operational Downtime',
    },
  ];

  return (
    <>
      <section
        className="relative flex min-h-[100vh] w-full flex-col justify-between overflow-hidden select-none bg-[#14040a] text-white"
        aria-label="Sathus Technology Developed 3D WebGL Universe"
      >
        {/* ======================================================= */}
        {/* PURE DEVELOPED 3D WEBGL ENGINE CANVAS (NO STATIC IMAGE) */}
        {/* ======================================================= */}
        <div className="absolute inset-0 z-0 h-full w-full">
          <CinematicHero3D />
        </div>

        {/* Cinematic Vignette Gradients (Enhances left-column text contrast against 3D sky) */}
        <div
          className="pointer-events-none absolute inset-0 z-1"
          style={{
            background:
              'linear-gradient(to right, rgba(20, 4, 10, 0.85) 0%, rgba(20, 4, 10, 0.6) 30%, rgba(20, 4, 10, 0.1) 58%, transparent 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-36 z-1"
          style={{
            background:
              'linear-gradient(to top, rgba(16, 2, 8, 0.95) 0%, rgba(16, 2, 8, 0.3) 60%, transparent 100%)',
          }}
        />

        {/* Top Spacer for header */}
        <div className="h-16 w-full" />

        {/* ======================================================= */}
        {/* FOREGROUND: Editorial Headline & Dual CTAs             */}
        {/* ======================================================= */}
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 my-auto">
          <div className="max-w-xl lg:max-w-2xl">
            {/* Pill Badge */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 15 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF9933] opacity-80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF9933]" />
              </span>
              <span className="tracking-wide">AI · Data · Cloud · Enterprise</span>
            </motion.div>

            {/* Monumental Headline */}
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 22 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 font-display text-4xl leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.2rem]"
            >
              Engineering the{' '}
              <br className="hidden sm:inline" />
              Future of{' '}
              <span className="bg-gradient-to-r from-[#FFB366] via-[#FF9933] to-[#FFAE5C] bg-clip-text text-transparent font-semibold">
                AI, Data &
              </span>{' '}
              <br className="hidden sm:inline" />
              <span className="text-white drop-shadow-[0_2px_12px_rgba(162,10,58,0.6)] font-semibold">
                Enterprise Software.
              </span>
            </motion.h1>

            {/* Subtitle / Paragraph */}
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg"
            >
              We engineer intelligent enterprise platforms, governed data ecosystems and cloud-native applications that turn complex business challenges into meaningful outcomes.
            </motion.p>

            {/* Dual CTAs (Burgundy Solid Pill + Glass Play Pill) */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <Button
                asChild
                size="lg"
                className="group h-13 rounded-full bg-[#850B30] hover:bg-[#A20A3A] text-white px-8 text-sm font-semibold shadow-[0_4px_24px_rgba(133,11,48,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_30px_rgba(162,10,58,0.8)] border border-[#FF9933]/30 cursor-pointer"
              >
                <Link href="/solutions">
                  Explore Our Solutions
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <button
                type="button"
                onClick={() => setStoryOpen(true)}
                className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-full border border-white/40 bg-white/15 px-7 text-sm font-semibold text-white shadow-md backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:border-white hover:shadow-lg cursor-pointer"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[#FF9933] transition-transform group-hover:scale-110">
                  <Play className="h-3.5 w-3.5 fill-[#FF9933]" />
                </span>
                <span>Watch Our Story</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* ======================================================= */}
        {/* BOTTOM: Animated Scroll to Explore Indicator            */}
        {/* ======================================================= */}
        <div className="relative z-10 flex w-full flex-col items-center justify-center pb-6 sm:pb-8">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center gap-1.5 cursor-pointer text-white/80 hover:text-white transition-colors"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight * 0.95,
                behavior: 'smooth',
              });
            }}
          >
            {/* Minimalist Mouse Icon */}
            <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-white/60 p-1">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="h-1.5 w-1 rounded-full bg-[#FF9933]"
              />
            </div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-white/80">
              Scroll to Explore
            </span>
            <ChevronDown className="h-3.5 w-3.5 animate-bounce text-[#FF9933]" />
          </motion.div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* CINEMATIC STORY MODAL ("Watch Our Story")               */}
      {/* ======================================================= */}
      <AnimatePresence>
        {storyOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-[#2E0B19] via-[#1A050E] to-[#0D0207] p-6 sm:p-10 shadow-2xl text-white"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setStoryOpen(false)}
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF9933] uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Executive Architectural Showcase</span>
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-display font-bold text-white">
                The Sathus Connected Intelligence Universe
              </h2>
              <p className="mt-2 text-sm text-white/70">
                A 3-minute architectural briefing on how Sathus Technology engineers mission-critical enterprise systems.
              </p>

              {/* Interactive Story Showcase Frame */}
              <div className="mt-6 rounded-2xl border border-white/15 bg-black/60 p-6 sm:p-8 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div>
                    <span className="text-xs font-mono text-[#FF9933]">
                      CURRENT CHAPTER
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {storyChapters[activeStoryChapter].title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-display font-bold text-[#FF9933]">
                      {storyChapters[activeStoryChapter].stat}
                    </span>
                    <span className="text-xs text-white/60 max-w-[120px] leading-tight">
                      {storyChapters[activeStoryChapter].statLabel}
                    </span>
                  </div>
                </div>

                <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/90">
                  {storyChapters[activeStoryChapter].desc}
                </p>

                {/* Chapter Navigation Dots */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {storyChapters.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveStoryChapter(idx)}
                        className={`h-2.5 rounded-full transition-all cursor-pointer ${
                          activeStoryChapter === idx
                            ? 'w-8 bg-[#FF9933]'
                            : 'w-2.5 bg-white/30 hover:bg-white/60'
                        }`}
                        title={`Go to chapter ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={activeStoryChapter === 0}
                      onClick={() => setActiveStoryChapter((prev) => Math.max(0, prev - 1))}
                      className="border-white/20 bg-white/5 text-white hover:bg-white/15 disabled:opacity-30 cursor-pointer"
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (activeStoryChapter < storyChapters.length - 1) {
                          setActiveStoryChapter((prev) => prev + 1);
                        } else {
                          setStoryOpen(false);
                        }
                      }}
                      className="bg-[#850B30] hover:bg-[#A20A3A] text-white cursor-pointer"
                    >
                      {activeStoryChapter < storyChapters.length - 1 ? 'Next Chapter' : 'Explore Platform'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Modal Footer CTAs */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-[#FF9933]" />
                  <span>Verified Sathus Technology Corporate Infrastructure</span>
                </div>
                <Button asChild size="sm" className="bg-[#FF9933] hover:bg-[#DE6419] text-[#292329] font-bold cursor-pointer">
                  <Link href="/company/contact" onClick={() => setStoryOpen(false)}>
                    Book Strategy Session →
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
