import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import { Lightbulb, FileText, BarChart, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Insights & Whitepapers',
  description: 'Enterprise research insights, whitepapers, and industry benchmarks from Sathus Technology.',
  alternates: {
    canonical: '/resources/insights',
  },
  openGraph: {
    title: 'Insights & Whitepapers — Sathus Technology',
    description: 'Enterprise research insights, whitepapers, and industry benchmarks.',
    url: `${siteConfig.url}/resources/insights`,
  },
};

const insights = [
  {
    title: 'State of Enterprise AI Governance 2026',
    description: 'A comprehensive benchmark of AI evaluation, guardrails, and compliance postures across 200+ regulated companies.',
    type: 'Whitepaper',
    icon: FileText,
  },
  {
    title: 'Lakehouse vs Data Warehouse for Financial Risk Systems',
    description: 'Comparative study analyzing query latency, cost per petabyte, and governance overhead.',
    type: 'Research Report',
    icon: BarChart,
  },
  {
    title: '21st Century Cures Act Interoperability Guide',
    description: 'Architectural blueprint for healthcare organizations adopting FHIR R4 APIs and SMART-on-FHIR app frameworks.',
    type: 'Industry Guide',
    icon: Lightbulb,
  },
];

export default function InsightsPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <Breadcrumb items={[{ label: 'Resources', href: '/resources' }, { label: 'Insights & Research' }]} />
      <SectionIntro
        eyebrow="Insights & Research"
        title="Whitepapers & Industry Benchmarks"
        description="Explore research papers and actionable guides on AI governance, lakehouse performance, and regulatory compliance."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {insights.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary uppercase">
                    {item.type}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2">{item.title}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">{item.description}</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
              >
                Download Report
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
