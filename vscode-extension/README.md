# PolyBuilder VS Code Extension

Build, deploy, and analyze Solidity smart contracts on Polygon directly from VS Code.

## Features

### 🚀 One-Click Deployment
- Deploy contracts to Polygon (Amoy testnet, Mumbai, or Mainnet) with a single command
- Automatic contract verification on Polygonscan
- View deployment status and transaction hashes

### 🛡️ Security Analysis
- Real-time security vulnerability scanning powered by AI
- Identify critical issues like reentrancy, access control, and more
- Get recommendations for fixing security issues

### ⚡ Gas Optimization
- Analyze contract gas efficiency
- Get AI-powered optimization suggestions
- Reduce deployment and execution costs

### 🤖 AI Assistant
- Context-aware code suggestions
- Explain complex Solidity code
- Debug and fix errors automatically
- Generate documentation

### 📚 Template Library
- Browse 100+ pre-built contract templates
- Insert templates directly into your code
- Filter by category (DeFi, NFT, Gaming, etc.)

### 📊 Analytics Dashboard
- Track your deployed contracts
- View performance metrics
- Monitor gas usage across deployments

## Installation

1. Install from VS Code Marketplace: [PolyBuilder Extension](https://marketplace.visualstudio.com/items?itemName=polybuilder.polybuilder-vscode)
2. Or search for "PolyBuilder" in VS Code Extensions panel

## Quick Start

1. Open any `.sol` file
2. Right-click and select:
   - **PolyBuilder: Compile Contract** - Compile your Solidity code
   - **PolyBuilder: Deploy to Polygon** - Deploy to Polygon testnet/mainnet
   - **PolyBuilder: Analyze Security** - Run security audit
   - **PolyBuilder: AI Assistant** - Get AI help

## Configuration

Open VS Code Settings and search for "PolyBuilder":

```json
{
  "polybuilder.apiKey": "your-api-key",
  "polybuilder.defaultNetwork": "amoy",
  "polybuilder.enableAI": true,
  "polybuilder.autoAnalyze": true
}
```

### Settings

- `polybuilder.apiKey`: Your PolyBuilder API key (get from https://polybuilder.com)
- `polybuilder.defaultNetwork`: Default network for deployment (`amoy`, `mumbai`, or `polygon`)
- `polybuilder.privateKey`: Wallet private key for deployments (stored securely)
- `polybuilder.enableAI`: Enable AI-powered features
- `polybuilder.autoAnalyze`: Automatically analyze contracts on save

## Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| `PolyBuilder: Compile Contract` | Compile Solidity contract | - |
| `PolyBuilder: Deploy to Polygon` | Deploy to Polygon network | - |
| `PolyBuilder: Analyze Security` | Run security vulnerability scan | - |
| `PolyBuilder: Optimize Gas` | Analyze and optimize gas usage | - |
| `PolyBuilder: AI Assistant` | Ask AI for help | - |
| `PolyBuilder: Browse Templates` | Browse contract templates | - |
| `PolyBuilder: Open Web Studio` | Open PolyBuilder web IDE | - |

## Requirements

- VS Code 1.80.0 or higher
- Node.js 16.0.0 or higher (for local development)
- Polygon wallet with POL tokens (for deployment)

## Support

- 📖 [Documentation](https://polybuilder.com/docs)
- 💬 [Discord Community](https://discord.gg/polybuilder)
- 🐛 [Report Issues](https://github.com/SCARPxVeNOM/PolyBuilder/issues)
- 📧 [Email Support](mailto:support@polybuilder.com)

## License

MIT License - see [LICENSE](LICENSE)

## Privacy

Your private keys are stored locally in VS Code's secure storage and never transmitted to our servers. All API calls are encrypted via HTTPS.

