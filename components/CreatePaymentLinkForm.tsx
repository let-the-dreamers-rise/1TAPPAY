'use client';

/**
 * CreatePaymentLinkForm Component
 * 
 * Form for creating new payment links with validation and error handling.
 */

import { useState, FormEvent } from 'react';
import { useAccount } from 'wagmi';
import { PaymentLink } from '@/types';
import { 
  generatePaymentLink, 
  validatePaymentLinkForm 
} from '@/utils/paymentLinkGenerator';
import { savePaymentLink, StorageError } from '@/utils/storageManager';

interface CreatePaymentLinkFormProps {
  onLinkCreated: (link: PaymentLink) => void;
}

export function CreatePaymentLinkForm({ onLinkCreated }: CreatePaymentLinkFormProps) {
  const { address } = useAccount();
  
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors([]);
    setStorageError(null);

    // Validate wallet connection
    if (!address) {
      setStorageError('Please connect your wallet first');
      return;
    }

    // Validate form data
    const validation = validatePaymentLinkForm(username, amount, note);
    
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate payment link
      const paymentLink = generatePaymentLink(username, amount, address, note || undefined);

      // Save to localStorage
      savePaymentLink(paymentLink, address);

      // Call success callback
      onLinkCreated(paymentLink);

      // Reset form
      setUsername('');
      setAmount('');
      setNote('');
      setErrors([]);
    } catch (error) {
      if (error instanceof StorageError) {
        setStorageError(error.message);
      } else {
        setStorageError('Failed to create payment link. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(e => e.field === field)?.message;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-fintech p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Create Payment Link
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g., john-doe"
            className={`
              w-full px-4 py-3 rounded-lg border transition-all
              ${getFieldError('username') 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
              }
              bg-white dark:bg-gray-900 text-gray-900 dark:text-white
              focus:outline-none focus:ring-2
            `}
            disabled={isSubmitting}
          />
          {getFieldError('username') && (
            <p className="mt-1 text-sm text-red-500">{getFieldError('username')}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            3-30 characters, letters, numbers, hyphens, and underscores only
          </p>
        </div>

        {/* Amount Field */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount (USDC) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="10.00"
            step="0.01"
            min="0.01"
            max="1000000"
            className={`
              w-full px-4 py-3 rounded-lg border transition-all
              ${getFieldError('amount') 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
              }
              bg-white dark:bg-gray-900 text-gray-900 dark:text-white
              focus:outline-none focus:ring-2
            `}
            disabled={isSubmitting}
          />
          {getFieldError('amount') && (
            <p className="mt-1 text-sm text-red-500">{getFieldError('amount')}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Minimum: 0.01 USDC, Maximum: 1,000,000 USDC
          </p>
        </div>

        {/* Note Field */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Note (Optional)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Payment for services..."
            rows={3}
            maxLength={200}
            className={`
              w-full px-4 py-3 rounded-lg border transition-all resize-none
              ${getFieldError('note') 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
              }
              bg-white dark:bg-gray-900 text-gray-900 dark:text-white
              focus:outline-none focus:ring-2
            `}
            disabled={isSubmitting}
          />
          {getFieldError('note') && (
            <p className="mt-1 text-sm text-red-500">{getFieldError('note')}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {note.length}/200 characters
          </p>
        </div>

        {/* Storage Error */}
        {storageError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{storageError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !address}
          className={`
            w-full px-6 py-3 rounded-lg font-semibold transition-all
            ${isSubmitting || !address
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:scale-105'
            }
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating...
            </span>
          ) : (
            'Generate Payment Link'
          )}
        </button>

        {!address && (
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Connect your wallet to create payment links
          </p>
        )}
      </form>
    </div>
  );
}
