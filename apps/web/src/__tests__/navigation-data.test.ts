import { describe, it, expect } from 'vitest';
import { mainNavigation, footerNavigation } from '@/features/navigation/config/navigation.config';

describe('Navigation Data', () => {
  describe('mainNavigation', () => {
    it('has all main navigation items', () => {
      expect(mainNavigation.length).toBe(5);
      expect(mainNavigation.find(n => n.id === 'solutions')).toBeDefined();
      expect(mainNavigation.find(n => n.id === 'products')).toBeDefined();
      expect(mainNavigation.find(n => n.id === 'resources')).toBeDefined();
      expect(mainNavigation.find(n => n.id === 'trust')).toBeDefined();
      expect(mainNavigation.find(n => n.id === 'contact')).toBeDefined();
    });

    it('has children for dropdown menus', () => {
      const solutions = mainNavigation.find(n => n.id === 'solutions');
      expect(solutions?.children).toBeDefined();
      expect(solutions?.children?.length).toBeGreaterThan(0);
    });
  });

  describe('footerNavigation', () => {
    it('has all footer sections', () => {
      expect(footerNavigation.length).toBe(4);
      expect(footerNavigation.find(f => f.id === 'product')).toBeDefined();
      expect(footerNavigation.find(f => f.id === 'resources')).toBeDefined();
      expect(footerNavigation.find(f => f.id === 'trust')).toBeDefined();
      expect(footerNavigation.find(f => f.id === 'company')).toBeDefined();
    });
  });
});