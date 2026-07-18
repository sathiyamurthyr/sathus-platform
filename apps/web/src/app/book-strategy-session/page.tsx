import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { ContactForm } from '@/features/contact/components/ContactForm';

const SITE_URL = 'https://sathus.in';

export const metadata: Metadata = {
  title: 'Book Strategy Session',
  description: 'Schedule a strategy session with our team to discuss your enterprise AI, data, and cloud modernization needs.',
  alternates: {
    canonical: '/book-strategy-session',
  },
  openGraph: {
    title: 'Book Strategy Session — Sathus Technology',
    description: 'Schedule a strategy session with our team.',
    url: `${SITE_URL}/book-strategy-session`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Strategy Session — Sathus Technology',
    description: 'Schedule a strategy session with our team.',
  },
};

export default function StrategySessionPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <SectionIntro
        eyebrow="Strategy Session"
        title="Book a Strategy Session"
        description="Schedule a 30-minute call with our team to discuss your enterprise software needs and how we can help."
      />

      <div className="mt-16 max-w-2xl">
        <ContactForm inquiryType="strategy-session" />
      </div>
    </div>
  );
}