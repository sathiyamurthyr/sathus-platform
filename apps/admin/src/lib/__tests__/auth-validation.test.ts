import { describe, expect, it } from 'vitest';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  mfaVerifySchema,
  changePasswordSchema,
} from '../auth-validation';

describe('auth-validation schemas', () => {
  describe('loginSchema', () => {
    it('accepts a valid login payload', () => {
      expect(loginSchema.safeParse({ email: 'user@example.com', password: 'Sup3r!Secret' }).success).toBe(true);
    });

    it('rejects an invalid email', () => {
      const result = loginSchema.safeParse({ email: 'not-email', password: 'Sup3r!Secret' });
      expect(result.success).toBe(false);
    });

    it('rejects a short password', () => {
      const result = loginSchema.safeParse({ email: 'user@example.com', password: 'short' });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('accepts a valid registration', () => {
      const result = registerSchema.safeParse({
        email: 'user@example.com',
        password: 'Sup3r!Secret',
        firstName: 'Ada',
        lastName: 'Lovelace',
      });
      expect(result.success).toBe(true);
    });

    it('rejects a password missing complexity', () => {
      const result = registerSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        firstName: 'Ada',
        lastName: 'Lovelace',
      });
      expect(result.success).toBe(false);
    });

    it('rejects missing names', () => {
      const result = registerSchema.safeParse({
        email: 'user@example.com',
        password: 'Sup3r!Secret',
        firstName: '',
        lastName: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('forgotPasswordSchema', () => {
    it('accepts a valid email', () => {
      expect(forgotPasswordSchema.safeParse({ email: 'user@example.com' }).success).toBe(true);
    });

    it('rejects an empty email', () => {
      expect(forgotPasswordSchema.safeParse({ email: '' }).success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('accepts matching passwords', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'abc',
        password: 'Sup3r!Secret',
        confirmPassword: 'Sup3r!Secret',
      });
      expect(result.success).toBe(true);
    });

    it('rejects mismatched passwords', () => {
      const result = resetPasswordSchema.safeParse({
        token: 'abc',
        password: 'Sup3r!Secret',
        confirmPassword: 'Different1!',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('verifyEmailSchema', () => {
    it('requires a token', () => {
      expect(verifyEmailSchema.safeParse({ token: 'token-123' }).success).toBe(true);
      expect(verifyEmailSchema.safeParse({ token: '' }).success).toBe(false);
    });
  });

  describe('mfaVerifySchema', () => {
    it('accepts a 6-digit code', () => {
      expect(mfaVerifySchema.safeParse({ code: '123456' }).success).toBe(true);
    });

    it('rejects a code that is not 6 digits', () => {
      expect(mfaVerifySchema.safeParse({ code: '123' }).success).toBe(false);
      expect(mfaVerifySchema.safeParse({ code: '1234567' }).success).toBe(false);
    });
  });

  describe('changePasswordSchema', () => {
    it('accepts matching new passwords', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'Old1!pass',
        newPassword: 'Sup3r!Secret',
        confirmPassword: 'Sup3r!Secret',
      });
      expect(result.success).toBe(true);
    });

    it('rejects mismatched new passwords', () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: 'Old1!pass',
        newPassword: 'Sup3r!Secret',
        confirmPassword: 'Other1!pass',
      });
      expect(result.success).toBe(false);
    });
  });
});
