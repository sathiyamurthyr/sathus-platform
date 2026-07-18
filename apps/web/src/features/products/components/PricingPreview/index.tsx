import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { PricingPreview } from '../../types';

interface PricingPreviewProps {
  pricing: PricingPreview;
}

export function PricingPreview({ pricing }: PricingPreviewProps) {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12">Pricing</h2>
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {pricing.plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg border p-6 ${
                plan.popular ? 'border-primary' : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="text-xs font-semibold text-primary mb-2">Most Popular</div>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="text-3xl font-bold my-4">{plan.price}</div>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm">
                    • {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                Get Started
              </Button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="link" asChild>
            <Link href={pricing.cta.href}>{pricing.cta.text}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}