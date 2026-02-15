'use client';

/**
 * Dashboard Page Component
 * 
 * Main dashboard interface for managing payment links and viewing payment history.
 * Protected route - redirects to home if wallet not connected.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { PaymentLink, Payment } from '@/types';
import { getPaymentLinks, getPayments } from '@/utils/storageManager';
import { ConnectButton } from '@/components/ConnectButton';
import { CreatePaymentLinkForm } from '@/components/CreatePaymentLinkForm';
import { PaymentLinksList } from '@/components/PaymentLinksList';
import { PaymentHistoryList } from '@/components/PaymentHistoryList';

export default function DashboardPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalReceived, setTotalReceived] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  // Load data when wallet is connected
  useEffect(() => {
    if (address) {
      loadData();
    }
  }, [address]);

  const loadData = () => {
    if (!address) return;

    try {
      setIsLoading(true);

      // Load payment links
      const links = getPaymentLinks(address);
      setPaymentLinks(links);

      // Load payments
      const paymentsData = getPayments(address);
      setPayments(paymentsData);

      // Calculate total received (only confirmed payments)
      const total = paymentsData
        .filter(p => p.status === 'confirmed' || p.status === 'simulated')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
      
      setTotalReceived(total.toFixed(2));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkCreated = (link: PaymentLink) => {
    // Reload data to show new link
    loadData();
  };

  // Show loading state while checking connection
  if (!isConnected || !address) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
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
            <ConnectButton variant="primary" showBalance={true} />
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your payment links and track payments
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Total Received */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-fintech p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Received
                </h3>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${totalReceived}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                USDC
              </p>
            </div>

            {/* Payment Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-fintech p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Payment Links
                </h3>
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {paymentLinks.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Active links
              </p>
            </div>

            {/* Payments Received */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-fintech p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Payments
                </h3>
                <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {payments.filter(p => p.status === 'confirmed' || p.status === 'simulated').length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Completed
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Create Payment Link */}
            <div>
              <CreatePaymentLinkForm onLinkCreated={handleLinkCreated} />
            </div>

            {/* Right Column - Payment Links List */}
            <div>
              <PaymentLinksList links={paymentLinks} />
            </div>
          </div>

          {/* Payment History */}
          <div className="mt-8">
            <PaymentHistoryList payments={payments} />
          </div>
        </div>
      </div>
    </main>
  );
}
