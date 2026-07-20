import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Target,
  Zap,
  Users,
  Layers,
  Code2,
  Globe,
  Building2,
  Heart,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Sathus Technology',
  description:
    'Our mission, founding story, engineering philosophy, and core principles for delivering AI, data, and cloud platforms for regulated industries.',
  alternates: { canonical: '/company/about' },
  openGraph: {
    title: 'About Sathus Technology',
    description:
      'Our mission, engineering approach, and core pillars for regulated industries.',
    url: `${siteConfig.url}/company/about`,
  },
};

const principles = [
  {
    icon: Code2,
    title: 'Code, Not Slide Decks',
    description:
      'Every engagement delivers production source code, automated CI/CD pipelines, and full intellectual property transfer. We do not produce advisory reports without accompanying systems.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance by Design',
    description:
      'Security controls, audit logging, data classification, and RBAC policies are embedded from line one of every system we build — not bolted on at the end of a sprint.',
  },
  {
    icon: Layers,
    title: 'Open Architectures Only',
    description:
      'We build on open standards — Apache Iceberg, Delta Lake, FastAPI, Model Context Protocol, and Kubernetes. Your data, intellectual property, and infrastructure remain 100% yours.',
  },
  {
    icon: Zap,
    title: 'Accountable Performance',
    description:
      'We commit to hard technical SLAs: sub-10ms query latencies, 99.99% system availability, 98%+ RAG retrieval precision. These are contractual metrics, not marketing claims.',
  },
  {
    icon: Users,
    title: 'Embedded Squad Model',
    description:
      'Our senior engineers integrate directly into your engineering organization — using your Jira, GitHub, and Slack — as a cohesive, high-output extension of your team, not an external agency.',
  },
  {
    icon: Heart,
    title: 'Long-Term Partnership',
    description:
      'We build for the systems you will operate for the next decade. Every architecture decision considers operational complexity, hiring needs, and long-term maintainability.',
  },
];

const expertise = [
  { domain: 'Artificial Intelligence', detail: 'Agentic LLM systems, evaluation harnesses, multi-agent orchestration, RAG pipelines, and Model Context Protocol development.' },
  { domain: 'Data Engineering', detail: 'Governed lakehouses, Apache Iceberg, Databricks, Snowflake, Apache Kafka streaming, and dbt transformation pipelines.' },
  { domain: 'Cloud Infrastructure', detail: 'AWS and Azure enterprise landing zones, Kubernetes orchestration, Terraform IaC, GitOps, and FinOps governance.' },
  { domain: 'Enterprise Applications', detail: '.NET 9 Clean Architecture, FastAPI microservices, FHIR healthcare APIs, core banking systems, and identity platforms.' },
  { domain: 'Regulated Industries', detail: 'Financial services (BFSI), healthcare (HIPAA/FHIR), insurance, life sciences, and public sector compliance environments.' },
];

const industryClients = [
  { name: 'Financial Services & Banking', icon: Building2, detail: 'Core banking modernization, risk platform engineering, real-time compliance reporting, and anti-fraud ML systems.' },
  { name: 'Healthcare & Life Sciences', icon: Heart, detail: 'FHIR-native data platforms, clinical decision support AI, patient identity management, and regulatory trial data systems.' },
  { name: 'Insurance & Risk', icon: ShieldCheck, detail: 'Actuarial lakehouse analytics, claims processing automation, and IoT-integrated underwriting AI platforms.' },
  { name: 'FinTech & Payments', icon: Zap, detail: 'Real-time payment processing APIs, PCI-DSS compliant data pipelines, and fraud detection ML inference systems.' },
];

