import Link from 'next/link';
import { ArrowUpRight, Bot, Database, Boxes, CloudCog, Rocket, Repeat } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/sections/reveal';
import { SectionIntro } from '@/components/sections/section-intro';

interface Solution {
  icon: LucideIcon;
  title: string;
  problem: string;
  outcome: string;
  href: string;
}

const SOLUTIONS: Solution[] = [
  {
    icon: Bot,
    title: 'AI Engineering',
    problem:
      'Pilot AI projects stall in production — models drift, outputs are not auditable, and teams cannot govern them.',
    outcome:
      'We ship production-grade agentic systems with evaluation harnesses, observability, and human-in-the-loop controls from day one.',
    href: '#products',
  },
  {
    icon: Database,
    title: 'Data Engineering',
    problem:
      'Data lives in fragmented silos with no lineage, no quality guarantees, and no real-time access.',
    outcome:
      'We build governed lakehouses and streaming pipelines that turn raw events into trustworthy, query-ready intelligence.',
    href: '#platform',
  },
  {
    icon: Boxes,
    title: 'Enterprise Applications',
    problem:
      'Off-the-shelf software forces process compromise and creates brittle, hard-to-maintain integrations.',
    outcome:
      'We design domain-driven applications — custom or composable — that fit the way your organization actually works.',
    href: '#products',
  },
  {
    icon: CloudCog,
    title: 'Cloud Modernization',
    problem:
      'Legacy estates are costly, fragile, and difficult to scale securely without business disruption.',
    outcome:
      'We re-platform to cloud-native architectures on Azure and AWS with zero-downtime migration paths.',
    href: '#technology',
  },
  {
    icon: Rocket,
    title: 'Product Engineering',
    problem:
      'Strong ideas die in the gap between prototype and a shipped, supported product.',
    outcome:
      'We run embedded product squads that take concepts from discovery to GA with a real delivery cadence.',
    href: '#why',
  },
  {
    icon: Repeat,
    title: 'Digital Transformation',
    problem:
      'Transformation programs run for years and deliver slide decks rather than measurable outcomes.',
    outcome:
      'We deliver operating-model change through outcome-based roadmaps and durable platform thinking.',
    href: '#why',
  },
];

export function Solutions() {
  return (
    <section id="solutions" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Solutions"
          title="Engineering disciplines, delivered as outcomes"
          description="We do not sell workshops. Each discipline is a delivery practice with accountable outcomes, reference architectures, and a path to production."
        />

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((solution, i) => {
            const Icon = solution.icon;
            return (
              <Reveal
                key={solution.title}
                delay={(i % 3) * 0.06}
                className="group relative bg-background p-7 transition-colors duration-300 hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-2xl text-muted-foreground/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
                  {solution.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground/80">The problem. </span>
                  {solution.problem}
                </p>

                <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-foreground/80">
                  <span className="font-medium text-primary">The outcome. </span>
                  {solution.outcome}
                </p>

                <Link
                  href={solution.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                >
                  Learn more
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
