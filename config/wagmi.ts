/**
 * Wagmi and RainbowKit Configuration
 * 
 * Configures Web3 wallet connectivity with Etherlink testnet
 */

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

/**
 * Etherlink Testnet Chain Configuration
 */
export const etherlinkTestnet = defineChain({
  id: 128123,
  name: 'Etherlink Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'XTZ',
    symbol: 'XTZ',
  },
  rpcUrls: {
    default: {
      http: ['https://node.ghostnet.etherlink.com'],
    },
    public: {
      http: ['https://node.ghostnet.etherlink.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherlink Explorer',
      url: 'https://testnet.explorer.etherlink.com',
    },
  },
  testnet: true,
});

/**
 * Wagmi Configuration
 */
export const config = getDefaultConfig({
  appName: '1TapPay',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [etherlinkTestnet],
  ssr: true, // Enable server-side rendering support
});
