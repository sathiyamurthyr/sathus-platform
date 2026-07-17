'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { SectionIntro } from '@/components/sections/section-intro';

interface Tech {
  name: string;
  blurb: string;
}

interface Category {
  title: string;
  techs: Tech[];
}

const CATEGORIES: Category[] = [
  {
    title: 'Languages & Frameworks',
    techs: [
      { name: 'Python', blurb: 'Our core for ML, data engineering, and API services — typed, tested, and production-hardened.' },
      { name: '.NET', blurb: 'Enterprise line-of-business applications and integrations with Azure-native tooling.' },
    ],
  },
  {
    title: 'Data & AI',
    techs: [
      { name: 'Databricks', blurb: 'Lakehouse foundations for governance, feature stores, and large-scale ML training.' },
      { name: 'Apache Spark', blurb: 'Distributed processing for petabyte-scale batch and structured streaming.' },
      { name: 'Apache Kafka', blurb: 'Event backbone for real-time pipelines, change data capture, and agent tooling.' },
      { name: 'Snowflake', blurb: 'Elastic warehousing and semantic layers that power governed analytics.' },
    ],
  },
  {
    title: 'Cloud & Infra',
    techs: [
      { name: 'Microsoft Azure', blurb: 'Primary cloud for identity, data, and compliant enterprise deployments.' },
      { name: 'AWS', blurb: 'Secondary cloud and multi-cloud strategies with infrastructure as code.' },
      { name: 'Kubernetes', blurb: 'Portable orchestration for workloads that must run anywhere, including the edge.' },
    ],
  },
  {
    title: 'Experience',
    techs: [
      { name: 'React', blurb: 'Component systems and design tokens shared across every product surface.' },
      { name: 'Next.js', blurb: 'Our default for fast, server-rendered, SEO-strong enterprise web platforms.' },
    ],
  },
];

const OVERVIEW = {
  name: 'A deliberate stack',
  blurb:
    'We standardize on a small set of best-in-class platforms so delivery is repeatable and secure. Select a technology to see how we use it.',
};

export function Technology() {
  const [active, setActive] = React.useState<{ name: string; blurb: string }>(OVERVIEW);

  return (
    <section id="technology" className="scroll-mt-24 border-t border-border py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Technology"
          title="The stack we are accountable for"
          description="We are not framework-agnostic for its own sake. We go deep on a curated set of platforms and operate them in production."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-8 sm:grid-cols-2">
            {CATEGORIES.map((category) => (
              <div key={category.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {category.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {category.techs.map((tech) => {
                    const isActive = active.name === tech.name;
                    return (
                      <button
                        key={tech.name}
                        type="button"
                        onMouseEnter={() => setActive(tech)}
                        onFocus={() => setActive(tech)}
                        onClick={() => setActive(tech)}
                        className={cn(
                          'rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                          isActive
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background text-foreground hover:border-primary/40 hover:text-primary'
                        )}
                        aria-pressed={isActive}
                      >
                        {tech.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <motion.aside
            key={active.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="h-fit rounded-2xl border border-border bg-muted/40 p-8 lg:sticky lg:top-28"
            aria-live="polite"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {active.name === OVERVIEW.name ? 'Overview' : 'How we use it'}
            </p>
            <h3 className="mt-3 font-display text-3xl text-foreground">{active.name}</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {active.blurb}
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
