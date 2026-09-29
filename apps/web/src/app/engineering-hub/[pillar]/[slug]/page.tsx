import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { TechArticleJsonLd, DatasetJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { AISummaryBlock } from '@/components/seo/ai-summary-block';
import { getHubPillarBySlug, getTopicByPath, getAllHubTopics, getRelatedTopics } from '@/features/engineering-hub/data';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import {
  Clock,
  Calendar,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  UserCheck,
  Layers,
  Terminal,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  Activity,
  BookOpen,
  AlertCircle,
  Compass,
  FlaskConical,
} from 'lucide-react';
import { SparkMemoryCalculator, DocumentAiCostEstimator } from '@/features/engineering-hub/components';

interface TopicPageProps {
  params: Promise<{ pillar: string; slug: string }>;
}

export async function generateStaticParams() {
  const topics = getAllHubTopics();
  return topics.map((t) => ({
    pillar: t.pillarSlug,
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { pillar: pillarSlug, slug } = await params;
  const topic = getTopicByPath(pillarSlug, slug);

  if (!topic) {
    return {};
  }

  return generatePageMetadata({
    title: topic.metaTitle || `${topic.title} — Sathus Engineering Hub`,
    description: topic.description,
    path: `/engineering-hub/${topic.pillarSlug}/${topic.slug}`,
    keywords: [
      topic.title,
      ...topic.targetQueries,
      'Sathus Technology',
      'architecture guide',
      'engineering blueprint',
    ],
  });
}

export default async function TopicDetailPage({ params }: TopicPageProps) {
  const { pillar: pillarSlug, slug } = await params;
  const pillar = getHubPillarBySlug(pillarSlug);
  const topic = getTopicByPath(pillarSlug, slug);

  if (!topic || !pillar) {
    notFound();
  }

  const relatedTopics = getRelatedTopics(topic);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Engineering Hub', url: '/engineering-hub' },
    { name: pillar.name, url: `/engineering-hub/${pillar.slug}` },
    { name: topic.title, url: `/engineering-hub/${pillar.slug}/${topic.slug}` },
  ];

  return (
    <>
      {topic.schemaType === 'Dataset' ? (
        <DatasetJsonLd
          name={topic.title}
          description={topic.description}
          url={`/engineering-hub/${pillar.slug}/${topic.slug}`}
          variableMeasured={topic.targetQueries}
        />
      ) : (
        <TechArticleJsonLd
          headline={topic.title}
          description={topic.description}
          url={`/engineering-hub/${pillar.slug}/${topic.slug}`}
          datePublished={topic.lastUpdated}
          authorName={topic.author.name}
          proficiencyLevel="Expert"
          dependencies={topic.targetQueries.join(', ')}
        />
      )}

      {topic.faqs && topic.faqs.length > 0 && <FAQPageJsonLd faqs={topic.faqs} />}
      <BreadcrumbJsonLd items={breadcrumbs} />

      <div className="container mx-auto px-4 py-8 space-y-12 max-w-5xl">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Engineering Hub', href: '/engineering-hub' },
              { label: pillar.name, href: `/engineering-hub/${pillar.slug}` },
              { label: topic.title },
            ]}
          />
          <Link
            href={`/engineering-hub/${pillar.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to {pillar.name}
          </Link>
        </div>

        {/* Hero Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-wider">
              {topic.pageType.replace('-', ' ')}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Updated {topic.lastUpdated}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {topic.readingTime} min technical read
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
            {topic.title}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {topic.description}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">
              {topic.author.name.charAt(0)}
            </div>
            <div className="text-xs">
              <div className="font-bold text-foreground">{topic.author.name}</div>
              <div className="text-muted-foreground">{topic.author.role} • {topic.author.practice}</div>
            </div>
            {topic.searchIntent && (
              <div className="ml-auto rounded-lg border border-border/80 bg-muted/40 px-3 py-1 text-[11px] text-muted-foreground hidden sm:block">
                <span className="font-semibold text-foreground">Intent:</span> {topic.searchIntent.intent} • {topic.searchIntent.targetAudience}
              </div>
            )}
          </div>
        </header>

        {/* Featured Direct Answer Block */}
        {topic.directAnswer && (
          <section className="rounded-2xl border-2 border-primary/30 bg-card/90 p-6 md:p-8 space-y-3 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-4 w-4" />
              Direct Technical Synthesis &amp; Fast Answer
            </div>
            <p className="text-base md:text-lg font-medium text-foreground leading-relaxed">
              {topic.directAnswer}
            </p>
          </section>
        )}

        {/* AI Overviews & Search Engine Summary Block */}
        <AISummaryBlock
          topic={topic.title}
          definition={topic.description}
          keyTakeaways={topic.keyTakeaways}
          faqs={topic.faqs.slice(0, 3)}
        />

        {/* Key Takeaways Box */}
        {topic.keyTakeaways && topic.keyTakeaways.length > 0 && (
          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Key Architectural Takeaways
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              {topic.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Deep Explanation Sections */}
        {topic.deepExplanationSections && topic.deepExplanationSections.length > 0 && (
          <section className="space-y-8">
            <div className="border-b border-border/60 pb-3">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                In-Depth Technical Breakdown &amp; Analysis
              </h2>
            </div>
            <div className="space-y-6">
              {topic.deepExplanationSections.map((sec, idx) => (
                <div key={idx} className="rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8 space-y-3">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    {sec.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </p>
                  {sec.codeOrSteps && sec.codeOrSteps.length > 0 && (
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2 mt-4">
                      {sec.codeOrSteps.map((step, sIdx) => (
                        <div key={sIdx} className="text-xs text-muted-foreground font-mono flex items-start gap-2.5">
                          <span className="text-primary font-bold">{sIdx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Architecture Components Breakdown */}
        {topic.architectureOverview && (
          <section className="space-y-6">
            <div className="border-b border-border/60 pb-3">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Layers className="h-6 w-6 text-primary" />
                Reference Architecture Breakdown
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {topic.architectureOverview.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {topic.architectureOverview.components.map((comp, idx) => (
                <div key={idx} className="rounded-xl border border-border/60 bg-card/60 p-5 space-y-2 backdrop-blur-sm">
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono font-semibold text-primary">
                    {comp.tech}
                  </span>
                  <h3 className="font-bold text-base text-foreground">{comp.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{comp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Diagnostic Walkthrough & Spark UI Triage Table */}
        {topic.diagnosticSteps && topic.diagnosticSteps.length > 0 && (
          <section className="space-y-4">
            <div className="border-b border-border/60 pb-3">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Activity className="h-6 w-6 text-primary" />
                Diagnostic Walkthrough &amp; Spark UI Triage
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Pinpoint root cause failure modes and match observed metrics to actionable remediation.
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/60">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/60 bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-4">UI Tab / Tool</th>
                    <th className="p-4">Observed Metric / Signal</th>
                    <th className="p-4">Underlying Failure Mode</th>
                    <th className="p-4">Actionable Remediation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-xs">
                  {topic.diagnosticSteps.map((diag, dIdx) => (
                    <tr key={dIdx} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-primary">{diag.toolOrTab}</td>
                      <td className="p-4 font-medium text-foreground">{diag.signal}</td>
                      <td className="p-4 text-muted-foreground">{diag.interpretation}</td>
                      <td className="p-4 font-mono text-emerald-400 bg-emerald-500/5">{diag.remediation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Code Snippet Block */}
        {topic.codeSnippet && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
                <Terminal className="h-6 w-6 text-primary" />
                Production Implementation Code
              </h2>
              <span className="text-xs font-mono text-muted-foreground">{topic.codeSnippet.title}</span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/80 bg-neutral-950 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border/40 bg-neutral-900/80 px-4 py-2.5 text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2">{topic.codeSnippet.title}</span>
                </span>
                <span className="uppercase text-[10px] tracking-wider text-primary font-bold">
                  {topic.codeSnippet.language}
                </span>
              </div>
              <pre className="p-5 text-xs md:text-sm font-mono text-neutral-100 overflow-x-auto leading-relaxed">
                <code>{topic.codeSnippet.code}</code>
              </pre>
            </div>
          </section>
        )}

        {/* Before vs. After Architecture Transformation */}
        {topic.beforeAfterArchitecture && (
          <section className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 via-card/40 to-muted/20 p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Architecture Transformation</span>
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Before vs. After Production Architecture</h2>
              </div>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-center">
                <div className="text-xs font-semibold text-emerald-400">Production Impact</div>
                <div className="text-sm font-bold text-foreground">{topic.beforeAfterArchitecture.impactMetric}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-red-400">Baseline / Antipattern</div>
                <h3 className="font-bold text-foreground text-sm">{topic.beforeAfterArchitecture.beforeTitle}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{topic.beforeAfterArchitecture.beforeDescription}</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Hardened Production Pattern</div>
                <h3 className="font-bold text-foreground text-sm">{topic.beforeAfterArchitecture.afterTitle}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{topic.beforeAfterArchitecture.afterDescription}</p>
              </div>
            </div>

            {/* Evidence & Grounding Standard */}
            {topic.beforeAfterArchitecture.evidence && (
              <div className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-3 mt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {(topic.beforeAfterArchitecture.evidence.type === 'verified-result' || topic.beforeAfterArchitecture.evidence.type === 'production-experience') && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {topic.beforeAfterArchitecture.evidence.label}
                      </span>
                    )}
                    {topic.beforeAfterArchitecture.evidence.type === 'reproducible-benchmark' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 px-3 py-1 text-xs font-bold text-blue-400">
                        <FlaskConical className="h-3.5 w-3.5" />
                        {topic.beforeAfterArchitecture.evidence.label}
                      </span>
                    )}
                    {topic.beforeAfterArchitecture.evidence.type === 'reference-architecture' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400">
                        <Compass className="h-3.5 w-3.5" />
                        {topic.beforeAfterArchitecture.evidence.label}
                      </span>
                    )}
                    {topic.beforeAfterArchitecture.evidence.type === 'illustrative-example' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 px-3 py-1 text-xs font-bold text-purple-400">
                        <Sparkles className="h-3.5 w-3.5" />
                        {topic.beforeAfterArchitecture.evidence.label}
                      </span>
                    )}
                    {topic.beforeAfterArchitecture.evidence.hardwareOrDataset && (
                      <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
                        • {topic.beforeAfterArchitecture.evidence.hardwareOrDataset}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    E-E-A-T Verification Standard
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {topic.beforeAfterArchitecture.evidence.methodologyNote}
                </p>
                {topic.beforeAfterArchitecture.evidence.disclaimer && (
                  <div className="rounded-lg bg-muted/60 border border-border/80 px-3.5 py-2 text-xs font-medium text-foreground/90 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>{topic.beforeAfterArchitecture.evidence.disclaimer}</span>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Interactive Engineering Asset / Calculator */}
        {topic.interactiveTool === 'spark-memory-calculator' && (
          <section className="space-y-4">
            <SparkMemoryCalculator />
          </section>
        )}
        {topic.interactiveTool === 'document-ai-cost-estimator' && (
          <section className="space-y-4">
            <DocumentAiCostEstimator />
          </section>
        )}

        {/* Comparison Table */}
        {topic.comparisonTable && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Technical Trade-Offs &amp; Matrix</h2>
            <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/60">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/60 bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    {topic.comparisonTable.headers.map((h, idx) => (
                      <th key={idx} className="p-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {topic.comparisonTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={`p-4 text-xs md:text-sm ${cIdx === 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* FAQs Section */}
        {topic.faqs && topic.faqs.length > 0 && (
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <HelpCircle className="h-6 w-6 text-primary" />
              Frequently Asked Technical Questions
            </h2>
            <div className="space-y-3">
              {topic.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-border/60 bg-card/40 p-5 space-y-2">
                  <h3 className="text-base font-bold text-foreground">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Authoritative Citations & References */}
        {topic.authoritativeReferences && topic.authoritativeReferences.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Authoritative Engineering References &amp; Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topic.authoritativeReferences.map((ref, rIdx) => (
                <a
                  key={rIdx}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-4 text-xs hover:border-primary/40 hover:bg-card/80 transition-all group"
                >
                  <div>
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{ref.title}</div>
                    <div className="text-muted-foreground">{ref.organization}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Author Bio & E-E-A-T Credibility Card */}
        <section className="rounded-2xl border border-border/60 bg-card/60 p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-2xl">
            {topic.author.name.charAt(0)}
          </div>
          <div className="space-y-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h3 className="text-base font-bold text-foreground">{topic.author.name}</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-3 w-3" /> Peer Reviewed
              </span>
            </div>
            <p className="text-xs font-medium text-primary">{topic.author.role}</p>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              Part of the {topic.author.practice} at Sathus Technology. Specializing in mission-critical data lakehouses, streaming analytics, and compliance-driven platforms.
            </p>
          </div>
        </section>

        {/* Downward Money Page Conversion Block */}
        <section className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background p-8 md:p-10 shadow-2xl space-y-4 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Enterprise Engineering Advisory</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-foreground">
              {topic.conversionCta.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {topic.conversionCta.description}
            </p>
          </div>
          <Link
            href={topic.conversionCta.href}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105"
          >
            <span>{topic.conversionCta.buttonText}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Lateral Cluster Navigation */}
        {relatedTopics.length > 0 && (
          <section className="space-y-4 border-t border-border/60 pt-8">
            <h3 className="text-lg font-bold text-foreground">Next in this Knowledge Cluster</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedTopics.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/engineering-hub/${rel.pillarSlug}/${rel.slug}`}
                  className="group rounded-xl border border-border/60 bg-card/40 p-4 transition-all hover:border-primary/40 hover:bg-card/80 space-y-1.5"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {rel.pageType.replace('-', ' ')}
                  </span>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 pt-1">
                    <span>{rel.readingTime} min read</span>
                    <ArrowRight className="h-3 w-3 ml-auto transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
