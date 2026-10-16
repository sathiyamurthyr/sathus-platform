import { Reveal } from '@/components/sections/reveal';
import { SectionIntro } from '@/components/sections/section-intro';

interface Industry {
  name: string;
  description: string;
  tags: string[];
}

const INDUSTRIES: Industry[] = [
  {
    name: 'FinTech',
    description:
      'Real-time risk, resilient payments rails, and fraud detection built on event-driven platforms.',
    tags: ['Payments', 'Risk', 'Fraud'],
  },
  {
    name: 'Financial Services',
    description:
      'Regulatory reporting, trustworthy data lineage, and secure multi-tenant platforms.',
    tags: ['Reporting', 'Lineage', 'Audit'],
  },
  {
    name: 'Life Sciences',
    description:
      'GxP-aligned data pipelines and compliant machine learning that accelerate R&D.',
    tags: ['GxP', 'R&D', 'ML'],
  },
  {
    name: 'Healthcare',
    description:
      'Interoperable records, consent management, and AI assist under privacy-by-design.',
    tags: ['Interop', 'Consent', 'AI assist'],
  },
  {
    name: 'Retail',
    description:
      'Unified commerce data, demand forecasting, and personalization engines at scale.',
    tags: ['Commerce', 'Forecast', 'Personalization'],
  },
  {
    name: 'Manufacturing',
    description:
      'IIoT ingestion, digital twins, and predictive quality delivered on the industrial edge.',
    tags: ['IIoT', 'Twins', 'Quality'],
  },
];

export function Industries() {
  return (
    <section
      id="industries"
      className="scroll-mt-24 border-t border-[#EDE1E6] bg-[#FAF8F9] py-20 sm:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionIntro
              eyebrow="Industries"
              title="Built for the jurisdictions and standards that matter"
              description="We engineer inside the constraints of regulated industries — auditability, data residency, and explainability are design inputs, not retrofits."
            />
          </div>

          <ul className="flex flex-col">
            {INDUSTRIES.map((industry, i) => (
              <Reveal
                as="li"
                key={industry.name}
                delay={(i % 2) * 0.05}
                className="group border-t border-[#EDE1E6] py-7 first:border-t-0 last:border-b last:border-[#EDE1E6]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-8">
                  <span className="font-display text-lg text-[#635861]/60 sm:w-10">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold tracking-tight text-[#292329] transition-colors group-hover:text-[#A20A3A]">
                      {industry.name}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#635861]">
                      {industry.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {industry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#EDE1E6] bg-white px-3 py-1 text-xs font-medium text-[#635861] shadow-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