const methodology = [
  { step: 'Discover', description: 'Understand your constraints, existing architecture, regulatory obligations, and target business outcomes.' },
  { step: 'Architect', description: 'Produce reference architectures aligned to enterprise security and scalability standards with your team.' },
  { step: 'Build', description: 'Ship production-grade code with automated testing, documentation, and CI/CD pipelines from sprint one.' },
  { step: 'Deploy', description: 'Execute zero-downtime rollouts with observability, alerting, and runbook documentation in place.' },
  { step: 'Validate', description: 'Verify against pre-agreed business metric benchmarks — not just functional requirements.' },
  { step: 'Optimize', description: 'Continuously improve based on production telemetry, cost targets, and evolving business needs.' },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-20">
      {/* Header */}
      <div>
        <Breadcrumb items={[{ label: 'Company', href: '/company' }, { label: 'About Us' }]} />
        <SectionIntro
          eyebrow="About Sathus Technology"
          title="Engineering Precision for Regulated Enterprise Software"
          description="Sathus Technology was founded to solve a fundamental gap: regulated enterprises in finance, healthcare, and critical infrastructure needed to innovate with modern AI and cloud architectures — but lacked access to engineering teams with deep domain expertise and compliance rigor."
        />
      </div>

      {/* Company Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="rounded-xl border border-border bg-card p-8 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Globe className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">Our Story</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sathus Technology was founded by engineers who had spent years inside global banks, healthcare systems, and insurance firms — watching enterprises spend years on transformation programs that delivered little production value.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We built Sathus around a simple thesis: regulated enterprises deserve production-grade AI and data platforms built by engineers with genuine domain expertise — not management consultants who subcontract development to junior resources.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every engineer at Sathus has shipped production systems in regulated environments. Every engagement results in systems we stand behind, with clear SLAs and full intellectual property transfer.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-8 space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Award className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold">What Sets Us Apart</h2>
          <ul className="space-y-3 text-xs text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">→</span>
              <span>Principal-grade engineers with 8–20 years in AI, data, and regulated enterprise software.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">→</span>
              <span>Deep expertise in open table formats, MCP protocol, FHIR, and SOC 2 / ISO 27001 environments.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">→</span>
              <span>No junior staff on client systems. No hand-off to offshore pools after kickoff.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">→</span>
              <span>Zero-retention AI policies ensuring client data is never used for model training.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">→</span>
              <span>Open architecture approach — Apache Iceberg, FastAPI, Kubernetes — no proprietary lock-in.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold shrink-0">→</span>
              <span>Contractual performance SLAs on throughput, availability, and retrieval accuracy.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Engineering Principles */}
      <div>
        <h2 className="text-2xl font-bold mb-8">Engineering Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Expertise */}
      <div>
        <h2 className="text-2xl font-bold mb-8">Domain Expertise</h2>
        <div className="space-y-3">
          {expertise.map((e) => (
            <div key={e.domain} className="rounded-xl border border-border bg-card p-5 flex flex-col md:flex-row gap-4">
              <p className="text-sm font-bold text-primary min-w-[220px] shrink-0">{e.domain}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{e.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Industries */}
      <div>
        <h2 className="text-2xl font-bold mb-8">Industries We Serve</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {industryClients.map((ind) => {
            const Icon = ind.icon;
            return (
              <div key={ind.name} className="rounded-xl border border-border bg-card p-6 flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-2">{ind.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ind.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center">
          <Link href="/industries" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4">
            Explore All Industries <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Delivery Methodology */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Our Delivery Methodology</h2>
        <p className="text-sm text-muted-foreground mb-8">
          A repeatable, phased delivery model that has been refined across engagements in financial services, healthcare, and cloud-native product companies.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {methodology.map((m, i) => (
            <div key={m.step} className="rounded-xl border border-border bg-card p-5 flex gap-4">
              <span className="text-2xl font-black text-primary/20 font-mono shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-sm font-bold text-foreground mb-1">{m.step}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border border-border bg-muted/40 p-8 sm:p-12 text-center max-w-4xl mx-auto">
        <Target className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Evaluate Sathus for Your Platform</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
          Book a 30-minute architecture review with our principal engineers. We will evaluate your existing platform, identify high-leverage improvements, and propose a phased delivery roadmap.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/book-strategy-session"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow"
          >
            Book Architecture Review
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/company/why-sathus"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Why Sathus
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
