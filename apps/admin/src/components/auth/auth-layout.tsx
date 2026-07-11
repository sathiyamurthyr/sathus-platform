'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { LockKeyhole } from 'lucide-react';

import { ThemeSwitcher } from './theme-switcher';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute right-4 top-4">
        <ThemeSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LockKeyhole className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {children}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sathus Platform. <Link href="/" className="hover:underline underline-offset-4">Return to site</Link>
        </p>
      </motion.div>
    </div>
  );
}

export { AuthLayout, type AuthLayoutProps };
