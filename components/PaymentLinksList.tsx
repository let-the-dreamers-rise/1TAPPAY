'use client';

/**
 * PaymentLinksList Component
 * 
 * Displays all created payment links with QR codes and copy functionality.
 */

import { useState } from 'react';
import { PaymentLink } from '@/types';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { formatAmount } from '@/utils/paymentLinkGenerator';

interface PaymentLinksListProps {
  links: PaymentLink[];
}

export function PaymentLinksList({ links }: PaymentLinksListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCopyUrl = async (link: PaymentLink) => {
    try {
      const fullUrl = typeof window !== 'undefined'
        ? `${window.location.origin}${link.url}`
        : link.qrCodeData;

      await navigator.clipboard.writeText(fullUrl);
      setCopiedId(link.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      alert('Failed to copy URL. Please try again.');
    }
  };

  const toggleExpanded = (linkId: string) => {
    setExpandedId(expandedId === linkId ? null : linkId);
  };

  if (links.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-fintech p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No payment links yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create your first payment link to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-fintech p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Your Payment Links
      </h2>

      <div className="space-y-4">
        {links.map((link) => (
          <div
            key={link.id}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-primary-500 transition-all"
          >
            {/* Link Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    @{link.username}
                  </h3>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded">
                    Active
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  ${formatAmount(link.amount)} USDC
                </p>
                {link.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {link.note}
                  </p>
                )}
              </div>

              {/* QR Toggle Button */}
              <button
                onClick={() => toggleExpanded(link.id)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                title="Show QR Code"
              >
                <svg
                  className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${expandedId === link.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* URL Display */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}${link.url.split('?')[0]}`
                    : link.url.split('?')[0]}
                  <span className="text-gray-400">...</span>
                </p>
              </div>
              <button
                onClick={() => handleCopyUrl(link)}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
              >
                {copiedId === link.id ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>
                Created {new Date(link.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span>
                ID: {link.id.slice(0, 8)}...
              </span>
            </div>

            {/* QR Code (Expandable) */}
            {expandedId === link.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-center animate-fade-in">
                <QRCodeDisplay
                  url={typeof window !== 'undefined' ? `${window.location.origin}${link.url}` : link.qrCodeData}
                  size={180}
                  downloadable={true}
                  label={`@${link.username} - $${formatAmount(link.amount)}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
