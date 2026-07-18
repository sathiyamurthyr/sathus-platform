import type { ResponsibleAIPrinciple } from '../../types';

interface ResponsibleAIProps {
  principles: ResponsibleAIPrinciple[];
}

export function ResponsibleAI({ principles }: ResponsibleAIProps) {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Responsible AI</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle) => (
            <div key={principle.id} className="rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-2">{principle.title}</h3>
              <p className="text-sm text-muted-foreground">{principle.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}