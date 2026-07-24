/**
 * Official Sathus Technology Hybrid Enterprise & AI Design System
 * Coexistence: Enterprise Luxury (Burgundy & Gold) + AI Technology (Blue & Cyan)
 */

export const BRAND_COLORS = {
  // Backgrounds & Surfaces
  background: '#0D0B10',
  surface: '#171419',
  surfaceElevated: '#1F1A20',

  // Primary Brand (Burgundy - 8%)
  primary: '#94003A',
  primaryHover: '#B5004A',

  // Gold Accents (Gold - 4%)
  premiumGold: '#E7B631',
  secondaryGold: '#EDC11E',

  // AI & Technology (Blue & Cyan - 8%)
  aiBlue: '#4F7CFF',
  aiCyan: '#37D5FF',

  // Typography
  mainText: '#FFFFFF',
  secondaryText: '#D6D6D6',
  mutedText: '#9E9E9E',

  // Borders & Structure
  border: '#40202C',
  engineeringGrid: 'rgba(255, 255, 255, 0.05)',

  // Status & Feedback
  success: '#2ECC71',
  warning: '#EDC11E',
  error: '#D64545',
} as const;

export type BrandColors = typeof BRAND_COLORS;
