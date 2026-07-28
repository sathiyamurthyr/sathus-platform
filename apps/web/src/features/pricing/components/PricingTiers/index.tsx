'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck, ActivitySquare, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Tier = {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  duration: string;
  description: string;
  badge: string | null;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted: boolean;
};

const tiers: Tier[] = [
  {
    name: 'Platform Audit',
    monthlyPrice: '$4,800',
    annualPrice: '$3,840',
    duration: '2-week engagement',
    description: 'Deep-dive technical audit of your AI, data, or cloud platform. Delivered by a Principal Engineer.',
    badge: null,
    features: [
      'Dedicated Principal Engineer',
      'Architecture gap analysis',
      'Security & compliance review',
      'Performance benchmarking',
      'Written findings report',
      '30-day Q&A follow-up',
    ],
    cta: 'Start with Audit',
    ctaHref: '/book-strategy-session',
    highlighted: false,
  },
  {
    name: 'Embedded Squad',
    monthlyPrice: '$18,500',
    annualPrice: '$14,800',
    duration: 'per month',
    description: 'A 3-person embedded squad (Principal Engineer + 2 senior engineers) integrated with your team.',
    badge: 'Most Popular',
    features: [
      '3 dedicated senior engineers',
      'Daily standups & pair programming',
      'Full sprint participation',
      'On-call architecture support',
      'Contractual SLAs (uptime, latency)',
      'SOC 2 compliant delivery',
      'Monthly performance reports',
      'Direct Slack/Meet access',
    ],
    cta: 'Book Strategy Session',
    ctaHref: '/book-strategy-session',
    highlighted: true,
  },
  {
    name: 'Enterprise Program',
    monthlyPrice: 'Custom',
    annualPrice: 'Custom',
    duration: 'tailored engagement',
    description: 'Full engineering program for large-scale AI, data platform, or cloud transformation. Multi-quarter commitment.',
    badge: null,
    features: [
      'Dedicated engineering program manager',
      'Multi-team coordination',
      'Custom SLA frameworks',
      'Executive reporting cadence',
      'Regulatory compliance advisory',
      'IP ownership & transfer',
      'Joint architecture reviews',
      'Priority support & escalations',
    ],
    cta: 'Talk to Us',
    ctaHref: '/book-strategy-session',
    highlighted: false,
  },
];

export function PricingTiers() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="space-y-16">
      <div className="flex justify-center">
        <div className="relative flex items-center p-1 bg-muted/50 rounded-full border border-border/50">
          <button
            onClick={() => setIsAnnual(false)}
            className={cn(
              "relative w-32 py-2 text-sm font-medium transition-colors z-10",
              !isAnnual ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={cn(
              "relative w-32 py-2 text-sm font-medium transition-colors z-10",
              isAnnual ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Annual
            <span className="absolute -top-3 -right-2 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
              Save 20%
            </span>
          </button>
          <motion.div
            className="absolute top-1 bottom-1 left-1 w-32 bg-background rounded-full shadow-sm border border-border/50"
            animate={{ x: isAnnual ? '100%' : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={cn(
              "relative flex flex-col p-8 rounded-3xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5",
              tier.highlighted
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 hover:scale-[1.02]"
                : "border-border/50 hover:-translate-y-1"
            )}
          >
            {tier.badge && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
                  {tier.badge}
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
              <p className="text-sm text-muted-foreground min-h-[60px]">{tier.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">
                  {isAnnual ? tier.annualPrice : tier.monthlyPrice}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {tier.duration}
              </p>
              {isAnnual && tier.monthlyPrice !== 'Custom' && (
                <p className="text-sm text-emerald-500 font-medium mt-1">
                  Billed annually (20% off)
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              variant={tier.highlighted ? 'default' : 'outline'}
              className={cn("w-full", tier.highlighted && "shadow-md shadow-primary/20")}
            >
              <Link href={tier.ctaHref}>{tier.cta}</Link>
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-20 p-8 rounded-3xl bg-secondary/30 border border-border/50 backdrop-blur-sm">
        <h4 className="text-lg font-semibold mb-3 text-center">Why no monthly retainer?</h4>
        <p className="text-muted-foreground text-center mb-8">
          We believe in value-driven engineering. You only pay for active, scoped engagements. 
          When we finish a project or handover a squad's work, the billing stops. No idle hours, no hidden fees.
        </p>

        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/50">
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ShieldCheck className="w-8 h-8 text-primary/80" />
            <span className="text-xs font-medium uppercase tracking-wider">SOC 2 Type II</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ActivitySquare className="w-8 h-8 text-primary/80" />
            <span className="text-xs font-medium uppercase tracking-wider">HIPAA Compliant</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Server className="w-8 h-8 text-primary/80" />
            <span className="text-xs font-medium uppercase tracking-wider">ISO 27001</span>
          </div>
        </div>
      </div>
    </div>
  );
}
