# 🚀 PolyBuilder - Scaffold & Learning platform

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-purple)
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Polygon](https://img.shields.io/badge/Polygon-PoS-8247E5)

**A next-generation Web3 development platform for building, learning, and deploying dApps on Polygon**

[Demo](#-demo) • [Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 🌟 Overview

PolyBuilder is a **modern, all-in-one Web3 development studio** that combines the best of Replit, Scaffold-ETH, and Polygon Academy. Build production-ready smart contracts with zero setup, learn blockchain development through interactive lessons, and deploy to Polygon networks with a single click.

### 🎯 Perfect For

- 🎓 **Beginners** learning smart contract development
- 👨‍💻 **Developers** prototyping dApps quickly
- 🏗️ **Teams** building on Polygon
- 🎮 **Hackathon participants** shipping fast

---

## ✨ Features

### 🤖 **AI-Powered Development** ⭐ NEW
- **Gemini 2.5 Flash AI** - Latest Google AI for real-time assistance (100% FREE!)
- **Smart Contract Analyzer** - Automatic security audits and gas optimization
- **Cross-Chain Migration** - Migrate contracts from any blockchain to Polygon with AI
- **Context-Aware Help** - Ask questions about your code and get instant answers
- **Bug Detection** - Identify vulnerabilities before deployment
- **60 requests/minute** - Fast and generous rate limits

### 🏗️ **Interactive Web IDE**
- **Monaco Editor** - VSCode-quality code editing in your browser
- **3 Smart Contract Templates** - ERC-20, NFT (ERC-721), DAO Governance
- **Live Preview** - See your dApp in action instantly
- **Real-time Console** - Track compilation and deployment logs
- **File Explorer** - Navigate project structure easily

### ⚡ **One-Click Deployment**
- **Automated Pipeline** - Compile, deploy, and verify automatically
- **Multi-Network Support** - Mumbai, Amoy, and Polygon Mainnet
- **Polygonscan Integration** - Auto-verification on block explorer
- **Gas Estimation** - Know costs before deploying
- **Transaction Tracking** - Monitor deployment status in real-time

### 📚 **Gamified Learning System**
- **8+ Interactive Lessons** - From blockchain basics to advanced concepts
- **XP & Leveling** - Earn experience points as you learn
- **9 Achievement Badges** - Unlock rewards for milestones
- **Progress Tracking** - See your journey with stats and streaks
- **Level-Up Celebrations** - Confetti and animations when you progress

### 💻 **Code Challenges**
- **4+ Solidity Puzzles** - Practice smart contract development
- **Integrated IDE** - Write and test code in the browser
- **Hints System** - Get help when stuck
- **Solution Viewer** - Learn from reference implementations
- **Instant Feedback** - Test your solutions immediately

### 💰 **Wallet Integration**
- **RainbowKit** - Beautiful wallet connection UI
- **Multi-Wallet Support** - MetaMask, WalletConnect, Coinbase, and more
- **Network Switching** - Easy chain management
- **Contract Interaction** - Read and write to deployed contracts
- **Balance Display** - See your tokens and NFTs

### 📊 **Personal Dashboard**
- **Learning Stats** - XP, level, lessons completed
- **Achievement Showcase** - Display your earned badges
- **Progress Overview** - Track your development journey
- **Quick Actions** - Jump to Studio, Learn, or Challenges

---

## 🎨 Screenshots

### Landing Page
Beautiful dark theme with neon Polygon purple accents and smooth animations.

### Interactive Studio
Full-featured Web IDE with Monaco editor, file explorer, and live console.

### Learning Dashboard
Track your progress with XP, levels, and unlock achievement badges.

### Code Challenges
Practice Solidity with integrated challenges and instant feedback.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask or another Web3 wallet
- Google Gemini API key (for AI features - **FREE!**) - Get from [makersuite.google.com](https://makersuite.google.com/app/apikey)
- (Optional) Polygon testnet tokens from [faucet](https://faucet.polygon.technology/)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/polygon-scaffold-platform.git
cd polygon-scaffold-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your keys
```

### Environment Variables

Create a `.env.local` file:

```env
# Required for deployment
DEPLOYER_PRIVATE_KEY=your_private_key_here
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here

# Required for AI features (FREE!)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Custom RPC URLs
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGON_RPC_URL=https://polygon-rpc.com

# Optional: WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

### Build for Production

```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[ShadCN UI](https://ui.shadcn.com/)** - Beautiful components
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - VSCode editor
- **[Lucide React](https://lucide.dev/)** - Icon library

### Web3
- **[RainbowKit](https://www.rainbowkit.com/)** - Wallet connection
- **[Wagmi](https://wagmi.sh/)** - React hooks for Ethereum
- **[Viem](https://viem.sh/)** - TypeScript Ethereum interface
- **[Hardhat](https://hardhat.org/)** - Smart contract development
- **[OpenZeppelin](https://www.openzeppelin.com/)** - Secure contracts

### Blockchain
- **[Polygon PoS](https://polygon.technology/)** - Layer 2 scaling
- **[Ethers.js](https://docs.ethers.org/)** - Ethereum library
- **[Polygonscan](https://polygonscan.com/)** - Block explorer

---

## 📁 Project Structure

```
polygon-scaffold-platform/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── compile/              # Contract compilation
│   │   ├── deploy/               # Contract deployment
│   │   ├── verify/               # Polygonscan verification
│   │   └── contract-info/        # Contract data
│   ├── studio/                   # Web IDE page
│   ├── learn/                    # Learning dashboard
│   ├── challenges/               # Code challenges
│   ├── contracts/                # Contract interaction
│   ├── dashboard/                # User dashboard
│   └── docs/                     # Documentation
├── components/                   # React components
│   ├── landing/                  # Landing page sections
│   ├── studio/                   # IDE components
│   ├── learning/                 # Learning system
│   ├── web3/                     # Web3 components
│   └── ui/                       # UI primitives
├── lib/                          # Utilities and services
│   ├── blockchain/               # Compiler & deployer
│   ├── learning/                 # Progress & challenges
│   ├── services/                 # Deployment service
│   ├── templates/                # Smart contract templates
│   ├── web3/                     # Web3 config & hooks
│   └── utils/                    # Helper functions
├── public/                       # Static assets
├── hardhat.config.ts             # Hardhat configuration
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 📖 Usage Guide

### 1️⃣ Building Your First dApp

1. Navigate to **Studio** from the home page
2. Choose a template (ERC-20, NFT, or DAO)
3. Customize the smart contract code
4. Click **Deploy to Polygon**
5. Confirm the transaction in your wallet
6. View your deployed contract on Polygonscan 🎉

### 2️⃣ Learning Smart Contract Development

1. Go to the **Learn** page
2. Browse available lessons by category
3. Start a lesson and read the content
4. Complete the lesson to earn XP
5. Level up and unlock achievement badges
6. Track your progress on the dashboard

### 3️⃣ Solving Code Challenges

1. Visit the **Challenges** page
2. Select a challenge by difficulty
3. Write your Solidity code in the editor
4. Click **Test** to validate your solution
5. Use **Hints** if you get stuck
6. Submit to earn XP and complete the challenge

### 4️⃣ Interacting with Contracts

1. Navigate to **Contracts** page
2. Connect your wallet using RainbowKit
3. Enter a contract address
4. View contract information (name, symbol, supply)
5. Call read functions to query data
6. Execute write functions to send transactions

---

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types

# Blockchain (requires Hardhat setup)
npx hardhat compile  # Compile contracts
npx hardhat test     # Run contract tests
npx hardhat node     # Start local blockchain
```

### Adding a New Template

1. Create contract files in `lib/templates/`
2. Export template in `lib/templates/index.ts`
3. Add template card in `components/landing/template-cards.tsx`
4. Template will automatically appear in Studio

### Adding a New Lesson

1. Add lesson definition in `lib/learning/progress.ts`
2. Update `LESSONS` array with metadata
3. Lesson will automatically appear in Learning dashboard

### Adding a New Challenge

1. Add challenge in `lib/learning/challenges.ts`
2. Include starter code and solution
3. Challenge will automatically appear on Challenges page

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/polygon-scaffold-platform)

Or manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel

Add these in your Vercel project settings:

- `DEPLOYER_PRIVATE_KEY`
- `POLYGONSCAN_API_KEY`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod
```

---

## 🎯 Roadmap

### ✅ Completed
- [x] Interactive Web IDE with Monaco Editor
- [x] Smart contract templates (ERC-20, NFT, DAO)
- [x] One-click deployment to Polygon
- [x] Wallet integration with RainbowKit
- [x] Learning system with XP and badges
- [x] Code challenges with hints
- [x] Personal dashboard
- [x] Comprehensive documentation

### 🚧 In Progress
- [ ] More smart contract templates (Marketplace, Staking)
- [ ] Advanced code challenges
- [ ] Collaborative coding features
- [ ] Project versioning with Git integration

### 🔮 Future
- [ ] AI-powered code suggestions
- [ ] Multi-chain support (zkEVM, Ethereum, BSC)
- [ ] Social features (leaderboards, sharing)
- [ ] Video tutorials integration
- [ ] Mobile app (React Native)
- [ ] VS Code extension

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

1. 🐛 **Report Bugs** - Open an issue with details
2. 💡 **Suggest Features** - Share your ideas
3. 📖 **Improve Docs** - Fix typos or add examples
4. 🎨 **Design** - Propose UI/UX improvements
5. 💻 **Code** - Submit pull requests

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Use TypeScript for all new code
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ using amazing open-source projects:

- [Next.js](https://nextjs.org/) by Vercel
- [Hardhat](https://hardhat.org/) by Nomic Foundation
- [RainbowKit](https://www.rainbowkit.com/) by Rainbow
- [OpenZeppelin](https://www.openzeppelin.com/) Contracts
- [Polygon](https://polygon.technology/) Network
- [ShadCN UI](https://ui.shadcn.com/) Component Library
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) by Microsoft

Special thanks to:
- Polygon team for excellent documentation
- The Ethereum and Web3 community
- All contributors and early users

---

## 📞 Support

- 📚 [Documentation](https://github.com/yourusername/polygon-scaffold-platform/wiki)
- 💬 [Discussions](https://github.com/yourusername/polygon-scaffold-platform/discussions)
- 🐦 [Twitter](https://twitter.com/yourhandle)
- 💼 [LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐!

<div align="center">

**Built for the Polygon ecosystem 🟣**

Made with 💜 by the community

[⬆ Back to top](#-PolyBuilder)

</div>

