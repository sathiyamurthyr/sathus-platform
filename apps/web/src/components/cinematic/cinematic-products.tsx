'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  Heart,
  Mail,
  Cloud,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  href: string;
  icon: typeof Heart;
  color: string;
  stat: string;
  statLabel: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'oh-id',
    name: 'OH-ID',
    category: 'One Health ID',
    tagline: 'ABDM-Compliant Unified Healthcare Platform',
    description:
      'Zero-leakage clinical operating system connecting hospital OPD/IPD flows, consent-gated electronic medical records, and AI-assisted triage with complete HIPAA compliance.',
    href: '/products/onehealthid',
    icon: Heart,
    color: '#850B30',
    stat: '100%',
    statLabel: 'ABDM M1/M2/M3 Milestones',
  },
  {
    id: 'vmaila',
    name: 'Vmaila',
    category: 'Secure Business Mail',
    tagline: 'Encrypted Sovereign Enterprise Email Suite',
    description:
      'Private, sovereign business email suite with multi-tenant organization boundaries, cryptographic TLS 1.3 transit, scheduled delivery, and complete customer data ownership.',
    href: '/products/vmaila',
    icon: Mail,
    color: '#FF9933',
    stat: 'Zero-Knowledge',
    statLabel: 'Tenant Data Isolation',
  },
  {
    id: 'memomes-cloud',
    name: 'Memomes Cloud',
    category: 'Secure Cloud Sharing',
    tagline: 'Sovereign Cloud & Document Intelligence',
    description:
      'High-throughput document intelligence that turns unstructured enterprise knowledge into grounded, citation-backed context with zero cloud data leakage.',
    href: '/products/memomes-cloud',
    icon: Cloud,
    color: '#DE6419',
    stat: '10x',
    statLabel: 'Grounded Retrieval Speed',
  },
  {
    id: 'svora',
    name: 'Svora',
    category: 'AI Marketing Operating System',
    tagline: 'Autonomous Marketing & Growth Agent Swarm',
    description:
      'Multi-agent marketing intelligence platform automating audience segmentation, copy generation, and predictive spend optimization with deterministic guardrails.',
    href: '/products/svora',
    icon: Sparkles,
    color: '#850B30',
    stat: '4.8x',
    statLabel: 'Campaign Velocity Lift',
  },
];

export function CinematicProducts() {
  const reduce = useReducedMotion();

  return (
    <section id="products" className="relative w-full bg-white py-24 sm:py-32 border-t border-[#EDE1E6]">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-[#850B30] font-bold">
            OUR PRODUCTS
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#292329]">
            Enterprise Products for a Connected World
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#635861] leading-relaxed">
            Production-grade software platforms built to solve mission-critical challenges across health, security, cloud, and AI automation.
          </p>
        </div>

        {/* 4 Floating 3D Product Pedestals in a Row */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((prod, idx) => {
            const Icon = prod.icon;

            return (
              <motion.div
                key={prod.id}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#EDE1E6] bg-[#FAF8F9] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FF9933] hover:shadow-xl hover:bg-white"
              >
                <div>
                  {/* Floating Glass Icon Disc */}
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#EDE1E6] bg-white text-[#850B30] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:border-[#FF9933]">
                    <Icon className="h-8 w-8 stroke-[1.8]" />
                  </div>

                  <div className="mt-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF9933]">
                      {prod.category}
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#292329]">
                      {prod.name}
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[#635861]">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#EDE1E6]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold font-display text-[#850B30]">
                      {prod.stat}
                    </span>
                    <span className="text-[11px] text-[#635861] font-medium text-right max-w-[120px]">
                      {prod.statLabel}
                    </span>
                  </div>

                  <Link
                    href={prod.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#850B30] hover:text-[#FF9933] transition-colors"
                  >
                    <span>Explore Product</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                {/* 3D Glowing Elliptical Pedestal Base */}
                <div className="relative -mb-4 mt-6 flex justify-center">
                  <div className="h-5 w-4/5 rounded-full bg-gradient-to-r from-transparent via-[#FF9933]/35 to-transparent blur-sm transition-all duration-300 group-hover:via-[#FF9933]/65 group-hover:h-7" />
                  <div className="absolute top-0.5 h-3 w-3/4 rounded-full border border-[#FF9933]/60 shadow-[0_0_16px_rgba(255,153,51,0.45)] bg-gradient-to-b from-white/50 to-[#DE6419]/25" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
