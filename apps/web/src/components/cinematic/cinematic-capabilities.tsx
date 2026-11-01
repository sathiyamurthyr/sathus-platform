'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  Bot,
  Database,
  Boxes,
  CloudCog,
  Rocket,
  Repeat,
  ArrowRight,
  CheckCircle,
  Code2,
  Cpu,
  Layers,
} from 'lucide-react';

interface Capability {
  id: string;
  title: string;
  icon: typeof Bot;
  problem: string;
  solution: string;
  outcome: string;
  metrics: string;
  tech: string[];
  href: string;
}

const CAPABILITIES: Capability[] = [
  {
    id: 'ai',
    title: 'Enterprise AI & Autonomous Swarms',
    icon: Bot,
    problem:
      'Unstructured AI pilots stall in enterprise production due to model drift, hallucination risks, non-deterministic latency, and a complete lack of governance.',
    solution:
      'We build production-grade multi-agent swarms with deterministic evaluation harnesses, Pydantic runtime guardrails, human-in-the-loop review, and complete trace observability.',
    outcome:
      'Production-grade agent swarms delivering autonomous resolution with sub-50ms evaluation latency and zero data leakage.',
    metrics: '<45ms Evaluation · 99.8% Groundedness SLA',
    tech: ['Sathus AI', 'LangGraph', 'FastAPI MLOps', 'Pydantic Guard', 'Vector Embeddings'],
    href: '/solutions/ai-engineering',
  },
  {
    id: 'data',
    title: 'Governed Data Lakehouse Engineering',
    icon: Database,
    problem:
      'Enterprise data is trapped in proprietary warehouses and siloed databases with no lineage, broken data contracts, and spiraling query costs.',
    solution:
      'We engineer open-table Apache Iceberg lakehouses with real-time streaming ingestion, automated schema evolution, metadata governance, and zero-copy queries.',
    outcome:
      'Single source of truth with 60% lower storage costs, real-time query performance, and cryptographic auditability.',
    metrics: 'Petabyte Scale · 1.4M msg/sec Streaming',
    tech: ['Apache Iceberg', 'Apache Spark', 'Kafka Streaming', 'Delta lake', 'dbt Core'],
    href: '/solutions/data-engineering',
  },
  {
    id: 'cloud',
    title: 'Cloud Modernization & Multi-Region Infra',
    icon: CloudCog,
    problem:
      'Legacy monoliths and brittle virtual machines create downtime risks, technical debt, and prevent elastic multi-region scale.',
    solution:
      'We re-platform to cloud-native microservices on Azure and AWS with containerized Kubernetes meshes, automated disaster recovery, and sovereign data boundary isolation.',
    outcome:
      'Zero-downtime cutovers, multi-region high availability, and 40% reduction in cloud infrastructure waste.',
    metrics: '99.95% Availability · Zero-Downtime Migration',
    tech: ['Azure Kubernetes', 'AWS EKS', 'Terraform Cloud', 'Istio Mesh', 'Prometheus'],
    href: '/solutions/cloud-modernization',
  },
  {
    id: 'apps',
    title: 'Composable Enterprise Applications',
    icon: Boxes,
    problem:
      'Off-the-shelf software forces inefficient process compromises, while bespoke legacy software becomes impossible to maintain.',
    solution:
      'We design domain-driven applications and high-throughput API gateways tailored to your core business processes, built with modular, composable frontend architectures.',
    outcome:
      'High-velocity enterprise software that integrates seamlessly across ERP, CRM, and bespoke business workflows.',
    metrics: 'Sub-100ms API Gateways · SOC 2 Compliant',
    tech: ['Next.js 15', 'TypeScript 5', 'GraphQL / REST', 'FastAPI', 'Tailwind CSS'],
    href: '/solutions/enterprise-applications',
  },
  {
    id: 'product',
    title: 'Digital Product Engineering',
    icon: Rocket,
    problem:
      'Promising technology concepts die in the gap between proof-of-concept prototypes and scalable, customer-ready commercial products.',
    solution:
      'Our embedded product engineering squads take concepts from discovery spikes to production GA with strict design systems and bulletproof delivery cadences.',
    outcome:
      'Commercial-grade software shipping in reviewable sprints with enterprise scalability and documentation built in.',
    metrics: 'Rapid GA Delivery · 100% Type-Safe Stack',
    tech: ['React 19', 'Turborepo', 'PostgreSQL', 'Redis Mesh', 'Vitest'],
    href: '/solutions/product-engineering',
  },
  {
    id: 'transform',
    title: 'Operating Model Transformation',
    icon: Repeat,
    problem:
      'Multi-year transformation programs spend millions on management consulting slide decks that fail to produce working software.',
    solution:
      'We transform engineering teams through outcome-based architecture roadmaps, technical spikes, and permanent platform delivery practices.',
    outcome:
      'Durable internal engineering excellence with measurable delivery velocity and reduced operational overhead.',
    metrics: 'Outcome-Driven Roadmaps · Measurable KPIs',
    tech: ['DevOps Automation', 'CI/CD Pipelines', 'Security Governance', 'Platform Engineering'],
    href: '/solutions/digital-transformation',
  },
];

