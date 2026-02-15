# Implementation Plan: 1TapPay

## Overview

This implementation plan breaks down the 1TapPay Web3 payment platform into incremental coding tasks. The approach follows a bottom-up strategy: set up infrastructure first, build core components, integrate blockchain functionality, and finally polish the UI. Each task builds on previous work to ensure no orphaned code.

## Tasks

- [x] 1. Initialize Next.js project with Web3 infrastructure
  - Create Next.js 14 project with TypeScript and App Router
  - Install dependencies: RainbowKit, Wagmi v2, ethers.js v6, TailwindCSS, qrcode.react
  - Configure TailwindCSS with fintech design tokens (colors, typography, spacing)
  - Set up Etherlink testnet configuration in Wagmi
  - Create environment variables template (.env.example)
  - _Requirements: 12.4_

- [x] 2. Implement data models and storage layer
  - [x] 2.1 Create TypeScript interfaces for PaymentLink, Payment, WalletState, DashboardData
    - Define all data models in `types/index.ts`
    - Include validation rules interface
    - _Requirements: 4.4, 5.3, 5.4, 5.5, 5.6, 7.5, 9.2, 9.3, 9.4_
  
  - [x] 2.2 Implement StorageManager utility for localStorage operations
    - Create `utils/storageManager.ts` with save/retrieve functions
    - Implement JSON serialization/deserialization
    - Add wallet-address-scoped storage keys
    - Include error handling for storage quota and disabled localStorage
    - _Requirements: 5.1, 5.2_
  
  - [x]* 2.3 Write property test for payment link storage persistence
    - **Property 2: Payment Link Data Persistence**
    - **Validates: Requirements 4.4, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6**
  
  - [x]* 2.4 Write unit tests for StorageManager edge cases
    - Test localStorage full scenario
    - Test localStorage disabled scenario
    - Test corrupted data handling
    - _Requirements: 5.1, 5.2_

- [x] 3. Set up Web3 wallet integration
  - [x] 3.1 Create WalletProvider component with RainbowKit and Wagmi configuration
    - Configure Etherlink testnet chain
    - Set up RainbowKit theme matching fintech design
    - Wrap app in `app/layout.tsx`
    - _Requirements: 2.1, 2.2_
  
  - [x] 3.2 Create custom ConnectButton component
    - Build on RainbowKit's ConnectButton with custom styling
    - Display wallet address, network name, and balance
    - Add network warning for non-Etherlink networks
    - _Requirements: 1.2, 2.3, 2.4, 2.5, 2.6_
  
  - [x]* 3.3 Write property tests for wallet state display
    - **Property 9: Wallet Connection State Display**
    - **Property 10: Wrong Network Warning**
    - **Property 11: Balance Display**
    - **Validates: Requirements 2.3, 2.4, 2.5, 2.6**
  
  - [x]* 3.4 Write unit tests for ConnectButton component
    - Test rendering in disconnected state
    - Test rendering in connected state
    - Test network warning display
    - _Requirements: 2.3, 2.4, 2.5_

- [x] 4. Build landing page
  - [x] 4.1 Create landing page component at `app/page.tsx`
    - Implement hero section with tagline "Send global payments with a link"
    - Add features section (instant, global, simple)
    - Add "How it works" section with 3-step flow
    - Add demo preview section
    - Include ConnectButton with redirect to /dashboard on success
    - Use TailwindCSS for minimal fintech styling
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 10.7_
  
  - [x] 4.2 Implement responsive design for landing page
    - Add mobile-first responsive breakpoints
    - Test at 320px, 768px, 1024px, 1920px widths
    - Ensure hero section stacks properly on mobile
    - _Requirements: 1.7, 10.5_
  
  - [x]* 4.3 Write property test for responsive rendering
    - **Property 20: Responsive Rendering**
    - **Validates: Requirements 1.7, 10.5**
  
  - [x]* 4.4 Write unit tests for landing page content
    - Test hero section contains required tagline
    - Test features section is present
    - Test "How it works" section is present
    - Test messaging includes "Global payment links", "Borderless payments", etc.
    - _Requirements: 1.1, 1.3, 1.4, 10.7_

- [ ] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement payment link creation functionality
  - [x] 6.1 Create payment link generator utility
    - Implement `utils/paymentLinkGenerator.ts`
    - Generate unique IDs (UUID or timestamp-based)
    - Create URL in format `/pay/{username}/{amount}`
    - Generate QR code data
    - _Requirements: 4.3, 4.4_
  
  - [x] 6.2 Create CreatePaymentLinkForm component
    - Build form with username, amount, and optional note fields
    - Implement inline validation (username format, amount > 0)
    - Display validation errors
    - Call payment link generator on submit
    - Save to localStorage via StorageManager
    - Trigger callback on successful creation
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [x]* 6.3 Write property tests for payment link creation
    - **Property 1: Payment Link URL Format**
    - **Property 3: Username Validation**
    - **Property 4: Amount Validation**
    - **Property 6: Optional Note Handling**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.6**
  
  - [x]* 6.4 Write unit tests for form validation edge cases
    - Test username at min/max length boundaries
    - Test amount at min/max value boundaries
    - Test special characters in username
    - Test note at max length
    - Test rapid form submissions
    - _Requirements: 4.1, 4.2, 4.6_

