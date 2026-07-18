'use client';

import * as React from 'react';
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

interface Node {
  id: string;
  label: string;
  meta: string;
  icon: LucideIcon;
  x: number;
  y: number;
}

// Card dimensions: approximately 120px width, 32px height
// Adjust connector endpoints to meet at card center
const NODES: Node[] = [
  { id: 'ai', label: 'AI Agents', meta: 'Reasoning · Tools', icon: Bot, x: 50, y: 12 },
  { id: 'data', label: 'Data Pipelines', meta: 'Streaming · Lakehouse', icon: Workflow, x: 13, y: 36 },
  { id: 'cloud', label: 'Cloud', meta: 'Azure · AWS', icon: Cloud, x: 87, y: 36 },
  { id: 'analytics', label: 'Analytics', meta: 'Real-time', icon: LineChart, x: 22, y: 64 },
  { id: 'apps', label: 'Applications', meta: 'Composable', icon: LayoutGrid, x: 78, y: 64 },
];

// Connector endpoint offsets to meet at card center
const CONNECTOR_OFFSETS: Record<string, { x: number; y: number }> = {
  ai: { x: 0, y: 6 }, // Top card: offset down by ~6%
  data: { x: 14, y: 0 }, // Left card: offset right by ~14%
  cloud: { x: -14, y: 0 }, // Right card: offset left by ~14%
  analytics: { x: 14, y: 0 }, // Bottom-left: offset right by ~14%
  apps: { x: -14, y: 0 }, // Bottom-right: offset left by ~14%
};

export function PlatformVisualization() {
  const reduce = useReducedMotion();

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[520px]"
      aria-hidden="true"
    >
{/* Connectors - meeting at card centers */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        {NODES.map((node) => {
          const offset = CONNECTOR_OFFSETS[node.id] || { x: 0, y: 0 };
          return (
            <line
              key={node.id}
              x1="50"
              y1="50"
              x2={node.x + offset.x}
              y2={node.y + offset.y}
              stroke="url(#nodeGradient)"
              strokeWidth="0.4"
              strokeDasharray="2 2.4"
              vectorEffect="non-scaling-stroke"
              className={reduce ? '' : 'animate-dash'}
              opacity={0.7}
            />
          );
        })}
        <defs>
          <linearGradient id="nodeGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>

      {/* Core - perfectly centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {!reduce && (
          <>
            <span className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30 [animation:pulse-ring_3s_ease-out_infinite]" />
            <span className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-400/20 [animation:pulse-ring_3s_ease-out_infinite_1.2s]" />
          </>
        )}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-violet-500 to-cyan-400 shadow-2xl ring-1 ring-inset ring-white/20">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Nodes - perfectly positioned with center alignment */}
      {NODES.map((node, i) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
          >
            <div
              className={
                reduce
                  ? ''
                  : 'animate-float-soft'
              }
              style={{ animationDelay: `${i * 0.7}s` }}
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 shadow-lg backdrop-blur-md">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/80 to-violet-500/80 text-white ring-1 ring-inset ring-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[0.78rem] font-semibold text-white">
                    {node.label}
                  </span>
                  <span className="text-[0.62rem] text-white/55">{node.meta}</span>
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
