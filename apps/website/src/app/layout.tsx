import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { TooltipProvider } from '@/providers/tooltip-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { MotionProvider } from '@/providers/motion-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-display',
});

const SITE_URL = 'https://sathus.technology';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sathus Technology — Engineering the Future of AI, Data & Enterprise Software',
    template: '%s | Sathus Technology',
  },
  description:
    'Sathus Technology helps enterprises design, build and modernize AI-powered products, intelligent data platforms and cloud-native applications for regulated industries.',
  keywords: [
    'enterprise AI',
    'data engineering',
    'product engineering',
    'cloud modernization',
    'AI agents',
    'lakehouse',
    'regulated industries',
    'Sathus Technology',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Sathus Technology',
    title: 'Sathus Technology — Engineering the Future of AI, Data & Enterprise Software',
    description:
      'Enterprise AI, data platforms, and cloud-native software engineered for regulated industries.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Sathus Technology',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sathus Technology — Engineering the Future of AI, Data & Enterprise Software',
    description:
      'Enterprise AI, data platforms, and cloud-native software engineered for regulated industries.',
    creator: '@sathustech',
    images: ['/opengraph-image'],
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
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#070810' },
  ],
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sathus Technology',
  url: SITE_URL,
  description:
    'Sathus Technology engineers enterprise AI, data platforms, and cloud-native software for regulated industries.',
  sameAs: [
    'https://www.linkedin.com/company/sathustechnology',
    'https://twitter.com/sathustech',
    'https://github.com/sathustechnology',
  ],
  areaServed: 'Worldwide',
  knowsAbout: [
    'Enterprise Artificial Intelligence',
    'Data Engineering',
    'Cloud Modernization',
    'Product Engineering',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Sathus Technology',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased font-inter flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <MotionProvider reducedMotion="user">
          <ThemeProvider defaultTheme="system" storageKey="sathus-theme">
            <TooltipProvider>
              <ToastProvider>
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
                >
                  Skip to content
                </a>
                <AnnouncementBar />
                <Header />
                <main id="main-content" className="flex-1" tabIndex={-1}>
                  {children}
                </main>
                <Footer />
              </ToastProvider>
            </TooltipProvider>
          </ThemeProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
