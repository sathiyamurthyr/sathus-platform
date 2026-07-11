export const duration = {
  instant: 0,
  fast: 75,
  normal: 150,
  slow: 200,
  slower: 300,
  slowest: 500,
  elastic: 700,
} as const;

export const easing = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;
