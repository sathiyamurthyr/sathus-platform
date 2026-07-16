import type { Config } from 'tailwindcss';
import { tailwindTheme } from '@sathus-platform/config';

const config: Config = {
  ...tailwindTheme,
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      ...tailwindTheme.theme?.extend,
      colors: {
        ...tailwindTheme.theme?.extend?.colors,
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
      },
    },
  },
};

export default config;