- [x] 7. Build QR code functionality
  - [x] 7.1 Create QRCodeDisplay component
    - Use qrcode.react to render QR codes
    - Accept URL, size, and downloadable props
    - Implement download functionality (canvas to blob to download)
    - Style with UPI/PayPal inspired design
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x]* 7.2 Write property tests for QR code generation and display
    - **Property 12: QR Code Generation**
    - **Property 13: QR Code Display**
    - **Property 14: QR Code Download Functionality**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**
  
  - [x]* 7.3 Write unit tests for QR code download
    - Test download button click triggers download
    - Test download with various URL lengths
    - Test error handling for download failures
    - _Requirements: 8.5_

- [x] 8. Create dashboard interface
  - [x] 8.1 Create Dashboard page component at `app/dashboard/page.tsx`
    - Protect route with wallet connection check (redirect to / if not connected)
    - Retrieve payment links from localStorage for connected wallet
    - Retrieve payment history from localStorage
    - Calculate total received amount
    - Display CreatePaymentLinkForm
    - Display PaymentLinksList
    - Display PaymentHistoryList
    - Display total received amount
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 5.2_
  
  - [x] 8.2 Create PaymentLinksList component
    - Display all payment links in a list/grid
    - Show username, amount, note, URL (copyable), QR code
    - Include QRCodeDisplay for each link
    - Add copy-to-clipboard functionality for URLs
    - Style with Stripe-like card design
    - _Requirements: 3.3, 4.5, 8.2_
  
  - [x] 8.3 Create PaymentHistoryList component
    - Display all received payments in a table
    - Show payer address (truncated), amount, timestamp, transaction hash
    - Link transaction hash to block explorer
    - Handle empty state (no payments yet)
    - _Requirements: 3.4, 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x]* 8.4 Write property tests for dashboard data display
    - **Property 5: Payment Link Display Completeness**
    - **Property 7: Total Amount Calculation**
    - **Property 18: Payment History Completeness**
    - **Validates: Requirements 3.3, 3.5, 4.5, 9.1, 9.2, 9.3, 9.4, 9.5**
  
  - [x]* 8.5 Write unit tests for dashboard components
    - Test empty payment links list
    - Test empty payment history
    - Test dashboard with multiple links and payments
    - Test total calculation with various payment amounts
    - _Requirements: 3.3, 3.4, 3.5_

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement payment page and transaction flow
  - [x] 10.1 Create PaymentPage component at `app/pay/[username]/[amount]/page.tsx`
    - Extract username and amount from URL params
    - Look up payment link details from localStorage (if created by current user)
    - Display payee username, amount, and optional note
    - Display QR code for the payment URL
    - Include PayButton component
    - Show SuccessAnimation after successful payment
    - _Requirements: 6.1, 6.2, 6.3, 6.7, 8.3_
  
  - [x] 10.2 Create PayButton component
    - Check if wallet is connected, prompt connection if not
    - Implement transaction execution using Wagmi's useSendTransaction
    - For MVP: Send native token (simulating USDC)
    - Show loading state during transaction confirmation
    - Handle transaction success: record payment, show success animation
    - Handle transaction failure: display error message
    - _Requirements: 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 10.3 Create SuccessAnimation component
    - Implement smooth success animation (checkmark with fade-in)
    - Display "Payment sent successfully" message
    - Auto-dismiss after 3 seconds
    - Call onComplete callback
    - _Requirements: 6.6_
  
  - [x]* 10.4 Write property tests for payment flow
    - **Property 8: Payment Page Data Display**
    - **Property 15: Transaction Amount Transfer**
    - **Property 16: Transaction Hash Recording**
    - **Property 17: Transaction Error Handling**
    - **Validates: Requirements 6.1, 6.2, 7.2, 7.4, 7.5**
  
  - [x]* 10.5 Write unit tests for payment page and transaction flow
    - Test payment page displays correct data from URL
    - Test PayButton prompts wallet connection when disconnected
    - Test PayButton initiates transaction when connected
    - Test success animation displays after successful payment
    - Test error message displays after failed transaction
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.4_

