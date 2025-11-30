# 2048 on Celo

A modern implementation of the classic 2048 puzzle game with blockchain integration on Celo. Play in free mode or compete on-chain with permanent leaderboards!

## Features

- 🎮 **Dual Game Modes**:
  - **Free Play**: Play offline with local high scores
  - **On-Chain**: Submit scores to Celo blockchain for permanent leaderboards

- 📱 **Mobile-First Design**: Optimized for Farcaster mini-apps with touch controls
- 🎨 **Classic 2048 Aesthetics**: Familiar color scheme with Celo yellow branding
- ⛓️ **Blockchain Integration**: Wagmi v2 + Viem for seamless Celo interaction
- 📊 **Player Statistics**: Track wins, losses, streaks, and high scores
- 🔗 **Multi-Wallet Support**: MetaMask, WalletConnect, Farcaster Wallet, and browser wallets

## Tech Stack

- **Frontend**: Next.js 14.2.15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS 3.4, Framer Motion 11.18
- **Blockchain**: Wagmi 2.19, Viem 2.40, Celo Mainnet
- **Farcaster**: @farcaster/miniapp-sdk 0.2.1
- **Smart Contracts**: Solidity 0.8.20, Hardhat 2.27

## Getting Started

### Installation

1. Install dependencies:
   \`\`\`bash
   npm install --legacy-peer-deps
   \`\`\`

2. Set up environment:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

3. Run development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open http://localhost:3000

## Smart Contract Deployment

Deploy to Alfajores testnet:
\`\`\`bash
npx hardhat run scripts/deploy.ts --network alfajores
\`\`\`

Update \`lib/contract-abi.ts\` with the deployed address.

## Built with ❤️ on Celo
