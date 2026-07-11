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

export function useMotionConfig() {
  return React.useContext(MotionContext);
}
