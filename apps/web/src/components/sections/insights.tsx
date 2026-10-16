import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/sections/reveal';
import { SectionIntro } from '@/components/sections/section-intro';

interface Article {
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  href: string;
}

const FEATURED: Article = {
  category: 'AI Engineering',
  title: 'Evaluation harnesses are the unit tests of enterprise AI',
  excerpt:
    'Agents fail quietly. We treat evaluation as a first-class delivery artifact — versioned suites, regression gates, and human review that travel with every model we ship to production.',
  readTime: '9 min read',
  date: 'May 2026',
  href: '#insights',
};

const LIST: Article[] = [
  {
    category: 'Data',
    title: 'Streaming lineage: making Kafka pipelines auditable',
    excerpt: 'Change data capture with provenance end-to-end.',
    readTime: '7 min read',
    date: 'Apr 2026',
    href: '#insights',
  },
  {
    category: 'Architecture',
    title: 'A reference architecture for zero-trust SaaS',
    excerpt: 'Identity, segmentation, and audit by default.',
    readTime: '11 min read',
    date: 'Apr 2026',
    href: '#insights',
  },
  {
    category: 'Data',
    title: 'From lakehouse to decision: governed analytics that ship',
    excerpt: 'Closing the gap between raw events and decisions.',
    readTime: '8 min read',
    date: 'Mar 2026',
    href: '#insights',
  },
  {
    category: 'Engineering',
    title: 'Migrating .NET estates to Azure without downtime',
    excerpt: 'A phased, reversible path off legacy infrastructure.',
    readTime: '10 min read',
    date: 'Feb 2026',
    href: '#insights',
  },
];

export function Insights() {
  return (
    <section id="insights" className="scroll-mt-24 border-t border-[#EDE1E6] bg-white py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="Insights"
            title="Field notes from the engineering floor"
            description="Practices, patterns, and postmortems from building AI and data platforms for regulated enterprises."
          />
          <Link
            href="#insights"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-[#292329] transition-colors hover:text-[#A20A3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A20A3A] focus-visible:ring-offset-2 rounded"
          >
            All articles
            <ArrowUpRight className="h-4 w-4 text-[#FF9933] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {/* Featured */}
          <Reveal className="lg:col-span-7">
            <Link
              href={FEATURED.href}
              className="group flex h-full flex-col justify-between rounded-3xl border border-[#EDE1E6] bg-[#FAF8F9] p-8 shadow-xs transition-all duration-300 hover:border-[#A20A3A]/40 hover:bg-white hover:shadow-md sm:p-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A20A3A] focus-visible:ring-offset-2"
            >
              <div>
                <span className="inline-flex items-center rounded-full border border-[#EDE1E6] bg-[#F9EEF2] px-3 py-1 text-xs font-semibold text-[#A20A3A]">
                  {FEATURED.category}
                </span>
                <h3 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight text-balance text-[#292329] transition-colors group-hover:text-[#A20A3A] sm:text-4xl">
                  {FEATURED.title}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-pretty text-[#635861]">
                  {FEATURED.excerpt}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 text-sm text-[#635861]">
                <span>{FEATURED.date}</span>
                <span className="h-1 w-1 rounded-full bg-[#635861]/50" />
                <span>{FEATURED.readTime}</span>
              </div>
            </Link>
          </Reveal>

          {/* List */}
          <ul className="flex flex-col divide-y divide-[#EDE1E6] lg:col-span-5">
            {LIST.map((article, i) => (
              <Reveal as="li" key={article.title} delay={i * 0.05}>
                <Link
                  href={article.href}
                  className="group flex flex-col gap-2 py-6 first:pt-0 last:pb-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A20A3A] focus-visible:ring-offset-2 rounded"
                >
                  <div className="flex items-center gap-3 text-xs text-[#635861]">
                    <span className="font-semibold text-[#A20A3A]">{article.category}</span>
                    <span className="h-1 w-1 rounded-full bg-[#635861]/50" />
                    <span>{article.date}</span>
                    <span className="h-1 w-1 rounded-full bg-[#635861]/50" />
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-balance text-[#292329] transition-colors group-hover:text-[#A20A3A]">
                    {article.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-pretty text-[#635861]">
                    {article.excerpt}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
