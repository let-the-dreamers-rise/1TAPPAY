# Design Document: 1TapPay

## Overview

1TapPay is a Web3 payment platform built on Next.js that enables global stablecoin payments through shareable payment links and QR codes. The system provides a familiar UPI-like payment experience while leveraging blockchain technology for borderless, instant payments.

### Key Design Principles

1. **Simplicity First**: Hide blockchain complexity from users - they should feel like they're using Stripe or PayPal
2. **Production Quality**: Every component should look and feel like a funded startup product
3. **Progressive Enhancement**: Core functionality works immediately, advanced features enhance the experience
4. **Mobile-First**: Design for mobile scanning and payments, scale up to desktop

### Technology Stack

- **Frontend Framework**: Next.js 14 with App Router for modern React patterns and optimal performance
- **Styling**: TailwindCSS with custom fintech design system
- **Web3 Integration**: RainbowKit + Wagmi v2 + ethers.js v6 for wallet connectivity
- **Blockchain**: Etherlink testnet (EVM-compatible)
- **QR Generation**: qrcode.react or next-qrcode for dynamic QR code generation
- **State Management**: React Context for wallet state, localStorage for payment link persistence (MVP)
- **Deployment**: Vercel with automatic CI/CD

## Architecture

### System Architecture

The application follows a client-side architecture with blockchain integration:

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js Application                        │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   Landing    │  │  Dashboard   │  │  Payment     │ │ │
│  │  │     Page     │  │     Page     │  │    Page      │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │         Wallet Context (RainbowKit + Wagmi)        │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │         Payment Link Storage (localStorage)        │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           │ Web3 Provider                    │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Wallet (MetaMask, etc.)                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ JSON-RPC
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Etherlink Testnet                           │
│                  (EVM-Compatible Blockchain)                 │
└─────────────────────────────────────────────────────────────┘
```

### Application Flow

1. **Landing → Connect**: User visits landing page and connects wallet via RainbowKit
2. **Dashboard**: After connection, user is redirected to dashboard showing payment links and history
3. **Create Link**: User fills form (username, amount, optional note) to generate payment link
4. **Share Link**: System generates unique URL and QR code for sharing
5. **Payment**: Payer visits link, connects wallet, and sends stablecoin transaction
6. **Confirmation**: Transaction confirms on blockchain, both parties see updated history

### Routing Structure

```
/                          → Landing page (public)
/dashboard                 → Dashboard (requires wallet connection)
/pay/[username]/[amount]   → Payment page (public, prompts wallet connection)
```

## Components and Interfaces

### Core Components

#### 1. WalletProvider Component

Wraps the application with RainbowKit and Wagmi providers for wallet connectivity.

```typescript
interface WalletProviderProps {
  children: React.ReactNode;
}

// Configures RainbowKit with Etherlink testnet
// Provides wallet connection state to entire app
```

#### 2. ConnectButton Component

Displays wallet connection button with current connection state.

```typescript
interface ConnectButtonProps {
  variant?: 'primary' | 'secondary';
  showBalance?: boolean;
}

// Uses RainbowKit's ConnectButton with custom styling
// Shows: Connect | Address + Balance | Disconnect
```

#### 3. LandingPage Component

Marketing page with hero, features, and call-to-action.

```typescript
interface LandingPageProps {
  // No props - static content
}

// Sections: Hero, Features, How It Works, Demo Preview
// Includes ConnectButton that redirects to /dashboard on success
```

#### 4. Dashboard Component

Main application interface for managing payment links.

```typescript
interface DashboardProps {
  // Reads wallet address from Wagmi hooks
}

// Displays:
// - CreatePaymentLinkForm
// - PaymentLinksList
// - PaymentHistoryList
// - TotalReceivedAmount
```

#### 5. CreatePaymentLinkForm Component

Form for generating new payment links.

```typescript
interface CreatePaymentLinkFormProps {
  onLinkCreated: (link: PaymentLink) => void;
}

