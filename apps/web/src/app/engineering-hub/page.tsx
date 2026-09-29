import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { CollectionPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { getHubPillars, getAllHubTopics } from '@/features/engineering-hub/data';
import { PillarCard } from '@/features/engineering-hub/components/PillarCard';
import { TopicCard } from '@/features/engineering-hub/components/TopicCard';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import { BookOpen, Sparkles, Shield, ArrowRight, Layers, Terminal, Search } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Engineering Hub & Architecture Library — Sathus',
  description:
    'Sathus Technical Knowledge Hub: 300+ production architecture blueprints, distributed systems benchmarks, streaming lakehouse guides, and healthcare interoperability specs.',
  path: '/engineering-hub',
  keywords: [
    'data engineering architecture',
    'big data consulting',
    'databricks lakehouse implementation',
    'healthcare data interoperability fhir',
    'document intelligence extraction python',
    'graphrag knowledge graph',
    'Sathus Engineering Hub',
  ],
});

export default function EngineeringHubPage() {
  const pillars = getHubPillars();
  const featuredTopics = getAllHubTopics().slice(0, 6);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Engineering Hub', url: '/engineering-hub' },
  ];

  return (
    <>
      <CollectionPageJsonLd
        title="Sathus Technical Knowledge & Services Hub"
        description="Comprehensive enterprise engineering library covering Data Engineering, Lakehouses, Big Data, Cloud Infrastructure, Healthcare FHIR, Life Sciences GxP, and Document AI."
        url="/engineering-hub"
        hasPart={pillars.map((p) => ({
          name: p.name,
          url: `/engineering-hub/${p.slug}`,
          description: p.description,
        }))}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />

      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
        {/* Decorative Grid Background */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="container relative mx-auto px-4 space-y-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Engineering Hub' },
            ]}
          />

          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Sathus Technical Knowledge & Services Hub
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Architectural Blueprints, Lakehouse Standards &amp; B2B Search Authority
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Explore 300+ production architecture guides, streaming pipelines, open table format benchmarks, and validated healthcare compliance frameworks engineered by Sathus Principal Architects.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/book-strategy-session"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105"
              >
                <span>Book Data Architecture Advisory</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/solutions/data-engineering"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-accent"
              >
                <span>Explore Enterprise Services</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* 9 Core Strategic Pillars */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Core Knowledge Pillars</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-1">
                Technical Knowledge Domains
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Each pillar contains authoritative architecture guides, real-time code blueprints, and direct links to Sathus enterprise services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <PillarCard key={pillar.id} pillar={pillar} />
            ))}
          </div>
        </section>

        {/* Featured Deep Architecture Guides */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Engineering Blueprints</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-1">
                Featured Production Guides &amp; Benchmarks
              </h2>
            </div>
            <Link
              href="/engineering-hub/data-engineering"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              Browse All Topics <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>

        {/* E-E-A-T Practice Authority Banner */}
        <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Sathus Engineering Credibility &amp; Author Standards
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-foreground">
                Engineered by Battle-Tested Architects, Not Generative Placeholders
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Every guide in the Sathus Engineering Hub is authored and reviewed by lead data platform engineers, certified Databricks architects, and healthcare informatics specialists with active production deployments across petabyte-scale lakehouses, FDA 21 CFR Part 11 platforms, and high-concurrency streaming pipelines.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                href="/company/about"
                className="w-full text-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Meet the Engineering Leads
              </Link>
              <Link
                href="/case-studies"
                className="w-full text-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
              >
                View Client Case Studies
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
