import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
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
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sathus Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sathus Platform',
    description: 'Enterprise-grade web platform for technology companies.',
    creator: '@sathusplatform',
    images: ['/og-image.png'],
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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
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
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <MotionProvider reducedMotion="user">
          <ThemeProvider defaultTheme="system" storageKey="sathus-theme">
            <TooltipProvider>
              <ToastProvider>
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
