'use client';

/**
 * ConnectButton Component
 * 
 * Custom wallet connection button with network warning and balance display.
 * Built on top of RainbowKit's ConnectButton with custom styling.
 */

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { etherlinkTestnet } from '@/config/wagmi';

interface ConnectButtonProps {
  variant?: 'primary' | 'secondary';
  showBalance?: boolean;
}

export function ConnectButton({ variant = 'primary', showBalance = false }: ConnectButtonProps) {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  // Check if connected to wrong network
  const isWrongNetwork = chain && chain.id !== etherlinkTestnet.id;

  return (
    <div className="flex flex-col items-end gap-2">
      <RainbowConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className={`
                        px-6 py-3 rounded-lg font-semibold transition-all duration-200
                        ${variant === 'primary'
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:scale-105'
                          : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="px-6 py-3 rounded-lg font-semibold bg-error text-white hover:bg-red-600 transition-all"
                    >
                      Wrong Network
                    </button>
                  );
                }

                return (
                  <div className="flex items-center gap-3">
                    {showBalance && balance && (
                      <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium">
                          {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 20,
                            height: 20,
                            borderRadius: 999,
                            overflow: 'hidden',
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 20, height: 20 }}
                            />
                          )}
                        </div>
                      )}
                      <span className="text-sm font-medium">{chain.name}</span>
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                      <span className="text-sm font-medium">
                        {account.displayName}
                      </span>
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </RainbowConnectButton.Custom>

      {/* Network Warning */}
      {isWrongNetwork && (
        <div className="animate-fade-in">
          <div className="px-4 py-2 bg-warning/10 border border-warning rounded-lg">
            <p className="text-sm text-warning font-medium">
              ⚠️ Please switch to Etherlink Testnet
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
