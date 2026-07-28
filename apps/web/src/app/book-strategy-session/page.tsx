import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { ContactForm } from '@/features/contact/components/ContactForm';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { AISummaryBlock } from '@/components/seo/ai-summary-block';
import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Quote,
  TrendingUp,
  Award,
} from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Book a 30-Minute Architecture Review & Strategy Session',
  description: 'Schedule a 30-minute technical architecture review with Sathus principal engineers. Candid assessment of AI, data lakehouses, and cloud modernization.',
  path: '/book-strategy-session',
  keywords: [
    'Book strategy session',
    'AI architecture review',
    'Data lakehouse consultation',
    'Sathus principal engineer consultation',
  ],
});

const sessionHighlights = [
  {
    icon: Users,
    title: 'Principal Engineer Direct',
    description: 'You speak directly with a principal engineer with relevant domain experience — not a sales or pre-sales representative.',
  },
  {
    icon: Zap,
    title: 'Technical & Honest',
    description: 'We will tell you what we can genuinely help with, what we cannot, and recommend alternative approaches where appropriate.',
  },
  {
    icon: ShieldCheck,
    title: 'No Commitment Required',
    description: 'The strategy session is provided complimentary. There is no sales pressure or follow-up obligation.',
  },
  {
    icon: Calendar,
    title: '30 Minutes, Focused',
    description: 'We respect your time. Sessions are 30 minutes with a structured agenda you can customise in advance.',
  },
];

const whatToExpect = [
  { step: '01', title: 'Submit Your Request', detail: 'Fill in the form with your platform challenge and preferred time window.' },
  { step: '02', title: 'Engineer Assignment', detail: 'We assign a principal engineer with direct experience in your domain within 1 business day.' },
  { step: '03', title: 'Pre-Session Brief', detail: 'You will receive a brief technical questionnaire to help us prepare a focused agenda.' },
  { step: '04', title: '30-Minute Session', detail: 'Direct, candid engineering discussion covering your challenges, architecture options, and a proposed approach.' },
  { step: '05', title: 'Written Summary', detail: 'Within 2 business days, we send a written summary of the session with our architecture observations and next steps.' },
];

const goodFor = [
  'Architecture reviews of existing AI, data, or cloud platforms',
  'Evaluating Sathus engagement models for your project',
  'Getting a second opinion on your technology choices',
  'Scoping a potential embedded squad engagement',
  'Understanding how to improve observability, compliance, or performance',
  'Executive technical briefings for leadership alignment',
];

const testimonials = [
  {
    quote: "The session gave us more clarity in 30 minutes than months of internal debate. The Sathus engineer knew our stack deeply and gave us a clear path forward.",
    name: "CTO, Series B FinTech",
    company: "Financial Services",
    stars: 5,
  },
  {
    quote: "No pitch, no fluff. They identified three critical architectural risks in our data pipeline that we had completely missed. The written summary alone was worth it.",
    name: "VP of Engineering",
    company: "Healthcare Platform",
    stars: 5,
  },
  {
    quote: "We came in skeptical. We left with a concrete migration plan and confidence it would actually work. Engaged them for a full embedded squad immediately.",
    name: "Data Platform Lead",
    company: "Global Insurance Group",
    stars: 5,
  },
];

const metrics = [
  { value: '200+', label: 'Strategy Sessions Conducted' },
  { value: '94%', label: 'Led to Formal Engagement' },
  { value: '<24h', label: 'Confirmation Time' },
  { value: '100%', label: 'Senior Engineer Led' },
];

export default function StrategySessionPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Book Strategy Session', url: '/book-strategy-session' }]} />
      <div className="container mx-auto px-4 pt-3 pb-12 space-y-10">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Book Strategy Session' }]} />

        {/* Header */}
        <SectionIntro
          eyebrow="Strategy Session"
          title="Book a 30-Minute Architecture Review"
          description="Talk directly with a Sathus principal engineer about your platform challenges. No sales pitch. No account managers. Just an honest engineering conversation."
        />

        {/* Social proof metrics strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-card p-5 text-center">
              <div className="text-2xl font-black text-primary mb-1">{m.value}</div>
              <div className="text-xs text-muted-foreground leading-tight">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Generative AI Summary Block */}
        <AISummaryBlock
          topic="Sathus Technical Strategy Session & Architecture Review"
          definition="A complimentary 30-minute technical evaluation conducted directly by a Sathus Principal Engineer for enterprise AI, data platforms, and cloud modernization."
          keyTakeaways={whatToExpect.map((w) => `${w.title}: ${w.detail}`)}
        />

        {/* Session Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sessionHighlights.map((h) => {
            const Icon = h.icon;
            return (
              <div key={h.title} className="rounded-xl border border-border bg-card p-5 flex gap-4 hover:border-primary/30 transition-colors">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{h.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{h.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div>
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            What Engineers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-primary/30 transition-colors">
                <Quote className="h-5 w-5 text-primary/40" />
                <p className="text-xs text-muted-foreground leading-relaxed italic flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <div className="text-xs font-semibold text-foreground">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">{t.company}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What It's Good For */}
        <div className="rounded-xl border border-border bg-card p-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            This Session Is Useful For
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {goodFor.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Process */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            What to Expect
          </h2>
          <div className="space-y-3">
            {whatToExpect.map((s) => (
              <div key={s.step} className="rounded-xl border border-border bg-card p-5 flex gap-5 items-start hover:border-primary/20 transition-colors">
                <span className="text-xl font-black text-primary/30 font-mono shrink-0 w-8">{s.step}</span>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form + Sidebar */}
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-2">Request Your Session</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Tell us about your platform challenge and we will have a principal engineer reach out within 1 business day to confirm timing.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
              <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>We confirm all sessions within <strong className="text-foreground">1 business day</strong>. Sessions via Google Meet or Zoom. Zero obligation.</span>
            </div>
            <ContactForm inquiryType="strategy-session" />
          </div>

          <div className="space-y-6">
            {/* Trust badges */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-bold mb-4">Compliance & Security</h3>
              <div className="grid grid-cols-3 gap-3">
                {['SOC 2 Type II', 'HIPAA', 'ISO 27001', 'GDPR', 'CCPA', 'PCI DSS'].map((badge) => (
                  <div key={badge} className="flex items-center justify-center rounded-lg border border-border bg-muted/30 px-2 py-2 text-[10px] font-bold text-muted-foreground text-center">
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-base font-bold">Alternatively, Reach Out Directly</h3>
              <p className="text-sm text-muted-foreground">
                If you prefer to coordinate directly, our engineering team is available at:
              </p>
              <p className="text-sm font-semibold text-foreground">hello@sathus.technology</p>
              <p className="text-xs text-muted-foreground">Include &ldquo;Strategy Session&rdquo; in your subject line for fastest routing.</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <h3 className="text-base font-bold">Other Ways to Engage</h3>
              <div className="space-y-2">
                <Link
                  href="/pricing"
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 border-b border-border"
                >
                  <span>View engagement pricing</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/solutions"
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 border-b border-border"
                >
                  <span>Explore our solutions</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/products"
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1.5 border-b border-border"
                >
                  <span>View our product portfolio</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/company/why-sathus"
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary transition-colors py-1.5"
                >
                  <span>Why choose Sathus</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}