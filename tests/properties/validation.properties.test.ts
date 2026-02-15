/**
 * Property-Based Tests for Payment Link Validation
 * Feature: 1tap-pay
 */

import { describe, it, expect } from 'vitest';
import { fc } from '@fast-check/vitest';
import {
  generatePaymentLink,
  validateUsername,
  validateAmount,
  validateNote,
  validatePaymentLinkForm,
} from '@/utils/paymentLinkGenerator';

describe('Property 1: Payment Link URL Format', () => {
  it('should generate URLs in correct format /pay/{username}/{amount}', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9_-]{3,30}$/),
        fc.double({ min: 0.01, max: 1000000, noNaN: true }).map(n => n.toFixed(2)),
        fc.hexaString({ minLength: 40, maxLength: 40 }).map(s => '0x' + s),
        (username, amount, walletAddress) => {
          const link = generatePaymentLink(username, amount, walletAddress);
          
          // Verify URL format
          const expectedUrl = `/pay/${encodeURIComponent(username)}/${encodeURIComponent(amount)}`;
          expect(link.url).toBe(expectedUrl);
          
          // Verify URL contains username and amount
          expect(link.url).toContain(username);
          expect(link.url).toContain(amount);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 3: Username Validation', () => {
  it('should reject empty or missing usernames', () => {
    expect(validateUsername('')).toBe(false);
    expect(validateUsername(' ')).toBe(false);
  });

  it('should reject usernames that are too short', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 2 }),
        (username) => {
          expect(validateUsername(username)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject usernames that are too long', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 31, maxLength: 100 }),
        (username) => {
          expect(validateUsername(username)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject usernames with invalid characters', () => {
    const invalidChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', ' ', '.'];
    
    invalidChars.forEach(char => {
      expect(validateUsername(`user${char}name`)).toBe(false);
    });
  });

  it('should accept valid usernames', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9_-]{3,30}$/),
        (username) => {
          expect(validateUsername(username)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 4: Amount Validation', () => {
  it('should reject zero, negative, or missing amounts', () => {
    expect(validateAmount('')).toBe(false);
    expect(validateAmount('0')).toBe(false);
    expect(validateAmount('-1')).toBe(false);
    expect(validateAmount('-10.50')).toBe(false);
  });

  it('should reject amounts exceeding maximum', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1000001, max: 10000000, noNaN: true }),
        (amount) => {
          expect(validateAmount(amount.toString())).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject amounts with too many decimal places', () => {
    expect(validateAmount('10.1234567')).toBe(false);
    expect(validateAmount('5.12345678')).toBe(false);
  });

  it('should accept valid amounts', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.01, max: 1000000, noNaN: true }),
        (amount) => {
          const amountStr = amount.toFixed(Math.min(6, 2));
          expect(validateAmount(amountStr)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 6: Optional Note Handling', () => {
  it('should accept payment links without notes', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9_-]{3,30}$/),
        fc.double({ min: 0.01, max: 1000000, noNaN: true }).map(n => n.toFixed(2)),
        fc.hexaString({ minLength: 40, maxLength: 40 }).map(s => '0x' + s),
        (username, amount, walletAddress) => {
          const link = generatePaymentLink(username, amount, walletAddress);
          expect(link.note).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should store notes exactly as provided', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9_-]{3,30}$/),
        fc.double({ min: 0.01, max: 1000000, noNaN: true }).map(n => n.toFixed(2)),
        fc.hexaString({ minLength: 40, maxLength: 40 }).map(s => '0x' + s),
        fc.string({ maxLength: 200 }),
        (username, amount, walletAddress, note) => {
          const link = generatePaymentLink(username, amount, walletAddress, note);
          expect(link.note).toBe(note);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should validate note length', () => {
    expect(validateNote(undefined)).toBe(true);
    expect(validateNote('')).toBe(true);
    expect(validateNote('a'.repeat(200))).toBe(true);
    expect(validateNote('a'.repeat(201))).toBe(false);
  });
});
