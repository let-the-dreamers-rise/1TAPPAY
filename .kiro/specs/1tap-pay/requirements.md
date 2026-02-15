# Requirements Document: 1TapPay

## Introduction

1TapPay is a Web3 payment platform that enables global stablecoin payments through simple payment links and QR codes. The system provides a UPI-like experience for internet payments, targeting freelancers, creators, developers, and online businesses who need to send and receive borderless payments instantly without requiring deep cryptocurrency knowledge. The platform delivers a production-grade MVP with Stripe/Razorpay level user experience.

## Glossary

- **Payment_System**: The 1TapPay Web3 payment platform
- **User**: A person who creates payment links or sends payments
- **Payee**: The recipient of a payment who creates a payment link
- **Payer**: The person who sends payment through a payment link
- **Payment_Link**: A unique URL that enables payment to a specific payee for a specific amount
- **Wallet**: A Web3 cryptocurrency wallet (e.g., MetaMask) connected via RainbowKit
- **Stablecoin**: USDC testnet token used for payments on Etherlink testnet
- **Dashboard**: The main interface where users manage payment links and view payment history
- **QR_Code**: A scannable code that encodes a payment link
- **Etherlink**: The EVM-compatible blockchain testnet used for transactions
- **Transaction**: A blockchain payment operation transferring stablecoins

## Requirements

### Requirement 1: Landing Page

**User Story:** As a visitor, I want to see a professional fintech landing page, so that I understand what 1TapPay offers and feel confident using the platform.

#### Acceptance Criteria

1. THE Payment_System SHALL display a hero section with the tagline "Send global payments with a link"
2. THE Payment_System SHALL provide a wallet connect button on the landing page
3. THE Payment_System SHALL display a features section highlighting instant, global, and simple payment capabilities
4. THE Payment_System SHALL display a "How it works" section explaining the payment flow
5. THE Payment_System SHALL display a demo preview of the payment interface
6. THE Payment_System SHALL use a minimal, premium fintech design theme with dark or white color scheme
7. THE Payment_System SHALL render responsively on mobile devices

### Requirement 2: Wallet Connection

**User Story:** As a user, I want to connect my Web3 wallet, so that I can create payment links and send payments.

#### Acceptance Criteria

1. WHEN a user clicks the connect wallet button, THE Payment_System SHALL initiate wallet connection via RainbowKit
2. WHEN a wallet is successfully connected, THE Payment_System SHALL redirect the user to the dashboard
3. WHEN a wallet is connected, THE Payment_System SHALL display the user's wallet address
4. WHEN a wallet is connected, THE Payment_System SHALL display the current network name
5. WHEN a wallet is connected on a network other than Etherlink testnet, THE Payment_System SHALL display a network warning
6. WHERE balance display is implemented, THE Payment_System SHALL show the user's stablecoin balance

### Requirement 3: Dashboard Interface

**User Story:** As a connected user, I want to access a clean dashboard, so that I can manage my payment links and view payment history.

#### Acceptance Criteria

1. THE Payment_System SHALL display a dashboard with a Stripe-like professional interface
2. THE Payment_System SHALL provide a section for creating new payment links
3. THE Payment_System SHALL display a list of all generated payment links
4. THE Payment_System SHALL display a payments received history section
5. THE Payment_System SHALL display the total amount received across all payments
6. THE Payment_System SHALL maintain consistent fintech design language throughout the dashboard

### Requirement 4: Payment Link Creation

**User Story:** As a payee, I want to create payment links with custom amounts, so that I can share them with payers to receive payments.

#### Acceptance Criteria

1. WHEN a user submits the payment link form, THE Payment_System SHALL validate that a username is provided
2. WHEN a user submits the payment link form, THE Payment_System SHALL validate that an amount is provided and is greater than zero
3. WHEN a user creates a payment link, THE Payment_System SHALL generate a unique payment URL in the format `/pay/{username}/{amount}`
4. WHEN a payment link is created, THE Payment_System SHALL store the receiver wallet address, amount, username, and unique link identifier
5. WHEN a payment link is created, THE Payment_System SHALL display the generated link in the dashboard
6. WHERE a note is provided, THE Payment_System SHALL store and associate the note with the payment link

### Requirement 5: Payment Link Storage

**User Story:** As a user, I want my payment links to persist, so that I can access them across sessions and share them reliably.

#### Acceptance Criteria

1. WHEN a payment link is created, THE Payment_System SHALL persist the link data to storage
2. WHEN a user returns to the dashboard, THE Payment_System SHALL retrieve and display all previously created payment links
3. THE Payment_System SHALL store the receiver wallet address for each payment link
4. THE Payment_System SHALL store the amount in USDC for each payment link
5. THE Payment_System SHALL store the username for each payment link
6. THE Payment_System SHALL store a unique identifier for each payment link

### Requirement 6: Payment Page

**User Story:** As a payer, I want to visit a payment link and complete payment, so that I can send stablecoins to the payee.

#### Acceptance Criteria

