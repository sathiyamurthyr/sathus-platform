import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import {
  TrendingUp,
  ShieldCheck,
  Globe,
  Layers,
  Users,
  BarChart3,
  ArrowRight,
  Building2,
  Rocket,
  Target,
  FileText,
  Lock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Investor Relations',
  description:
    'Corporate governance, market opportunity, product portfolio, and investor contact at Sathus Technology Pvt. Ltd.',
  alternates: { canonical: '/company/investors' },
  openGraph: {
    title: 'Investor Relations — Sathus Technology',
    description:
      'Corporate governance, market opportunity, product portfolio, and investor contact at Sathus Technology Pvt. Ltd.',
    url: `${siteConfig.url}/company/investors`,
  },
};

const marketOpportunity = [
  {
    icon: BarChart3,
    title: 'Enterprise AI Market',
    value: '$1.8T',
    timeline: 'by 2030',
    description: 'Global enterprise AI spending, driven by agentic automation, foundation model integration, and evaluation infrastructure.',
    source: 'IDC, 2025 Global AI Forecast',
  },
  {
    icon: Layers,
    title: 'Data Platform Market',
    value: '$285B',
    timeline: 'by 2028',
    description: 'Unified lakehouse, streaming analytics, and data governance infrastructure across regulated industries.',
    source: 'Gartner Market Research, 2025',
  },
  {
    icon: Globe,
    title: 'Cloud Engineering Services',
    value: '$1.2T',
    timeline: 'by 2027',
    description: 'Cloud-native infrastructure, Kubernetes orchestration, and IaC automation across Fortune 500 and emerging enterprises.',
    source: 'McKinsey Digital Report, 2025',
  },
];

const productPortfolio = [
  {
    name: 'Sathus AI Platform',
    slug: 'sathus-ai',
    stage: 'GA',
    stageColor: 'bg-emerald-500/10 text-emerald-600',
    description: 'Enterprise agentic AI platform with built-in evaluation harnesses, multi-agent orchestration, and production safety guardrails.',
    market: 'AI Ops / AIOps',
  },
  {
    name: 'Memomes Cloud',
    slug: 'memomes-cloud',
    stage: 'GA',
    stageColor: 'bg-emerald-500/10 text-emerald-600',
    description: 'Document intelligence and enterprise memory platform using hybrid RAG, semantic search, and RBAC access control.',
    market: 'Document Intelligence',
  },
  {
    name: 'SocialHub MCP',
    slug: 'socialhub-mcp',
    stage: 'Beta',
    stageColor: 'bg-amber-500/10 text-amber-600',
    description: 'Model Context Protocol gateway connecting AI agents to enterprise APIs with OAuth2 token vaulting and telemetry.',
    market: 'AI Infrastructure',
  },
  {
    name: 'OneHealthID',
    slug: 'onehealthid',
    stage: 'GA',
    stageColor: 'bg-emerald-500/10 text-emerald-600',
    description: 'FHIR-native healthcare identity and patient consent platform for multi-provider healthcare networks.',
    market: 'Digital Health',
  },
];

const governancePillars = [
  {
    icon: ShieldCheck,
    title: 'Security & Compliance Controls',
    description: 'International security standards readiness (ISO 27001, SOC 2 Type II), transparent fiscal auditing, automated compliance reporting.',
  },
  {
    icon: Lock,
    title: 'Responsible AI Governance',
    description: 'Zero-retention AI data policies, mandatory evaluation harnesses, bias auditing, and structured LLM output validation.',
  },
  {
    icon: FileText,
    title: 'Financial Transparency',
    description: 'Capital-efficient operations with recurring revenue models across multi-year enterprise contracts and SaaS subscriptions.',
  },
  {
    icon: Users,
    title: 'Board & Advisory Structure',
    description: 'Governed by experienced technology executives with backgrounds in enterprise software, financial services, and regulated healthcare.',
  },
];

const roadmapMilestones = [
  { phase: 'Phase 1', title: 'Platform Foundation', status: 'Complete', detail: 'Core product suite launched — Sathus AI, Memomes Cloud, SocialHub MCP, OneHealthID GA releases.' },
  { phase: 'Phase 2', title: 'Enterprise GTM Expansion', status: 'Active', detail: 'Embedded squad deployments in financial services and healthcare clients. Partner ecosystem with AWS, Azure, Databricks.' },
  { phase: 'Phase 3', title: 'Platform Deepening', status: 'H2 2026', detail: 'Multi-tenant SaaS management portal. Advanced MLOps pipeline orchestration. Customer analytics dashboard.' },
  { phase: 'Phase 4', title: 'International Expansion', status: '2027', detail: 'EU data residency compliance (GDPR). Middle East regulated market entry. Strategic OEM partnerships.' },
];

