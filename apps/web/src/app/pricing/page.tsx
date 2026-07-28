import { generatePageMetadata } from '@/lib/seo/metadata-builder';
import { PricingHero } from '@/features/pricing/components/PricingHero';
import { PricingTiers } from '@/features/pricing/components/PricingTiers';
import { CheckCircle2 } from 'lucide-react';

export async function generateMetadata() {
  return generatePageMetadata({
    title: 'Pricing | Sathus Technology',
    description: 'Transparent engineering pricing for AI, data, and cloud platform engagements. No retainers, no surprises.',
    path: '/pricing',
  });
}

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 pt-3 pb-12 space-y-8">
      <PricingHero />
      <PricingTiers />

      <div className="mt-24 mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Compare Engagements</h2>
        
        <div className="overflow-x-auto rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border/50 bg-muted/20">
                <th className="p-6 text-sm font-semibold text-muted-foreground w-1/4">Feature</th>
                <th className="p-6 text-sm font-semibold w-1/4">Platform Audit</th>
                <th className="p-6 text-sm font-semibold w-1/4">Embedded Squad</th>
                <th className="p-6 text-sm font-semibold w-1/4">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="p-6 text-sm font-medium">Dedicated engineers</td>
                <td className="p-6 text-sm text-muted-foreground">1 PE</td>
                <td className="p-6 text-sm text-muted-foreground">3 engineers</td>
                <td className="p-6 text-sm text-muted-foreground">Custom</td>
              </tr>
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="p-6 text-sm font-medium">Duration</td>
                <td className="p-6 text-sm text-muted-foreground">2 weeks</td>
                <td className="p-6 text-sm text-muted-foreground">Monthly</td>
                <td className="p-6 text-sm text-muted-foreground">Quarterly+</td>
              </tr>
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="p-6 text-sm font-medium">SLA guarantees</td>
                <td className="p-6 text-sm text-muted-foreground">Report SLA</td>
                <td className="p-6 text-sm text-muted-foreground">Contractual uptime</td>
                <td className="p-6 text-sm text-muted-foreground">Custom</td>
              </tr>
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="p-6 text-sm font-medium">Compliance</td>
                <td className="p-6"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></td>
                <td className="p-6"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></td>
                <td className="p-6"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></td>
              </tr>
              <tr className="hover:bg-muted/10 transition-colors">
                <td className="p-6 text-sm font-medium">Source code ownership</td>
                <td className="p-6"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></td>
                <td className="p-6"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></td>
                <td className="p-6"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
