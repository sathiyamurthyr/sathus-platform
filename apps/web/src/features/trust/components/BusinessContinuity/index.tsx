import type { BusinessContinuityPlan } from '../../types';

interface BusinessContinuityProps {
  plans: BusinessContinuityPlan[];
}

export function BusinessContinuity({ plans }: BusinessContinuityProps) {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Business Continuity</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-2">{plan.title}</h3>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}