export default function InvestorsPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-20">
      {/* Header */}
      <div>
        <Breadcrumb items={[{ label: 'Company', href: '/company' }, { label: 'Investor Relations' }]} />
        <SectionIntro
          eyebrow="Investor Relations"
          title="Building the Enterprise AI Infrastructure Layer"
          description="Sathus Technology Pvt. Ltd. is engineering the foundational software infrastructure that regulated enterprises need to deploy, govern, and scale AI and data platforms safely."
        />
      </div>

      {/* Company Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="rounded-xl border border-border bg-card p-8 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">Company Overview</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sathus Technology Pvt. Ltd. is a deep-technology engineering company headquartered in Bengaluru, India, with a globally distributed delivery model. We design, build, and operate enterprise-grade AI, data, and cloud software for regulated industries including financial services, healthcare, life sciences, and insurance.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our business model combines embedded engineering retainers, multi-year SaaS platform subscriptions, and strategic product licensing — generating high-margin, recurring revenue with long client retention.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-8 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">Vision & Mission</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Vision:</strong> To become the trusted engineering partner for every regulated enterprise adopting AI and modern data platforms at scale.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Mission:</strong> Engineer production-grade, compliance-ready AI and data infrastructure that enterprises can trust, audit, and depend on — without vendor lock-in or compromise on security.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Differentiation:</strong> Principal-grade engineers. Open architectures. Compliance by design. Accountable performance SLAs. Code, not consulting reports.
          </p>
        </div>
      </div>

      {/* Market Opportunity */}
      <div>
        <h2 className="text-2xl font-bold mb-8">Market Opportunity</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketOpportunity.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.title} className="rounded-xl border border-border bg-card p-6 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{m.title}</p>
                  <p className="text-3xl font-black text-foreground">{m.value}</p>
                  <p className="text-xs text-primary font-semibold">{m.timeline}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
                <p className="text-[10px] text-muted-foreground italic">{m.source}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Portfolio */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Product Portfolio</h2>
        <p className="text-sm text-muted-foreground mb-8">
          A composable platform of enterprise software products designed to work as an integrated stack or as standalone solutions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productPortfolio.map((p) => (
            <div key={p.name} className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">{p.name}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider ${p.stageColor}`}>
                    {p.stage}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">{p.market}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{p.description}</p>
              </div>
              <Link
                href={`/products/${p.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
              >
                View Product Details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Corporate Governance */}
      <div>
        <h2 className="text-2xl font-bold mb-8">Corporate Governance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {governancePillars.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.title} className="rounded-xl border border-border bg-card p-6 flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-2">{g.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{g.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          For formal security attestations and compliance documentation, visit our{' '}
          <Link href="/trust" className="text-primary font-semibold hover:underline">Trust Center</Link>.
        </p>
      </div>

      {/* Leadership */}
      <div className="rounded-xl border border-border bg-card p-8 space-y-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold">Leadership & Advisory</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          Our executive team combines decades of applied engineering experience in cloud architecture, AI research, and regulated enterprise software delivery — not just advisory — with a bias toward shipping production systems over slide decks.
        </p>
        <Link
          href="/company/leadership"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
        >
          Meet the Leadership Team <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Roadmap */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Platform Roadmap</h2>
        <p className="text-sm text-muted-foreground mb-8">A phased delivery roadmap focused on platform depth, enterprise GTM, and international expansion.</p>
        <div className="space-y-4">
          {roadmapMilestones.map((m, i) => (
            <div key={m.phase} className="rounded-xl border border-border bg-card p-6 flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-3 min-w-[140px]">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0
                  ${m.status === 'Complete' ? 'bg-emerald-500 text-white' : m.status === 'Active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {i + 1}
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-semibold">{m.phase}</p>
                  <p className="text-xs font-bold text-foreground">{m.title}</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground leading-relaxed">{m.detail}</p>
              </div>
              <span className={`self-start text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider whitespace-nowrap
                ${m.status === 'Complete' ? 'bg-emerald-500/10 text-emerald-600' : m.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-border bg-muted/40 p-8 sm:p-12 text-center max-w-3xl mx-auto">
        <TrendingUp className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Investor Inquiries</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-4">
          For investor relations inquiries, partnership discussions, or to request our corporate overview deck, please contact us directly. All inquiries are handled with strict confidentiality.
        </p>
        <p className="text-xs text-muted-foreground mb-8">
          <strong className="text-foreground">Response commitment:</strong> We respond to all investor inquiries within 2 business days.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow"
          >
            <Rocket className="h-4 w-4" />
            Request Investor Deck
          </Link>
          <Link
            href="/trust"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <ShieldCheck className="h-4 w-4" />
            View Trust & Compliance
          </Link>
        </div>
      </div>
    </div>
  );
}