interface FormData {
  username: string;
  amount: string;
  note?: string;
}

// Validates input, generates unique ID, creates PaymentLink
// Stores to localStorage and calls onLinkCreated callback
```

#### 6. PaymentLinksList Component

Displays all created payment links with QR codes.

```typescript
interface PaymentLinksListProps {
  links: PaymentLink[];
}

// Shows each link with:
// - Username, Amount, Note
// - Full URL (copyable)
// - QR Code with download button
// - Creation timestamp
```

#### 7. PaymentPage Component

Page where payers complete transactions.

```typescript
interface PaymentPageProps {
  username: string;
  amount: string;
}

// Displays:
// - Payee username
// - Amount in USDC
// - Optional note
// - QR code
// - Pay button (connects wallet if needed)
// - Success animation after payment
```

#### 8. PayButton Component

Handles payment transaction execution.

```typescript
interface PayButtonProps {
  recipientAddress: string;
  amount: string;
  onSuccess: (txHash: string) => void;
  onError: (error: Error) => void;
  demoMode?: boolean;
}

// Uses Wagmi's useSendTransaction hook
// Sends USDC transfer transaction
// Shows loading state during confirmation
// Triggers success/error callbacks
```

#### 9. QRCodeDisplay Component

Renders QR code for payment links.

```typescript
interface QRCodeDisplayProps {
  url: string;
  size?: number;
  downloadable?: boolean;
}

// Generates QR code using qrcode.react
// Provides download functionality
// Styled with fintech aesthetic
```

#### 10. PaymentHistoryList Component

Displays received payments.

```typescript
interface PaymentHistoryListProps {
  payments: Payment[];
}

// Shows each payment:
// - Payer address (truncated)
// - Amount
// - Timestamp
// - Transaction hash (link to explorer)
```

#### 11. SuccessAnimation Component

Animated success feedback after payment.

```typescript
interface SuccessAnimationProps {
  message: string;
  onComplete?: () => void;
}

// Smooth animation (checkmark, confetti, or pulse)
// Auto-dismisses after 3 seconds
// Calls onComplete callback
```

### Utility Functions

#### Payment Link Generator

```typescript
function generatePaymentLink(
  username: string,
  amount: string,
  walletAddress: string,
  note?: string
): PaymentLink {
  // Creates unique ID (UUID or timestamp-based)
  // Constructs URL: /pay/{username}/{amount}
  // Returns PaymentLink object
}
```

#### Storage Manager

```typescript
interface StorageManager {
  savePaymentLink(link: PaymentLink): void;
  getPaymentLinks(walletAddress: string): PaymentLink[];
  savePayment(payment: Payment): void;
  getPayments(walletAddress: string): Payment[];
  clearStorage(): void;
}

