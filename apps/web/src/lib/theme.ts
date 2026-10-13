import { BRAND_COLORS } from './colors';

export const theme = {
  colors: BRAND_COLORS,
  gradients: {
    brandAccent: 'linear-gradient(135deg, #A20A3A 0%, #FF9933 100%)',
    goldAccent: 'linear-gradient(135deg, #FF9933 0%, #EDC11E 100%)',
    primaryButton: 'linear-gradient(135deg, #A20A3A 0%, #8C0832 100%)',
    subtleSurface: 'linear-gradient(180deg, #FFFFFF 0%, #FAF8F9 100%)',
  },
  shadows: {
    cardHover: '0 12px 32px rgba(162, 10, 58, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
    primaryGlow: '0 8px 24px rgba(162, 10, 58, 0.25)',
    goldGlow: '0 0 20px rgba(237, 193, 30, 0.25)',
    orangeGlow: '0 0 20px rgba(255, 153, 51, 0.25)',
  },
} as const;

export type Theme = typeof theme;
