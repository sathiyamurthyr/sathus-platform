import { describe, it, expect } from 'vitest';
import { memomesCloud } from '@/features/products/data/memomes-cloud';

describe('Product Types', () => {
  describe('memomesCloud', () => {
    it('has required product fields', () => {
      expect(memomesCloud.id).toBe('memomes-cloud');
      expect(memomesCloud.name).toBe('Memomes Cloud');
      expect(memomesCloud.slug).toBe('memomes-cloud');
      expect(memomesCloud.tagline).toBeDefined();
      expect(memomesCloud.description).toBeDefined();
    });

    it('has hero section', () => {
      expect(memomesCloud.hero.title).toBe('Memomes Cloud');
      expect(memomesCloud.hero.primaryCta.text).toBe('Get Started');
      expect(memomesCloud.hero.primaryCta.href).toBe('/contact');
    });

    it('has features', () => {
      expect(memomesCloud.features.length).toBeGreaterThan(0);
      expect(memomesCloud.features[0].title).toBeDefined();
      expect(memomesCloud.features[0].description).toBeDefined();
    });

    it('has security features', () => {
      expect(memomesCloud.security.length).toBe(6);
      expect(memomesCloud.security.find(s => s.id === 'aes-256')).toBeDefined();
      expect(memomesCloud.security.find(s => s.id === 'zero-knowledge')).toBeDefined();
    });

    it('has technology stack', () => {
      expect(memomesCloud.technology.length).toBe(6);
      expect(memomesCloud.technology.find(t => t.name === '.NET')).toBeDefined();
      expect(memomesCloud.technology.find(t => t.name === 'Next.js')).toBeDefined();
    });

    it('has roadmap items', () => {
      expect(memomesCloud.roadmap.length).toBe(3);
      expect(memomesCloud.roadmap[0].status).toBe('completed');
    });

    it('has FAQ items', () => {
      expect(memomesCloud.faq.length).toBe(3);
      expect(memomesCloud.faq[0].question).toBeDefined();
      expect(memomesCloud.faq[0].answer).toBeDefined();
    });
  });
});