'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'motion/react';
import {
  Bot,
  Workflow,
  Cloud,
  LineChart,
  LayoutGrid,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

const AICore3D = dynamic(
  () => import('@/components/sections/ai-core-3d').then((mod) => mod.AICore3D),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-violet-500 to-cyan-400 shadow-2xl ring-1 ring-inset ring-white/20">
        <Sparkles className="h-8 w-8 text-white animate-pulse" />
      </div>
    ),
  }
);

// Radial Trigonometric Topology System
// Center = (50%, 50%)
// Single Fixed Radius R = 38.5%
const CENTER = { x: 50, y: 50 };
const RADIUS = 38.5;

interface RawNode {
  id: string;
  label: string;
  meta: string;
  icon: LucideIcon;
  angle: number; // in degrees
}

const RAW_NODES: RawNode[] = [
  { id: 'ai', label: 'AI Agents', meta: 'Reasoning · Tools', icon: Bot, angle: -90 },
  { id: 'cloud', label: 'Cloud', meta: 'Azure · AWS', icon: Cloud, angle: -18 },
  { id: 'apps', label: 'Applications', meta: 'Composable', icon: LayoutGrid, angle: 54 },
  { id: 'analytics', label: 'Analytics', meta: 'Real-time', icon: LineChart, angle: 126 },
  { id: 'data', label: 'Data Pipelines', meta: 'Streaming · Lakehouse', icon: Workflow, angle: 198 },
];

export const NODES = RAW_NODES.map((node) => {
  const rad = (node.angle * Math.PI) / 180;
  const x = Number((CENTER.x + RADIUS * Math.cos(rad)).toFixed(2));
  const y = Number((CENTER.y + RADIUS * Math.sin(rad)).toFixed(2));
  const distance = Number(Math.sqrt(Math.pow(x - CENTER.x, 2) + Math.pow(y - CENTER.y, 2)).toFixed(2));
  return {
    ...node,
    x,
    y,
    distance,
  };
});

export function PlatformVisualization() {
  const reduce = useReducedMotion();

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[540px] platform-stacked select-none"
      aria-hidden="true"
    >
      {/* Radial Topology SVG Canvas (Center at 50, 50) */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full pointer-events-none z-0"
        fill="none"
      >
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Visual Guide Orbit Circle proving all node centers lie on radius R = 38.5 */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          stroke="#3b82f6"
          strokeWidth="0.25"
          strokeDasharray="1 2"
          opacity="0.25"
          vectorEffect="non-scaling-stroke"
        />

        {NODES.map((node, i) => (
          <React.Fragment key={node.id}>
            {/* Connection Line from AI Core center (50, 50) to exact card visual center (node.x, node.y) */}
            <line
              x1="50"
              y1="50"
              x2={node.x}
              y2={node.y}
              stroke="url(#nodeGradient)"
              strokeWidth="0.5"
              strokeDasharray="2 2.4"
              vectorEffect="non-scaling-stroke"
              className={reduce ? '' : 'animate-dash'}
              opacity={0.6}
            />

            {/* Particle Streaming Effect from Core (50, 50) to Card Center (node.x, node.y) */}
            {!reduce && (
              <circle r="0.8" fill="#38bdf8" opacity="0.9">
                <animateMotion
                  path={`M 50 50 L ${node.x} ${node.y}`}
                  dur={`${2.2 + (i % 3) * 0.4}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.3}s`}
                />
              </circle>
            )}

            {!reduce && (
              <circle r="0.6" fill="#c084fc" opacity="0.8">
                <animateMotion
                  path={`M ${node.x} ${node.y} L 50 50`}
                  dur={`${2.6 + (i % 2) * 0.5}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.4 + 0.2}s`}
                />
              </circle>
            )}
          </React.Fragment>
        ))}
      </svg>

      {/* 3D Interactive AI Core - centered at exact (50%, 50%) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
        {!reduce && (
          <>
            <span className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20 [animation:pulse-ring_3.5s_ease-out_infinite]" />
            <span className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/15 [animation:pulse-ring_3.5s_ease-out_infinite_1.5s]" />
          </>
        )}
        <div className="relative flex items-center justify-center rounded-3xl bg-slate-950/40 p-2 backdrop-blur-md border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.25)]">
          <AICore3D className="h-28 w-28 sm:h-32 sm:w-32" />
        </div>
      </div>

      {/* Technology Nodes - Outer wrapper forces translate(-50%, -50%) so card CENTER sits on (node.x, node.y) */}
      {NODES.map((node, i) => {
        const Icon = node.icon;
        return (
          <div
            key={node.id}
            className="absolute z-20 pointer-events-auto"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.8 }}
              animate={reduce ? undefined : { opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
              whileHover={reduce ? undefined : { scale: 1.06 }}
            >
              {/* Arrival Pulse Ring */}
              {!reduce && (
                <span className="absolute inset-0 rounded-xl border border-primary/40 animate-ping opacity-25 pointer-events-none" />
              )}

              <div
                className={reduce ? '' : 'animate-float-soft'}
                style={{ animationDelay: `${i * 0.7}s` }}
              >
                {/* Fixed identical card size (h-11 w-44) so visual center is always exact */}
                <div className="group flex h-11 w-44 items-center gap-2.5 rounded-xl border border-white/15 bg-slate-900/60 px-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-slate-900/80 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/80 to-violet-500/80 text-white ring-1 ring-inset ring-white/15 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex flex-col leading-tight min-w-0">
                    <span className="text-[0.76rem] font-semibold text-white tracking-tight truncate">
                      {node.label}
                    </span>
                    <span className="text-[0.60rem] text-white/60 truncate">{node.meta}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}