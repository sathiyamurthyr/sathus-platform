export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
} as const;

export const fontWeights = {
  thin: 100,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const letterSpacings = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

export const typographyScale = {
  displayXl: {
    fontSize: '4.5rem',
    lineHeight: '1.1',
    fontWeight: 800,
    letterSpacing: '-0.02em',
  },
  displayLg: {
    fontSize: '3.75rem',
    lineHeight: '1.1',
    fontWeight: 800,
    letterSpacing: '-0.02em',
  },
  h1: {
    fontSize: '3rem',
    lineHeight: '1.2',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  h2: {
    fontSize: '2.25rem',
    lineHeight: '1.25',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.875rem',
    lineHeight: '1.3',
    fontWeight: 600,
    letterSpacing: '0em',
  },
  h4: {
    fontSize: '1.5rem',
    lineHeight: '1.4',
    fontWeight: 600,
    letterSpacing: '0em',
  },
  bodyLg: {
    fontSize: '1.125rem',
    lineHeight: '1.6',
    fontWeight: 400,
    letterSpacing: '0em',
  },
  body: {
    fontSize: '1rem',
    lineHeight: '1.5',
    fontWeight: 400,
    letterSpacing: '0em',
  },
  bodySm: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    fontWeight: 400,
    letterSpacing: '0em',
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: '1.4',
    fontWeight: 400,
    letterSpacing: '0.02em',
  },
  label: {
    fontSize: '0.75rem',
    lineHeight: '1.4',
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
  button: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    fontWeight: 500,
    letterSpacing: '0.01em',
  },
  code: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    fontWeight: 400,
    letterSpacing: '0em',
    fontFamily: 'var(--font-jetbrains-mono), monospace',
  },
} as const;

export type TypographyScale = keyof typeof typographyScale;
