import Link from 'next/link';
import { ArrowUpRight, BrainCircuit, FileStack, Share2, Fingerprint, FlaskConical } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/sections/reveal';
import { SectionIntro } from '@/components/sections/section-intro';
import { cn } from '@/lib/utils';

type Status = 'GA' | 'Beta' | 'Research';

interface Product {
  icon: LucideIcon;
  name: string;
  description: string;
  status: Status;
  href: string;
  featured?: boolean;
}

const STATUS_STYLES: Record<Status, string> = {
  GA: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Beta: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Research: 'border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400',
};

const PRODUCTS: Product[] = [
  {
    icon: BrainCircuit,
    name: 'Sathus AI',
    description:
      'Managed platform for building, evaluating, and deploying enterprise agents — with guardrails, evaluation harnesses, and production observability built in.',
    status: 'GA',
    href: '#platform',
    featured: true,
  },
  {
    icon: FileStack,
    name: 'Memomes Cloud',
    description:
      'Unified document intelligence and memory platform that turns enterprise knowledge into grounded, citation-ready context.',
    status: 'GA',
    href: '#products',
  },
  {
    icon: Share2,
    name: 'SocialHub MCP',
    description:
      'Model Context Protocol gateway that connects AI agents to your social and business graph through governed, auditable tools.',
    status: 'Beta',
    href: '#products',
  },
  {
    icon: Fingerprint,
    name: 'OneHealthID',
    description:
      'Privacy-first identity and consent layer for healthcare ecosystems, designed for interoperability and patient control.',
    status: 'GA',
    href: '#products',
  },
  {
    icon: FlaskConical,
    name: 'Future Products',
    description:
      'Agentic data governance, industry copilots, and embedded analytics — in active research with design partners.',
    status: 'Research',
    href: '#products',
  },
];

function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status === 'GA' ? 'Generally Available' : status}
    </span>
  );
}

export function Products() {
  return (
    <section id="products" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Products"
          title="A platform and a portfolio, shipping today"
          description="Production systems our clients run on, plus research that defines what comes next."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => {
            const Icon = product.icon;
            return (
              <Reveal
                key={product.name}
                delay={(i % 3) * 0.06}
                className={cn(
                  'group relative flex flex-col rounded-2xl border border-border bg-background p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl',
                  product.featured && 'lg:col-span-3 lg:flex-row lg:items-center lg:gap-10'
                )}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15',
                    product.featured && 'lg:h-16 lg:w-16'
                  )}
                >
                  <Icon className={cn('h-6 w-6', product.featured && 'lg:h-8 lg:w-8')} />
                </div>

                <div className={cn('mt-5 flex-1', product.featured && 'lg:mt-0')}>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {product.name}
                    </h3>
                    <StatusPill status={product.status} />
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                </div>

                <Link
                  href={product.href}
                  className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                >
                  Explore
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
