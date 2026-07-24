import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Bot, Database, Boxes, CloudCog, Rocket, Repeat, Sparkles, Network, Cloud, Code2, Server, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/sections/reveal';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Solutions',
  description:
    'Engineering solutions that deliver business outcomes. AI Engineering, Data Engineering, Enterprise Applications, Cloud Modernization, Product Engineering, and Digital Transformation.',
  alternates: {
    canonical: '/solutions',
  },
  openGraph: {
    title: 'Solutions — Sathus Technology',
    description:
      'Engineering disciplines delivered as accountable outcomes with reference architectures and production-ready delivery.',
    url: `${siteConfig.url}/solutions`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solutions — Sathus Technology',
    description:
      'Engineering disciplines delivered as accountable outcomes with reference architectures and production-ready delivery.',
  },
};

interface SolutionPractice {
  icon: LucideIcon;
  title: string;
  href: string;
  challenge: string;
  approach: string;
  outcome: string;
  technologies: string[];
}

const SOLUTION_PRACTICES: SolutionPractice[] = [
  {
    icon: Bot,
    title: 'AI Engineering',
    href: '/solutions/ai-engineering',
    challenge: 'Pilot AI projects stall in production — models drift, outputs are not auditable, and teams cannot govern them.',
    approach: 'Production-grade agentic systems with evaluation harnesses, observability, and human-in-the-loop controls from day one.',
    outcome: 'Deploy AI with measurable ROI and enterprise-grade governance.',
    technologies: ['LLM Integration', 'RAG Architecture', 'MLOps', 'Vector Databases'],
  },
  {
    icon: Database,
    title: 'Data Engineering',
    href: '/solutions/data-engineering',
    challenge: 'Data lives in fragmented silos with no lineage, no quality guarantees, and no real-time access.',
    approach: 'Governed lakehouses and streaming pipelines that turn raw events into trustworthy, query-ready intelligence.',
    outcome: 'Unified, governed data platform with real-time analytics capabilities.',
    technologies: ['Lakehouse', 'Streaming', 'Data Quality', 'Lineage'],
  },
  {
    icon: Sparkles,
    title: 'GenAI Solutions',
    href: '/solutions/genai',
    challenge: 'Generic LLM prompts produce inconsistent outputs and hallucinations that erode enterprise trust.',
    approach: 'Custom fine-tuning, RLHF, and enterprise-grade LLM deployment pipelines with automated guardrails.',
    outcome: 'Domain-specific LLM systems with measurable accuracy and auditability.',
    technologies: ['Fine-tuning', 'RLHF', 'Prompt Engineering', 'Guardrails'],
  },
  {
    icon: Bot,
    title: 'AI Agents & Swarms',
    href: '/solutions/ai-agents',
    challenge: 'Multi-step enterprise workflows require autonomous coordination across tools, APIs, and human approval queues.',
    approach: 'Stateful multi-agent swarms with sandboxed tool execution, evaluation harnesses, and human-in-the-loop controls.',
    outcome: 'Automate complex enterprise workflows with full audit trail and safety guarantees.',
    technologies: ['Multi-Agent Orchestration', 'Tool Execution', 'MCP', 'Eval Harnesses'],
  },
  {
    icon: Database,
    title: 'Enterprise RAG Systems',
    href: '/solutions/rag-solutions',
    challenge: 'Naive vector search retrieves irrelevant context and exposes unauthorized documents to LLMs.',
    approach: 'Hybrid BM25 + vector search, semantic reranking, and RBAC permission filtering before prompt injection.',
    outcome: '98%+ retrieval precision with SOC 2 document access compliance.',
    technologies: ['Qdrant', 'Milvus', 'Hybrid Search', 'Reranking'],
  },
  {
    icon: Network,
    title: 'MCP Development',
    href: '/solutions/mcp-development',
    challenge: 'AI agents need secure, standardized connectivity to enterprise APIs without credential exposure.',
    approach: 'Custom Model Context Protocol servers, OAuth2 credential vaults, and enterprise MCP gateways.',
    outcome: '10x faster agent tool onboarding with 100% audit logging.',
    technologies: ['TypeScript MCP SDK', 'Python MCP SDK', 'OAuth2', 'Tool Registry'],
  },
  {
    icon: Cloud,
    title: 'Cloud Engineering',
    href: '/solutions/cloud-engineering',
    challenge: 'Ad-hoc cloud provisioning creates environment drift, security gaps, and uncontrolled spending.',
    approach: 'Terraform IaC, GitOps Kubernetes clusters, and automated FinOps policies on AWS and Azure.',
    outcome: '99.99% availability with 40% cloud cost reduction through automated governance.',
    technologies: ['Terraform', 'Kubernetes', 'ArgoCD', 'AWS / Azure'],
  },
  {
    icon: CloudCog,
    title: 'Cloud Modernization',
    href: '/solutions/cloud-modernization',
    challenge: 'Legacy estates are costly, fragile, and difficult to scale securely without business disruption.',
    approach: 'Re-platform to cloud-native architectures on Azure and AWS with zero-downtime migration paths.',
    outcome: 'Resilient, scalable cloud infrastructure with reduced operational overhead.',
    technologies: ['Azure', 'AWS', 'Kubernetes', 'Infrastructure as Code'],
  },
  {
    icon: Activity,
    title: 'Enterprise Integration',
    href: '/solutions/enterprise-integration',
    challenge: 'Point-to-point APIs and batch ETL create brittle coupling and near-real-time data delays.',
    approach: 'Kafka event mesh, Change Data Capture (CDC), and standardized API gateways to decouple systems.',
    outcome: 'Sub-10ms event delivery with 99.999% message guarantee across enterprise services.',
    technologies: ['Apache Kafka', 'Debezium', 'Kong Gateway', 'RabbitMQ'],
  },
  {
    icon: Code2,
    title: 'API Engineering',
    href: '/solutions/api-development',
    challenge: 'Synchronous legacy APIs bottleneck AI workflows and fail under high-concurrency agentic loads.',
    approach: 'Async-first Python FastAPI microservices with Pydantic v2, OpenAPI 3.0, and Redis rate limiting.',
    outcome: '50k+ RPS throughput with sub-5ms P99 latency and 100% OpenAPI compliance.',
    technologies: ['FastAPI', 'Python 3.13+', 'Pydantic v2', 'Async SQLAlchemy'],
  },
  {
    icon: Server,
    title: 'Data Platform Modernization',
    href: '/solutions/data-platform-modernization',
    challenge: 'Legacy Oracle and Teradata warehouses incur massive licensing costs and cannot support modern AI workloads.',
    approach: 'Open lakehouse migration to Databricks and Snowflake using Apache Iceberg and dual-run validation.',
    outcome: '70% TCO reduction and 10x query performance improvement post-migration.',
    technologies: ['Databricks', 'Apache Iceberg', 'dbt', 'Snowflake'],
  },
  {
    icon: Boxes,
    title: 'Enterprise Applications',
    href: '/solutions/enterprise-applications',
    challenge: 'Off-the-shelf software forces process compromise and creates brittle, hard-to-maintain integrations.',
    approach: 'Domain-driven applications — custom or composable — that fit the way your organization actually works.',
    outcome: 'Custom applications that scale with your business complexity.',
    technologies: ['Domain-Driven Design', 'Microservices', 'API Platform', 'Workflow Automation'],
  },
  {
    icon: Rocket,
    title: 'Product Engineering',
    href: '/solutions/product-engineering',
    challenge: 'Strong ideas die in the gap between prototype and a shipped, supported product.',
    approach: 'Embedded product squads that take concepts from discovery to GA with a real delivery cadence.',
    outcome: 'Ship products that users adopt with clear product-market fit signals.',
    technologies: ['Product Discovery', 'Agile Delivery', 'Observability', 'User Research'],
  },
  {
    icon: Repeat,
    title: 'Digital Transformation',
    href: '/solutions/digital-transformation',
    challenge: 'Transformation programs run for years and deliver slide decks rather than measurable outcomes.',
    approach: 'Outcome-based roadmaps and durable platform thinking that drives operating-model change.',
    outcome: 'Measurable transformation with sustainable platform foundations.',
    technologies: ['Change Management', 'Platform Strategy', 'Data Mesh', 'API Economy'],
  },
];

