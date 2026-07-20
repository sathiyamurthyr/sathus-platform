import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service governing the use of Sathus Technology platforms and software services.',
  alternates: {
    canonical: '/legal/terms',
  },
  openGraph: {
    title: 'Terms of Service — Sathus Technology',
    description: 'Terms of Service governing the use of Sathus Technology platforms.',
    url: `${siteConfig.url}/legal/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <Breadcrumb items={[{ label: 'Legal', href: '/legal' }, { label: 'Terms of Service' }]} />
      <SectionIntro
        eyebrow="Legal Agreement"
        title="Terms of Service"
        description="Effective Date: July 2026. Please review these Terms of Service prior to deploying or integrating Sathus Technology software."
      />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-xs text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or subscribing to Sathus Technology services, platforms, or APIs, your enterprise agrees to be bound by these Master Services Terms and any associated Statement of Work (SOW).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. Service Level Agreements (SLAs)</h2>
          <p>
            Enterprise cloud platform deployments guarantee 99.99% monthly uptime, backed by credit remedies specified in your enterprise subscription contract.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. Intellectual Property Rights</h2>
          <p>
            Sathus Technology retains all title and interest in underlying proprietary algorithms, agent orchestrators, and framework code. Clients retain full ownership of custom application logic and proprietary datasets.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">4. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed under the laws of India, without regard to conflict of law principles.
          </p>
        </section>
      </div>
    </div>
  );
}
