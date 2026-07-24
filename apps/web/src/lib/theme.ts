import { BRAND_COLORS } from './colors';

export const theme = {
  colors: BRAND_COLORS,
  gradients: {
    aiTech: 'linear-gradient(135deg, #4F7CFF 0%, #37D5FF 100%)',
    goldAccent: 'linear-gradient(135deg, #E7B631 0%, #EDC11E 100%)',
    primaryButton: 'linear-gradient(135deg, #94003A 0%, #B5004A 100%)',
  },
  shadows: {
    cardHover: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(79, 124, 255, 0.35)',
    primaryGlow: '0 10px 30px rgba(148, 0, 58, 0.45)',
    goldGlow: '0 0 25px rgba(231, 182, 49, 0.30)',
    aiBlueGlow: '0 0 35px rgba(79, 124, 255, 0.40)',
  },
} as const;

export type Theme = typeof theme;
