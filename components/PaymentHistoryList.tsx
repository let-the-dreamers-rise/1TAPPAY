'use client';

/**
 * PaymentHistoryList Component
 * 
 * Displays all received payments in a table format with transaction details.
 */

import { Payment } from '@/types';
import { formatAmount } from '@/utils/paymentLinkGenerator';

interface PaymentHistoryListProps {
  payments: Payment[];
}

export function PaymentHistoryList({ payments }: PaymentHistoryListProps) {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusBadge = (status: Payment['status']) => {
    const styles = {
      confirmed: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
      pending: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
      failed: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
      simulated: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    };

    const labels = {
      confirmed: 'Confirmed',
      pending: 'Pending',
      failed: 'Failed',
      simulated: 'Demo',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getBlockExplorerUrl = (txHash: string) => {
    const explorerUrl = process.env.NEXT_PUBLIC_BLOCK_EXPLORER || 'https://testnet.explorer.etherlink.com';
    return `${explorerUrl}/tx/${txHash}`;
  };

  if (payments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-fintech p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No payments yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Payments you receive will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-fintech p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Payment History
      </h2>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                From
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                Transaction
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {payment.payerAddress.slice(2, 4).toUpperCase()}
                    </div>
                    <span className="text-sm font-mono text-gray-900 dark:text-white">
                      {truncateAddress(payment.payerAddress)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${formatAmount(payment.amount)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                    USDC
                  </span>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(payment.status)}
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(payment.timestamp).toLocaleDateString()}
                  </span>
                  <br />
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(payment.timestamp).toLocaleTimeString()}
                  </span>
                </td>
                <td className="py-4 px-4">
                  {payment.transactionHash ? (
                    <a
                      href={getBlockExplorerUrl(payment.transactionHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                    >
                      {truncateAddress(payment.transactionHash)}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-600">
                      N/A
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {payment.payerAddress.slice(2, 4).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-mono text-gray-900 dark:text-white">
                    {truncateAddress(payment.payerAddress)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(payment.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {getStatusBadge(payment.status)}
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                ${formatAmount(payment.amount)} USDC
              </span>
            </div>

            {payment.transactionHash && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={getBlockExplorerUrl(payment.transactionHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                >
                  View Transaction
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
