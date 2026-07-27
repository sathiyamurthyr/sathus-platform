import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/providers/theme-provider';
import { TooltipProvider } from '@/providers/tooltip-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { MotionProvider } from '@/providers/motion-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { siteConfig } from '@/constants';
import { companyConfig } from '@/config/company';
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

const SITE_URL = siteConfig.url;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sathus Technology — AI Engineering, Enterprise Data & Cloud Modernization',
    template: '%s | Sathus Technology',
  },
  description:
    'Sathus Technology (sathus.in) is an enterprise engineering company specializing in production AI agents, data lakehouses, and cloud-native software for regulated industries.',
  keywords: [
    'Sathus',
    'Sathus Technology',
    'sathus.in',
    'Sathus Platform',
    'enterprise AI engineering',
    'data platform engineering',
    'cloud modernization',
    'AI agents & swarms',
    'lakehouse architecture',
    'FastAPI MLOps',
    'Model Context Protocol',
    'Chennai software company',
    'India AI engineering',
  ],
  authors: [{ name: 'Sathus Technology', url: SITE_URL }],
  creator: 'Sathus Technology Pvt. Ltd.',
  publisher: 'Sathus Technology Pvt. Ltd.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Sathus Technology',
    title: 'Sathus Technology — AI Engineering, Enterprise Data & Cloud Modernization',
    description:
      'Sathus Technology (sathus.in) engineers enterprise AI, data platforms, and cloud-native applications for regulated industries.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Sathus Technology Enterprise Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sathus Technology — AI Engineering, Enterprise Data & Cloud Modernization',
    description:
      'Enterprise AI, data platforms, and cloud-native software engineered for regulated industries.',
    creator: '@sathustech',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-sathus-tech',
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
    },
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
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

const orgJsonLd = companyConfig.getOrganizationSchema();
const localBusinessJsonLd = companyConfig.getLocalBusinessSchema();

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://sathus.in/#website',
  name: 'Sathus Technology',
  alternateName: ['Sathus', 'Sathus.in', 'Sathus Platform'],
  url: SITE_URL,
  publisher: {
    '@id': 'https://sathus.in/#organization',
  },
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${instrumentSerif.variable}`}>
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
        {clarityId && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        )}
      </head>
      <body className="min-h-screen bg-background font-sans antialiased font-inter flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
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
