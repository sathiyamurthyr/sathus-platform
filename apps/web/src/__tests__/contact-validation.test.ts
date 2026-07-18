import { describe, it, expect } from 'vitest';
import {
  contactFormSchema,
  step1Schema,
  step2Schema,
  step3Schema,
} from '@/features/contact/validation';

describe('Contact Validation', () => {
  describe('contactFormSchema', () => {
    it('validates a valid contact form', () => {
      const result = contactFormSchema.parse({
        firstName: 'John',
        lastName: 'Doe',
        company: 'Acme Corp',
        jobTitle: 'CTO',
        email: 'john@acmecorp.com',
        country: 'United States',
        industry: 'Technology',
        companySize: '51-200',
        message: 'I would like to discuss a project',
        consent: true,
        inquiryType: 'general',
      });
      expect(result.firstName).toBe('John');
    });

    it('throws for personal email', () => {
      expect(() => contactFormSchema.parse({
        firstName: 'John',
        lastName: 'Doe',
        company: 'Acme Corp',
        jobTitle: 'CTO',
        email: 'john@gmail.com',
        country: 'United States',
        industry: 'Technology',
        companySize: '51-200',
        message: 'Test message',
        consent: true,
        inquiryType: 'general',
      })).toThrow('Please use your business email address');
    });

    it('throws for missing required fields', () => {
      expect(() => contactFormSchema.parse({
        firstName: '',
        lastName: '',
        email: 'test@example.com',
        country: '',
        industry: '',
        companySize: '',
        message: 'Short',
        consent: false,
        inquiryType: 'general',
      })).toThrow();
    });
  });

  describe('step1Schema', () => {
    it('validates personal information step', () => {
      const result = step1Schema.parse({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@acmecorp.com',
      });
      expect(result.firstName).toBe('John');
    });
  });

  describe('step2Schema', () => {
    it('validates company information step', () => {
      const result = step2Schema.parse({
        company: 'Acme Corp',
        jobTitle: 'CTO',
        country: 'United States',
        industry: 'Technology',
        companySize: '51-200',
      });
      expect(result.company).toBe('Acme Corp');
    });
  });

  describe('step3Schema', () => {
    it('validates message step', () => {
      const result = step3Schema.parse({
        message: 'This is a test message with enough characters',
        consent: true,
      });
      expect(result.consent).toBe(true);
    });
  });
});