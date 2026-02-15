/**
 * Property-Based Tests for Payment Link Storage
 * Feature: 1tap-pay
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { fc } from '@fast-check/vitest';
import { savePaymentLink, getPaymentLinks } from '@/utils/storageManager';
import { PaymentLink } from '@/types';

describe('Property 2: Payment Link Data Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should persist and retrieve payment link data correctly', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          username: fc.stringMatching(/^[a-zA-Z0-9_-]{3,30}$/),
          amount: fc.double({ min: 0.01, max: 1000000, noNaN: true }).map(n => n.toFixed(2)),
          note: fc.option(fc.string({ maxLength: 200 }), { nil: undefined }),
          recipientAddress: fc.hexaString({ minLength: 40, maxLength: 40 }).map(s => '0x' + s),
          url: fc.string(),
          qrCodeData: fc.string(),
          createdAt: fc.integer({ min: 0 }),
        }),
        (linkData) => {
          // Clear localStorage before each property run
          localStorage.clear();
          
          const walletAddress = '0x' + 'a'.repeat(40);
          const link: PaymentLink = linkData as PaymentLink;

          // Save the payment link
          savePaymentLink(link, walletAddress);

          // Retrieve payment links
          const retrieved = getPaymentLinks(walletAddress);

          // Verify the link was saved and retrieved correctly
          expect(retrieved).toHaveLength(1);
          expect(retrieved[0]).toEqual(link);
          expect(retrieved[0].id).toBe(link.id);
          expect(retrieved[0].username).toBe(link.username);
          expect(retrieved[0].amount).toBe(link.amount);
          expect(retrieved[0].recipientAddress).toBe(link.recipientAddress);
          
          if (link.note) {
            expect(retrieved[0].note).toBe(link.note);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle multiple payment links correctly', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            username: fc.stringMatching(/^[a-zA-Z0-9_-]{3,30}$/),
            amount: fc.double({ min: 0.01, max: 1000000, noNaN: true }).map(n => n.toFixed(2)),
            note: fc.option(fc.string({ maxLength: 200 }), { nil: undefined }),
            recipientAddress: fc.hexaString({ minLength: 40, maxLength: 40 }).map(s => '0x' + s),
            url: fc.string(),
            qrCodeData: fc.string(),
            createdAt: fc.integer({ min: 0 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (linksData) => {
          // Clear localStorage before each property run
          localStorage.clear();
          
          const walletAddress = '0x' + 'b'.repeat(40);
          const links: PaymentLink[] = linksData as PaymentLink[];

          // Save all links
          links.forEach(link => savePaymentLink(link, walletAddress));

          // Retrieve all links
          const retrieved = getPaymentLinks(walletAddress);

          // Verify all links were saved
          expect(retrieved).toHaveLength(links.length);
          
          // Verify each link's data
          links.forEach((link, index) => {
            const found = retrieved.find(r => r.id === link.id);
            expect(found).toBeDefined();
            expect(found?.username).toBe(link.username);
            expect(found?.amount).toBe(link.amount);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
