import Link from 'next/link';
import { ArrowRight, Lock, Eye, FileCheck2, Network, Scale } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/sections/reveal';
import { SectionIntro } from '@/components/sections/section-intro';
import { cn } from '@/lib/utils';

interface TrustItem {
  icon: LucideIcon;
  title: string;
  text: string;
  featured?: boolean;
}

const ITEMS: TrustItem[] = [
  {
    icon: Lock,
    title: 'Security',
    text: 'Zero-trust architecture, encryption in transit and at rest, and continuous monitoring with full audit trails on every action.',
    featured: true,
  },
  {
    icon: Eye,
    title: 'Privacy',
    text: 'Data minimization, residency controls, and consent you can audit — privacy is an architecture decision, not a policy.',
  },
  {
    icon: FileCheck2,
    title: 'Compliance',
    text: 'SOC 2 Type II and ISO 27001-aligned controls, with GDPR and HIPAA-ready patterns for regulated programs.',
  },
  {
    icon: Network,
    title: 'Architecture',
    text: 'Defense-in-depth reference architectures, reviewed jointly with your risk and security teams before build.',
  },
  {
    icon: Scale,
    title: 'Responsible AI',
    text: 'Model cards, evaluation suites, and human oversight by design — so AI decisions are explainable and contestable.',
  },
];

export function TrustCenter() {
  return (
    <section
      id="trust-center"
      className="scroll-mt-24 border-t border-border bg-muted/30 py-20 sm:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="Trust Center"
            title="Engineered for the audit, not just the demo"
            description="Procurement and partnership start with trust. We make our posture legible, reviewable, and verifiable."
          />
          <Link
            href="/trust"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          >
            Visit the Trust Center
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal
                key={item.title}
                delay={(i % 3) * 0.05}
                className={cn(
                  'group flex flex-col rounded-2xl border border-border bg-background p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-xl justify-between',
                  item.featured && 'sm:col-span-2 lg:col-span-2'
                )}
              >
                <div>
                  {/* CardHeader */}
                  <div className="flex items-center gap-4 m-0 p-0">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground m-0 p-0 leading-normal">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
