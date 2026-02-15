/**
 * Unit Tests for StorageManager
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  savePaymentLink,
  getPaymentLinks,
  savePayment,
  getPayments,
  StorageError,
} from '@/utils/storageManager';
import { PaymentLink, Payment } from '@/types';

describe('StorageManager', () => {
  const mockWalletAddress = '0x1234567890123456789012345678901234567890';
  
  // Store original localStorage methods
  const originalLocalStorage = {
    setItem: localStorage.setItem,
    getItem: localStorage.getItem,
    removeItem: localStorage.removeItem,
    clear: localStorage.clear,
  };

  beforeEach(() => {
    // Clear storage but don't clear mocks as it breaks localStorage
  });
  
  afterEach(() => {
    // Restore original localStorage methods after each test
    localStorage.setItem = originalLocalStorage.setItem;
    localStorage.getItem = originalLocalStorage.getItem;
    localStorage.removeItem = originalLocalStorage.removeItem;
    localStorage.clear = originalLocalStorage.clear;
  });

  describe('Payment Links', () => {
    it('should handle localStorage full scenario', () => {
      const mockLink: PaymentLink = {
        id: 'test-id',
        username: 'testuser',
        amount: '10.00',
        recipientAddress: mockWalletAddress,
        url: '/pay/testuser/10',
        qrCodeData: 'http://localhost:3000/pay/testuser/10',
        createdAt: Date.now(),
      };

      // Save original methods
      const originalSetItem = localStorage.setItem;
      const originalGetItem = localStorage.getItem;
      const originalRemoveItem = localStorage.removeItem;
      
      // Mock setItem to throw QuotaExceededError except for availability checks
      localStorage.setItem = (key: string, value: string) => {
        // Allow availability check to pass
        if (key === '__localStorage_test__') {
          originalSetItem.call(localStorage, key, value);
          return;
        }
        // All other calls should throw
        const error: any = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      };
      
      // Also need to handle removeItem for the availability check
      localStorage.removeItem = (key: string) => {
        originalRemoveItem.call(localStorage, key);
      };

      expect(() => savePaymentLink(mockLink, mockWalletAddress)).toThrow(StorageError);
      expect(() => savePaymentLink(mockLink, mockWalletAddress)).toThrow(
        'Storage limit reached'
      );
      
      // Restore originals
      localStorage.setItem = originalSetItem;
      localStorage.getItem = originalGetItem;
      localStorage.removeItem = originalRemoveItem;
    });

    it('should handle localStorage disabled scenario', () => {
      const mockLink: PaymentLink = {
        id: 'test-id',
        username: 'testuser',
        amount: '10.00',
        recipientAddress: mockWalletAddress,
        url: '/pay/testuser/10',
        qrCodeData: 'http://localhost:3000/pay/testuser/10',
        createdAt: Date.now(),
      };

      // Mock all methods to simulate disabled localStorage
      const originalSetItem = localStorage.setItem;
      const originalGetItem = localStorage.getItem;
      const originalRemoveItem = localStorage.removeItem;
      
      localStorage.setItem = () => {
        throw new Error('localStorage is not available');
      };
      
      localStorage.getItem = () => {
        throw new Error('localStorage is not available');
      };
      
      localStorage.removeItem = () => {
        throw new Error('localStorage is not available');
      };

      expect(() => savePaymentLink(mockLink, mockWalletAddress)).toThrow();
      
      // Restore originals
      localStorage.setItem = originalSetItem;
      localStorage.getItem = originalGetItem;
      localStorage.removeItem = originalRemoveItem;
    });

    it('should handle corrupted data', () => {
      const key = `1tappay_links_${mockWalletAddress.toLowerCase()}`;
      
      // Save the original getItem
      const originalGetItem = localStorage.getItem;
      
      // Mock getItem to return corrupted data
      localStorage.getItem = (k: string) => {
        if (k === key) {
          return 'invalid json data';
        }
        return originalGetItem.call(localStorage, k);
      };

      expect(() => getPaymentLinks(mockWalletAddress)).toThrow(StorageError);
      expect(() => getPaymentLinks(mockWalletAddress)).toThrow('corrupted');
      
      // Restore
      localStorage.getItem = originalGetItem;
    });

    it('should return empty array when no data exists', () => {
      const links = getPaymentLinks(mockWalletAddress);
      expect(links).toEqual([]);
    });

    it('should save and retrieve payment link successfully', () => {
      const mockLink: PaymentLink = {
        id: 'test-id',
        username: 'testuser',
        amount: '10.00',
        recipientAddress: mockWalletAddress,
        url: '/pay/testuser/10',
        qrCodeData: 'http://localhost:3000/pay/testuser/10',
        createdAt: Date.now(),
      };

      savePaymentLink(mockLink, mockWalletAddress);
      const links = getPaymentLinks(mockWalletAddress);

      expect(links).toHaveLength(1);
      expect(links[0]).toEqual(mockLink);
    });
  });

  describe('Payments', () => {
    it('should handle localStorage full for payments', () => {
      const mockPayment: Payment = {
        id: 'payment-id',
        paymentLinkId: 'link-id',
        payerAddress: mockWalletAddress,
        recipientAddress: mockWalletAddress,
        amount: '10.00',
        transactionHash: '0xabc123',
        timestamp: Date.now(),
        status: 'confirmed',
      };

      const originalSetItem = localStorage.setItem;
      let callCount = 0;
      
      localStorage.setItem = (key: string, value: string) => {
        callCount++;
        // First call is the availability check, let it pass
        if (callCount === 1 && key === '__localStorage_test__') {
          originalSetItem.call(localStorage, key, value);
          return;
        }
        // Subsequent calls should throw
        const error: any = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      };

      expect(() => savePayment(mockPayment, mockWalletAddress)).toThrow(StorageError);
      
      // Restore original
      localStorage.setItem = originalSetItem;
    });

    it('should save and retrieve payment successfully', () => {
      const mockPayment: Payment = {
        id: 'payment-id',
        paymentLinkId: 'link-id',
        payerAddress: mockWalletAddress,
        recipientAddress: mockWalletAddress,
        amount: '10.00',
        transactionHash: '0xabc123',
        timestamp: Date.now(),
        status: 'confirmed',
      };

      savePayment(mockPayment, mockWalletAddress);
      const payments = getPayments(mockWalletAddress);

      expect(payments).toHaveLength(1);
      expect(payments[0]).toEqual(mockPayment);
    });
  });
});
