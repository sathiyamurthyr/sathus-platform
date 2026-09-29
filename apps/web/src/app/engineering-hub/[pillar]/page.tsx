import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { CollectionPageJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { getHubPillarBySlug, getTopicsByPillar, getHubPillars } from '@/features/engineering-hub/data';
import { TopicCard } from '@/features/engineering-hub/components/TopicCard';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import { ArrowRight, Sparkles, ShieldCheck, Layers, BookOpen } from 'lucide-react';

interface PillarPageProps {
  params: Promise<{ pillar: string }>;
}

export async function generateStaticParams() {
  const pillars = getHubPillars();
  return pillars.map((p) => ({
    pillar: p.slug,
  }));
}

export async function generateMetadata({ params }: PillarPageProps): Promise<Metadata> {
  const { pillar: pillarSlug } = await params;
  const pillar = getHubPillarBySlug(pillarSlug);

  if (!pillar) {
    return {};
  }

  return generatePageMetadata({
    title: `${pillar.name} — Technical Knowledge & Services Hub`,
    description: pillar.description,
    path: `/engineering-hub/${pillar.slug}`,
    keywords: [
      pillar.name,
      ...pillar.featuredQueries,
      'Sathus Technology',
      'architecture guides',
      'engineering blueprints',
    ],
  });
}

export default async function PillarHubPage({ params }: PillarPageProps) {
  const { pillar: pillarSlug } = await params;
  const pillar = getHubPillarBySlug(pillarSlug);

  if (!pillar) {
    notFound();
  }

  const topics = getTopicsByPillar(pillarSlug);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Engineering Hub', url: '/engineering-hub' },
    { name: pillar.name, url: `/engineering-hub/${pillar.slug}` },
  ];

  return (
    <>
      <CollectionPageJsonLd
        title={`${pillar.name} — Technical Knowledge & Services Hub`}
        description={pillar.description}
        url={`/engineering-hub/${pillar.slug}`}
        hasPart={topics.map((t) => ({
          name: t.title,
          url: `/engineering-hub/${pillar.slug}/${t.slug}`,
          description: t.description,
        }))}
      />
      <BreadcrumbJsonLd items={breadcrumbs} />

      {/* Header Banner */}
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-primary/5 via-background to-background py-14 md:py-20">
        <div className="container relative mx-auto px-4 space-y-6">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Engineering Hub', href: '/engineering-hub' },
              { label: pillar.name },
            ]}
          />

          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Sathus Technical Domain Hub
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
              {pillar.name}
            </h1>

            <p className="text-base md:text-xl text-primary font-medium">
              {pillar.tagline}
            </p>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {pillar.description}
            </p>

            {/* Money Page Bridging Button */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href={pillar.commercialServiceHref}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
              >
                <span>Explore {pillar.commercialServiceTitle}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/book-strategy-session"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-accent"
              >
                <span>Book Architecture Strategy Session</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Subclusters Overview */}
        <section className="space-y-6">
          <div className="border-b border-border/60 pb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Core Technical Subclusters
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Structured specialization tracks under the {pillar.name} umbrella.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillar.subclusters.map((sub, idx) => (
              <div key={idx} className="rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground">{sub.name}</h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    {sub.topicCount}+ specs
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{sub.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Guides & Topics Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                Authoritative Guides, Benchmarks &amp; Blueprints
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Deep production guides authored by Sathus practice leads.
              </p>
            </div>
          </div>

          {topics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4">
              <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-bold text-foreground">Expanding Technical Index</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Our engineering team is continually publishing peer-reviewed benchmarks and architecture references. Check out our enterprise service capabilities below.
              </p>
              <Link
                href={pillar.commercialServiceHref}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground"
              >
                <span>View {pillar.commercialServiceTitle}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
