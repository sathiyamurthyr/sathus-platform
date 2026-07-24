import type { ComplianceFramework } from '../../types';

interface ComplianceGridProps {
  frameworks: ComplianceFramework[];
}

const STATUS_STYLES: Record<string, string> = {
  achieved: 'bg-green-100 text-green-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  planned: 'bg-amber-100 text-amber-800',
};

export function ComplianceGrid({ frameworks }: ComplianceGridProps) {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Compliance</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {frameworks.map((framework) => (
            <div key={framework.id} className="rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{framework.name}</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded ${STATUS_STYLES[framework.status]}`}>
                  {framework.status === 'achieved' ? 'Achieved' : framework.status === 'in-progress' ? 'In Progress' : 'Planned'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{framework.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}