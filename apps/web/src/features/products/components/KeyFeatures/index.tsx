import type { Feature } from '../../types';

interface KeyFeaturesProps {
  features: Feature[];
}

export function KeyFeatures({ features }: KeyFeaturesProps) {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Key Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.id} className="rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}