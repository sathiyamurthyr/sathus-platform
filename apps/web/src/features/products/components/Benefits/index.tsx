import type { Benefit } from '../../types';

interface BenefitsProps {
  benefits: Benefit[];
}

export function Benefits({ benefits }: BenefitsProps) {
  return (
    <div className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">Benefits</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="text-center">
              {benefit.metric && (
                <div className="text-4xl font-bold text-primary mb-2">{benefit.metric}</div>
              )}
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}