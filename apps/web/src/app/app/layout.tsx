import { Metadata } from 'next';
import { WorkspaceLayout } from '@/features/workspace/components/WorkspaceLayout';
import { siteConfig } from '@/constants';

export const metadata: Metadata = {
  title: {
    default: 'Sathus Cloud SaaS Platform',
    template: '%s | Sathus Cloud',
  },
  description: 'Enterprise authenticated application shell for Sathus Cloud.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/app',
  },
  openGraph: {
    title: 'Sathus Cloud SaaS Platform',
    description: 'Enterprise workspace application area.',
    url: `${siteConfig.url}/app`,
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <WorkspaceLayout>{children}</WorkspaceLayout>;
}
