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
    stat: 'Security-by-Design',
  },
];

const TIMELINE = [
  { year: '2024', text: 'Incorporated as Sathus Technology Pvt. Ltd. (August 28, 2024) to engineer enterprise AI and data platforms.' },
  { year: '2025', text: 'Deployed core open-table data lakehouse architectures, MCP gateway systems, and healthcare platforms.' },
  { year: '2026', text: 'Operating production enterprise AI agent swarms and distributed systems across regulated industries.' },
];

export function WhySathus() {
  return (
    <section id="why" className="scroll-mt-24 border-t border-[#EDE1E6] bg-white py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Why Sathus"
          title="A delivery practice, not a project shop"
          description="The same operating model underpins every engagement — a disciplined process, accountable pillars, and a track record you can verify."
        />

        {/* Engineering process */}
        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {PROCESS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal as="li" key={step.title} delay={i * 0.05} className="relative">
                <div className="flex h-full flex-col rounded-2xl border border-[#EDE1E6] bg-[#FAF8F9] p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#A20A3A]/40 hover:bg-white hover:shadow-md">
                  <div className="flex items-center justify-between relative m-0 p-0">
                    <div className="flex items-center gap-3 pr-10 m-0 p-0">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F9EEF2] border border-[#EDE1E6] text-[#A20A3A] shrink-0">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-semibold tracking-tight text-balance text-[#292329] m-0 p-0">
                        {step.title}
                      </h3>
                    </div>
                    <span className="absolute top-0 right-0 font-display text-xl text-[#635861]/40 select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-pretty text-[#635861]">
                    {step.text}
                  </p>
                </div>
                {i < PROCESS.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-[#635861]/40 lg:block" />
                )}
              </Reveal>
            );
          })}
        </ol>

        {/* Pillars */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <Reveal
                key={pillar.title}
                delay={i * 0.06}
                className="rounded-2xl border border-[#EDE1E6] bg-[#FAF8F9] p-8 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#A20A3A]/40 hover:bg-white hover:shadow-md"
              >
                <div className="flex items-center gap-3 m-0 p-0">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F9EEF2] border border-[#EDE1E6] text-[#A20A3A] shrink-0">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight text-[#292329] m-0 p-0">
                    {pillar.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#635861]">
                  {pillar.text}
                </p>
                <p className="mt-5 inline-flex items-center gap-2 border-t border-[#EDE1E6] pt-4 text-sm font-medium text-[#292329]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A20A3A]" />
                  {pillar.stat}
                </p>
              </Reveal>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="mt-12">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#635861]">
            How we got here
          </h3>
          <ol className="mt-8 grid gap-8 border-l border-[#EDE1E6] pl-6 sm:grid-cols-2 lg:grid-cols-3 lg:border-l-0 lg:pl-0">
            {TIMELINE.map((item, i) => (
              <Reveal as="li" key={item.year} delay={i * 0.05} className="relative">
                <span className="absolute -left-[1.65rem] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#A20A3A] ring-1 ring-[#A20A3A]/30 lg:static lg:-ml-1.5 lg:mb-4" />
                <p className="font-display text-2xl font-semibold text-[#292329]">{item.year}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#635861]">
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
