import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
}

const SIZE_CLASSES = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
  xl: 'h-12',
};

const WORDMARK_SIZE_CLASSES = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-2xl',
};

export function Logo({
  className,
  showWordmark = true,
  wordmarkClassName,
  size = 'md',
  href = '/',
}: LogoProps) {
  return (
    <Link href={href} className={cn('inline-flex items-center gap-2.5', className)} aria-label="Sathus Technology Pvt. Ltd. home">
      <motion.span
        className="inline-flex items-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src="/branding/logo.svg"
          alt="Sathus Technology Pvt. Ltd. Logo"
          width={200}
          height={40}
          className={`${SIZE_CLASSES[size]} w-auto`}
          priority
        />
      </motion.span>
      {showWordmark && (
        <span className={cn('font-display font-semibold text-foreground hidden sm:inline-block', WORDMARK_SIZE_CLASSES[size], wordmarkClassName)}>
          Sathus Technology
        </span>
      )}
    </Link>
  );
}