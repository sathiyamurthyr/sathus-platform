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
  GA: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  Beta: 'border-[#FFD9B3] bg-[#FFF4E8] text-[#C25E00]',
  Research: 'border-[#EDE1E6] bg-white text-[#635861]',
};

const PRODUCTS: Product[] = [
  {
    icon: BrainCircuit,
    name: 'Sathus AI',
    description:
      'Managed platform for building, evaluating, and deploying enterprise agents — with guardrails, evaluation harnesses, and production observability built in.',
    status: 'GA',
    href: '/products/sathus-ai',
    featured: true,
  },
  {
    icon: FileStack,
    name: 'Memomes Cloud',
    description:
      'Unified document intelligence and memory platform that turns enterprise knowledge into grounded, citation-ready context.',
    status: 'GA',
    href: '/products/memomes-cloud',
  },
  {
    icon: Share2,
    name: 'SocialHub MCP',
    description:
      'Model Context Protocol gateway that connects AI agents to your social and business graph through governed, auditable tools.',
    status: 'Beta',
    href: '/products/socialhub-mcp',
  },
  {
    icon: Fingerprint,
    name: 'OneHealthID',
    description:
      'Role-first healthcare operating platform that simplifies hospital and clinical operations for administrators, doctors, nurses, staff, and patients.',
    status: 'GA',
    href: '/products/onehealthid',
  },
  {
    icon: FlaskConical,
    name: 'Future Products',
    description:
      'Agentic data governance, industry copilots, and embedded analytics — in active research with design partners.',
    status: 'Research',
    href: '/products',
  },
];

function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
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
    <section id="products" className="scroll-mt-24 bg-white py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Products"
          title="A platform and a portfolio, shipping today"
          description="Production systems our clients run on, plus research that defines what comes next."
        />

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product, i) => {
            const Icon = product.icon;
            return (
              <Reveal
                key={product.name}
                delay={(i % 3) * 0.06}
                className={cn(
                  'group relative flex flex-col rounded-2xl border border-[#EDE1E6] bg-[#FAF8F9] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#A20A3A]/40 hover:bg-white hover:shadow-md justify-between',
                  product.featured && 'md:col-span-2 lg:col-span-3 border-[#A20A3A]/30 bg-gradient-to-br from-[#FAF8F9] via-[#FAF8F9] to-[#F9EEF2]/40'
                )}
              >
                <div>
                  {/* CardHeader: Icon + Title + StatusPill */}
                  <div className="flex items-center gap-4 m-0 p-0">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9EEF2] border border-[#EDE1E6] text-[#A20A3A] transition-colors group-hover:bg-[#A20A3A] group-hover:text-white shrink-0">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold tracking-tight text-balance text-[#292329] m-0 p-0 leading-normal">
                        {product.name}
                      </h3>
                      <StatusPill status={product.status} />
                    </div>
                  </div>

                  {/* Description */}
                  <p className={cn("mt-4 text-sm leading-relaxed text-pretty text-[#635861]", product.featured && "max-w-3xl")}>
                    {product.description}
                  </p>
                </div>

                {/* Explore Link */}
                <Link
                  href={product.href}
                  className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#292329] transition-colors hover:text-[#A20A3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A20A3A] focus-visible:ring-offset-2 rounded after:absolute after:inset-0 after:rounded-2xl"
                  aria-label={`Explore ${product.name}`}
                >
                  Explore
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#FF9933]" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
