import type { ProductOverview } from '../../types';

interface ProductOverviewProps {
  overview: ProductOverview;
}

export function ProductOverview({ overview }: ProductOverviewProps) {
  return (
    <div className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">The Problem & Solution</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold mb-3">The Problem</h3>
              <p className="text-muted-foreground">{overview.problem}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Our Solution</h3>
              <p className="text-muted-foreground">{overview.solution}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Why We Are Different</h3>
              <p className="text-muted-foreground">{overview.differentiator}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}