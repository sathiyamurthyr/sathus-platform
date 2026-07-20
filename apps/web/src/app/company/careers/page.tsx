import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import { Briefcase, Heart, Gift, Users, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join our embedded engineering squads building enterprise AI, data platforms, and cloud software.',
  alternates: {
    canonical: '/company/careers',
  },
  openGraph: {
    title: 'Careers — Sathus Technology',
    description: 'Join our embedded engineering squads building enterprise AI, data platforms, and cloud software.',
    url: `${siteConfig.url}/company/careers`,
  },
};

const openRoles = [
  {
    title: 'Principal AI Engineer',
    department: 'AI & Agents',
    location: 'Bengaluru / Hybrid',
    type: 'Full-time',
    description: 'Architect agentic orchestration platforms, evaluation harnesses, and RAG pipelines for financial services.',
  },
  {
    title: 'Lead Data Platform Architect',
    department: 'Data Engineering',
    location: 'Bengaluru / Remote',
    type: 'Full-time',
    description: 'Build governed lakehouses on Databricks, Apache Iceberg, and streaming Kafka pipelines.',
  },
  {
    title: 'Senior .NET Enterprise Engineer',
    department: 'Software Engineering',
    location: 'Bengaluru / Hybrid',
    type: 'Full-time',
    description: 'Design microservices and high-throughput backend APIs for core banking and healthcare systems.',
  },
];

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <div>
        <Breadcrumb items={[{ label: 'Company', href: '/company' }, { label: 'Careers' }]} />
        <SectionIntro
          eyebrow="Careers at Sathus"
          title="Build Engineering Systems That Matter"
          description="We are looking for principal engineers, data architects, and product leads who thrive on solving hard technical problems in AI, distributed data systems, and cloud infrastructure."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-border p-6 bg-card">
          <Heart className="h-6 w-6 text-primary mb-3" />
          <h2 className="text-base font-bold mb-2">High Engineering Bar</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Work alongside senior architects with deep experience in AI safety, distributed systems, and compiler design.
          </p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <Gift className="h-6 w-6 text-primary mb-3" />
          <h2 className="text-base font-bold mb-2">Competitive Benefits</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Top-tier compensation, comprehensive healthcare coverage, learning stipends, and flexible hybrid options.
          </p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <Users className="h-6 w-6 text-primary mb-3" />
          <h2 className="text-base font-bold mb-2">Embedded Ownership</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Own complete product architecture end-to-end without red tape or bureaucratic overhead.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Open Engineering Positions</h2>
        <div className="space-y-4">
          {openRoles.map((role) => (
            <div key={role.title} className="rounded-xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">
                    {role.department}
                  </span>
                  <span className="text-xs text-muted-foreground">• {role.location}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{role.title}</h3>
                <p className="text-xs text-muted-foreground max-w-2xl">{role.description}</p>
              </div>
              <Link
                href="/company/contact"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shrink-0 w-fit"
              >
                Apply Now
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
