/**
 * Unit Tests for Payment Link Generator
 */

import { describe, it, expect } from 'vitest';
import {
  validateUsername,
  validateAmount,
  validateNote,
  validatePaymentLinkForm,
  generatePaymentLink,
} from '@/utils/paymentLinkGenerator';

describe('Payment Link Generator - Edge Cases', () => {
  describe('Username Validation', () => {
    it('should handle username at min length boundary (3 chars)', () => {
      expect(validateUsername('abc')).toBe(true);
      expect(validateUsername('ab')).toBe(false);
    });

    it('should handle username at max length boundary (30 chars)', () => {
      expect(validateUsername('a'.repeat(30))).toBe(true);
      expect(validateUsername('a'.repeat(31))).toBe(false);
    });

    it('should handle special characters in username', () => {
      expect(validateUsername('user-name')).toBe(true);
      expect(validateUsername('user_name')).toBe(true);
      expect(validateUsername('user.name')).toBe(false);
      expect(validateUsername('user@name')).toBe(false);
      expect(validateUsername('user name')).toBe(false);
    });
  });

  describe('Amount Validation', () => {
    it('should handle amount at min value boundary (0.01)', () => {
      expect(validateAmount('0.01')).toBe(true);
      expect(validateAmount('0.001')).toBe(true); // Still valid, just very small
      expect(validateAmount('0')).toBe(false);
    });

    it('should handle amount at max value boundary (1000000)', () => {
      expect(validateAmount('1000000')).toBe(true);
      expect(validateAmount('1000001')).toBe(false);
    });

    it('should handle decimal places correctly', () => {
      expect(validateAmount('10')).toBe(true);
      expect(validateAmount('10.5')).toBe(true);
      expect(validateAmount('10.50')).toBe(true);
      expect(validateAmount('10.123456')).toBe(true);
      expect(validateAmount('10.1234567')).toBe(false);
    });

    it('should handle invalid number formats', () => {
      expect(validateAmount('abc')).toBe(false);
      expect(validateAmount('10.5.5')).toBe(false);
      expect(validateAmount('10,50')).toBe(false);
    });
  });

  describe('Note Validation', () => {
    it('should handle note at max length (200 chars)', () => {
      expect(validateNote('a'.repeat(200))).toBe(true);
      expect(validateNote('a'.repeat(201))).toBe(false);
    });

    it('should handle empty and undefined notes', () => {
      expect(validateNote('')).toBe(true);
      expect(validateNote(undefined)).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('should return errors for invalid username', () => {
      const result = validatePaymentLinkForm('ab', '10', undefined);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('username');
    });

    it('should return errors for invalid amount', () => {
      const result = validatePaymentLinkForm('testuser', '0', undefined);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('amount');
    });

    it('should return errors for invalid note', () => {
      const result = validatePaymentLinkForm('testuser', '10', 'a'.repeat(201));
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('note');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const result = validatePaymentLinkForm('ab', '0', 'a'.repeat(201));
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    it('should pass validation for valid inputs', () => {
      const result = validatePaymentLinkForm('testuser', '10.50', 'Test note');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Payment Link Generation', () => {
    it('should generate unique IDs for each link', () => {
      const link1 = generatePaymentLink('user1', '10', '0x123');
      const link2 = generatePaymentLink('user1', '10', '0x123');
      
      expect(link1.id).not.toBe(link2.id);
    });

    it('should include all required fields', () => {
      const link = generatePaymentLink('testuser', '10.50', '0x123', 'Test note');
      
      expect(link.id).toBeDefined();
      expect(link.username).toBe('testuser');
      expect(link.amount).toBe('10.50');
      expect(link.recipientAddress).toBe('0x123');
      expect(link.note).toBe('Test note');
      expect(link.url).toBeDefined();
      expect(link.qrCodeData).toBeDefined();
      expect(link.createdAt).toBeDefined();
    });
  });
});
