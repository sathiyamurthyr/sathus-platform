import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import { Handshake, Award, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Partner Ecosystem',
  description: 'Our global technology partners including AWS, Microsoft Azure, Databricks, Snowflake, and Anthropic.',
  alternates: {
    canonical: '/company/partners',
  },
  openGraph: {
    title: 'Partner Ecosystem — Sathus Technology',
    description: 'Our global technology partners including AWS, Microsoft Azure, Databricks, Snowflake, and Anthropic.',
    url: `${siteConfig.url}/company/partners`,
  },
};

const partnerTiers = [
  {
    name: 'Cloud & Infrastructure Partners',
    partners: ['Amazon Web Services (AWS)', 'Microsoft Azure', 'Google Cloud Platform'],
    description: 'Premier delivery partner for enterprise cloud migration, landing zones, and Kubernetes orchestration.',
  },
  {
    name: 'Data & Lakehouse Partners',
    partners: ['Databricks', 'Snowflake', 'Apache Iceberg Ecosystem'],
    description: 'Certified implementation partner building unified analytics lakehouses and streaming event pipelines.',
  },
  {
    name: 'AI & Frontier Model Partners',
    partners: ['Anthropic (MCP Standard)', 'OpenAI Enterprise', 'Qdrant Vector DB'],
    description: 'System integrator engineering Model Context Protocol (MCP) gateways and RAG vector search systems.',
  },
];

export default function PartnersPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <div>
        <Breadcrumb items={[{ label: 'Company', href: '/company' }, { label: 'Partners' }]} />
        <SectionIntro
          eyebrow="Global Ecosystem"
          title="Enterprise Technology Alliance & Partners"
          description="We partner with the world's leading cloud, data platform, and frontier AI providers to deliver production-ready solutions for regulated enterprises."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {partnerTiers.map((tier) => (
          <div key={tier.name} className="rounded-xl border border-border p-6 bg-card flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Handshake className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold mb-2">{tier.name}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">{tier.description}</p>
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Certified Networks:</span>
                <ul className="space-y-1">
                  {tier.partners.map((partner) => (
                    <li key={partner} className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-primary shrink-0" />
                      {partner}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-8 sm:p-12 text-center max-w-4xl mx-auto">
        <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Become a Sathus Alliance Partner</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
          Join our enterprise partner network to collaborate on AI engineering, data platform modernization, and cloud initiatives.
        </p>
        <Link
          href="/company/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow"
        >
          Partner With Us
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
