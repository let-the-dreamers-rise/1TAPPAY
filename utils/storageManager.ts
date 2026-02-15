/**
 * StorageManager - Handles localStorage operations for payment links and payments
 * 
 * This utility provides a clean interface for persisting and retrieving data
 * with proper error handling for storage quota and disabled localStorage scenarios.
 */

import { PaymentLink, Payment, STORAGE_KEYS } from '@/types';

/**
 * Error types for storage operations
 */
export class StorageError extends Error {
  constructor(message: string, public code: 'QUOTA_EXCEEDED' | 'STORAGE_DISABLED' | 'CORRUPTED_DATA' | 'UNKNOWN') {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Check if localStorage is available and enabled
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Save a payment link to localStorage
 */
export function savePaymentLink(link: PaymentLink, walletAddress: string): void {
  if (!isLocalStorageAvailable()) {
    throw new StorageError(
      'Browser storage is disabled. Payment links will not persist.',
      'STORAGE_DISABLED'
    );
  }

  try {
    const key = STORAGE_KEYS.PAYMENT_LINKS(walletAddress);
    
    // Get existing links
    let existing: PaymentLink[] = [];
    try {
      existing = getPaymentLinks(walletAddress);
    } catch (e) {
      // If data is corrupted, start fresh
      if (e instanceof StorageError && e.code === 'CORRUPTED_DATA') {
        existing = [];
      } else {
        throw e;
      }
    }
    
    // Check if link already exists (by ID)
    const index = existing.findIndex(l => l.id === link.id);
    if (index >= 0) {
      existing[index] = link; // Update existing
    } else {
      existing.push(link); // Add new
    }

    localStorage.setItem(key, JSON.stringify(existing));
  } catch (e: any) {
    if (e instanceof StorageError) {
      throw e;
    }
    if (e.name === 'QuotaExceededError') {
      throw new StorageError(
        'Storage limit reached. Please clear old payment links.',
        'QUOTA_EXCEEDED'
      );
    }
    throw new StorageError(
      'Failed to save payment link.',
      'UNKNOWN'
    );
  }
}

/**
 * Get all payment links for a wallet address
 */
export function getPaymentLinks(walletAddress: string): PaymentLink[] {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const key = STORAGE_KEYS.PAYMENT_LINKS(walletAddress);
    const data = localStorage.getItem(key);
    
    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);
    
    // Validate data structure
    if (!Array.isArray(parsed)) {
      throw new StorageError(
        'Failed to retrieve payment links. Data may be corrupted.',
        'CORRUPTED_DATA'
      );
    }

    return parsed as PaymentLink[];
  } catch (e) {
    if (e instanceof StorageError) {
      throw e;
    }
    console.error('Failed to retrieve payment links:', e);
    throw new StorageError(
      'Failed to retrieve payment links. Data may be corrupted.',
      'CORRUPTED_DATA'
    );
  }
}

/**
 * Delete a payment link by ID
 */
export function deletePaymentLink(linkId: string, walletAddress: string): void {
  if (!isLocalStorageAvailable()) {
    throw new StorageError(
      'Browser storage is disabled.',
      'STORAGE_DISABLED'
    );
  }

  try {
    const key = STORAGE_KEYS.PAYMENT_LINKS(walletAddress);
    const existing = getPaymentLinks(walletAddress);
    const filtered = existing.filter(l => l.id !== linkId);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch (e) {
    throw new StorageError(
      'Failed to delete payment link.',
      'UNKNOWN'
    );
  }
}

/**
 * Save a payment to localStorage
 */
export function savePayment(payment: Payment, walletAddress: string): void {
  if (!isLocalStorageAvailable()) {
    throw new StorageError(
      'Browser storage is disabled. Payments will not persist.',
      'STORAGE_DISABLED'
    );
  }

  try {
    const key = STORAGE_KEYS.PAYMENTS(walletAddress);
    
    // Get existing payments
    let existing: Payment[] = [];
    try {
      existing = getPayments(walletAddress);
    } catch (e) {
      // If data is corrupted, start fresh
      if (e instanceof StorageError && e.code === 'CORRUPTED_DATA') {
        existing = [];
      } else {
        throw e;
      }
    }
    
    // Check if payment already exists (by ID)
    const index = existing.findIndex(p => p.id === payment.id);
    if (index >= 0) {
      existing[index] = payment; // Update existing
    } else {
      existing.push(payment); // Add new
    }

    localStorage.setItem(key, JSON.stringify(existing));
  } catch (e: any) {
    if (e instanceof StorageError) {
      throw e;
    }
    if (e.name === 'QuotaExceededError') {
      throw new StorageError(
        'Storage limit reached. Please clear old payments.',
        'QUOTA_EXCEEDED'
      );
    }
    throw new StorageError(
      'Failed to save payment.',
      'UNKNOWN'
    );
  }
}

/**
 * Get all payments for a wallet address
 */
export function getPayments(walletAddress: string): Payment[] {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const key = STORAGE_KEYS.PAYMENTS(walletAddress);
    const data = localStorage.getItem(key);
    
    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);
    
    // Validate data structure
    if (!Array.isArray(parsed)) {
      throw new StorageError(
        'Failed to retrieve payments. Data may be corrupted.',
        'CORRUPTED_DATA'
      );
    }

    return parsed as Payment[];
  } catch (e) {
    if (e instanceof StorageError) {
      throw e;
    }
    console.error('Failed to retrieve payments:', e);
    throw new StorageError(
      'Failed to retrieve payments. Data may be corrupted.',
      'CORRUPTED_DATA'
    );
  }
}

/**
 * Clear all payment links for a wallet address
 */
export function clearPaymentLinks(walletAddress: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const key = STORAGE_KEYS.PAYMENT_LINKS(walletAddress);
    localStorage.removeItem(key);
  } catch (e) {
    throw new StorageError(
      'Failed to clear payment links.',
      'UNKNOWN'
    );
  }
}

/**
 * Clear all payments for a wallet address
 */
export function clearPayments(walletAddress: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const key = STORAGE_KEYS.PAYMENTS(walletAddress);
    localStorage.removeItem(key);
  } catch (e) {
    throw new StorageError(
      'Failed to clear payments.',
      'UNKNOWN'
    );
  }
}

/**
 * Clear all storage for a wallet address
 */
export function clearAllStorage(walletAddress: string): void {
  clearPaymentLinks(walletAddress);
  clearPayments(walletAddress);
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): { available: boolean; used?: number; total?: number } {
  if (!isLocalStorageAvailable()) {
    return { available: false };
  }

  try {
    // Estimate storage usage
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }

    return {
      available: true,
      used: used,
      // Most browsers have 5-10MB limit, we'll use 5MB as conservative estimate
      total: 5 * 1024 * 1024,
    };
  } catch (e) {
    return { available: true };
  }
}
