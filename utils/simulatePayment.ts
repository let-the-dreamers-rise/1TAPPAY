/**
 * Payment Simulation Utility
 * 
 * Simulates payment transactions for demo mode without blockchain interaction.
 */

import { v4 as uuidv4 } from 'uuid';
import { Payment } from '@/types';

/**
 * Simulate a payment transaction
 * 
 * @param payerAddress - Payer's wallet address
 * @param recipientAddress - Recipient's wallet address
 * @param amount - Payment amount
 * @param paymentLinkId - Optional payment link ID
 * @returns Simulated Payment object
 */
export function simulatePayment(
  payerAddress: string,
  recipientAddress: string,
  amount: string,
  paymentLinkId?: string
): Payment {
  // Generate mock transaction hash
  const mockTxHash = generateMockTransactionHash();

  // Create simulated payment
  const payment: Payment = {
    id: uuidv4(),
    paymentLinkId: paymentLinkId || 'simulated',
    payerAddress,
    recipientAddress,
    amount,
    transactionHash: mockTxHash,
    timestamp: Date.now(),
    status: 'simulated',
  };

  return payment;
}

/**
 * Generate a mock transaction hash
 * 
 * @returns Mock transaction hash in hex format
 */
export function generateMockTransactionHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return hash;
}

/**
 * Simulate payment delay (mimics blockchain confirmation time)
 * 
 * @param minMs - Minimum delay in milliseconds
 * @param maxMs - Maximum delay in milliseconds
 * @returns Promise that resolves after random delay
 */
export function simulatePaymentDelay(minMs: number = 1500, maxMs: number = 3000): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Check if a transaction hash is simulated
 * 
 * @param txHash - Transaction hash to check
 * @returns true if simulated, false otherwise
 */
export function isSimulatedTransaction(txHash: string): boolean {
  // In a real implementation, you might check against a list of known simulated hashes
  // For now, we'll just check if it's a valid hex string
  return /^0x[0-9a-f]{64}$/i.test(txHash);
}
