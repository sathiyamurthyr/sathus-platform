'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Send, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/common/Logo';
import { footerSections, socialLinks, siteConfig } from '@/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { companyConfig } from '@/config/company';

export function Footer({ className }: { className?: string }) {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className={cn('border-t border-border bg-background', className)}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          {/* Brand & Contact Info */}
          <div className="flex flex-col">
            <Logo size="lg" showWordmark={true} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Engineering the future of AI, data & enterprise software for regulated industries.
            </p>

            {/* Official Company Address & Contact Details */}
            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground">{companyConfig.name}</p>
              <p>{companyConfig.address.formatted}</p>
              <p className="pt-1">
                Email:{' '}
                <a href={`mailto:${companyConfig.email}`} className="font-medium text-primary hover:underline">
                  {companyConfig.email}
                </a>{' '}
                • Phone:{' '}
                <a href={`tel:${companyConfig.phoneRaw}`} className="font-medium text-primary hover:underline">
                  {companyConfig.phone}
                </a>
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="mt-6 max-w-sm space-y-2">
              <label htmlFor="footer-email" className="text-xs font-semibold text-foreground">
                Subscribe to Engineering Briefings
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id="footer-email"
                  type="email"
                  placeholder="enter.name@enterprise.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-9 text-xs bg-muted/40 border-border"
                />
                <Button type="submit" size="sm" className="h-9 px-3 shrink-0 gap-1 text-xs">
                  {subscribed ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      Subscribed
                    </>
                  ) : (
                    <>
                      Subscribe
                      <Send className="h-3 w-3" />
                    </>
                  )}
                </Button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-500 font-medium">
                  ✓ Thank you for subscribing to Sathus Engineering Briefings.
                </p>
              )}
            </form>

            <Link
              href="/book-strategy-session"
              className="group mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              Book a strategy session
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={link.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{link.name}</span>
                  {link.name === 'LinkedIn' && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  )}
                  {link.name === 'Instagram' && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4" aria-label="Footer">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-foreground">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus-visible:underline"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {companyConfig.name}. All rights reserved.
          </p>
          <p className="max-w-md text-xs leading-relaxed">
            Built for regulated industries. SOC 2 Type II · ISO 27001-aligned ·
            GDPR & HIPAA-ready.
          </p>
        </div>
      </div>
    </footer>
  );
}