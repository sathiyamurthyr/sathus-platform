'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';

import { ThemeSwitcher } from './theme-switcher';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-muted/20 px-4 py-8">
      <div className="absolute right-4 top-4">
        <ThemeSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-border/80 shadow-xs p-1.5 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/sathus-logo.png"
              alt="Sathus Technology"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {children}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sathus Technology Pvt Ltd. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}

export { AuthLayout, type AuthLayoutProps };
