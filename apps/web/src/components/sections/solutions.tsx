import { Bot, Database, Boxes, CloudCog, Rocket, Repeat } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionIntro } from '@/components/sections/section-intro';
import { EnterpriseCard } from '@/components/common/EnterpriseCard';

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

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
          {SOLUTIONS.map((solution, i) => (
            <EnterpriseCard
              key={solution.title}
              icon={solution.icon}
              number={String(i + 1).padStart(2, '0')}
              title={solution.title}
              problem={solution.problem}
              outcome={solution.outcome}
              href={solution.href}
              delay={(i % 3) * 0.06}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
