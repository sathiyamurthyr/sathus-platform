import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy and session token usage disclosures for Sathus Technology web applications.',
  alternates: {
    canonical: '/legal/cookies',
  },
  openGraph: {
    title: 'Cookie Policy — Sathus Technology',
    description: 'Cookie Policy and session token usage disclosures.',
    url: `${siteConfig.url}/legal/cookies`,
  },
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <Breadcrumb items={[{ label: 'Legal', href: '/legal' }, { label: 'Cookie Policy' }]} />
      <SectionIntro
        eyebrow="Legal Policy"
        title="Cookie Policy"
        description="Effective Date: July 2026. Disclosures regarding session cookies, essential tokens, and local storage usage."
      />

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-xs text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">1. Essential Cookies</h2>
          <p>
            We use strictly essential HTTP cookies and local storage tokens for authentication state maintenance, CSRF protection, and user theme preferences (`sathus-theme`).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">2. Third-Party Analytics</h2>
          <p>
            Our web platform does not deploy intrusive third-party cross-site tracking cookies. Aggregated performance analytics are anonymized and self-hosted.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-foreground">3. Managing Preferences</h2>
          <p>
            You can configure your web browser to block or alert you about cookies, but certain interactive features of the web platform may be disabled as a result.
          </p>
        </section>
      </div>
    </div>
  );
}
