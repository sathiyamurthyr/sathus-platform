import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import { Cpu, FileText, ArrowRight, ShieldCheck, Wrench } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Interactive Engineering Tools & Calculators — Sathus Engineering Hub',
  description:
    'Free, production-grade interactive engineering calculators and sizing tools built by Sathus distributed systems architects. Sizing for Spark executor memory, partition counts, and document AI extraction TCO.',
  path: '/engineering-hub/tools',
  keywords: [
    'spark memory calculator',
    'spark executor memory overhead calculator',
    'pyspark partition sizing tool',
    'document extraction cost estimator',
    'vision llm ocr pricing calculator',
    'sathus engineering tools',
  ],
});

export default function EngineeringToolsPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Engineering Hub', url: '/engineering-hub' },
    { name: 'Interactive Tools', url: '/engineering-hub/tools' },
  ];

  const tools = [
    {
      title: 'Spark Executor Memory & Partition Sizing Calculator',
      description:
        'Compute optimal JVM executor heap, off-heap memoryOverhead (PyArrow buffers), and target shuffle partition counts (128MB rule) to prevent OutOfMemory crashes.',
      href: '/engineering-hub/tools/spark-memory-calculator',
      icon: Cpu,
      tag: 'Big Data & Distributed Systems',
      formula: 'spark.executor.memoryOverhead = max(384m, 0.20-0.25 * heap)',
    },
    {
      title: 'Document Extraction & Vision LLM TCO Cost Estimator',
      description:
        'Model annual infrastructure savings across 10K to 1M pages per month by comparing monolithic Vision LLMs against Sathus 3-tier intelligent cascading router.',
      href: '/engineering-hub/tools/document-ai-cost-estimator',
      icon: FileText,
      tag: 'Document Intelligence & AI',
      formula: 'Tier 1 ($0.01/1K) + Tier 2 ($1.50/1K) + Tier 3 ($25.00/1K)',
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="container mx-auto px-4 py-8 space-y-12 max-w-5xl">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Engineering Hub', href: '/engineering-hub' },
            { label: 'Interactive Tools' },
          ]}
        />

        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
            <Wrench className="h-3.5 w-3.5" />
            Original Engineering Assets
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            Interactive Engineering Calculators &amp; Sizing Tools
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Free, reference-grade distributed systems and AI sizing calculators developed by Sathus principal architects. Designed to help data teams eliminate cluster OOMs and optimize enterprise cloud spend.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 md:p-8 space-y-6 hover:border-primary/60 hover:shadow-xl transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-mono font-semibold text-muted-foreground">
                      {tool.tag}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/40">
                  <div className="rounded-lg bg-neutral-950 p-2.5 text-[11px] font-mono text-neutral-300">
                    <span className="text-primary font-bold">Rule: </span>
                    {tool.formula}
                  </div>
                  <Link
                    href={tool.href}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
                  >
                    <span>Launch Interactive Tool</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
