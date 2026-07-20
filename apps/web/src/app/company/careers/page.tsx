import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import {
  Heart,
  Gift,
  Users,
  ArrowRight,
  BookOpen,
  Code2,
  Zap,
  Coffee,
  Globe,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers at Sathus Technology',
  description:
    'Join our embedded engineering squads building enterprise AI, data platforms, and cloud software. We hire senior engineers who want to own and ship.',
  alternates: { canonical: '/company/careers' },
  openGraph: {
    title: 'Careers — Sathus Technology',
    description:
      'Join our embedded engineering squads building enterprise AI, data platforms, and cloud software.',
    url: `${siteConfig.url}/company/careers`,
  },
};

const culturePillars = [
  {
    icon: Code2,
    title: 'High Engineering Bar',
    description:
      'Every engineer at Sathus operates as a senior contributor. We hire principals, architects, and leads — not generalists. You will work on production systems handling financial transaction data, patient records, and real-time AI inference.',
  },
  {
    icon: Zap,
    title: 'Complete Product Ownership',
    description:
      'You will own architecture decisions, code quality, and production delivery without layers of bureaucracy. Our squads move from design to deployed feature in days, not quarters.',
  },
  {
    icon: BookOpen,
    title: 'Continuous Deep Learning',
    description:
      'Annual learning stipend for conferences, certifications, and courses. Internal engineering guild sessions. Direct exposure to frontier AI, lakehouse architectures, and MCP protocol development.',
  },
  {
    icon: ShieldCheck,
    title: 'Work That Matters',
    description:
      'The systems we build carry clinical decisions, financial compliance obligations, and critical infrastructure. If you want your code to matter beyond demos, Sathus is for you.',
  },
  {
    icon: Globe,
    title: 'Flexible & Distributed',
    description:
      'Remote-first engineering with hybrid anchor in Bengaluru. We judge engineers on the quality of their work, not presence in an office.',
  },
  {
    icon: Heart,
    title: 'Engineering Culture First',
    description:
      'No sales quotas. No churn targets. Our culture is built around technical excellence, honesty, and long-term partnerships — with clients and with our team.',
  },
];

const benefits = [
  { icon: Gift, title: 'Competitive Compensation', detail: 'Market-leading base salaries with performance-linked bonuses aligned to client outcomes.' },
  { icon: Coffee, title: 'Comprehensive Healthcare', detail: 'Full family health coverage including dental and vision, with top-tier hospital network access.' },
  { icon: BookOpen, title: 'Learning Stipend', detail: '₹1,00,000 annual learning budget for conferences, certifications (AWS, Databricks, Kubernetes), and courses.' },
  { icon: Clock, title: 'Flexible Time Off', detail: 'Uncapped leave policy with a minimum of 21 days encouraged. No guilt culture around time off.' },
  { icon: Globe, title: 'Remote-First Infrastructure', detail: 'Full equipment allowance, co-working access, and reliable async communication tooling.' },
  { icon: Zap, title: 'High-Impact Projects', detail: 'Direct access to production AI agent systems, lakehouse pipelines, and real-time event meshes from day one.' },
];

const hiringSteps = [
  { step: '01', title: 'Application Review', description: 'We review every application personally. If your profile matches, you hear back within 5 business days.' },
  { step: '02', title: 'Technical Conversation', description: 'A 60-minute engineering discussion with a principal from your domain — system design, tradeoffs, and engineering philosophy.' },
  { step: '03', title: 'Technical Assessment', description: 'A focused take-home exercise (4–6 hours) relevant to your role. We value clarity of thinking over algorithmic gymnastics.' },
  { step: '04', title: 'Engineering Deep Dive', description: 'A 90-minute session with senior engineers covering architecture, past systems you have built, and production war stories.' },
  { step: '05', title: 'Leadership Conversation', description: 'A 30-minute conversation with our CTO or Founder to discuss culture, growth, and mutual fit.' },
  { step: '06', title: 'Offer & Onboarding', description: 'We move fast on offers. Structured 30-day onboarding with a mentor, clear goals, and a real project from week one.' },
];

