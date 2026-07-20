import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Engineering Blog',
  description: 'Technical articles, architectural deep dives, postmortems, and AI engineering practices from Sathus Technology.',
  alternates: {
    canonical: '/resources/blog',
  },
  openGraph: {
    title: 'Engineering Blog — Sathus Technology',
    description: 'Technical articles, architectural deep dives, and postmortems from Sathus Technology.',
    url: `${siteConfig.url}/resources/blog`,
  },
};

const posts = [
  {
    title: 'Zero-Trust SaaS Reference Architecture for Regulated Markets',
    excerpt: 'How we design zero-trust networks, client-side encryption, and continuous audit logging for enterprise SaaS.',
    date: 'July 15, 2026',
    author: 'Sathish Kumar',
    category: 'Architecture',
    slug: 'zero-trust-saas-architecture',
  },
  {
    title: 'Automated Evaluation Harnesses for Multi-Agent LLM Systems',
    excerpt: 'Preventing agent hallucinations and infinite loops using deterministic quality gates and evaluation benchmarks.',
    date: 'June 28, 2026',
    author: 'Dr. Anita Roy',
    category: 'AI Engineering',
    slug: 'eval-harnesses-agent-systems',
  },
  {
    title: 'Migrating 12M+ Core Banking Users to Cloud-Native Databricks Lakehouse',
    excerpt: 'Lessons learned executing a zero-downtime database cutover under strict financial regulatory oversight.',
    date: 'May 14, 2026',
    author: 'Marcus Vance',
    category: 'Data Engineering',
    slug: 'migrating-core-banking-lakehouse',
  },
];

export default function BlogHubPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <Breadcrumb items={[{ label: 'Resources', href: '/resources' }, { label: 'Engineering Blog' }]} />
      <SectionIntro
        eyebrow="Engineering Blog"
        title="Perspectives & Deep Dives from Our Architects"
        description="Read technical breakdowns, postmortems, and reference architectures written by our principal engineers."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.title} className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary uppercase">
                  {post.category}
                </span>
                <span className="text-xs text-muted-foreground">• {post.date}</span>
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">{post.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>
            </div>
            <Link
              href="/resources/insights"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
            >
              Read Article
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