export function CinematicCapabilities() {
  const reduce = useReducedMotion();
  const [activeCapId, setActiveCapId] = React.useState<string>('ai');

  const activeCap = CAPABILITIES.find((c) => c.id === activeCapId) || CAPABILITIES[0];
  const Icon = activeCap.icon;

  return (
    <section
      id="capabilities"
      className="relative scroll-mt-24 border-t border-[#EDE1E6] bg-white py-24 sm:py-32"
    >
      <div className="container relative mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EDE1E6] bg-[#F9EEF2] px-3.5 py-1 text-xs font-semibold text-[#A20A3A]">
            <Code2 className="h-3.5 w-3.5" />
            <span>CHAPTER 04 — ENGINEERING CAPABILITIES</span>
          </div>

          <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight text-[#292329] sm:text-5xl lg:text-6xl">
            Disciplines engineered for mission-critical scale.
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-[#635861]">
            We do not sell generalist outsourcing. Each practice is led by principal architects with battle-tested reference architectures, audited SLAs, and a clear path to production.
          </p>
        </div>

        {/* Capability Navigation Tabs */}
        <div className="mt-12 flex flex-wrap gap-2.5 border-b border-[#EDE1E6] pb-4">
          {CAPABILITIES.map((cap) => {
            const isActive = activeCapId === cap.id;
            const TabIcon = cap.icon;
            return (
              <button
                key={cap.id}
                type="button"
                onClick={() => setActiveCapId(cap.id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#A20A3A] text-white shadow-sm'
                    : 'bg-[#FAF8F9] text-[#635861] hover:bg-[#F9EEF2] hover:text-[#A20A3A]'
                }`}
              >
                <TabIcon className="h-4 w-4" />
                <span>{cap.title.split(' ')[0]} {cap.title.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Active Capability Deep Dive Viewport */}
        <div className="mt-8 rounded-3xl border border-[#EDE1E6] bg-[#FAF8F9] p-8 sm:p-12 shadow-xs">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            {/* Left Column: Solution & Outcome */}
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#EDE1E6] text-[#A20A3A] shadow-xs">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <span className="text-xs font-mono font-semibold uppercase text-[#FF9933]">
                    ENGINEERING DISCIPLINE
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-[#292329]">
                    {activeCap.title}
                  </h3>
                </div>
              </div>

              {/* The Problem & Solution Breakdown */}
              <div className="mt-8 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A20A3A]">
                    The Enterprise Challenge:
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#635861]">
                    {activeCap.problem}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#292329]">
                    Our Engineering Solution:
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#635861]">
                    {activeCap.solution}
                  </p>
                </div>
              </div>

              {/* Hardened Tech Stack */}
              <div className="mt-8">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#635861]">
                  Technology Stack:
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeCap.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#EDE1E6] bg-white px-3 py-1 text-xs font-medium text-[#292329] shadow-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Quantified Impact Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#EDE1E6] bg-white p-8 shadow-sm">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-mono text-xs font-semibold text-emerald-800">
                  <CheckCircle className="h-3.5 w-3.5" />
                  VERIFIED OUTCOME
                </span>

                <h4 className="mt-4 text-lg font-bold text-[#292329]">
                  Quantifiable Business Result
                </h4>

                <p className="mt-3 text-sm leading-relaxed text-[#635861]">
                  {activeCap.outcome}
                </p>

                <div className="mt-6 rounded-xl border border-[#EDE1E6] bg-[#FAF8F9] p-4">
                  <span className="text-[11px] font-mono text-[#635861]">
                    BENCHMARKED TARGET
                  </span>
                  <p className="mt-1 font-mono text-base font-bold text-[#A20A3A]">
                    {activeCap.metrics}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#EDE1E6]">
                <Link
                  href={activeCap.href}
                  className="group flex items-center justify-between font-semibold text-sm text-[#A20A3A] hover:underline"
                >
                  <span>Explore Practice & Architectures</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-[#FF9933]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

