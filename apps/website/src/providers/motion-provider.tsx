'use client';

import * as React from 'react';
import { MotionConfigProps } from 'motion/react';

const MotionContext = React.createContext<MotionConfigProps | null>(null);

export function MotionProvider({
  children,
  reducedMotion = 'user',
}: {
  children: React.ReactNode;
  reducedMotion?: MotionConfigProps['reducedMotion'];
}) {
  return (
    <MotionContext.Provider value={{ reducedMotion }}>
      {children}
    </MotionContext.Provider>
  );
}

export function useReducedMotion() {
  const config = React.useContext(MotionContext);
  if (config === null) return false;
  if (typeof config.reducedMotion === 'boolean') return config.reducedMotion;
  if (config.reducedMotion === 'user') {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}

export function useMotionConfig() {
  return React.useContext(MotionContext);
}