// Wraps localStorage with JSON serialization
// Keys: `links_${walletAddress}`, `payments_${walletAddress}`
```

#### Transaction Helper

```typescript
async function sendStablecoinPayment(
  recipientAddress: string,
  amount: string,
  signer: ethers.Signer
): Promise<string> {
  // For MVP: Send native token (simulating USDC)
  // Production: Use ERC-20 USDC contract
  // Returns transaction hash
}
```

#### Demo Mode Handler

```typescript
function simulatePayment(
  paymentLink: PaymentLink,
  payerAddress: string
): Payment {
  // Creates mock Payment object
  // Generates fake transaction hash
  // Saves to payment history
  // Returns Payment for UI update
}
```

## Data Models

### PaymentLink

Represents a created payment link.

```typescript
interface PaymentLink {
  id: string;                    // Unique identifier (UUID)
  username: string;              // Payee's display name
  amount: string;                // Amount in USDC (as string to avoid precision issues)
  note?: string;                 // Optional payment description
  recipientAddress: string;      // Payee's wallet address (0x...)
  url: string;                   // Full payment URL
  qrCodeData: string;           // URL encoded for QR
  createdAt: number;            // Unix timestamp
}
```

### Payment

Represents a completed payment transaction.

```typescript
interface Payment {
  id: string;                    // Unique identifier
  paymentLinkId: string;        // Reference to PaymentLink
  payerAddress: string;         // Payer's wallet address (0x...)
  recipientAddress: string;     // Payee's wallet address (0x...)
  amount: string;               // Amount in USDC
  transactionHash?: string;     // Blockchain tx hash (optional for demo mode)
  timestamp: number;            // Unix timestamp
  status: 'pending' | 'confirmed' | 'failed' | 'simulated';
}
```

### WalletState

Represents current wallet connection state (managed by Wagmi).

```typescript
interface WalletState {
  address?: string;             // Connected wallet address
  isConnected: boolean;         // Connection status
  isConnecting: boolean;        // Loading state
  chain?: {
    id: number;
    name: string;
    unsupported?: boolean;
  };
}
```

### DashboardData

Aggregated data for dashboard display.

```typescript
interface DashboardData {
  paymentLinks: PaymentLink[];
  payments: Payment[];
  totalReceived: string;        // Sum of all confirmed payments
  walletAddress: string;
}
```

### FormValidation

Validation rules for payment link creation.

```typescript
interface ValidationRules {
  username: {
    required: true;
    minLength: 3;
    maxLength: 30;
    pattern: /^[a-zA-Z0-9_-]+$/;  // Alphanumeric, underscore, hyphen
  };
  amount: {
    required: true;
    min: 0.01;
    max: 1000000;
    decimals: 6;                   // USDC has 6 decimals
  };
  note: {
    required: false;
    maxLength: 200;
  };
}
```

### Configuration

Environment and blockchain configuration.

```typescript
interface AppConfig {
  chainId: number;                // Etherlink testnet chain ID
  chainName: string;
  rpcUrl: string;
  blockExplorer: string;
  usdcContractAddress?: string;   // For production with real USDC
  demoMode: boolean;              // Enable payment simulation
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Payment Link URL Format

*For any* valid payment link created with a username and amount, the generated URL should follow the format `/pay/{username}/{amount}` where username and amount match the input values.

**Validates: Requirements 4.3**

### Property 2: Payment Link Data Persistence

*For any* payment link created with username, amount, wallet address, and optional note, storing the link and then retrieving it should return an object containing all the original data fields (username, amount, recipientAddress, note, and unique identifier).

**Validates: Requirements 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**

### Property 3: Username Validation

*For any* form submission with an empty or missing username, the payment link creation should be rejected and no link should be created.

**Validates: Requirements 4.1**

### Property 4: Amount Validation

*For any* form submission with an amount that is zero, negative, or missing, the payment link creation should be rejected and no link should be created.

**Validates: Requirements 4.2**

### Property 5: Payment Link Display Completeness

*For any* created payment link, the dashboard should display all payment links including the newly created one, and each displayed link should show the username, amount, URL, and QR code.

**Validates: Requirements 3.3, 4.5**

### Property 6: Optional Note Handling

*For any* payment link created with a note, retrieving that link should return the note exactly as provided; for any link created without a note, the note field should be absent or empty.

**Validates: Requirements 4.6, 6.7**

### Property 7: Total Amount Calculation

*For any* set of confirmed payments, the displayed total amount received should equal the sum of all individual payment amounts.

**Validates: Requirements 3.5, 9.6**

### Property 8: Payment Page Data Display

*For any* payment link URL visited, the payment page should display both the payee username and the payment amount exactly as specified in the URL parameters.

**Validates: Requirements 6.1, 6.2**

### Property 9: Wallet Connection State Display

*For any* connected wallet, the system should display the wallet address and the current network name.

**Validates: Requirements 2.3, 2.4**

### Property 10: Wrong Network Warning

*For any* wallet connected to a network other than Etherlink testnet, the system should display a network warning to the user.

**Validates: Requirements 2.5**

### Property 11: Balance Display

*For any* connected wallet where balance display is implemented, the system should show the user's stablecoin balance.

**Validates: Requirements 2.6**

### Property 12: QR Code Generation

*For any* created payment link, a QR code encoding the payment URL should be automatically generated and associated with that link.

**Validates: Requirements 8.1**

### Property 13: QR Code Display

*For any* payment link, the QR code should be displayed both on the dashboard in the payment links list and on the payment page when the link is visited.

**Validates: Requirements 8.2, 8.3**

### Property 14: QR Code Download Functionality

*For any* QR code displayed, a download button should be present that allows the user to download the QR code as an image file.

**Validates: Requirements 8.4**

### Property 15: Transaction Amount Transfer

*For any* payment transaction initiated with a specific amount, the blockchain transaction should transfer exactly that amount from the payer's wallet to the payee's wallet address.

**Validates: Requirements 7.2**

### Property 16: Transaction Hash Recording

*For any* successful payment transaction, the system should record and store the transaction hash returned by the blockchain.

**Validates: Requirements 7.5**

### Property 17: Transaction Error Handling

*For any* failed payment transaction, the system should display an error message to the payer indicating the failure.

**Validates: Requirements 7.4**

### Property 18: Payment History Completeness

*For any* received payment, the payment history should display an entry containing the payer's wallet address, the amount, the timestamp, and the transaction hash (if available).

**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

### Property 19: Simulated Payment Recording

*For any* simulated payment in demo mode, the payment should be recorded in the payment history with a status indicating it was simulated.

**Validates: Requirements 11.3**

### Property 20: Responsive Rendering

*For any* page in the application, the layout should render correctly and remain usable at mobile viewport widths (320px to 768px) and desktop widths (1024px and above).

**Validates: Requirements 1.7, 10.5**

## Error Handling

### Wallet Connection Errors

**Scenario**: User rejects wallet connection or connection fails

**Handling**:
- Display user-friendly error message: "Wallet connection failed. Please try again."
- Allow user to retry connection
- Do not block access to landing page
- Log error details to console for debugging

**Scenario**: User's wallet is locked

**Handling**:
- Display message: "Please unlock your wallet to continue"
- Provide retry button
- Show wallet icon with lock indicator

### Network Errors

**Scenario**: User is connected to wrong network

**Handling**:
- Display prominent warning banner: "Please switch to Etherlink Testnet"
- Provide "Switch Network" button that triggers network change via wallet
- Disable payment functionality until correct network is selected
- Show current network name and required network name

**Scenario**: RPC connection fails

**Handling**:
- Display error: "Unable to connect to blockchain. Please check your connection."
- Retry connection automatically (max 3 attempts)
- Provide manual retry button
- Fall back to demo mode if configured

### Transaction Errors

**Scenario**: User rejects transaction

**Handling**:
- Display message: "Transaction cancelled"
- Return to payment page in ready state
- Do not record failed payment
- Allow user to retry

**Scenario**: Insufficient balance

**Handling**:
- Check balance before initiating transaction
- Display error: "Insufficient balance. You need {amount} USDC but have {balance} USDC"
- Provide link to testnet faucet
- Do not submit transaction

**Scenario**: Transaction fails on blockchain

**Handling**:
- Display error: "Transaction failed. Please try again."
- Show transaction hash link to block explorer for investigation
- Log error details
- Allow user to retry
- Do not record failed payment

**Scenario**: Transaction timeout

**Handling**:
- Display message: "Transaction is taking longer than expected. Check your wallet."
- Continue waiting for confirmation (up to 5 minutes)
- Provide option to check transaction status manually
- Show transaction hash if available

### Form Validation Errors

**Scenario**: Invalid username format

**Handling**:
- Display inline error: "Username must be 3-30 characters and contain only letters, numbers, hyphens, and underscores"
- Highlight invalid field in red
- Prevent form submission
- Show valid example: "e.g., john-doe, alice_123"

**Scenario**: Invalid amount

**Handling**:
- Display inline error for specific issue:
  - "Amount is required"
  - "Amount must be greater than 0"
  - "Amount cannot exceed 1,000,000 USDC"
  - "Amount can have maximum 6 decimal places"
- Highlight invalid field
- Prevent form submission

**Scenario**: Note too long

**Handling**:
- Display character counter: "{current}/200 characters"
- Display error when exceeded: "Note cannot exceed 200 characters"
- Prevent form submission when over limit

### Storage Errors

**Scenario**: localStorage is full

**Handling**:
- Display error: "Storage limit reached. Please clear old payment links."
- Provide "Clear Old Links" button
- Allow user to manually delete specific links
- Suggest exporting data before clearing

**Scenario**: localStorage is disabled

**Handling**:
- Display warning: "Browser storage is disabled. Payment links will not persist."
- Offer to continue in session-only mode
- Suggest enabling localStorage in browser settings
- Consider alternative storage (future: backend API)

### QR Code Errors

**Scenario**: QR code generation fails

**Handling**:
- Display error: "Unable to generate QR code"
- Show payment link as copyable text
- Log error details
- Allow user to retry generation

**Scenario**: QR code download fails

**Handling**:
- Display error: "Download failed. Please try again."
- Provide alternative: "Right-click and save image"
- Retry download automatically once

### General Error Boundaries

**Component Error Boundary**:
- Wrap each major component in error boundary
- Display fallback UI: "Something went wrong. Please refresh the page."
- Log error to console
- Provide "Refresh" button
- Do not crash entire application

**Page-Level Error Handling**:
- 404 for invalid payment links: "Payment link not found"
- 500 for server errors: "Service temporarily unavailable"
- Network offline: "You appear to be offline. Please check your connection."

## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific scenarios and property-based tests for universal correctness guarantees. This ensures both concrete functionality and general system behavior are validated.

### Property-Based Testing

Property-based testing validates that universal properties hold across many randomly generated inputs. This approach catches edge cases that might be missed by example-based tests.

**Library**: Use `@fast-check/vitest` for TypeScript/JavaScript property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with: `Feature: 1tap-pay, Property {N}: {property description}`
- Tests should generate random valid inputs within domain constraints

**Property Test Coverage**:

Each correctness property from the design document must have a corresponding property-based test:

1. **Property 1 - URL Format**: Generate random usernames and amounts, verify URL format
2. **Property 2 - Data Persistence**: Generate random payment links, test storage round-trip
3. **Property 3 - Username Validation**: Generate invalid usernames (empty, too short, special chars), verify rejection
4. **Property 4 - Amount Validation**: Generate invalid amounts (zero, negative, too large), verify rejection
5. **Property 5 - Display Completeness**: Generate multiple payment links, verify all appear in dashboard
6. **Property 6 - Note Handling**: Generate links with and without notes, verify correct storage/retrieval
7. **Property 7 - Total Calculation**: Generate random payment sets, verify sum is correct
8. **Property 8 - Payment Page Display**: Generate random payment links, verify data displays correctly
9. **Property 9 - Wallet State Display**: Test with various wallet addresses and networks
10. **Property 10 - Network Warning**: Test with various non-Etherlink networks, verify warning appears
11. **Property 11 - Balance Display**: Test with various balance values, verify display
12. **Property 12 - QR Generation**: Generate random payment links, verify QR codes are created
13. **Property 13 - QR Display**: Verify QR codes appear in both dashboard and payment page
14. **Property 14 - QR Download**: Test download functionality for various QR codes
15. **Property 15 - Transaction Amount**: Test transactions with various amounts, verify correct transfer
16. **Property 16 - Transaction Hash**: Test successful transactions, verify hash is recorded
17. **Property 17 - Error Handling**: Test failed transactions, verify error messages
18. **Property 18 - History Completeness**: Generate random payments, verify all fields display
19. **Property 19 - Simulated Payments**: Test demo mode payments, verify recording
20. **Property 20 - Responsive Rendering**: Test various viewport sizes, verify layout correctness

### Unit Testing

Unit tests validate specific examples, edge cases, and integration points. They complement property tests by testing concrete scenarios and component interactions.

**Library**: Vitest with React Testing Library for component tests

**Focus Areas**:

**Component Tests**:
- `ConnectButton`: Renders correctly, handles click events, shows connection states
- `CreatePaymentLinkForm`: Form submission, validation messages, success callbacks
- `PaymentPage`: Displays payment info, handles wallet connection, transaction flow
- `QRCodeDisplay`: Renders QR code, download functionality
- `SuccessAnimation`: Animation triggers, auto-dismiss, callback execution

**Integration Tests**:
- End-to-end flow: Create link → Visit payment page → Complete payment → View history
- Wallet connection → Dashboard access → Create link → Disconnect
- Demo mode: Simulate payment → Verify history update → Check no blockchain call

**Edge Cases**:
- Empty payment link list
- Single payment vs. multiple payments
- Very long usernames (at max length)
- Very large amounts (at max value)
- Very small amounts (minimum value)
- Special characters in notes
- Rapid form submissions
- Concurrent payment link creation

**Error Conditions**:
- Network disconnection during transaction
- Wallet rejection of transaction
- Invalid payment link URLs
- Corrupted localStorage data
- Missing environment variables

### Test Organization

```
tests/
├── unit/
│   ├── components/
│   │   ├── ConnectButton.test.tsx
│   │   ├── CreatePaymentLinkForm.test.tsx
│   │   ├── PaymentPage.test.tsx
│   │   ├── QRCodeDisplay.test.tsx
│   │   └── SuccessAnimation.test.tsx
│   ├── utils/
│   │   ├── paymentLinkGenerator.test.ts
│   │   ├── storageManager.test.ts
│   │   └── transactionHelper.test.ts
│   └── integration/
│       ├── paymentFlow.test.tsx
│       └── demoMode.test.tsx
└── properties/
    ├── paymentLink.properties.test.ts
    ├── validation.properties.test.ts
    ├── storage.properties.test.ts
    ├── transaction.properties.test.ts
    └── display.properties.test.ts
```

### Testing Best Practices

1. **Mock Blockchain Interactions**: Use Wagmi's mock connectors for wallet testing
2. **Isolate Components**: Test components in isolation with mocked dependencies
3. **Test User Flows**: Integration tests should mirror actual user journeys
4. **Accessibility**: Include tests for keyboard navigation and screen reader support
5. **Performance**: Test with large datasets (100+ payment links, 1000+ payments)
6. **Browser Compatibility**: Test in Chrome, Firefox, Safari, and mobile browsers
7. **Responsive Design**: Test at breakpoints: 320px, 768px, 1024px, 1920px

### Continuous Integration

- Run all tests on every commit
- Require 80%+ code coverage for merge
- Run property tests with 1000 iterations in CI (vs. 100 locally)
- Test deployment preview on Vercel before merge
- Run E2E tests against deployed preview

### Manual Testing Checklist

Before release, manually verify:
- [ ] Wallet connection works with MetaMask, Rainbow, Coinbase Wallet
- [ ] Payment flow completes successfully on Etherlink testnet
- [ ] QR codes scan correctly on mobile devices
- [ ] UI looks professional on iPhone, Android, desktop
- [ ] All animations are smooth (60fps)
- [ ] Error messages are clear and helpful
- [ ] Demo mode works without blockchain connection
- [ ] Application loads quickly (<3s on 3G)
- [ ] No console errors or warnings
- [ ] Responsive design works at all breakpoints
