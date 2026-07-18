'use client';

import { motion } from 'motion/react';
import { Logo } from '@/components/common/Logo';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Logo size="lg" showWordmark={true} />
      </motion.div>
    </div>
  );
}