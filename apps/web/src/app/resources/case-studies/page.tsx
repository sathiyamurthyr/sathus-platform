import { Metadata } from 'next';
import CaseStudiesPage from '../../case-studies/page';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: 'Resource Case Studies',
  description: 'Explore client success stories, technical architectures, and impact metrics.',
  alternates: {
    canonical: '/resources/case-studies',
  },
  openGraph: {
    title: 'Resource Case Studies — Sathus Technology',
    description: 'Explore client success stories, technical architectures, and impact metrics.',
    url: `${siteConfig.url}/resources/case-studies`,
  },
};

export default function ResourceCaseStudiesPage() {
  return <CaseStudiesPage />;
}
