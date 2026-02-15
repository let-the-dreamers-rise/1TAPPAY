'use client';

/**
 * PayButton Component
 * 
 * Handles payment transaction execution with loading states and error handling.
 * Supports both real blockchain transactions and demo mode simulation.
 */

import { useState } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ConnectButton } from '@/components/ConnectButton';
import { savePayment } from '@/utils/storageManager';
import { v4 as uuidv4 } from 'uuid';

interface PayButtonProps {
  recipientAddress: string;
  amount: string;
  onSuccess: (txHash: string) => void;
  onError: (error: Error) => void;
  demoMode?: boolean;
}

export function PayButton({
  recipientAddress,
  amount,
  onSuccess,
  onError,
  demoMode = false,
}: PayButtonProps) {
  const { address, isConnected } = useAccount();
  const { data: hash, sendTransaction, isPending: isSending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Check if demo mode is enabled from environment
  const isDemoMode = demoMode || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  const handlePayment = async () => {
    console.log('PayButton clicked');

    if (!address) {
      console.log('No wallet connected');
      setError('Please connect your wallet first');
      return;
    }

    setError(null);

    try {
      console.log('Preparing transaction...', { recipientAddress, amount });

      // Validate recipient address
      if (!recipientAddress || !recipientAddress.startsWith('0x')) {
        console.error('Invalid address:', recipientAddress);
        throw new Error('Invalid recipient address. The payment link might be broken/old.');
      }

      // For MVP: Send native token (simulating USDC)
      // In production, this would use ERC-20 USDC contract

      console.log('Sending transaction...');
      sendTransaction({
        to: recipientAddress as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (err: any) {
      console.error('Payment error:', err);
      const errorMessage = err.message || 'Transaction failed. Please try again.';
      setError(errorMessage);
      alert(`Payment Error: ${errorMessage}`); // Force visibility
      onError(new Error(errorMessage));
    }
  };

  const handleSimulatePayment = async () => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSimulating(true);
    setError(null);

    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock transaction hash
      const mockTxHash = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;

      // Save simulated payment
      const payment = {
        id: uuidv4(),
        paymentLinkId: 'simulated',
        payerAddress: address,
        recipientAddress: recipientAddress,
        amount: amount,
        transactionHash: mockTxHash,
        timestamp: Date.now(),
        status: 'simulated' as const,
      };

      savePayment(payment, address);

      // Call success callback
      onSuccess(mockTxHash);
    } catch (err: any) {
      const errorMessage = 'Simulation failed. Please try again.';
      setError(errorMessage);
      onError(new Error(errorMessage));
    } finally {
      setIsSimulating(false);
    }
  };

  // Handle successful transaction
  if (isSuccess && hash) {
    // Save payment to history
    if (address) {
      const payment = {
        id: uuidv4(),
        paymentLinkId: 'unknown', // Would be looked up in production
        payerAddress: address,
        recipientAddress: recipientAddress,
        amount: amount,
        transactionHash: hash,
        timestamp: Date.now(),
        status: 'confirmed' as const,
      };

      try {
        savePayment(payment, address);
      } catch (err) {
        console.error('Failed to save payment:', err);
      }
    }

    onSuccess(hash);
  }

  if (!isConnected) {
    return (
      <div className="space-y-4">
        <ConnectButton variant="primary" />
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Connect your wallet to make a payment
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Real Payment Button */}
      {!isDemoMode && (
        <button
          onClick={handlePayment}
          disabled={isSending || isConfirming}
          className={`
            w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all
            ${isSending || isConfirming
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:scale-105'
            }
          `}
        >
          {isSending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </span>
          ) : isConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Confirming...
            </span>
          ) : (
            <>
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Pay ${amount} USDC
              </span>
            </>
          )}
        </button>
      )}

      {/* Demo Mode Button */}
      {isDemoMode && (
        <>
          <button
            onClick={handleSimulatePayment}
            disabled={isSimulating}
            className={`
              w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all
              ${isSimulating
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
              }
            `}
          >
            {isSimulating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Simulating...
              </span>
            ) : (
              <>
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Simulate Payment (Demo)
                </span>
              </>
            )}
          </button>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-400 text-center">
              🎭 Demo Mode Active - No real transaction will be made
            </p>
          </div>
        </>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-fade-in">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Payment Failed
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Hash Display */}
      {hash && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-fade-in">
          <p className="text-sm text-green-700 dark:text-green-400 text-center">
            Transaction submitted! Hash: {hash.slice(0, 10)}...
          </p>
        </div>
      )}
      {/* Debug/Verification Info */}
      <p className="text-xs text-center text-gray-400 font-mono">
        Sending {amount} XTZ → {recipientAddress.startsWith('0x') ? `${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}` : 'Invalid Address'}
      </p>
    </div>
  );
}
