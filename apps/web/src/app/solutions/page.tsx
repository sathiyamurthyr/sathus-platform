import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Bot, Database, Boxes, CloudCog, Rocket, Repeat } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/sections/reveal';
import { SectionIntro } from '@/components/sections/section-intro';

const SITE_URL = 'https://sathus.in';

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
    url: `${SITE_URL}/solutions`,
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
    challenge:
      'Pilot AI projects stall in production — models drift, outputs are not auditable, and teams cannot govern them.',
    approach:
      'Production-grade agentic systems with evaluation harnesses, observability, and human-in-the-loop controls from day one.',
    outcome: 'Deploy AI with measurable ROI and enterprise-grade governance.',
    technologies: ['LLM Integration', 'RAG Architecture', 'MLOps', 'Vector Databases'],
  },
  {
    icon: Database,
    title: 'Data Engineering',
    href: '/solutions/data-engineering',
    challenge:
      'Data lives in fragmented silos with no lineage, no quality guarantees, and no real-time access.',
    approach:
      'Governed lakehouses and streaming pipelines that turn raw events into trustworthy, query-ready intelligence.',
    outcome: 'Unified, governed data platform with real-time analytics capabilities.',
    technologies: ['Lakehouse', 'Streaming', 'Data Quality', 'Lineage'],
  },
  {
    icon: Boxes,
    title: 'Enterprise Applications',
    href: '/solutions/enterprise-applications',
    challenge:
      'Off-the-shelf software forces process compromise and creates brittle, hard-to-maintain integrations.',
    approach:
      'Domain-driven applications — custom or composable — that fit the way your organization actually works.',
    outcome: 'Custom applications that scale with your business complexity.',
    technologies: ['Domain-Driven Design', 'Microservices', 'API Platform', 'Workflow Automation'],
  },
  {
    icon: CloudCog,
    title: 'Cloud Modernization',
    href: '/solutions/cloud-modernization',
    challenge:
      'Legacy estates are costly, fragile, and difficult to scale securely without business disruption.',
    approach:
      'Re-platform to cloud-native architectures on Azure and AWS with zero-downtime migration paths.',
    outcome: 'Resilient, scalable cloud infrastructure with reduced operational overhead.',
    technologies: ['Azure', 'AWS', 'Kubernetes', 'Infrastructure as Code'],
  },
  {
    icon: Rocket,
    title: 'Product Engineering',
    href: '/solutions/product-engineering',
    challenge:
      'Strong ideas die in the gap between prototype and a shipped, supported product.',
    approach:
      'Embedded product squads that take concepts from discovery to GA with a real delivery cadence.',
    outcome: 'Ship products that users adopt with clear product-market fit signals.',
    technologies: ['Product Discovery', 'Agile Delivery', 'Observability', 'User Research'],
  },
  {
    icon: Repeat,
    title: 'Digital Transformation',
    href: '/solutions/digital-transformation',
    challenge:
      'Transformation programs run for years and deliver slide decks rather than measurable outcomes.',
    approach:
      'Outcome-based roadmaps and durable platform thinking that drives operating-model change.',
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
  return (
    <>
      {/* Editorial Hero */}
      <section id="solutions-hero" className="scroll-mt-24 py-20 sm:py-24">
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
      <section id="practices" className="scroll-mt-24 py-20 sm:py-24">
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
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-2xl text-muted-foreground/40">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h2 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
                    {practice.title}
                  </h2>

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
      <section id="methodology" className="scroll-mt-24 py-20 sm:py-24 bg-muted/20">
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
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground">{stage.name}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{stage.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sathus */}
      <section id="why" className="scroll-mt-24 py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <SectionIntro
            eyebrow="Differentiator"
            title="Why Sathus"
            description="Our engineering approach sets us apart from traditional consultancies."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-lg font-semibold text-foreground">Engineering-first</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We ship production code, not presentations. Every engagement includes source code
                deliverables, documentation, and knowledge transfer.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-lg font-semibold text-foreground">Security-first</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Security is built into every layer of our architecture, from secure coding practices
                to compliance-by-design for regulated industries.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-lg font-semibold text-foreground">Scalable architecture</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our reference architectures scale horizontally, integrate cleanly, and adapt to your
                evolving enterprise requirements.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <h3 className="text-lg font-semibold text-foreground">Long-term partnership</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We stay engaged post-launch to ensure continued success, providing ongoing support,
                optimization, and evolution of your platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="scroll-mt-24 py-20 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-primary/5 p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to engineer your next platform?
            </h2>
<p className="mt-4 text-muted-foreground">
              Let's discuss how our engineering practices can accelerate your business outcomes.
            </p>
            <Link
              href="/contact"
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