const DELIVERY_STAGES = [
  { name: 'Discover', description: 'Understand your context, constraints, and desired outcomes.' },
  { name: 'Architect', description: 'Design reference architectures aligned to your enterprise standards.' },
  { name: 'Build', description: 'Ship production-grade code with automated testing and CI/CD.' },
  { name: 'Deploy', description: 'Execute zero-downtime rollouts with observability in place.' },
  { name: 'Operate', description: 'Run and support your systems with SRE principles.' },
  { name: 'Optimize', description: 'Continuously improve based on business metrics and feedback.' },
];

export default function SolutionsPage() {
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Enterprise Engineering Solutions',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Engineering Practices',
      itemListElement: SOLUTION_PRACTICES.map((p) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: p.title,
          description: p.approach,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Solutions' }]} />
      </div>

      {/* Editorial Hero */}
      <section id="solutions-hero" className="scroll-mt-24 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <SectionIntro
              eyebrow="Solutions"
              title="Engineering Solutions That Deliver Business Outcomes"
              description="We engineer enterprise-grade platforms that solve complex business challenges. Each solution combines deep technical expertise with proven delivery methodologies to ensure measurable impact."
            />
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Talk to an Expert
              </Link>
              <Link
                href="#practices"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Explore Practices
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section id="practices" className="scroll-mt-24 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <SectionIntro
            eyebrow="Practices"
            title="Six Engineering Practices"
            description="Each practice is a delivery discipline with accountable outcomes, reference architectures, and a proven path to production."
          />

          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {SOLUTION_PRACTICES.map((practice, i) => {
              const Icon = practice.icon;
              return (
                <Reveal
                  key={practice.title}
                  delay={(i % 3) * 0.06}
                  className="group relative bg-background p-7 transition-colors duration-300 hover:bg-muted/40"
                >
                  <div className="flex items-center justify-between relative m-0 p-0">
                    <div className="flex items-center gap-4 pr-12 m-0 p-0">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 transition-colors group-hover:bg-primary group-hover:text-primary-foreground shrink-0">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h2 className="text-xl font-semibold tracking-tight text-foreground m-0 p-0">
                        {practice.title}
                      </h2>
                    </div>
                    <span className="absolute top-0 right-0 font-display text-2xl font-bold text-muted-foreground/40 select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Business Challenge
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                        {practice.challenge}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Our Approach
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                        {practice.approach}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Business Outcome
                      </h3>
                      <p className="mt-1.5 text-sm font-medium text-primary">
                        {practice.outcome}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Key Technologies
                      </h3>
                      <ul className="mt-1.5 flex flex-wrap gap-1.5">
                        {practice.technologies.map((tech) => (
                          <li
                            key={tech}
                            className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    href={practice.href}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                  >
                    Learn more
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="sr-only">{practice.title}</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Delivery Methodology */}
      <section id="methodology" className="scroll-mt-24 py-16 sm:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <SectionIntro
            eyebrow="Methodology"
            title="Delivery Framework"
            description="Our six-stage delivery process ensures predictable outcomes and continuous value delivery."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DELIVERY_STAGES.map((stage, i) => (
              <Reveal key={stage.name} delay={i * 0.05}>
                <div className="rounded-xl border border-border bg-background p-6">
                  <div className="flex items-baseline gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                      {i + 1}
                    </span>
                    <h3 className="text-base font-semibold text-foreground">{stage.name}</h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{stage.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sathus */}
      <section id="why" className="scroll-mt-24 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <SectionIntro
            eyebrow="Differentiator"
            title="Why Sathus"
            description="Our engineering approach sets us apart from traditional consultancies."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-base font-semibold text-foreground">Engineering-first</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                We ship production code, not presentations. Every engagement includes source code
                deliverables, documentation, and knowledge transfer.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-base font-semibold text-foreground">Security-first</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Security is built into every layer of our architecture, from secure coding practices
                to compliance-by-design for regulated industries.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-base font-semibold text-foreground">Scalable architecture</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Our reference architectures scale horizontally, integrate cleanly, and adapt to your
                evolving enterprise requirements.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-base font-semibold text-foreground">Long-term partnership</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                We stay engaged post-launch to ensure continued success, providing ongoing support,
                optimization, and evolution of your platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="scroll-mt-24 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-primary/5 p-8 sm:p-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Ready to engineer your next platform?
            </h2>
            <p className="mt-4 text-xs text-muted-foreground max-w-lg mx-auto">
              Let&apos;s discuss how our engineering practices can accelerate your business outcomes.
            </p>
            <Link
              href="/book-strategy-session"
              className="mt-8 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Start the conversation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
