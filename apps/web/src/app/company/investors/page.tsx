import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Investor Relations',
  description: 'Corporate governance, growth metrics, and investor relations at Sathus Technology.',
  alternates: {
    canonical: '/company/investors',
  },
  openGraph: {
    title: 'Investor Relations — Sathus Technology',
    description: 'Corporate governance, growth metrics, and investor relations at Sathus Technology.',
    url: `${siteConfig.url}/company/investors`,
  },
};

export default function InvestorsPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <Breadcrumb items={[{ label: 'Company', href: '/company' }, { label: 'Investors' }]} />
      <SectionIntro
        eyebrow="Corporate Governance"
        title="Investor Relations & Corporate Overview"
        description="Sathus Technology delivers sustained, capital-efficient growth by building mission-critical software platforms for enterprise clients worldwide."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="rounded-xl border border-border p-8 bg-card">
          <h2 className="text-xl font-bold mb-4">Capital Efficiency & Growth</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Focused on high-margin enterprise software licensing, embedded engineering retainers, and high-retention SaaS solutions for regulated markets.
          </p>
          <Link href="/company/contact" className="inline-flex items-center text-xs font-semibold text-primary hover:underline">
            Request Investor Relations Deck →
          </Link>
        </div>
        <div className="rounded-xl border border-border p-8 bg-card">
          <h2 className="text-xl font-bold mb-4">Corporate Governance</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Committed to international security standards (ISO 27001, SOC 2 Type II), transparent fiscal auditing, and responsible AI governance.
          </p>
          <Link href="/trust" className="inline-flex items-center text-xs font-semibold text-primary hover:underline">
            View Trust & Compliance Posture →
          </Link>
        </div>
      </div>
    </div>
  );
}
