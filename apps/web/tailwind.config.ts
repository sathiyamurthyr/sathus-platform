import type { Config } from 'tailwindcss';
import { tailwindTheme } from '@sathus-platform/config';

const config: Config = {
  ...tailwindTheme,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        burgundy: {
          DEFAULT: '#A20A3A',
          hover: '#8C0832',
          light: '#F9EEF2',
        },
        orange: {
          DEFAULT: '#FF9933',
          light: '#FFAE5C',
          pale: '#FFF4E8',
        },
        gold: {
          DEFAULT: '#EDC11E',
          light: '#F4D04C',
        },
        surface: {
          DEFAULT: '#FAF8F9',
          subtle: '#FAF8F9',
          elevated: '#FFFFFF',
        },
        highlight: {
          burgundy: '#F9EEF2',
          orange: '#FFF4E8',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Instrument Serif', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
};

export default config;
