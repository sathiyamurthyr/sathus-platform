import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'h-7',
  md: 'h-8',
  lg: 'h-10',
};

export function BrandLogo({
  className,
  showWordmark = true,
  wordmarkClassName,
  size = 'md',
}: BrandLogoProps) {
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2.5', className)} aria-label="Sathus Technology home">
      <motion.span
        className="inline-flex items-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src="/branding/logo.svg"
          alt="Sathus Technology"
          width={200}
          height={40}
          className={`${SIZE_CLASSES[size]} w-auto`}
          priority
        />
      </motion.span>
    </Link>
  );
}