- [x] 11. Implement demo mode functionality
  - [x] 11.1 Add demo mode configuration
    - Add NEXT_PUBLIC_DEMO_MODE environment variable
    - Create demo mode context/hook
    - _Requirements: 11.1, 11.4_
  
  - [x] 11.2 Implement payment simulation in PayButton
    - Add "Simulate payment" button when demo mode is enabled
    - Create simulatePayment utility function
    - Generate mock transaction hash
    - Record simulated payment to history with 'simulated' status
    - Show success animation without blockchain transaction
    - Display demo mode indicator on payment page
    - _Requirements: 7.6, 11.1, 11.2, 11.3, 11.4_
  
  - [x]* 11.3 Write property test for simulated payment recording
    - **Property 19: Simulated Payment Recording**
    - **Validates: Requirements 11.3**
  
  - [x]* 11.4 Write unit tests for demo mode
    - Test simulate button appears when demo mode enabled
    - Test simulate button hidden when demo mode disabled
    - Test simulated payment completes without blockchain call
    - Test simulated payment appears in history
    - Test demo mode indicator displays
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 12. Add error handling and user feedback
  - [x] 12.1 Implement error boundary components
    - Create global error boundary for app
    - Create component-level error boundaries for Dashboard and PaymentPage
    - Display user-friendly error messages
    - Add refresh/retry buttons
    - _Requirements: General error handling_
  
  - [x] 12.2 Add comprehensive error handling to transaction flow
    - Handle wallet rejection
    - Handle insufficient balance (check before transaction)
    - Handle network errors
    - Handle transaction timeout
    - Display specific error messages for each case
    - _Requirements: 7.4_
  
  - [x] 12.3 Add error handling to storage operations
    - Handle localStorage full
    - Handle localStorage disabled
    - Handle corrupted data
    - Display appropriate error messages and recovery options
    - _Requirements: 5.1, 5.2_
  
  - [x]* 12.4 Write unit tests for error scenarios
    - Test error boundary catches and displays errors
    - Test transaction rejection handling
    - Test insufficient balance handling
    - Test storage error handling
    - _Requirements: 7.4_

- [x] 13. Polish UI and add animations
  - [x] 13.1 Refine fintech design system
    - Create custom TailwindCSS theme with fintech colors
    - Implement consistent spacing and typography
    - Add subtle shadows and borders for depth
    - Ensure dark/light mode support (optional)
    - _Requirements: 1.6, 10.1, 10.3, 10.4_
  
  - [x] 13.2 Add smooth animations and transitions
    - Add page transitions
    - Add button hover effects
    - Add form input focus effects
    - Add loading spinners for async operations
    - Add success/error toast notifications
    - Ensure 60fps performance
    - _Requirements: 10.2_
  
  - [x] 13.3 Implement copy-to-clipboard functionality
    - Add copy buttons for payment URLs
    - Add copy buttons for wallet addresses
    - Show toast notification on successful copy
    - _Requirements: 3.3, 4.5_

- [ ] 14. Create documentation and deployment configuration
  - [ ] 14.1 Write comprehensive README.md
    - Add project overview and features
    - Add prerequisites (Node.js version, wallet extension)
    - Add local development instructions
    - Add environment variables documentation
    - Add Vercel deployment instructions
    - Add troubleshooting section
    - _Requirements: 12.2, 12.3_
  
  - [ ] 14.2 Configure Vercel deployment
    - Create vercel.json configuration
    - Set up environment variables in Vercel dashboard
    - Configure build settings
    - Test deployment preview
    - _Requirements: 12.1_
  
  - [ ] 14.3 Add code comments and documentation
    - Add JSDoc comments to utility functions
    - Add comments explaining Web3 integration points
    - Add comments for complex business logic
    - Document component props with TypeScript
    - _Requirements: 12.6_

- [ ] 15. Final integration and testing
  - [ ]* 15.1 Write integration tests for complete user flows
    - Test flow: Connect wallet → Create link → Visit payment page → Complete payment → View history
    - Test flow: Create multiple links → Verify all display in dashboard
    - Test flow: Receive multiple payments → Verify total calculation
    - Test flow: Demo mode end-to-end
    - _Requirements: All requirements_
  
  - [ ] 15.2 Perform manual testing checklist
    - Test with MetaMask on Etherlink testnet
    - Test responsive design on mobile and desktop
    - Test QR code scanning with mobile device
    - Verify all animations are smooth
    - Verify error messages are clear
    - Test demo mode without blockchain connection
    - Check for console errors
    - _Requirements: All requirements_
  
  - [ ] 15.3 Performance optimization
    - Optimize bundle size (check with next/bundle-analyzer)
    - Lazy load heavy components
    - Optimize images and assets
    - Test loading speed on 3G connection
    - _Requirements: General performance_

- [ ] 16. Final checkpoint - Ensure all tests pass and app is production-ready
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property tests validate universal correctness across many inputs (min 100 iterations)
- Unit tests validate specific examples, edge cases, and error conditions
- Integration tests validate complete user flows
- The implementation follows a bottom-up approach: infrastructure → components → integration → polish
- Demo mode allows showcasing the platform without requiring testnet tokens
- All Web3 interactions use Wagmi v2 hooks for type safety and best practices
