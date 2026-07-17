'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { Cpu, Bot, Database, Cloud, Boxes, Webhook, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionIntro } from '@/components/sections/section-intro';

interface PlatformNode {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  x: number;
  y: number;
}

const NODES: PlatformNode[] = [
  { id: 'ai', label: 'AI', description: 'Agentic systems, evaluation harnesses, and guardrails that keep models accountable in production.', icon: Bot, x: 50, y: 9 },
  { id: 'data', label: 'Data', description: 'Governed lakehouses and streaming pipelines with lineage, quality, and real-time access.', icon: Database, x: 13, y: 33 },
  { id: 'cloud', label: 'Cloud', description: 'Cloud-native foundations on Azure and AWS — secure, elastic, and observable.', icon: Cloud, x: 87, y: 33 },
  { id: 'apis', label: 'APIs', description: 'Unified API and integration layer that connects agents, data, and applications.', icon: Webhook, x: 13, y: 76 },
  { id: 'products', label: 'Products', description: 'Composable enterprise applications and our product portfolio running on the platform.', icon: Boxes, x: 87, y: 76 },
  { id: 'security', label: 'Security', description: 'Zero-trust controls, encryption, and auditability woven through every layer.', icon: ShieldCheck, x: 50, y: 92 },
];

const EDGES: Array<[string, string, 'core' | 'link']> = [
  ['core', 'ai', 'core'],
  ['core', 'data', 'core'],
  ['core', 'cloud', 'core'],
  ['core', 'apis', 'core'],
  ['core', 'products', 'core'],
  ['core', 'security', 'core'],
  ['data', 'ai', 'link'],
  ['ai', 'products', 'link'],
  ['apis', 'cloud', 'link'],
  ['security', 'data', 'link'],
  ['security', 'cloud', 'link'],
  ['security', 'apis', 'link'],
];

const DEFAULT_DETAIL = {
  label: 'Sathus Platform',
  description:
    'A single operating model connecting AI, data, and cloud into composable enterprise products — governed end-to-end by security and a unified API layer. Hover or focus a layer to see how it connects.',
};

function position(id: string) {
  if (id === 'core') return { x: 50, y: 50 };
  return NODES.find((n) => n.id === id)!;
}

export function PlatformOverview() {
  const [active, setActive] = React.useState<string | null>(null);

  const detail = active
    ? NODES.find((n) => n.id === active) ?? DEFAULT_DETAIL
    : DEFAULT_DETAIL;

  const isLit = (a: string, b: string) => {
    if (!active) return true;
    return a === active || b === active || a === 'core' || b === 'core';
  };

  return (
    <section
      id="platform"
      className="scroll-mt-24 border-t border-white/10 bg-[#070810] py-20 text-white sm:py-24"
    >
      <div className="container mx-auto px-4">
        <SectionIntro
          tone="dark"
          eyebrow="Platform"
          title="One architecture, from silicon to solution"
          description="Every engagement runs on the same governed backbone — so AI, data, cloud, and products compose instead of competing."
        />

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
          {/* Graph */}
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              fill="none"
              aria-hidden="true"
            >
              {EDGES.map(([a, b, type], i) => {
                const pa = position(a);
                const pb = position(b);
                const lit = isLit(a, b);
                return (
                  <line
                    key={i}
                    x1={pa.x}
                    y1={pa.y}
                    x2={pb.x}
                    y2={pb.y}
                    stroke={lit ? 'url(#pg)' : 'rgba(255,255,255,0.12)'}
                    strokeWidth={type === 'core' ? 0.45 : 0.35}
                    strokeDasharray={type === 'link' ? '1.6 2.2' : undefined}
                    vectorEffect="non-scaling-stroke"
                    className={cn(
                      'transition-[stroke,opacity] duration-300',
                      lit ? 'opacity-100' : 'opacity-40'
                    )}
                  />
                );
              })}
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="50%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>

            {/* Core */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-violet-500 to-cyan-400 text-center shadow-2xl ring-1 ring-inset ring-white/20">
                <Cpu className="h-6 w-6 text-white" />
                <span className="mt-1 px-2 text-[0.62rem] font-semibold leading-tight text-white">
                  Sathus
                  <br />
                  Platform
                </span>
              </div>
            </div>

            {/* Peripheral nodes */}
            {NODES.map((node) => {
              const Icon = node.icon;
              const isActive = active === node.id;
              return (
                <motion.button
                  key={node.id}
                  type="button"
                  onMouseEnter={() => setActive(node.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(node.id)}
                  onBlur={() => setActive(null)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  aria-label={`${node.label}: ${node.description}`}
                  aria-pressed={isActive}
                >
                  <span
                    className={cn(
                      'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium backdrop-blur transition-all duration-300',
                      isActive
                        ? 'border-white/30 bg-white/10 text-white shadow-lg'
                        : 'border-white/10 bg-white/5 text-white/70 hover:text-white'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {node.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <div aria-live="polite">
              <h3 className="font-display text-3xl text-white">
                {active ? detail.label : 'Sathus Platform'}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-white/65">
                {detail.description}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {NODES.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onMouseEnter={() => setActive(node.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(node.id)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                    active === node.id
                      ? 'border-white/40 bg-white/15 text-white'
                      : 'border-white/10 text-white/60 hover:text-white'
                  )}
                >
                  {node.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
