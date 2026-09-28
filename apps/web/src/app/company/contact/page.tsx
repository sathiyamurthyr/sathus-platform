import { Metadata } from 'next';
import ContactPage from '../../contact/page';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Company Contact',
  description: 'Reach out to Sathus Technology engineering, sales, and executive teams.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Company Contact',
    description: 'Reach out to Sathus Technology engineering, sales, and executive teams.',
    url: `${siteConfig.url}/contact`,
  },
};

export default function CompanyContactPage() {
  return <ContactPage />;
}
