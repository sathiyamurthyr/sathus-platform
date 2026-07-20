import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Target, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Our mission, engineering approach, and core pillars for regulated industries.',
  alternates: {
    canonical: '/company/about',
  },
  openGraph: {
    title: 'About Us — Sathus Technology',
    description: 'Our mission, engineering approach, and core pillars for regulated industries.',
    url: `${siteConfig.url}/company/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <div>
        <Breadcrumb items={[{ label: 'Company', href: '/company' }, { label: 'About Us' }]} />
        <SectionIntro
          eyebrow="About Sathus Technology"
          title="Engineering Precision for Regulated Enterprise Software"
          description="Sathus Technology was founded to solve a fundamental challenge: enabling enterprises in finance, healthcare, and regulated markets to innovate with modern AI and cloud architectures without compromising governance or security."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold mb-2">Embedded Delivery Squads</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We deploy senior engineering squads directly into client product workflows, accelerating delivery velocity with production-grade discipline.
          </p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold mb-2">Zero-Trust & Compliance</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Every platform we engineer incorporates automated compliance harnesses, audit logs, and security guardrails from line one of code.
          </p>
        </div>
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
            <Zap className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold mb-2">Measurable ROI</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We focus on tangible business outcomes — sub-second query latencies, 99.99% system availability, and rapid feature release cycles.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-8 sm:p-12 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Ready to Modernize Your Enterprise Platform?</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
          Book a strategy session with our principal engineers to discuss your cloud, AI, or data architecture.
        </p>
        <Link
          href="/book-strategy-session"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow"
        >
          Book Strategy Session
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
