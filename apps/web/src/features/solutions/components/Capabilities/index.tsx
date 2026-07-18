import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import type { Capability } from '../../types';
import { Bot, Database, GitBranch, TestTube, Activity, Users } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Bot: <Bot className="h-5 w-5" aria-hidden="true" />,
  Database: <Database className="h-5 w-5" aria-hidden="true" />,
  GitBranch: <GitBranch className="h-5 w-5" aria-hidden="true" />,
  TestTube: <TestTube className="h-5 w-5" aria-hidden="true" />,
  Activity: <Activity className="h-5 w-5" aria-hidden="true" />,
  Users: <Users className="h-5 w-5" aria-hidden="true" />,
};

interface CapabilitiesProps {
  capabilities: Capability[];
}

export function Capabilities({ capabilities }: CapabilitiesProps) {
  return (
    <section id="capabilities" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Capabilities"
          title="What We Deliver"
          description="Core capabilities that enable production-grade AI systems with enterprise governance."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability, i) => (
            <Reveal
              key={capability.id}
              delay={(i % 3) * 0.06}
              className="group relative bg-background p-7 transition-colors duration-300 hover:bg-muted/40"
            >
              {capability.icon && (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {ICON_MAP[capability.icon] || <Bot className="h-5 w-5" aria-hidden="true" />}
                </span>
              )}
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
                {capability.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                {capability.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}