const techStack = [
  { category: 'AI & Agents', stack: ['Python 3.13+', 'FastAPI', 'Model Context Protocol', 'Pydantic v2', 'Qdrant', 'Milvus', 'LangGraph'] },
  { category: 'Data Platform', stack: ['Apache Spark', 'Databricks', 'Apache Iceberg', 'dbt Core', 'Apache Kafka', 'Debezium', 'Snowflake'] },
  { category: 'Cloud & Infrastructure', stack: ['AWS (EKS, S3, Lambda)', 'Azure (AKS, ADLS, Event Hub)', 'Terraform', 'ArgoCD', 'Kubernetes', 'Istio'] },
  { category: 'Frontend & Product', stack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Zod', 'TanStack Query'] },
  { category: 'Backend Systems', stack: ['.NET 9', 'SQLAlchemy 2.0 Async', 'PostgreSQL', 'Redis', 'Alembic', 'gRPC', 'OpenAPI 3.0'] },
];

const openRoles = [
  {
    title: 'Principal AI Engineer',
    department: 'AI & Agents',
    location: 'Bengaluru / Hybrid',
    type: 'Full-time',
    experience: '8+ years',
    description:
      'Architect agentic orchestration platforms, evaluation harnesses, RAG pipelines, and Model Context Protocol gateways for financial services and healthcare clients.',
    skills: ['Python', 'FastAPI', 'LangGraph', 'MCP', 'Vector DBs', 'Evaluation Harnesses'],
  },
  {
    title: 'Lead Data Platform Architect',
    department: 'Data Engineering',
    location: 'Bengaluru / Remote',
    type: 'Full-time',
    experience: '10+ years',
    description:
      'Design and build governed lakehouses on Databricks and Apache Iceberg. Lead streaming Kafka pipeline engineering and Unity Catalog governance implementations.',
    skills: ['PySpark', 'Databricks', 'Apache Iceberg', 'Kafka', 'dbt', 'Snowflake'],
  },
  {
    title: 'Senior .NET Enterprise Engineer',
    department: 'Software Engineering',
    location: 'Bengaluru / Hybrid',
    type: 'Full-time',
    experience: '6+ years',
    description:
      'Design high-throughput backend microservices and APIs in .NET 9 Clean Architecture for core banking platforms and healthcare identity systems.',
    skills: ['.NET 9', 'C#', 'EF Core', 'Microservices', 'FHIR R4', 'Clean Architecture'],
  },
  {
    title: 'Cloud Platform Engineer (AWS/Azure)',
    department: 'Cloud Infrastructure',
    location: 'Remote',
    type: 'Full-time',
    experience: '5+ years',
    description:
      'Build and operate enterprise landing zones, EKS/AKS Kubernetes clusters, and automated Terraform IaC pipelines with full GitOps governance.',
    skills: ['Terraform', 'Kubernetes', 'ArgoCD', 'AWS', 'Azure', 'Prometheus/Grafana'],
  },
];

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-20">
      {/* Header */}
      <div>
        <Breadcrumb items={[{ label: 'Company', href: '/company' }, { label: 'Careers' }]} />
        <SectionIntro
          eyebrow="Careers at Sathus"
          title="Build Engineering Systems That Actually Matter"
          description="We hire senior engineers, data architects, and AI researchers who want to own production systems — not maintain inherited technical debt. If you want to ship code that runs in critical enterprise environments, we should talk."
        />
      </div>

      {/* Culture Pillars */}
      <div>
        <h2 className="text-2xl font-bold mb-8">Engineering Culture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {culturePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="rounded-xl border border-border bg-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{pillar.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div>
        <h2 className="text-2xl font-bold mb-8">Benefits & Perks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="rounded-xl border border-border bg-card p-5 flex gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{b.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{b.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Our Technology Stack</h2>
        <p className="text-sm text-muted-foreground mb-8">
          We work at the frontier of enterprise AI, data engineering, and cloud infrastructure. This is the stack you will master.
        </p>
        <div className="space-y-4">
          {techStack.map((t) => (
            <div key={t.category} className="rounded-xl border border-border bg-card p-5 flex flex-col md:flex-row gap-4 items-start">
              <p className="text-xs font-bold text-primary uppercase tracking-wider min-w-[180px] shrink-0">{t.category}</p>
              <div className="flex flex-wrap gap-2">
                {t.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hiring Process */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Our Hiring Process</h2>
        <p className="text-sm text-muted-foreground mb-8">
          Transparent, respectful of your time, and designed to assess genuine engineering depth — not whiteboard tricks.
        </p>
        <div className="space-y-3">
          {hiringSteps.map((s) => (
            <div key={s.step} className="rounded-xl border border-border bg-card p-5 flex gap-5 items-start">
              <span className="text-xl font-black text-primary/30 font-mono shrink-0 w-8">{s.step}</span>
              <div>
                <h3 className="text-sm font-bold text-foreground mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Open Roles */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Open Engineering Positions</h2>
        <p className="text-sm text-muted-foreground mb-8">All roles are permanent, full-time positions. We do not hire contractors or temporary resources.</p>
        <div className="space-y-5">
          {openRoles.map((role) => (
            <div
              key={role.title}
              className="rounded-xl border border-border bg-card p-6 flex flex-col md:flex-row gap-6 justify-between"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                    {role.department}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {role.location}
                  </span>
                  <span className="text-xs text-muted-foreground">• {role.experience}</span>
                  <span className="text-xs text-muted-foreground">• {role.type}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{role.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 max-w-2xl">{role.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {role.skills.map((s) => (
                    <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Apply Now
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General Applications */}
      <div className="rounded-2xl border border-border bg-muted/40 p-8 sm:p-12 text-center max-w-4xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Don&apos;t See Your Role?</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-4">
          We hire on a rolling basis for exceptional engineers. If you have deep expertise in AI systems, data platforms, or cloud infrastructure, send us your work directly.
        </p>
        <ul className="flex flex-col sm:flex-row justify-center gap-4 text-xs text-muted-foreground mb-8">
          <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No recruiters or staffing agencies</li>
          <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> All applications reviewed by engineers</li>
          <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Response within 5 business days</li>
        </ul>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow"
        >
          Send Us Your Work
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
