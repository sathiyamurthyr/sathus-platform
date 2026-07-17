import { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Cloud Modernization',
  description: 'Re-platform to cloud-native architectures on Azure and AWS with zero-downtime migration paths.',
  alternates: {
    canonical: '/solutions/cloud-modernization',
  },
  openGraph: {
    title: 'Cloud Modernization — Sathus Technology',
    description: 'Cloud-native re-platforming with zero-downtime migration on Azure and AWS.',
    url: `${SITE_URL}/solutions/cloud-modernization`,
  },
};

export default function CloudModernizationPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Cloud Modernization</h1>
      <p className="mt-4 text-muted-foreground">
        Re-platform to cloud-native architectures on Azure and AWS with zero-downtime migration paths.
      </p>
      <Link href="/solutions" className="mt-8 inline-block text-primary hover:underline">
        ← Back to Solutions
      </Link>
    </div>
  );
}