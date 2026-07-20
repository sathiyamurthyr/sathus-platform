import { Metadata } from 'next';
import { SectionIntro } from '@/components/sections/section-intro';
import { ContactForm } from '@/features/contact/components/ContactForm';
import { OfficeLocations } from '@/features/contact/components/OfficeLocations';
import { BusinessHours } from '@/features/contact/components/BusinessHours';
import { ContactMethods } from '@/features/contact/components/ContactMethods';
import { Faq } from '@/features/contact/components/Faq';
import { Cta } from '@/features/contact/components/Cta';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { ContactPageJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/constants';

const SITE_URL = siteConfig.url;

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Sathus Technology engineering, sales, and executive teams. We are here to help with your enterprise AI, data, and cloud modernization needs.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us — Sathus Technology',
    description: 'Connect with our team to discuss your enterprise software needs.',
    url: `${SITE_URL}/contact`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us — Sathus Technology',
    description: 'Connect with our team to discuss your enterprise software needs.',
  },
};

export default function ContactPage() {
  return (
    <>
      <ContactPageJsonLd />
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={[{ label: 'Contact' }]} />
      </div>

      <div className="container mx-auto px-4 py-12">
        <SectionIntro
          eyebrow="Contact"
          title="Get in Touch"
          description="We are here to help with your enterprise AI, data, and cloud modernization needs."
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            <ContactForm />
          </div>

          <div className="space-y-8">
            <ContactMethods />
            <BusinessHours />
            <OfficeLocations />
          </div>
        </div>

        <div className="mt-20">
          <Faq />
        </div>

        <div className="mt-20">
          <Cta />
        </div>
      </div>
    </>
  );
}