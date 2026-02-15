'use client';

/**
 * Payment Page Component
 * 
 * Public page where payers complete transactions.
 * Displays payment details, QR code, and payment button.
 */

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { PayButton } from '@/components/PayButton';
import { SuccessAnimation } from '@/components/SuccessAnimation';
import { formatAmount } from '@/utils/paymentLinkGenerator';

export default function PaymentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { isConnected } = useAccount();

  const username = decodeURIComponent(params.username as string);
  const amount = decodeURIComponent(params.amount as string);
  const walletAddress = searchParams.get('address');

  // Use wallet address from URL if available, otherwise fallback to username (for demo/legacy)
  const recipientAddress = walletAddress || username;

  const [showSuccess, setShowSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Get full URL for QR code
  const fullUrl = typeof window !== 'undefined'
    ? window.location.href
    : '';

  const handlePaymentSuccess = (transactionHash: string) => {
    setTxHash(transactionHash);
    setShowSuccess(true);
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    // Error is handled in PayButton component
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <SuccessAnimation
          message="Payment sent successfully!"
          onComplete={() => {
            // Optionally redirect or reset
          }}
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg"></div>
              <span className="text-xl font-bold gradient-text">1TapPay</span>
            </div>
            <a
              href="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </nav>

      {/* Payment Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Payment Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-fintech-lg p-8 border border-gray-200 dark:border-gray-700 animate-slide-up">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Pay @{username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                You're about to send a payment
              </p>
            </div>

            {/* Amount Display */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-900 rounded-2xl p-8 mb-8 text-center border border-primary-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Amount
              </p>
              <p className="text-5xl font-bold gradient-text mb-2">
                ${formatAmount(amount)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                USDC on Etherlink Testnet
              </p>
            </div>

            {/* QR Code */}
            <div className="mb-8 flex justify-center">
              <QRCodeDisplay
                url={fullUrl}
                size={200}
                downloadable={false}
              />
            </div>

            {/* Payment Button */}
            <div className="mb-6">
              <PayButton
                recipientAddress={recipientAddress}
                amount={amount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>

            {/* Info */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isConnected ? (
                  <>
                    Click the button above to complete the payment
                  </>
                ) : (
                  <>
                    Connect your wallet to continue
                  </>
                )}
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    Secure Payment
                  </p>
                  <p>
                    Your payment is secured by blockchain technology.
                    Transactions are irreversible once confirmed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by <span className="font-semibold gradient-text">1TapPay</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Global payment links • Borderless payments • Instant global pay
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
