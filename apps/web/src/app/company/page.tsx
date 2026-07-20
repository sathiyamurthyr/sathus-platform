import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import { ShieldCheck, Target, Users, Briefcase, Mail, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Company Hub',
  description: 'Learn about Sathus Technology, our leadership team, corporate governance, careers, and engineering culture.',
  alternates: {
    canonical: '/company',
  },
  openGraph: {
    title: 'Company Hub — Sathus Technology',
    description: 'Engineering the future of AI, data & enterprise software for regulated industries.',
    url: `${siteConfig.url}/company`,
  },
};

const companySections = [
  {
    title: 'About Us & Approach',
    description: 'Learn about our engineering philosophy, core principles, and track record in regulated industries.',
    href: '/company/about',
    icon: Target,
    badge: 'Overview',
  },
  {
    title: 'Leadership',
    description: 'Meet our executive leadership and advisory team shaping enterprise AI and data platforms.',
    href: '/company/leadership',
    icon: Users,
    badge: 'Team',
  },
  {
    title: 'Careers & Culture',
    description: 'Join our embedded engineering squads building mission-critical SaaS and AI infrastructure.',
    href: '/company/careers',
    icon: Briefcase,
    badge: 'We’re Hiring',
  },
  {
    title: 'Investor Relations',
    description: 'Corporate governance, growth metrics, and investor contact information.',
    href: '/company/investors',
    icon: Award,
    badge: 'Corporate',
  },
  {
    title: 'Contact Engineering',
    description: 'Reach our engineering and sales teams directly for consultations and strategy sessions.',
    href: '/company/contact',
    icon: Mail,
    badge: 'Connect',
  },
  {
    title: 'Trust Center',
    description: 'Inspect our security posture, ISO/SOC 2 certifications, and responsible AI guardrails.',
    href: '/trust',
    icon: ShieldCheck,
    badge: 'Security',
  },
];

export default function CompanyHubPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Company' }]} />
      <SectionIntro
        eyebrow="Company"
        title="Engineering the Future of Enterprise Software"
        description="We partner with regulated enterprises to design, build, and scale mission-critical AI, data, and cloud platforms."
      />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companySections.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between hover:border-primary/40 transition-colors shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-muted px-2 py-0.5 rounded text-muted-foreground">
                    {item.badge}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2">{item.title}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">{item.description}</p>
              </div>
              <Link
                href={item.href}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
              >
                Learn more
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
