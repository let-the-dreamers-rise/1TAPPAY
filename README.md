
# 🌩️ 1TapPay - The Future of Global Payments 🌩️

![1TapPay Banner](https://img.shields.io/badge/1TapPay-Global_Payments-blueviolet?style=for-the-badge&logo=ethereum)
![Etherlink Testnet](https://img.shields.io/badge/Network-Etherlink_Testnet-blue?style=for-the-badge&logo=tezos)
![Next.js](https://img.shields.io/badge/Framework-Next.js_15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

> **"Borderless payments for the internet. Simple. Fast. Secure."**

---

## 🚀 Overview

**1TapPay** is a cutting-edge Web3 payment platform that revolutionizes how we send and receive money globally. Built on the **Etherlink Testnet**, it bridges the gap between traditional fintech UX and blockchain power.

Imagine sending money as easily as sharing a link. No complex wallet addresses to memorize. No waiting days for settlement. Just generated a link, share it, and get paid instantly.

### 🌟 Why 1TapPay?

*   **Global Reach**: Send payments to anyone, anywhere, instantly.
*   **Zero Friction**: Payers just click a link or scan a QR code.
*   **Bank-Grade UI**: A beautiful, intuitive dashboard inspired by Stripe and Razorpay.
*   **Blockchain Secured**: Powered by Etherlink's EVM-compatible L2 technology.

---

## 🔥 Features that Shine

| Feature | Description |
| :--- | :--- |
| **🔗 Smart Payment Links** | Create custom payment links (e.g., `1tappay.com/pay/ashwin/10`) with attached metadata. |
| **📱 Dynamic QR Codes** | Auto-generated QR codes that encode payment details for instant mobile checkout. |
| **⚡ Instant Settlement** | Payments settle in seconds on the Etherlink blockchain. |
| **💼 Pro Dashboard** | Track your income, manage active links, and view transaction history in real-time. |
| **🔐 Web3 Native** | Seamless integration with MetaMask, Rainbow, and WalletConnect. |
| **🎨 Fintech Design** | A premium, responsive UI with dark mode support and smooth animations. |

---

## 🛠️ Tech Stack of the Gods

*   **Frontend**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/) + Custom Design System
*   **Web3**: [RainbowKit](https://www.rainbowkit.com/) + [Wagmi v2](https://wagmi.sh/) + [Viem](https://viem.sh/)
*   **Blockchain**: **Etherlink Testnet** (EVM Layer 2)
*   **Tools**: [Vitest](https://vitest.dev/) for testing, [qrcode.react](https://www.npmjs.com/package/qrcode.react) for QRs.

---

## ⚡ Quick Start Guide

Ready to unleash the power of 1TapPay? Follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/let-the-dreamers-rise/1TAPPAY.git
cd 1tap-pay
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env.local` file in the root directory:

```env
# Etherlink Testnet Configuration
NEXT_PUBLIC_CHAIN_ID=128123
NEXT_PUBLIC_CHAIN_NAME="Etherlink Testnet"
NEXT_PUBLIC_RPC_URL="https://node.ghostnet.etherlink.com"
NEXT_PUBLIC_BLOCK_EXPLORER="https://testnet.explorer.etherlink.com"

# WalletConnect Project ID (Get one from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_project_id_here"

# App Configuration
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 4. Ignite the Engine 🏎️
```bash
npm run dev
```
Visit `http://localhost:3000` and witness the magic.

---

## 🧪 Testing

We value reliability. Run our test suite to ensure everything is rock solid.

```bash
npm test
```

---

## 🌍 Deployment

Deploying to the world is easy with Vercel.

1.  Push your code to GitHub.
2.  Import project into Vercel.
3.  Add environment variables.
4.  **Deploy!** 🚀

---

## 📜 Smart Contract Details (Etherlink Testnet)

*   **Network Name**: Etherlink Testnet
*   **RPC URL**: `https://node.ghostnet.etherlink.com`
*   **Chain ID**: `128123`
*   **Currency Symbol**: `XTZ`
*   **Block Explorer**: [Etherlink Explorer](https://testnet.explorer.etherlink.com)

---

## 🤝 Contributing

We welcome fellow dreamers! if you have ideas or improvements:

1.  Fork the repo.
2.  Create your feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by <b>Ashwin</b> for the <b>Etherlink Hackathon</b></p>
  <p><i>Let the dreamers rise.</i></p>
</div>
