'use client';

import * as React from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring } from 'motion/react';
import { BrainCircuit, FileStack, Share2, Fingerprint, Sparkles } from 'lucide-react';
import { cn } from '@sathus-platform/utils';

const FLOATING_CARDS = [
  { id: 'ai', label: 'Sathus AI', meta: 'Enterprise agents', Icon: BrainCircuit, x: 18, y: 18 },
  { id: 'data', label: 'Memomes Cloud', meta: 'Document intelligence', Icon: FileStack, x: 78, y: 22 },
  { id: 'health', label: 'OneHealthID', meta: 'Privacy-first identity', Icon: Fingerprint, x: 14, y: 72 },
  { id: 'social', label: 'SocialHub MCP', meta: 'Agent connectivity', Icon: Share2, x: 76, y: 74 },
];

export function HeroVisualization() {
  const reduce = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 100 });

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduce) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x * 6);
      mouseY.set(y * 6);
    },
    [mouseX, mouseY, reduce]
  );

  const handleMouseLeave = React.useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="relative mx-auto aspect-square w-full max-w-[540px]"
      aria-hidden="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: reduce ? 0 : springX,
        y: reduce ? 0 : springY,
      }}
    >
      {/* Network connectors */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        {FLOATING_CARDS.map((card) => (
          <line
            key={card.id}
            x1="50"
            y1="50"
            x2={String(card.x)}
            y2={String(card.y)}
            stroke="url(#heroGradient)"
            strokeWidth="0.35"
            strokeDasharray="2.5 3"
            vectorEffect="non-scaling-stroke"
            className={reduce ? '' : 'animate-dash'}
            opacity="0.5"
          />
        ))}
        {/* Ambient particles */}
        {Array.from({ length: 10 }).map((_, i) => {
          const px = 15 + ((i * 41) % 70);
          const py = 15 + ((i * 67) % 70);
          return (
            <circle
              key={i}
              cx={String(px)}
              cy={String(py)}
              r="0.5"
              fill="url(#heroGradient)"
              opacity="0.3"
              className={reduce ? '' : 'animate-pulse'}
            />
          );
        })}
        <defs>
          <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>

      {/* Central core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {!reduce && (
          <>
            <span className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/25 [animation:pulse-ring_3s_ease-out_infinite]" />
            <span className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/15 [animation:pulse-ring_3s_ease-out_infinite_1.2s]" />
          </>
        )}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-violet-500 to-cyan-400 shadow-2xl ring-1 ring-inset ring-white/20">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
      </div>

      {/* Floating product cards */}
      {FLOATING_CARDS.map((card, i) => {
        const Icon = card.Icon;
        return (
          <motion.div
            key={card.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${card.x}%`, top: `${card.y}%` }}
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className={cn(
                'transition-transform duration-300',
                reduce ? '' : 'animate-float-soft'
              )}
              style={{ animationDelay: `${i * 0.7}s` }}
            >
              <div className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-xl">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/80 to-violet-500/80 text-white ring-1 ring-inset ring-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[0.78rem] font-semibold text-white">{card.label}</span>
                  <span className="text-[0.62rem] text-white/55">{card.meta}</span>
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
