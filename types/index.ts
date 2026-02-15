/**
 * Data Models for 1TapPay
 * 
 * These interfaces define the core data structures used throughout the application.
 */

/**
 * PaymentLink represents a created payment link
 */
export interface PaymentLink {
  id: string;                    // Unique identifier (UUID)
  username: string;              // Payee's display name
  amount: string;                // Amount in USDC (as string to avoid precision issues)
  note?: string;                 // Optional payment description
  recipientAddress: string;      // Payee's wallet address (0x...)
  url: string;                   // Full payment URL
  qrCodeData: string;           // URL encoded for QR
  createdAt: number;            // Unix timestamp
}

/**
 * Payment represents a completed payment transaction
 */
export interface Payment {
  id: string;                    // Unique identifier
  paymentLinkId: string;        // Reference to PaymentLink
  payerAddress: string;         // Payer's wallet address (0x...)
  recipientAddress: string;     // Payee's wallet address (0x...)
  amount: string;               // Amount in USDC
  transactionHash?: string;     // Blockchain tx hash (optional for demo mode)
  timestamp: number;            // Unix timestamp
  status: 'pending' | 'confirmed' | 'failed' | 'simulated';
}

/**
 * WalletState represents current wallet connection state (managed by Wagmi)
 */
export interface WalletState {
  address?: string;             // Connected wallet address
  isConnected: boolean;         // Connection status
  isConnecting: boolean;        // Loading state
  chain?: {
    id: number;
    name: string;
    unsupported?: boolean;
  };
}

/**
 * DashboardData aggregates data for dashboard display
 */
export interface DashboardData {
  paymentLinks: PaymentLink[];
  payments: Payment[];
  totalReceived: string;        // Sum of all confirmed payments
  walletAddress: string;
}

/**
 * FormData for payment link creation
 */
export interface PaymentLinkFormData {
  username: string;
  amount: string;
  note?: string;
}

/**
 * Validation rules for payment link creation
 */
export interface ValidationRules {
  username: {
    required: true;
    minLength: 3;
    maxLength: 30;
    pattern: RegExp;  // /^[a-zA-Z0-9_-]+$/
  };
  amount: {
    required: true;
    min: number;      // 0.01
    max: number;      // 1000000
    decimals: number; // 6 (USDC has 6 decimals)
  };
  note: {
    required: false;
    maxLength: 200;
  };
}

/**
 * Application configuration
 */
export interface AppConfig {
  chainId: number;                // Etherlink testnet chain ID
  chainName: string;
  rpcUrl: string;
  blockExplorer: string;
  usdcContractAddress?: string;   // For production with real USDC
  demoMode: boolean;              // Enable payment simulation
}

/**
 * Validation error structure
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Storage keys for localStorage
 */
export const STORAGE_KEYS = {
  PAYMENT_LINKS: (address: string) => `1tappay_links_${address.toLowerCase()}`,
  PAYMENTS: (address: string) => `1tappay_payments_${address.toLowerCase()}`,
} as const;

/**
 * Validation rules constant
 */
export const VALIDATION_RULES: ValidationRules = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_-]+$/,
  },
  amount: {
    required: true,
    min: 0.01,
    max: 1000000,
    decimals: 6,
  },
  note: {
    required: false,
    maxLength: 200,
  },
};
