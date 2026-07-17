import { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Enterprise Applications',
  description: 'Domain-driven applications that fit the way your organization actually works.',
  alternates: {
    canonical: '/solutions/enterprise-applications',
  },
  openGraph: {
    title: 'Enterprise Applications — Sathus Technology',
    description: 'Custom or composable domain-driven applications for enterprise workflows.',
    url: `${SITE_URL}/solutions/enterprise-applications`,
  },
};

export default function EnterpriseApplicationsPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Enterprise Applications</h1>
      <p className="mt-4 text-muted-foreground">
        Domain-driven applications — custom or composable — that fit the way your organization actually works.
      </p>
      <Link href="/solutions" className="mt-8 inline-block text-primary hover:underline">
        ← Back to Solutions
      </Link>
    </div>
  );
}