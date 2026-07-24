import type { Technology } from '../../types';

interface TechnologyProps {
  technology: Technology[];
}

export function Technology({ technology }: TechnologyProps) {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Technology Stack</h2>
        <div className="flex flex-wrap gap-3">
          {technology.map((tech) => (
            <span
              key={tech.id}
              className="rounded-md bg-muted px-3 py-1.5 text-sm font-medium"
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}