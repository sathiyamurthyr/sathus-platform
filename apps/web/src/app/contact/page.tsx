import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { ContactForm } from '@/features/contact/components/ContactForm';
import { ContactPageJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/constants';
import Link from 'next/link';
import {
  Briefcase,
  Handshake,
  TrendingUp,
  HeartPulse,
  LifeBuoy,
  Building2,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

import { companyConfig } from '@/config/company';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    `Get in touch with ${companyConfig.name} — sales, partnerships, investor relations, careers, and enterprise support inquiries.`,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: `Contact Us — ${companyConfig.name}`,
    description:
      'Connect with our team to discuss your enterprise AI, data, and cloud modernization needs.',
    url: `${companyConfig.website}/contact`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Contact Us — ${companyConfig.name}`,
    description: 'Connect with our team to discuss your enterprise software needs.',
  },
};

const contactRoutes = [
  {
    icon: Building2,
    title: 'Enterprise Sales',
    description: 'Discuss a custom engagement, embedded squad deployment, or enterprise platform evaluation.',
    cta: 'Talk to Sales',
    href: '#contact-form',
    badge: 'Most Common',
    badgeColor: 'bg-primary/10 text-primary',
  },
  {
    icon: Briefcase,
    title: 'Book a Strategy Session',
    description: 'Schedule a 30-minute technical architecture review with our principal engineers.',
    cta: 'Book Now',
    href: '/book-strategy-session',
    badge: 'Recommended',
    badgeColor: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    icon: Handshake,
    title: 'Technology Partnerships',
    description: 'Explore alliance partnerships, OEM integrations, or co-delivery arrangements.',
    cta: 'Partner Inquiry',
    href: '/company/partners',
    badge: 'Partnerships',
    badgeColor: 'bg-amber-500/10 text-amber-600',
  },
  {
    icon: TrendingUp,
    title: 'Investor Relations',
    description: 'Request investor materials, corporate overview deck, or schedule an executive briefing.',
    cta: 'IR Contact',
    href: '/company/investors',
    badge: 'Investors',
    badgeColor: 'bg-blue-500/10 text-blue-600',
  },
  {
    icon: HeartPulse,
    title: 'Careers',
    description: 'Apply for engineering roles or send a general application to our hiring team.',
    cta: 'View Open Roles',
    href: '/company/careers',
    badge: 'Hiring',
    badgeColor: 'bg-rose-500/10 text-rose-600',
  },
  {
    icon: LifeBuoy,
    title: 'Enterprise Support',
    description: 'For existing clients requiring technical support, SLA escalations, or incident response.',
    cta: 'Open Support Ticket',
    href: '#contact-form',
    badge: 'Support',
    badgeColor: 'bg-muted text-muted-foreground',
  },
];

const commitments = [
  { icon: Clock, text: 'Enterprise sales inquiries: response within 4 business hours.' },
  { icon: ShieldCheck, text: 'All communications handled with strict confidentiality.' },
  { icon: CheckCircle2, text: 'Technical questions answered directly by principal engineers — no sales proxies.' },
];

export default function ContactPage() {
  return (
    <>
      <ContactPageJsonLd />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Contact' }]} />
      </div>

      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Header */}
        <SectionIntro
          eyebrow="Contact"
          title="Let's Start a Technical Conversation"
          description="We believe the best client relationships start with an honest, engineering-first conversation. Tell us what you're building — or trying to fix — and we'll tell you how we can help."
        />

        {/* Contact Routes */}
        <div>
          <h2 className="text-xl font-bold mb-6">How Can We Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {contactRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <div
                  key={route.title}
                  className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between hover:border-primary/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider ${route.badgeColor}`}>
                        {route.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-2">{route.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{route.description}</p>
                  </div>
                  <Link
                    href={route.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
                  >
                    {route.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Our Commitments */}
        <div className="rounded-xl border border-border bg-muted/40 p-6">
          <h2 className="text-base font-bold text-foreground mb-4">Our Response Commitments</h2>
          <ul className="space-y-3">
            {commitments.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Form */}
        <div id="contact-form" className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-2">Send a Direct Message</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Use this form for any inquiry. Select your inquiry type below and our team will route it to the right person.
            </p>
            <ContactForm />
          </div>

          <div className="space-y-8">
            {/* Contact Info */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-base font-bold">Direct Contact</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Official Support & General Inquiries</p>
                  <a href={`mailto:${companyConfig.email}`} className="font-medium text-primary hover:underline">
                    {companyConfig.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Direct Phone</p>
                  <a href={`tel:${companyConfig.phoneRaw}`} className="font-medium text-primary hover:underline">
                    {companyConfig.phone}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Official Website</p>
                  <a href={companyConfig.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                    {companyConfig.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Office Location */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-base font-bold">Corporate Headquarters</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">{companyConfig.name}</p>
                <p>{companyConfig.address.formatted}</p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <h3 className="text-base font-bold">Business Hours</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span className="font-semibold text-foreground">9:00 AM – 7:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold text-foreground">10:00 AM – 2:00 PM IST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold text-foreground">Closed</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Enterprise SLA clients have 24/7 incident response access.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}