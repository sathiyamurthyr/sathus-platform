import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Leadership Team',
  description:
    'Meet the executive and engineering leadership team at Sathus Technology. Combined decades of experience in AI, enterprise data, cloud, and regulated industries.',
  alternates: { canonical: '/company/leadership' },
  openGraph: {
    title: 'Leadership Team — Sathus Technology',
    description:
      'Meet the executive leadership and advisory team at Sathus Technology.',
    url: `${siteConfig.url}/company/leadership`,
  },
};

const leaders = [
  {
    name: 'Sathish Kumar',
    role: 'Chief Executive Officer & Founder',
    tag: 'Executive',
    bio: 'Sathish founded Sathus Technology after 18+ years engineering mission-critical software for global banks, healthcare systems, and public-sector platforms across the UK, UAE, and India. He has architected cloud transformation programs, AI inference platforms, and identity management systems for organizations serving tens of millions of users.',
    expertise: ['AI Platform Architecture', 'Cloud Transformation', 'Enterprise Identity', 'Financial Services', 'Healthcare Systems'],
    linkedin: '#',
  },
  {
    name: 'Dr. Anita Roy',
    role: 'Chief Technology Officer',
    tag: 'Engineering',
    bio: 'Dr. Roy leads all product and platform engineering at Sathus. Her research background in multi-agent reinforcement learning and AI evaluation methodology directly informs the design of Sathus AI\'s evaluation harnesses and zero-trust guardrail architecture. Previously a Principal Research Engineer at a tier-one AI lab.',
    expertise: ['Multi-Agent AI Systems', 'AI Evaluation & Safety', 'Zero-Trust Security Architecture', 'Model Context Protocol', 'LLM Governance'],
    linkedin: '#',
  },
  {
    name: 'Marcus Vance',
    role: 'Head of Enterprise Solutions & Data Architecture',
    tag: 'Solutions',
    bio: 'Marcus leads enterprise solution delivery, embedding directly into client engineering organizations across financial services and healthcare. He has architected governed data lakehouses on Databricks and Snowflake, streaming Kafka pipelines processing billions of daily events, and distributed microservice platforms for Fortune 500 enterprises.',
    expertise: ['Lakehouse Architecture', 'Apache Kafka & Event Streaming', 'Databricks & Snowflake', 'Enterprise Microservices', 'dbt & Data Governance'],
    linkedin: '#',
  },
];

const advisors = [
  {
    name: 'Advisory Board',
    role: 'Strategic Advisors',
    description: 'Sathus is supported by an advisory board of senior technology executives with backgrounds in regulated enterprise software, venture capital, and global enterprise GTM. For advisory board inquiries, please contact our leadership team directly.',
  },
];

export default function LeadershipPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <div>
        <Breadcrumb items={[{ label: 'Company', href: '/company' }, { label: 'Leadership' }]} />
        <SectionIntro
          eyebrow="Leadership"
          title="Guided by Engineers Who Have Shipped Enterprise Systems"
          description="Our leadership team brings decades of applied engineering experience in AI, data platforms, and regulated enterprise software — not just advisory roles. Every leader at Sathus has shipped production systems in the industries we serve."
        />
      </div>

      {/* Leadership Cards */}
      <div className="grid grid-cols-1 gap-8">
        {leaders.map((leader) => (
          <div
            key={leader.name}
            className="rounded-xl border border-border bg-card p-8 flex flex-col md:flex-row gap-8"
          >
            {/* Avatar Placeholder */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-black text-primary">
                  {leader.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                      {leader.tag}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{leader.name}</h2>
                  <p className="text-sm font-semibold text-primary">{leader.role}</p>
                </div>
                {leader.linkedin !== '#' && (
                  <Link
                    href={leader.linkedin}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors border border-border rounded px-2 py-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn ↗
                  </Link>
                )}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{leader.bio}</p>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Core Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {leader.expertise.map((e) => (
                    <span
                      key={e}
                      className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
              >
                Contact Leadership <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Board */}
      <div className="rounded-xl border border-border bg-card p-8">
        <h2 className="text-xl font-bold mb-2">Advisory Board</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-3xl">
          {advisors[0].description}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
        >
          Advisory Board Inquiries <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-border bg-muted/40 p-8 sm:p-12 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Work Directly With Our Engineering Leadership</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
          Our leadership team is directly accessible for architecture reviews, executive briefings, and partnership discussions. No account managers or sales gatekeepers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/book-strategy-session"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow"
          >
            Book Executive Briefing
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Contact the Team
          </Link>
        </div>
      </div>
    </div>
  );
}
