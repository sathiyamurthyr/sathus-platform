'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  title: string;
  company: string;
  industry: string;
  metrics: string;
  rating: number;
  verifiedBadge: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    quote:
      'Sathus embedded engineering squad migrated 12M+ core banking accounts to Delta Lake without a single second of outage during business hours. Their technical rigor is unparalleled.',
    author: 'Vikram Malhotra',
    title: 'CTO & Head of Platform',
    company: 'FinCore Global Banking',
    industry: 'Financial Services',
    metrics: '70% Cost Reduction • 0 Downtime Cutover',
    rating: 5,
    verifiedBadge: 'Verified Enterprise Client',
  },
  {
    id: '2',
    quote:
      'The zero-hallucination agent swarm Sathus architected for our clinical diagnostics workflow reduced document review latency from 45 minutes to under 12 seconds with sub-0.01% error rate.',
    author: 'Dr. Rachel Weiss',
    title: 'VP of Digital Health',
    company: 'Apex Health Systems',
    industry: 'Healthcare & Life Sciences',
    metrics: '225x Faster Review • HIPAA Compliant',
    rating: 5,
    verifiedBadge: 'Verified Enterprise Client',
  },
  {
    id: '3',
    quote:
      'Replacing our legacy data warehouse with a streaming lakehouse delivered sub-second queries for our 50,000 events/sec fraud detection model. Incredible engineering velocity.',
    author: 'Marcus Thorne',
    title: 'Director of Data Engineering',
    company: 'PayPulse Technologies',
    industry: 'FinTech & Payments',
    metrics: '50k events/sec • <14ms P99 Latency',
    rating: 5,
    verifiedBadge: 'Verified Enterprise Client',
  },
];

export function TestimonialShowcase() {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-b from-card/40 to-background border-y border-border/60">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Enterprise Proof
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
            What Engineering Leaders Say
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Real feedback from CTOs and VP Engineers who partner with Sathus Technology.
          </p>
        </div>

        {/* Carousel Card */}
        <div className="relative rounded-3xl border border-primary/20 bg-card p-8 md:p-12 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-primary pointer-events-none">
            <Quote className="h-32 w-32" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 relative z-10"
            >
              {/* Rating & Badge */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" />
                  {current.verifiedBadge}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="text-lg md:text-xl text-foreground font-medium leading-relaxed italic">
                "{current.quote}"
              </blockquote>

              {/* Metrics pill */}
              <div className="inline-block rounded-xl bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-bold text-primary">
                Impact: {current.metrics}
              </div>

              {/* Author Info & Controls */}
              <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">{current.author}</div>
                    <div className="text-xs text-muted-foreground">
                      {current.title} · <span className="text-foreground font-semibold">{current.company}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="h-9 w-9 rounded-xl border-border hover:bg-muted"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-semibold text-muted-foreground px-2">
                    {currentIndex + 1} / {TESTIMONIALS.length}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="h-9 w-9 rounded-xl border-border hover:bg-muted"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/book-strategy-session"
            className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline underline-offset-4"
          >
            Explore How Sathus Can Deliver Similar Results For Your Team →
          </Link>
        </div>
      </div>
    </section>
  );
}
