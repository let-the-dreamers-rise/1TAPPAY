'use client';

/**
 * Landing Page Component
 * 
 * Professional fintech landing page showcasing 1TapPay's value proposition.
 * Includes hero, features, how it works, and demo preview sections.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@/components/ConnectButton';

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();

  // Redirect to dashboard when wallet is connected
  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

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
            <ConnectButton variant="primary" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Send global payments</span>
              <br />
              <span className="text-gray-900 dark:text-white">with a link</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Borderless payments for the internet. Create payment links, share QR codes, 
              and receive stablecoins instantly from anywhere in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ConnectButton variant="primary" />
              <a
                href="#how-it-works"
                className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-700 hover:border-primary-500 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Demo Preview */}
          <div className="mt-16 animate-slide-up">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur-3xl opacity-20"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-fintech-lg p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Why 1TapPay?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The future of global payments is here
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Instant */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-fintech-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Instant</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Payments settle in seconds on the blockchain. No waiting days for bank transfers.
              </p>
            </div>

            {/* Feature 2: Global */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-accent-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-fintech-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Global</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Send and receive payments from anyone, anywhere. No borders, no limits.
              </p>
            </div>

            {/* Feature 3: Simple */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-fintech-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Simple</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Just share a link or QR code. No complex crypto knowledge required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Connect Wallet</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect your Web3 wallet (MetaMask, Rainbow, etc.) to get started.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Create Link</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enter your username and amount to generate a unique payment link and QR code.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Get Paid</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share your link or QR code and receive instant stablecoin payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-500 to-accent-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to go global?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join the future of borderless payments. UPI for the internet.
          </p>
          <ConnectButton variant="secondary" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg"></div>
            <span className="text-xl font-bold gradient-text">1TapPay</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Global payment links • Borderless payments • Instant global pay
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            Built on Etherlink Testnet
          </p>
        </div>
      </footer>
    </main>
  );
}
