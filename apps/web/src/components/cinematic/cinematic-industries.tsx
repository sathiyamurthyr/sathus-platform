'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  HeartPulse,
  CreditCard,
  ShoppingCart,
  Building2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface IndustrySector {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: typeof HeartPulse;
  href: string;
  compliance: string;
  gradient: string;
  sceneHighlight: string;
}

const SECTORS: IndustrySector[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    tagline: 'Clinical Systems & Patient Record Platforms',
    description:
      'Interoperable, consent-driven healthcare platforms built to ABDM milestones and HIPAA privacy standards with zero PHI leakage.',
    icon: HeartPulse,
    href: '/industries/healthcare',
    compliance: 'HIPAA & ABDM Compliant',
    gradient: 'from-[#3A0D1D] via-[#5C162E] to-[#850B30]',
    sceneHighlight: 'rgba(255, 100, 130, 0.4)',
  },
  {
    id: 'fintech',
    name: 'FinTech',
    tagline: 'High-Throughput Risk & Transaction Rails',
    description:
      'Event-driven streaming payment engines with sub-40ms fraud inference, automated AML anomaly detection, and ISO 20022 message compliance.',
    icon: CreditCard,
    href: '/industries/financial-services',
    compliance: 'PCI-DSS & ISO 20022 Aligned',
    gradient: 'from-[#361505] via-[#662B0A] to-[#DE6419]',
    sceneHighlight: 'rgba(255, 174, 92, 0.5)',
  },
  {
    id: 'retail',
    name: 'Retail',
    tagline: 'Composable Omnichannel Commerce',
    description:
      'High-scale commerce architectures with real-time unified inventory, predictive demand ML, and personalized engagement.',
    icon: ShoppingCart,
    href: '/industries/retail',
    compliance: 'SOC 2 Type II Certified',
    gradient: 'from-[#2D1606] via-[#68300E] to-[#FF9933]',
    sceneHighlight: 'rgba(255, 200, 120, 0.5)',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Mission-Critical Cloud Platforms & Security',
    description:
      'Zero-trust corporate foundations, automated compliance audit reporting, and distributed multi-cloud resiliency for Fortune 500 standards.',
    icon: Building2,
    href: '/industries/banking',
    compliance: 'Zero-Trust Architecture',
    gradient: 'from-[#2E0B19] via-[#52132A] to-[#850B30]',
    sceneHighlight: 'rgba(255, 153, 51, 0.4)',
  },
];

export function CinematicIndustries() {
  const reduce = useReducedMotion();

  return (
    <section id="industries" className="relative w-full bg-[#FAF8F9] py-24 sm:py-32 border-t border-[#EDE1E6]">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-widest text-[#850B30] font-bold">
            INDUSTRIES
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#292329]">
            Creating Impact Across Industries
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#635861] leading-relaxed">
            Domain-focused technology solutions that deliver real-world outcomes in highly regulated and mission-critical operating environments.
          </p>
        </div>

        {/* 4 Holographic Industry Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((sec, idx) => {
            const Icon = sec.icon;

            return (
              <motion.div
                key={sec.id}
                initial={reduce ? false : { opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#EDE1E6] bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#850B30] hover:shadow-xl"
              >
                <div>
                  {/* Miniature 3D Architectural Scene Viewport */}
                  <div
                    className={`relative h-44 w-full overflow-hidden rounded-2xl bg-gradient-to-tr ${sec.gradient} p-4 shadow-inner flex flex-col justify-between`}
                  >
                    {/* Perspective Depth Lines */}
                    <div
                      className="absolute inset-0 opacity-30 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(circle at 50% 120%, ${sec.sceneHighlight} 0%, transparent 70%)`,
                      }}
                    />

                    {/* Illuminated Pill Beacon */}
                    <div className="relative z-10 self-start inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] font-semibold text-white backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-[#FF9933]" />
                      <span>{sec.name} Solution</span>
                    </div>

                    {/* Glowing Architectural Emblem Badge */}
                    <div className="relative z-10 self-center my-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/40 bg-white/15 text-white shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-7 w-7 drop-shadow-[0_2px_10px_rgba(255,153,51,0.8)]" />
                    </div>

                    {/* Bottom Ground Reflection Line */}
                    <div className="relative z-10 h-0.5 w-full bg-gradient-to-r from-transparent via-[#FF9933]/60 to-transparent" />
                  </div>

                  {/* Industry Label Pill */}
                  <div className="mt-5 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF8F9] border border-[#EDE1E6] text-[#850B30]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="font-display text-2xl font-bold text-[#292329]">
                      {sec.name}
                    </h3>
                  </div>

                  <p className="mt-2 text-xs font-semibold text-[#FF9933]">
                    {sec.tagline}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-[#635861]">
                    {sec.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EDE1E6]">
                  <div className="flex items-center gap-1.5 text-xs text-[#635861] font-medium mb-3">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#850B30]" />
                    <span>{sec.compliance}</span>
                  </div>

                  <Link
                    href={sec.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#850B30] hover:text-[#FF9933] transition-colors"
                  >
                    <span>View Case Studies</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
