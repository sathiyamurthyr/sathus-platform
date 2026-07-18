import { SectionIntro } from '@/components/sections/section-intro';
import { Reveal } from '@/components/sections/reveal';
import type { Technology } from '../../types';

interface TechnologyStackProps {
  technologies: Technology[];
}

const CATEGORY_LABELS: Record<string, string> = {
  ai: 'AI & Machine Learning',
  data: 'Data',
  cloud: 'Cloud',
  devops: 'DevOps',
  framework: 'Frameworks',
  database: 'Databases',
  other: 'Other',
};

export function TechnologyStack({ technologies }: TechnologyStackProps) {
  // Group technologies by category
  const grouped = technologies.reduce(
    (acc, tech) => {
      const category = tech.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(tech);
      return acc;
    },
    {} as Record<string, Technology[]>
  );

  return (
    <section id="technology-stack" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Technology"
          title="Technology Stack"
          description="The tools and platforms we use to deliver production-grade AI systems."
        />
        <div className="mt-12 space-y-10">
          {Object.entries(grouped).map(([category, techs], i) => (
            <Reveal key={category} delay={i * 0.05}>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  {CATEGORY_LABELS[category] || category}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <li
                      key={tech.id}
                      className="rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground"
                    >
                      {tech.name}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}