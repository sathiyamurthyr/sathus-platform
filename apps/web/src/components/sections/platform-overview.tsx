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
  { id: 'ai', label: 'AI Engine', description: 'AI Intelligence Engine: Agentic systems, evaluation harnesses, and guardrails that keep models accountable in production.', icon: Bot, x: 50, y: 9 },
  { id: 'data', label: 'Data Foundation', description: 'Governed Data Foundation: Governed lakehouses and streaming pipelines with lineage, quality, and real-time access.', icon: Database, x: 13, y: 33 },
  { id: 'cloud', label: 'Cloud Execution', description: 'Cloud Infrastructure & Execution: Cloud-native foundations on Azure and AWS — secure, elastic, and observable.', icon: Cloud, x: 87, y: 33 },
  { id: 'apis', label: 'API Fabric', description: 'Unified API & Integration Fabric: High-throughput API gateway connecting agents, data pipelines, and client surfaces.', icon: Webhook, x: 13, y: 76 },
  { id: 'products', label: 'Enterprise Apps', description: 'Enterprise Applications: Composable domain-driven applications and product suites running on the unified platform.', icon: Boxes, x: 87, y: 76 },
  { id: 'security', label: 'Zero-Trust', description: 'Zero-Trust Security & Governance: Cryptographic isolation, AES-256 encryption, and auditability woven through every layer.', icon: ShieldCheck, x: 50, y: 92 },
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
  label: 'Sathus Intelligence Network',
  description:
    'A unified enterprise operating model connecting Governed Data, Cloud Infrastructure, and AI Engine into Composable Enterprise Applications — secured end-to-end by Zero-Trust governance. Hover or focus a layer to inspect its live connections.',
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
      className="scroll-mt-24 border-t border-[#E8E2E5] bg-white py-20 text-[#292329] sm:py-24"
    >
      <div className="container mx-auto px-4">
        <SectionIntro
          tone="light"
          eyebrow="Sathus Intelligence Network"
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
                    stroke={lit ? 'url(#pg)' : '#E8E2E5'}
                    strokeWidth={type === 'core' ? 0.5 : 0.35}
                    strokeDasharray={type === 'link' ? '1.6 2.2' : undefined}
                    vectorEffect="non-scaling-stroke"
                    className={cn(
                      'transition-[stroke,opacity] duration-300',
                      lit ? 'opacity-100' : 'opacity-50'
                    )}
                  />
                );
              })}
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#A20A3A" />
                  <stop offset="50%" stopColor="#FF9933" />
                  <stop offset="100%" stopColor="#EDC11E" />
                </linearGradient>
              </defs>
            </svg>

            {/* Core */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-[#A20A3A] text-center shadow-lg border border-[#A20A3A]">
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
                      'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium backdrop-blur transition-all duration-300 shadow-xs',
                      isActive
                        ? 'border-[#A20A3A] bg-[#A20A3A] text-white shadow-md'
                        : 'border-[#E8E2E5] bg-[#FAF8F9] text-[#625B60] hover:text-[#A20A3A] hover:border-[#A20A3A] hover:bg-white'
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
          <div className="rounded-2xl border border-[#E8E2E5] bg-[#FAF8F9] p-8 shadow-xs">
            <div aria-live="polite">
              <h3 className="font-display text-3xl text-[#292329]">
                {active ? detail.label : 'Sathus Platform'}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-[#625B60]">
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
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A20A3A]',
                    active === node.id
                      ? 'border-[#A20A3A] bg-[#A20A3A] text-white shadow-xs'
                      : 'border-[#E8E2E5] bg-white text-[#625B60] hover:text-[#A20A3A] hover:border-[#A20A3A]'
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
