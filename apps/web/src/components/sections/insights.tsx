'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface InsightArticle {
  id: string;
  category: string;
  title: string;
  readTime: string;
  href: string;
  gradient: string;
}

const ARTICLES: InsightArticle[] = [
  {
    id: '1',
    category: 'AI Engineering',
    title: 'Building Enterprise-Grade AI Platforms',
    readTime: '6 min read',
    href: '/resources/blog/eval-harnesses',
    gradient: 'from-[#850B30] to-[#FF9933]',
  },
  {
    id: '2',
    category: 'Data Architecture',
    title: 'Modern Data Engineering at Scale',
    readTime: '8 min read',
    href: '/resources/blog/kafka-lineage',
    gradient: 'from-[#DE6419] to-[#FFB366]',
  },
  {
    id: '3',
    category: 'Cloud Systems',
    title: 'A Practical Guide to Cloud Modernization',
    readTime: '7 min read',
    href: '/resources/blog/zero-trust-reference',
    gradient: 'from-[#850B30] to-[#DE6419]',
  },
  {
    id: '4',
    category: 'Enterprise Applications',
    title: 'Designing Scalable Enterprise Applications',
    readTime: '9 min read',
    href: '/resources/blog/lakehouse-analytics',
    gradient: 'from-[#FF9933] to-[#850B30]',
  },
];

export function Insights() {
  const reduce = useReducedMotion();

  return (
    <section id="insights" className="relative w-full bg-[#FAF8F9] py-24 sm:py-32 border-t border-[#EDE1E6]">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-widest text-[#850B30] font-bold">
            INSIGHTS
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight text-[#292329]">
            Ideas, Engineering & Innovation
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#635861] leading-relaxed">
            Perspectives on AI, data, cloud and enterprise technology written directly by our staff engineering team.
          </p>
        </div>

        {/* 4 Editorial Cards with Radiant Thumbnails */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ARTICLES.map((art, idx) => (
            <motion.div
              key={art.id}
              initial={reduce ? false : { opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#EDE1E6] bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#FF9933] hover:shadow-xl"
            >
              <div>
                {/* Visual Header / Artwork Thumbnail */}
                <div
                  className={`h-36 w-full rounded-2xl bg-gradient-to-tr ${art.gradient} p-4 flex flex-col justify-between shadow-xs transition-transform duration-300 group-hover:scale-102`}
                >
                  <span className="inline-flex self-start rounded-full bg-black/30 px-3 py-1 font-mono text-[10px] font-semibold text-white backdrop-blur-md">
                    {art.category}
                  </span>
                  <div className="self-end h-8 w-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-5">
                  <span className="font-mono text-[11px] text-[#635861]">
                    {art.readTime}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-bold leading-snug text-[#292329] group-hover:text-[#850B30] transition-colors">
                    {art.title}
                  </h3>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EDE1E6]">
                <Link
                  href={art.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#850B30] group-hover:text-[#FF9933] transition-colors"
                >
                  <span>Read More</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
