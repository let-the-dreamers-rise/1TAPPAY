/**
 * Payment Link Generator Utility
 * 
 * Generates unique payment links with QR code data for sharing.
 */

import { v4 as uuidv4 } from 'uuid';
import { PaymentLink } from '@/types';

/**
 * Generate a unique payment link
 * 
 * @param username - Payee's display name
 * @param amount - Payment amount in USDC
 * @param walletAddress - Payee's wallet address
 * @param note - Optional payment description
 * @returns PaymentLink object with all required fields
 */
export function generatePaymentLink(
  username: string,
  amount: string,
  walletAddress: string,
  note?: string
): PaymentLink {
  // Generate unique ID
  const id = uuidv4();

  // Create payment URL path with wallet address
  const urlPath = `/pay/${encodeURIComponent(username)}/${encodeURIComponent(amount)}?address=${encodeURIComponent(walletAddress)}`;

  // Get base URL (for QR code, we need the full URL)
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_BASE_URL || 'https://1tappay.vercel.app';

  const fullUrl = `${baseUrl}${urlPath}`;

  // Create payment link object
  const paymentLink: PaymentLink = {
    id,
    username,
    amount,
    note,
    recipientAddress: walletAddress,
    url: urlPath, // Store relative URL for routing
    qrCodeData: fullUrl, // Store full URL for QR code
    createdAt: Date.now(),
  };

  return paymentLink;
}

/**
 * Validate username format
 * 
 * @param username - Username to validate
 * @returns true if valid, false otherwise
 */
export function validateUsername(username: string): boolean {
  if (!username || username.length < 3 || username.length > 30) {
    return false;
  }

  // Only allow alphanumeric, underscore, and hyphen
  const pattern = /^[a-zA-Z0-9_-]+$/;
  return pattern.test(username);
}

/**
 * Validate amount
 * 
 * @param amount - Amount to validate
 * @returns true if valid, false otherwise
 */
export function validateAmount(amount: string): boolean {
  if (!amount) {
    return false;
  }

  // Check for valid number format (only digits, optional single decimal point)
  const validFormatPattern = /^[0-9]+(\.[0-9]+)?$/;
  if (!validFormatPattern.test(amount)) {
    return false;
  }

  const numAmount = parseFloat(amount);

  // Check if valid number
  if (isNaN(numAmount)) {
    return false;
  }

  // Check range
  if (numAmount <= 0 || numAmount > 1000000) {
    return false;
  }

  // Check decimal places (max 6 for USDC)
  const decimalParts = amount.split('.');
  if (decimalParts.length > 1 && decimalParts[1].length > 6) {
    return false;
  }

  return true;
}

/**
 * Validate note length
 * 
 * @param note - Note to validate
 * @returns true if valid, false otherwise
 */
export function validateNote(note?: string): boolean {
  if (!note) {
    return true; // Note is optional
  }

  return note.length <= 200;
}

/**
 * Validate all payment link form data
 * 
 * @param username - Username to validate
 * @param amount - Amount to validate
 * @param note - Optional note to validate
 * @returns Object with validation result and error messages
 */
export function validatePaymentLinkForm(
  username: string,
  amount: string,
  note?: string
): { valid: boolean; errors: { field: string; message: string }[] } {
  const errors: { field: string; message: string }[] = [];

  if (!validateUsername(username)) {
    if (!username) {
      errors.push({ field: 'username', message: 'Username is required' });
    } else if (username.length < 3) {
      errors.push({ field: 'username', message: 'Username must be at least 3 characters' });
    } else if (username.length > 30) {
      errors.push({ field: 'username', message: 'Username must be at most 30 characters' });
    } else {
      errors.push({
        field: 'username',
        message: 'Username can only contain letters, numbers, hyphens, and underscores'
      });
    }
  }

  if (!validateAmount(amount)) {
    if (!amount) {
      errors.push({ field: 'amount', message: 'Amount is required' });
    } else if (isNaN(parseFloat(amount))) {
      errors.push({ field: 'amount', message: 'Amount must be a valid number' });
    } else if (parseFloat(amount) <= 0) {
      errors.push({ field: 'amount', message: 'Amount must be greater than 0' });
    } else if (parseFloat(amount) > 1000000) {
      errors.push({ field: 'amount', message: 'Amount cannot exceed 1,000,000 USDC' });
    } else {
      const decimalParts = amount.split('.');
      if (decimalParts.length > 1 && decimalParts[1].length > 6) {
        errors.push({ field: 'amount', message: 'Amount can have maximum 6 decimal places' });
      }
    }
  }

  if (!validateNote(note)) {
    errors.push({ field: 'note', message: 'Note cannot exceed 200 characters' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format amount for display
 * 
 * @param amount - Amount to format
 * @returns Formatted amount string
 */
export function formatAmount(amount: string): string {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return amount;
  }

  return numAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}
