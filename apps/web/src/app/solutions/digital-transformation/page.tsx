import { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Digital Transformation',
  description: 'Outcome-based roadmaps and durable platform thinking that drives operating-model change.',
  alternates: {
    canonical: '/solutions/digital-transformation',
  },
  openGraph: {
    title: 'Digital Transformation — Sathus Technology',
    description: 'Enterprise transformation through outcome-based roadmaps and platform thinking.',
    url: `${SITE_URL}/solutions/digital-transformation`,
  },
};

export default function DigitalTransformationPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Digital Transformation</h1>
      <p className="mt-4 text-muted-foreground">
        Outcome-based roadmaps and durable platform thinking that drives operating-model change.
      </p>
      <Link href="/solutions" className="mt-8 inline-block text-primary hover:underline">
        ← Back to Solutions
      </Link>
    </div>
  );
}