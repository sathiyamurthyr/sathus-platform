import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/theme-provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sathusplatform.com'),
  title: {
    default: 'Sathus Platform',
    template: '%s | Sathus Platform',
  },
  description: 'Enterprise-grade web platform for technology companies.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sathusplatform.com',
    title: 'Sathus Platform',
    description: 'Enterprise-grade web platform for technology companies.',
    siteName: 'Sathus Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sathus Platform',
    description: 'Enterprise-grade web platform for technology companies.',
    creator: '@sathusplatform',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider defaultTheme="system" storageKey="sathus-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
