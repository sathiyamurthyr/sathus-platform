import { Reveal } from '@/components/sections/reveal';
import { SectionIntro } from '@/components/sections/section-intro';
import { Compass, DraftingCompass, Hammer, ShieldCheck, FlaskConical, BadgeCheck, ArrowRight } from 'lucide-react';

const PROCESS = [
  { icon: Compass, title: 'Discover', text: 'Outcome framing, domain modeling, and a technical spike.' },
  { icon: DraftingCompass, title: 'Architect', text: 'Reference architecture, data contracts, and security design.' },
  { icon: Hammer, title: 'Build', text: 'Embedded squads shipping in short, reviewable increments.' },
  { icon: ShieldCheck, title: 'Validate', text: 'Evaluations, load, and compliance checks before GA.' },
  { icon: BadgeCheck, title: 'Operate', text: 'Observability, SLOs, and continuous improvement.' },
];

const PILLARS = [
  {
    icon: FlaskConical,
    title: 'Innovation',
    text: 'We invest in research — agentic systems, data governance, and industry copilots — so clients adopt what is proven, not experimental.',
    stat: '12% of effort in R&D',
  },
  {
    icon: BadgeCheck,
    title: 'Quality',
    text: 'Definition-of-done includes tests, observability, and documentation. Every release is reviewable and reversible.',
    stat: '100% peer-reviewed',
  },
  {
    icon: ShieldCheck,
    title: 'Security',
    text: 'Zero-trust by default, encryption in transit and at rest, and an audit trail on every action.',
    stat: 'SOC 2 Type II',
  },
];

const TIMELINE = [
  { year: '2018', text: 'Founded as a product engineering studio for regulated enterprises.' },
  { year: '2020', text: 'First enterprise data platform reaches production with full lineage.' },
  { year: '2022', text: 'Launched the Sathus AI research practice and evaluation harnesses.' },
  { year: '2024', text: 'ISO 27001-aligned security program and responsible-AI controls.' },
  { year: '2026', text: 'Agentic platforms operating across six regulated industries.' },
];

export function WhySathus() {
  return (
    <section id="why" className="scroll-mt-24 border-t border-border bg-muted/30 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Why Sathus"
          title="A delivery practice, not a project shop"
          description="The same operating model underpins every engagement — a disciplined process, accountable pillars, and a track record you can verify."
        />

        {/* Engineering process */}
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal as="li" key={step.title} delay={i * 0.05} className="relative">
                <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-6">
                  <div className="flex items-center justify-between relative m-0 p-0">
                    <div className="flex items-center gap-3 pr-10 m-0 p-0">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 shrink-0">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-semibold tracking-tight text-foreground m-0 p-0">
                        {step.title}
                      </h3>
                    </div>
                    <span className="absolute top-0 right-0 font-display text-xl text-muted-foreground/40 select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
                {i < PROCESS.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground/40 lg:block" />
                )}
              </Reveal>
            );
          })}
        </ol>

        {/* Pillars */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <Reveal
                key={pillar.title}
                delay={i * 0.06}
                className="rounded-2xl border border-border bg-background p-8"
              >
                <div className="flex items-center gap-3 m-0 p-0">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15 shrink-0">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground m-0 p-0">
                    {pillar.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {pillar.text}
                </p>
                <p className="mt-5 inline-flex items-center gap-2 border-t border-border pt-4 text-sm font-medium text-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {pillar.stat}
                </p>
              </Reveal>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="mt-10">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            How we got here
          </h3>
          <ol className="mt-8 grid gap-8 border-l border-border pl-6 sm:grid-cols-2 lg:grid-cols-5 lg:border-l-0 lg:pl-0">
            {TIMELINE.map((item, i) => (
              <Reveal as="li" key={item.year} delay={i * 0.05} className="relative">
                <span className="absolute -left-[1.65rem] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary ring-1 ring-primary/30 lg:static lg:-ml-1.5 lg:mb-4" />
                <p className="font-display text-2xl text-foreground">{item.year}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
