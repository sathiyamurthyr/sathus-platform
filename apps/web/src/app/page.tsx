import { Hero } from '@/components/sections/hero';
import { TrustMetricsStrip } from '@/components/sections/trust-metrics-strip';
import { Solutions } from '@/components/sections/solutions';
import { Industries } from '@/components/sections/industries';
import { Products } from '@/components/sections/products';
import { PlatformOverview } from '@/components/sections/platform-overview';
import { WhySathus } from '@/components/sections/why-sathus';
import { Technology } from '@/components/sections/technology';
import { TrustCenter } from '@/components/sections/trust-center';
import { Insights } from '@/components/sections/insights';
import { FinalCta } from '@/components/sections/final-cta';

export default function Page() {
  return (
    <>
      <Hero />
      <TrustMetricsStrip />
      <Solutions />
      <Industries />
      <Products />
      <PlatformOverview />
      <WhySathus />
      <Technology />
      <TrustCenter />
      <Insights />
      <FinalCta />
    </>
  );
}
