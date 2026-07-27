import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { BreadcrumbJsonLd, ArticleJsonLd } from '@/components/seo/json-ld';
import { AISummaryBlock } from '@/components/seo/ai-summary-block';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import { resources } from '@/features/resources/data';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Clock, FileText } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Engineering Blog, Whitepapers & Technical Deep Dives',
  description: 'Peer-reviewed technical articles, AI agent evaluation benchmarks, data lakehouse whitepapers, and cloud modernization postmortems from Sathus engineers.',
  path: '/resources/blog',
  keywords: [
    'Sathus engineering blog',
    'AI agent evaluation whitepaper',
    'Data lakehouse migration guide',
    'FastAPI performance benchmarks',
    'Zero trust SaaS architecture',
  ],
});

export default function BlogHubPage() {
  const featuredArticle = resources[0];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Resources', url: '/resources' },
          { name: 'Engineering Blog', url: '/resources/blog' },
        ]}
      />
      {resources.slice(0, 3).map((res) => (
        <ArticleJsonLd key={res.id} article={res} />
      ))}

      <div className="container mx-auto px-4 py-8 space-y-10">
        <Breadcrumb items={[{ label: 'Resources', href: '/resources' }, { label: 'Engineering Blog' }]} />

        <SectionIntro
          eyebrow="Engineering Blog & Whitepapers"
          title="Perspectives & Deep Dives from Our Architects"
          description="Technical breakdowns, benchmark reports, and reference architectures written by Sathus principal engineers."
        />

        {/* Generative AI Search Engine Summary Block */}
        <AISummaryBlock
          topic="Sathus Engineering Knowledge & Whitepaper Library"
          definition="A peer-reviewed knowledge hub publishing technical benchmarks, architectural blueprints, and production postmortems for enterprise AI, data streaming, and cloud infrastructure."
          keyTakeaways={resources.slice(0, 5).map((r) => `${r.title}: ${r.excerpt || r.description}`)}
        />

        {/* Featured Hero Article */}
        {featuredArticle && (
          <div className="rounded-2xl border border-primary/30 bg-card p-8 md:p-10 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase">
                <FileText className="h-3.5 w-3.5" />
                Featured Whitepaper
              </span>
              <span className="text-xs text-muted-foreground">• {featuredArticle.publishedAt}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {featuredArticle.readingTime} min read
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4 leading-tight">
              <Link href={`/resources/blog/${featuredArticle.slug}`} className="hover:text-primary transition-colors">
                {featuredArticle.title}
              </Link>
            </h2>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 max-w-4xl">
              {featuredArticle.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <User className="h-4 w-4 text-primary" />
                {featuredArticle.author.name} — <span className="text-muted-foreground font-normal">{featuredArticle.author.role}</span>
              </div>
              <Link
                href={`/resources/blog/${featuredArticle.slug}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline underline-offset-4"
              >
                Read Whitepaper
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Grid of All 15 Articles */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground">All Technical Whitepapers & Articles ({resources.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {post.readingTime} min
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-2 leading-snug">
                    <Link href={`/resources/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt || post.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{post.author.name}</span>
                  <Link
                    href={`/resources/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4"
                  >
                    Read
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
