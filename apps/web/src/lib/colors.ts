/**
 * Official Sathus Technology Pvt. Ltd. Brand Design System
 * Unified Brand Palette
 */

export const BRAND_COLORS = {
  // Backgrounds & Surfaces
  background: '#FFFFFF',
  surface: '#FAF8F9',
  surfaceElevated: '#FFFFFF',

  // Primary Brand (Burgundy)
  primary: '#A20A3A',
  primaryHover: '#8C0832',

  // Restrained Brand Accents (Orange & Gold)
  vibrantOrange: '#FF9933',
  orange: '#FF9933',
  goldenYellow: '#EDC11E',
  gold: '#EDC11E',
  premiumGold: '#EDC11E',
  secondaryGold: '#FF9933',

  // Highlights
  highlightBurgundy: '#F9EEF2',
  highlightOrange: '#FFF4E8',

  // Typography
  mainText: '#292329',
  secondaryText: '#635861',
  mutedText: '#635861',

  // Borders & Structure
  border: '#EDE1E6',
  engineeringGrid: 'rgba(162, 10, 58, 0.04)',

  // Status & Feedback
  success: '#10B981',
  warning: '#EDC11E',
  error: '#D64545',
} as const;

export type BrandColors = typeof BRAND_COLORS;
