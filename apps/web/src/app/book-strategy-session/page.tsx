import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { ContactForm } from '@/features/contact/components/ContactForm';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Book a Strategy Session',
  description:
    'Schedule a 30-minute architecture review with our principal engineers. Discuss your AI, data, or cloud modernization challenges and get a candid, engineering-first assessment.',
  alternates: { canonical: '/book-strategy-session' },
  openGraph: {
    title: 'Book a Strategy Session — Sathus Technology',
    description:
      'Schedule a 30-minute architecture review with our principal engineers.',
    url: `${siteConfig.url}/book-strategy-session`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Strategy Session — Sathus Technology',
    description: 'Schedule a strategy session with our principal engineering team.',
  },
};

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

export default function StrategySessionPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Book Strategy Session' }]} />

      {/* Header */}
      <SectionIntro
        eyebrow="Strategy Session"
        title="Book a 30-Minute Architecture Review"
        description="Talk directly with a Sathus principal engineer about your platform challenges. No sales pitch. No account managers. Just an honest engineering conversation."
      />

      {/* Session Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sessionHighlights.map((h) => {
          const Icon = h.icon;
          return (
            <div key={h.title} className="rounded-xl border border-border bg-card p-5 flex gap-4">
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

      {/* What It's Good For */}
      <div className="rounded-xl border border-border bg-card p-8">
        <h2 className="text-xl font-bold mb-4">This Session Is Useful For</h2>
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
        <h2 className="text-xl font-bold mb-6">What to Expect</h2>
        <div className="space-y-3">
          {whatToExpect.map((s) => (
            <div key={s.step} className="rounded-xl border border-border bg-card p-5 flex gap-5 items-start">
              <span className="text-xl font-black text-primary/30 font-mono shrink-0 w-8">{s.step}</span>
              <div>
                <h3 className="text-sm font-bold text-foreground mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-2">Request Your Session</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Tell us about your platform challenge and we will have a principal engineer reach out within 1 business day to confirm timing.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Clock className="h-3.5 w-3.5 text-primary" />
            We confirm all sessions within 1 business day. Sessions conducted via Google Meet or Zoom.
          </div>
          <ContactForm inquiryType="strategy-session" />
        </div>

        <div className="space-y-6">
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
  );
}