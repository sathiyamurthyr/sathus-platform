'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Search,
  Layers,
  Code2,
  ShieldCheck,
  Infinity as InfinityIcon,
  Sparkles,
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Discover',
    tagline: 'Understand goals and opportunities',
    desc: 'Deep technical discovery, outcome framing, domain boundary modeling, and rapid architectural feasibility spikes.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Architect',
    tagline: 'Design scalable and secure solutions',
    desc: 'Target-state reference architectures, formal data contracts, multi-region high availability, and Zero-Trust security postures.',
    icon: Layers,
  },
  {
    step: '03',
    title: 'Build',
    tagline: 'Engineer with quality and speed',
    desc: 'Senior principal squads shipping tested, reviewable, production-ready code with continuous daily delivery cadences.',
    icon: Code2,
  },
  {
    step: '04',
    title: 'Validate',
    tagline: 'Test, secure and ensure compliance',
    desc: 'Rigorous deterministic evaluation harnesses, automated chaos fuzzing, and compliance audits before code promotes.',
    icon: ShieldCheck,
  },
  {
    step: '05',
    title: 'Operate',
    tagline: 'Run, monitor and continuously improve',
    desc: 'Telemetry observability, contractual SLA governance (99.95%+), and automated self-healing cloud runtime management.',
    icon: InfinityIcon,
  },
];

export function CinematicPositioning() {
  const reduce = useReducedMotion();

  return (
    <section id="methodology" className="relative w-full bg-white py-24 sm:py-32 border-t border-[#EDE1E6]">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-[#850B30] font-bold">
            OUR METHODOLOGY
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#292329]">
            The Sathus Engineering Approach
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#635861] leading-relaxed">
            A proven, end-to-end framework to build, deliver and run enterprise solutions that survive real-world scale.
          </p>
        </div>

        {/* Horizontal Connecting Pipeline Track (Desktop) */}
        <div className="relative mt-16">
          <div className="hidden lg:block absolute top-[58px] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-[#FF9933]/30 via-[#FF9933] to-[#FF9933]/30 z-0 shadow-[0_0_14px_rgba(255,153,51,0.7)]" />

          {/* 5 Beveled Glass Workflow Badges in a Row */}
          <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;

            return (
              <motion.div
                key={s.title}
                initial={reduce ? false : { opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#EDE1E6] bg-[#FAF8F9] p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FF9933] hover:shadow-lg hover:bg-white"
              >
                <div>
                  {/* Step Hexagon/Circle Icon */}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#EDE1E6] bg-white text-[#850B30] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:border-[#FF9933] group-hover:text-[#FF9933]">
                    <Icon className="h-7 w-7 stroke-[1.8]" />
                  </div>

                  <span className="mt-5 block font-mono text-xs font-bold uppercase tracking-wider text-[#FF9933]">
                    Step {s.step}
                  </span>

                  <h3 className="mt-1 font-display text-2xl font-bold text-[#292329]">
                    {s.title}
                  </h3>

                  <p className="mt-2 text-xs font-semibold text-[#850B30]">
                    {s.tagline}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-[#635861]">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
