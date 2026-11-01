'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CinematicConversion() {
  const reduce = useReducedMotion();

  return (
    <section id="contact-advisory" className="relative w-full overflow-hidden bg-[#18050E] py-28 sm:py-36 text-white">
      {/* Background Golden Dawn Radial Shimmer */}
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 50% 100%, #5E182F 0%, #3B0D1D 40%, #18050E 80%)',
        }}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-[#FF9933] shadow-lg backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>PARTNER WITH SATHUS TECHNOLOGY</span>
          </span>

          <h2 className="mt-6 font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            Let&apos;s Build <br className="hidden sm:inline" />
            What&apos;s Next Together
          </h2>

          <p className="mt-6 text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Partner with Sathus Technology to turn your vision into a secure, scalable and intelligent reality.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full bg-[#850B30] hover:bg-[#A20A3A] text-white px-10 text-base font-semibold shadow-[0_4px_30px_rgba(133,11,48,0.7)] border border-[#FF9933]/40 transition-all duration-300 hover:scale-105"
            >
              <Link href="/company/contact">
                Talk to Our Team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-white/60">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#FF9933]" />
              Direct Principal Squads
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#FF9933]" />
              Contractual Delivery SLAs
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#FF9933]" />
              Zero-Trust Architecture
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
