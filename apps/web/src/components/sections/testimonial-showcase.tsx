'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Layers, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PracticePattern {
  id: string;
  discipline: string;
  title: string;
  problem: string;
  architecture: string;
  deliverables: string[];
  metrics: string;
}

const PATTERNS: PracticePattern[] = [
  {
    id: '1',
    discipline: 'Data & Financial Systems',
    title: 'Core Ledger Modernization & High-Throughput Lakehouse',
    problem:
      'Fragmented operational databases create fragile end-of-day reconciliation pipelines, blocking real-time compliance reporting.',
    architecture:
      'CDC streaming pipelines feeding an open-table Delta lakehouse with deterministic compaction and zero-downtime cutover.',
    deliverables: [
      'Transactional ACID guarantees on analytical storage',
      'Immutable audit lineage on every state transition',
      'Dual-write validation harness during phased migration',
    ],
    metrics: 'Zero-Downtime Cutover • Immutable Audit Logs',
  },
  {
    id: '2',
    discipline: 'Healthcare & Life Sciences',
    title: 'Deterministic AI Agent Harness for Clinical Documentation',
    problem:
      'Unbounded LLM outputs introduce hallucination risk into clinical review workflows, stalling enterprise deployment.',
    architecture:
      'Agentic workflow with multi-tier evaluation harnesses, deterministic boundary guards, and FHIR R4-compliant data masking.',
    deliverables: [
      'Pre-flight schema validation and PII de-identification',
      'Human-in-the-loop review queues for uncertain outputs',
      'Strict zero-data-retention model gateway policies',
    ],
    metrics: 'Deterministic Guardrails • FHIR R4 Aligned',
  },
  {
    id: '3',
    discipline: 'Enterprise Software & Streaming',
    title: 'High-Velocity Event Mesh & Fraud Detection Pipelines',
    problem:
      'Batch pipelines cannot detect anomalous behaviors in real time, exposing payment systems to multi-hour risk windows.',
    architecture:
      'Distributed Kafka event streaming combined with in-memory caching and partitioned lakehouse tables for sub-second query execution.',
    deliverables: [
      'Sub-second analytical event classification',
      'Automated dead-letter queues and replay capabilities',
      'Schema registry enforcement across polyglot microservices',
    ],
    metrics: 'Real-Time Scoring • Governed Schemas',
  },
];

export function TestimonialShowcase() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextPattern = () => {
    setCurrentIndex((prev) => (prev + 1) % PATTERNS.length);
  };

  const prevPattern = () => {
    setCurrentIndex((prev) => (prev - 1 + PATTERNS.length) % PATTERNS.length);
  };

  const current = PATTERNS[currentIndex];

  return (
    <section className="py-16 bg-[#FAF8F9] border-y border-[#E8E2E5]">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#A20A3A]/10 px-3.5 py-1 text-xs font-bold text-[#A20A3A] uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            Enterprise Reference Architecture
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#292329]">
            Proven Engineering Patterns & Engagement Deliverables
          </h2>
          <p className="text-xs md:text-sm text-[#625B60] max-w-2xl mx-auto">
            Disciplined architectures and reference implementations Sathus principal squads deploy for regulated enterprises.
          </p>
        </div>

        {/* Carousel Card */}
        <div className="relative rounded-3xl border border-[#E8E2E5] bg-white p-8 md:p-12 shadow-md overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 relative z-10"
            >
              {/* Discipline & Badge */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-[#A20A3A] uppercase tracking-wider">
                  {current.discipline}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#A20A3A] bg-[#A20A3A]/10 px-3 py-1 rounded-full border border-[#A20A3A]/20">
                  <CheckCircle2 className="h-3 w-3" />
                  {current.metrics}
                </span>
              </div>

              {/* Title & Architecture */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#292329] mb-2">
                  {current.title}
                </h3>
                <p className="text-sm text-[#625B60] leading-relaxed mb-4">
                  <strong className="text-[#292329]">Problem:</strong> {current.problem}
                </p>
                <p className="text-sm text-[#625B60] leading-relaxed">
                  <strong className="text-[#292329]">Architecture:</strong> {current.architecture}
                </p>
              </div>

              {/* Deliverables list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {current.deliverables.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-xl border border-[#E8E2E5] bg-[#FAF8F9] p-3 text-xs text-[#292329]"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#A20A3A] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="pt-4 border-t border-[#E8E2E5] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#A20A3A]" />
                  <span className="text-xs font-semibold text-[#625B60]">
                    Pattern {currentIndex + 1} of {PATTERNS.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevPattern}
                    className="h-9 w-9 rounded-xl border-[#E8E2E5] hover:bg-[#FAF8F9]"
                    aria-label="Previous pattern"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextPattern}
                    className="h-9 w-9 rounded-xl border-[#E8E2E5] hover:bg-[#FAF8F9]"
                    aria-label="Next pattern"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/book-strategy-session"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#A20A3A] hover:underline underline-offset-4"
          >
            Review Architecture Patterns for Your Stack in a 30-Minute Session
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
