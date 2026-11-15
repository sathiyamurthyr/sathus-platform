'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Lock, Brain, Cloud, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@sathus-platform/ui';
import { HeroVisualization } from '@/components/sections/hero-visualization';
import { cn } from '@sathus-platform/utils';

const TRUST_INDICATORS = [
  { label: 'Privacy First', icon: Lock },
  { label: 'AI Powered', icon: Brain },
  { label: 'Cloud Native', icon: Cloud },
  { label: 'Built for Scale', icon: Zap },
];

const NETWORK_NODES = [
  { x: 50, y: 30 },
  { x: 20, y: 50 },
  { x: 80, y: 45 },
  { x: 35, y: 75 },
  { x: 65, y: 80 },
  { x: 15, y: 20 },
  { x: 85, y: 70 },
  { x: 45, y: 15 },
  { x: 55, y: 60 },
];

const NETWORK_EDGES = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [5, 0],
  [6, 2],
  [7, 0],
  [8, 1],
  [8, 2],
  [5, 7],
  [6, 4],
  [3, 8],
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[85vh] flex-col overflow-hidden bg-[#070810] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-[0.35]" />
      <div className="orb left-[-10%] top-[-10%] h-72 w-72 bg-primary/30" />
      <div className="orb right-[-8%] top-[20%] h-80 w-80 bg-violet-500/20" />
      <div className="orb bottom-[-15%] left-[30%] h-72 w-72 bg-cyan-400/15" />

      {/* Background animated network */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.07]" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          {NETWORK_EDGES.map((edge, i) => (
            <line
              key={i}
              x1={String(NETWORK_NODES[edge[0]].x)}
              y1={String(NETWORK_NODES[edge[0]].y)}
              x2={String(NETWORK_NODES[edge[1]].x)}
              y2={String(NETWORK_NODES[edge[1]].y)}
              stroke="url(#networkGradient)"
              strokeWidth="0.4"
              strokeDasharray="2.5 2.5"
              className={reduce ? '' : 'animate-dash'}
              opacity="0.6"
            />
          ))}
          {NETWORK_NODES.map((node, i) => (
            <circle
              key={i}
              cx={String(node.x)}
              cy={String(node.y)}
              r="0.6"
              fill="url(#networkGradient)"
              opacity="0.8"
              className={reduce ? '' : 'animate-pulse'}
            />
          ))}
        </svg>
      </div>

      {/* Subtle particles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/20"
            style={{
              left: `${((i * 23 + 7) % 100)}%`,
              top: `${((i * 37 + 13) % 100)}%`,
              animation: reduce ? 'none' : `pulse ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${(i * 0.7) % 4}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto flex flex-1 flex-col justify-center px-4">
        <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-[1fr_1fr]">
          {/* Left: Content */}
          <motion.div
            className="relative"
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Enterprise AI · Data · Cloud — built for regulated industries
            </div>

            <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Engineering Intelligent Products for Tomorrow.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              Sathus Technology builds secure, intelligent, and scalable AI, Cloud, Healthcare, and Data platforms that help businesses innovate with confidence.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="group h-12 px-7 text-base">
                <Link href="#products">
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/20 bg-white/5 px-7 text-base text-white backdrop-blur hover:bg-white/10 hover:text-white"
              >
                <Link href="#solutions">Discover Our Vision</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {TRUST_INDICATORS.map((indicator) => {
                const Icon = indicator.icon;
                return (
                  <span
                    key={indicator.label}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur transition-colors hover:border-white/20 hover:text-white'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    {indicator.label}
                  </span>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Visualization */}
          <motion.div
            className="relative"
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
