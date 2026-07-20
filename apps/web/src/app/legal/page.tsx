import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import { Shield, FileText, Cookie, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Legal & Compliance',
  description: 'Legal terms, privacy policies, cookie disclaimers, and regulatory compliance at Sathus Technology.',
  alternates: {
    canonical: '/legal',
  },
  openGraph: {
    title: 'Legal & Compliance — Sathus Technology',
    description: 'Legal terms, privacy policies, cookie disclaimers, and regulatory compliance.',
    url: `${siteConfig.url}/legal`,
  },
};

const legalDocs = [
  {
    title: 'Privacy Policy',
    description: 'How we collect, protect, process, and respect your enterprise data and personal information.',
    href: '/legal/privacy-policy',
    icon: Shield,
  },
  {
    title: 'Terms of Service',
    description: 'Terms governing the use of Sathus Technology SaaS products, platforms, and professional services.',
    href: '/legal/terms',
    icon: FileText,
  },
  {
    title: 'Cookie Policy',
    description: 'Detailed disclosures regarding cookies, tracking tokens, and browser session preference storage.',
    href: '/legal/cookies',
    icon: Cookie,
  },
];

export default function LegalHubPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <Breadcrumb items={[{ label: 'Legal' }]} />
      <SectionIntro
        eyebrow="Legal & Governance"
        title="Terms, Privacy & Legal Policies"
        description="Review our legal agreements, privacy disclosures, and compliance frameworks governing Sathus Technology services."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {legalDocs.map((doc) => {
          const Icon = doc.icon;
          return (
            <div key={doc.title} className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2">{doc.title}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">{doc.description}</p>
              </div>
              <Link
                href={doc.href}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
              >
                Read Policy
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