1. WHEN a payer visits a payment link URL, THE Payment_System SHALL display the payee username
2. WHEN a payer visits a payment link URL, THE Payment_System SHALL display the payment amount in USDC
3. WHEN a payer visits a payment link URL, THE Payment_System SHALL display a pay button
4. WHEN a payer clicks the pay button without a connected wallet, THE Payment_System SHALL prompt wallet connection
5. WHEN a payer clicks the pay button with a connected wallet, THE Payment_System SHALL initiate a stablecoin transfer transaction
6. WHEN a payment transaction is successful, THE Payment_System SHALL display a success animation with the message "Payment sent successfully"
7. WHERE a note is associated with the payment link, THE Payment_System SHALL display the note on the payment page

### Requirement 7: Blockchain Transaction Processing

**User Story:** As a payer, I want my payment to be processed on the blockchain, so that the payee receives the stablecoins securely.

#### Acceptance Criteria

1. WHEN a payment is initiated, THE Payment_System SHALL create a blockchain transaction on Etherlink testnet
2. WHEN creating a transaction, THE Payment_System SHALL transfer the specified USDC amount from the payer's wallet to the payee's wallet
3. WHEN a transaction is submitted, THE Payment_System SHALL wait for transaction confirmation
4. IF a transaction fails, THEN THE Payment_System SHALL display an error message to the payer
5. WHEN a transaction succeeds, THE Payment_System SHALL record the transaction hash
6. WHERE demo mode is enabled, THE Payment_System SHALL simulate payment completion without blockchain transaction

### Requirement 8: QR Code Generation

**User Story:** As a payee, I want QR codes generated for my payment links, so that payers can scan and pay easily from mobile devices.

#### Acceptance Criteria

1. WHEN a payment link is created, THE Payment_System SHALL automatically generate a QR code encoding the payment URL
2. THE Payment_System SHALL display the QR code on the dashboard for each payment link
3. WHEN a payer visits a payment page, THE Payment_System SHALL display the QR code for that payment link
4. THE Payment_System SHALL provide a download button for each QR code
5. WHEN a user clicks the download button, THE Payment_System SHALL download the QR code as an image file
6. THE Payment_System SHALL style QR codes in a UPI or PayPal inspired design

### Requirement 9: Payment History

**User Story:** As a payee, I want to view my payment history, so that I can track who paid me and when.

#### Acceptance Criteria

1. THE Payment_System SHALL display a list of all received payments in the dashboard
2. WHEN displaying payment history, THE Payment_System SHALL show the payer's wallet address for each payment
3. WHEN displaying payment history, THE Payment_System SHALL show the amount for each payment
4. WHEN displaying payment history, THE Payment_System SHALL show the timestamp for each payment
5. WHERE transaction hash is available, THE Payment_System SHALL display the transaction hash for each payment
6. THE Payment_System SHALL calculate and display the total amount received across all payments
7. WHERE real payment data is unavailable, THE Payment_System SHALL display simulated payment data for demonstration purposes

### Requirement 10: User Interface Design

**User Story:** As a user, I want a premium fintech interface, so that I feel confident the platform is professional and trustworthy.

#### Acceptance Criteria

1. THE Payment_System SHALL use TailwindCSS for styling with a modern minimal fintech design
2. THE Payment_System SHALL implement smooth animations for user interactions
3. THE Payment_System SHALL use clean typography consistent with fintech applications
4. THE Payment_System SHALL maintain a clutter-free interface design
5. THE Payment_System SHALL render responsively across desktop and mobile devices
6. WHERE glassmorphism is used, THE Payment_System SHALL apply it consistently with the overall design theme
7. THE Payment_System SHALL use messaging that emphasizes "Global payment links", "Borderless payments", "UPI for internet", and "Instant global pay"

### Requirement 11: Demo Mode

**User Story:** As a demonstrator, I want to simulate payments without blockchain transactions, so that I can showcase the platform functionality without requiring testnet tokens.

#### Acceptance Criteria

1. WHERE demo mode is enabled, THE Payment_System SHALL provide a "Simulate payment" button on payment pages
2. WHEN a user clicks the simulate payment button, THE Payment_System SHALL display the payment success animation without creating a blockchain transaction
3. WHEN a simulated payment completes, THE Payment_System SHALL record the payment in the payment history
4. WHERE demo mode is enabled, THE Payment_System SHALL clearly indicate that payments are simulated

### Requirement 12: Deployment and Configuration

**User Story:** As a developer, I want clear deployment instructions, so that I can easily deploy the application to Vercel.

#### Acceptance Criteria

1. THE Payment_System SHALL be deployable to Vercel without configuration errors
2. THE Payment_System SHALL include a README with clear instructions to run the application locally
3. THE Payment_System SHALL include a README with clear instructions to deploy to Vercel
4. THE Payment_System SHALL use environment variables for configuration of blockchain network and contract addresses
5. THE Payment_System SHALL organize code in a clean folder structure following Next.js best practices
6. THE Payment_System SHALL include code comments explaining key functionality
