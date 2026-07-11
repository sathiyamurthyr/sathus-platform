import type { Config } from 'tailwindcss';
import { tailwindTheme } from '@sathus-platform/config';

const config: Config = {
  ...tailwindTheme,
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
};

export default config;
