import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import { Target, ShieldCheck, Zap, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why Sathus',
  description: 'Why leading enterprises choose Sathus Technology for AI, data platform engineering, and cloud modernization.',
  alternates: {
    canonical: '/company/why-sathus',
  },
  openGraph: {
    title: 'Why Sathus — Sathus Technology',
    description: 'Why leading enterprises choose Sathus Technology for AI, data platform engineering, and cloud modernization.',
    url: `${siteConfig.url}/company/why-sathus`,
  },
};

const pillars = [
  {
    icon: Target,
    title: 'Code, Not Slide Decks',
    description: 'We are principal software engineers, data architects, and compiler designers. Every engagement delivers production source code, automated CI/CD pipelines, and complete ownership.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance-by-Design',
    description: 'Built for regulated markets. Zero-retention AI policies, HIPAA/SOC 2 Type II audit logging, and zero-trust identity tokenization embedded into every layer.',
  },
  {
    icon: Layers,
    title: 'Open Architectures & No Vendor Lock-in',
    description: 'We build on open standards — Apache Iceberg, Delta Lake, FastAPI, Model Context Protocol (MCP), and Kubernetes. Your data and IP remain 100% yours.',
  },
  {
    icon: Zap,
    title: 'Accountable Performance Metrics',
    description: 'We commit to hard technical SLAs: sub-10ms query latencies, 99.99% system availability, 98% RAG precision, and 70% cloud TCO reduction.',
  },
];

export default function WhySathusPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <div>
        <Breadcrumb items={[{ label: 'Company', href: '/company' }, { label: 'Why Sathus' }]} />
        <SectionIntro
          eyebrow="The Sathus Advantage"
          title="Why Enterprise Leaders Choose Sathus Technology"
          description="Traditional consultancies deliver slides. We build high-throughput, production-grade AI, data, and cloud systems engineered for regulated enterprises."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title} className="rounded-xl border border-border p-6 bg-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold mb-2">{pillar.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">{pillar.description}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-8">
        <h2 className="text-xl font-bold mb-6">Comparison: Sathus vs Traditional Consultancies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3">
            <h3 className="font-semibold text-primary uppercase tracking-wider">Sathus Technology</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Senior principal engineering squads</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Open table formats & open-weight AI models</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Guaranteed performance & SLA metrics</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> SOC 2 & HIPAA compliant reference builds</li>
            </ul>
          </div>
          <div className="space-y-3 opacity-75">
            <h3 className="font-semibold text-muted-foreground uppercase tracking-wider">Traditional Consultancies</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Junior staff rotated across projects</li>
              <li>• Proprietary vendor lock-in software</li>
              <li>• Deliverable limited to advisory reports</li>
              <li>• Security treated as an afterthought</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-8 sm:p-12 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Experience the Engineering Difference</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
          Schedule an architecture review with our principal engineers to evaluate your platform goals.
        </p>
        <Link
          href="/book-strategy-session"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow"
        >
          Book Architecture Review
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
