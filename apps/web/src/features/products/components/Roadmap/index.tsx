import type { RoadmapItem } from '../../types';

interface RoadmapProps {
  roadmap: RoadmapItem[];
}

const STATUS_LABELS: Record<string, string> = {
  planned: 'Planned',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export function Roadmap({ roadmap }: RoadmapProps) {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Roadmap</h2>
        <div className="max-w-3xl mx-auto">
          {roadmap.map((item) => (
            <div key={item.id} className="flex gap-4 pb-8 border-l border-border last:pb-0">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {item.quarter}
                </div>
                <div className="flex-1 w-px bg-border" />
              </div>
              <div className="flex-1 pb-8">
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <span className="text-xs font-medium text-primary">
                  {STATUS_LABELS[item.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}