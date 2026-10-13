import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found — Sathus Technology',
  description: 'The requested page could not be found. Explore Sathus Technology enterprise engineering services and solutions.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: null,
  },
};

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="mt-2 text-muted-foreground">Page not found</p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Return home
      </Link>
    </div>
  );
}
