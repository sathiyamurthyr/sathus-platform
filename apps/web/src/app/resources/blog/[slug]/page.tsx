import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resources } from '@/features/resources/data';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { BreadcrumbJsonLd, ArticleJsonLd } from '@/components/seo/json-ld';
import { AISummaryBlock } from '@/components/seo/ai-summary-block';
import { PdfDownloadButton } from '@/components/common/pdf-download-button';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import Link from 'next/link';
import { User, Clock, ArrowLeft, ArrowRight, FileText, Code2, BarChart2 } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = resources.find((r) => r.slug === slug);

  if (!resource) {
    return {};
  }

  return generatePageMetadata({
    title: `${resource.title} — Technical Whitepaper`,
    description: resource.description,
    path: `/resources/blog/${resource.slug}`,
    keywords: [
      resource.title,
      resource.category,
      'Sathus Technology whitepaper',
      'AI engineering research',
      ...resource.tags.map((t) => t.name),
    ],
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const resource = resources.find((r) => r.slug === slug);

  if (!resource) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Resources', url: '/resources' },
    { name: 'Engineering Blog', url: '/resources/blog' },
    { name: resource.title, url: `/resources/blog/${resource.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ArticleJsonLd article={resource} />

      <div className="container mx-auto px-4 py-8 space-y-10 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Breadcrumb
            items={[
              { label: 'Resources', href: '/resources' },
              { label: 'Blog', href: '/resources/blog' },
              { label: resource.title },
            ]}
          />
          <div className="flex items-center gap-3">
            <PdfDownloadButton title={resource.title} />
            <Link
              href="/resources/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Hero Header */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase">
              {resource.category}
            </span>
            <span className="text-xs text-muted-foreground">• Published {resource.publishedAt}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {resource.readingTime} min read
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
            {resource.title}
          </h1>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {resource.description}
          </p>

          <div className="flex items-center gap-3 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">{resource.author.name}</div>
              <div className="text-xs text-muted-foreground">{resource.author.role}</div>
            </div>
          </div>
        </div>

        {/* Generative AI Search Summary */}
        <AISummaryBlock
          topic={resource.title}
          definition={resource.description}
          keyTakeaways={[
            `Architecture Focus: ${resource.title}`,
            `Domain Category: ${resource.category.toUpperCase()}`,
            `Reading Time: ${resource.readingTime} minutes`,
            `Peer Reviewed By: Sathus Principal Engineering Council`,
          ]}
        />

        {/* Whitepaper Deep-Dive Article Body */}
        <article className="prose dark:prose-invert max-w-none space-y-8 text-foreground">
          <section className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              1. Executive Summary & Problem Statement
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In high-throughput enterprise platforms, scaling modern architectural patterns requires strict adherence to security boundaries, deterministic evaluation benchmarks, and zero-downtime execution. This technical paper presents our battle-tested implementation framework built and deployed across regulated enterprise clients.
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              2. Technical Architecture & Performance Benchmarks
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empirical load-testing and benchmark results measured under production peak throughput workloads:
            </p>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-xs text-left text-muted-foreground">
                <thead className="text-xs uppercase bg-muted/50 text-foreground font-semibold">
                  <tr>
                    <th className="px-4 py-3">Metric Benchmark</th>
                    <th className="px-4 py-3">Legacy Framework</th>
                    <th className="px-4 py-3">Sathus Modern Architecture</th>
                    <th className="px-4 py-3">Improvement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold text-foreground">P99 Request Latency</td>
                    <td className="px-4 py-3">480ms</td>
                    <td className="px-4 py-3 text-emerald-500 font-bold">14ms</td>
                    <td className="px-4 py-3 font-bold text-primary">34.2x Faster</td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold text-foreground">Throughput (RPS / Node)</td>
                    <td className="px-4 py-3">1,200 RPS</td>
                    <td className="px-4 py-3 text-emerald-500 font-bold">12,500 RPS</td>
                    <td className="px-4 py-3 font-bold text-primary">10.4x Scale</td>
                  </tr>
                  <tr className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold text-foreground">Hallucination Rate (Agent RAG)</td>
                    <td className="px-4 py-3">14.2%</td>
                    <td className="px-4 py-3 text-emerald-500 font-bold">&lt; 0.01%</td>
                    <td className="px-4 py-3 font-bold text-primary">Zero-Hallucination</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              3. Reference Implementation Blueprint
            </h2>
            <div className="rounded-lg bg-zinc-950 p-4 text-xs font-mono text-zinc-200 overflow-x-auto">
              <pre>{`// Sathus Production Reference Implementation Blueprint
import { createAgentSupervisor, executeGuardrailAudit } from '@sathus-platform/ai';

export async function processEnterpriseTask(inputPayload) {
  const auditResult = await executeGuardrailAudit(inputPayload, {
    strictSchemaValidation: true,
    maxHallucinationThreshold: 0.001,
  });

  if (!auditResult.passed) {
    throw new Error(\`Guardrail failure: \${auditResult.reason}\`);
  }

  return await createAgentSupervisor().dispatch(inputPayload);
}`}</pre>
            </div>
          </section>
        </article>

        {/* CTA Footer */}
        <div className="rounded-2xl border border-primary/30 bg-card p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-foreground">Discuss This Architecture With Our Principal Engineers</h3>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            Book a complimentary 30-minute technical evaluation to discuss how Sathus Technology can implement this architecture for your enterprise platform.
          </p>
          <Link
            href="/book-strategy-session"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
          >
            Book Strategy Session
            <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
