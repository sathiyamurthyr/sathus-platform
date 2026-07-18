import { describe, it, expect } from 'vitest';
import {
  securityControls,
  complianceFrameworks,
  privacyPrinciples,
  responsibleAIPrinciples,
  businessContinuityPlans,
  trustFAQ,
} from '@/features/trust/data';

describe('Trust Data', () => {
  describe('securityControls', () => {
    it('has all security control categories', () => {
      expect(securityControls.length).toBe(8);
      expect(securityControls.find(s => s.category === 'sdls')).toBeDefined();
      expect(securityControls.find(s => s.category === 'iam')).toBeDefined();
      expect(securityControls.find(s => s.category === 'encryption')).toBeDefined();
    });
  });

  describe('complianceFrameworks', () => {
    it('has achieved and planned frameworks', () => {
      expect(complianceFrameworks.length).toBe(5);
      const achieved = complianceFrameworks.filter(f => f.status === 'achieved');
      const planned = complianceFrameworks.filter(f => f.status === 'planned');
      expect(achieved.length).toBeGreaterThan(0);
      expect(planned.length).toBeGreaterThan(0);
    });
  });

  describe('privacyPrinciples', () => {
    it('has all privacy principles', () => {
      expect(privacyPrinciples.length).toBe(6);
      expect(privacyPrinciples.find(p => p.id === 'collection')).toBeDefined();
      expect(privacyPrinciples.find(p => p.id === 'residency')).toBeDefined();
    });
  });

  describe('responsibleAIPrinciples', () => {
    it('has all AI principles', () => {
      expect(responsibleAIPrinciples.length).toBe(6);
    });
  });

  describe('businessContinuityPlans', () => {
    it('has all continuity plans', () => {
      expect(businessContinuityPlans.length).toBe(4);
    });
  });

  describe('trustFAQ', () => {
    it('has FAQ items', () => {
      expect(trustFAQ.length).toBe(3);
    });
  });
});