# Private Weather Guess

A privacy-preserving weather prediction system built on blockchain using Fully Homomorphic Encryption (FHE). This application allows users to submit encrypted temperature predictions that are stored on-chain and revealed after the target date for ranking purposes.

## Features

- **🔒 Fully Homomorphic Encryption**: Protect temperature predictions using Zama's FHEVM technology
- **🌡️ Encrypted Temperature Predictions**: Submit encrypted temperature and confidence levels
- **👤 User-Owned Data**: Only prediction owners can decrypt their data before reveal
- **📊 Leaderboard System**: Rank predictions by accuracy after decryption
- **🌐 Multi-Network Support**: Works on local Hardhat network and Sepolia testnet
- **💼 Wallet Integration**: Seamless wallet connection using RainbowKit

## Quick Start

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm or yarn/pnpm**: Package manager
- **MetaMask** or compatible wallet

### Installation

1. **Install dependencies**

   ```bash
   npm install
   cd ui
   npm install
   ```

2. **Set up environment variables**

   ```bash
   npx hardhat vars set MNEMONIC
   npx hardhat vars set INFURA_API_KEY
   npx hardhat vars set ETHERSCAN_API_KEY
   ```

3. **Compile contracts**

   ```bash
   npm run compile
   npm run typechain
   ```

4. **Deploy to local network**

   ```bash
   # Terminal 1: Start Hardhat node
   npx hardhat node

   # Terminal 2: Deploy contract
   npx hardhat deploy --network localhost

   # Copy the deployed contract address and update ui/src/config/contracts.ts
   # CONTRACT_ADDRESSES[31337] = '0x...';
   ```

5. **Start frontend**

   ```bash
   cd ui
   npm run dev
   ```

6. **Connect wallet and test**

   - Open the app in your browser
   - Connect wallet to localhost network (Chain ID: 31337)
   - Submit a weather prediction
   - Decrypt your prediction to verify encryption/decryption

## Project Structure

```
crystal-predict-vault/
├── contracts/                    # Smart contract source files
│   └── PrivateWeatherGuess.sol  # Main weather prediction contract
├── deploy/                      # Deployment scripts
├── test/                         # Test files
│   ├── PrivateWeatherGuess.ts   # Local network tests
│   └── PrivateWeatherGuessSepolia.ts  # Sepolia testnet tests
├── ui/                          # Frontend React application
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom hooks
│   │   ├── config/              # Contract configuration
│   │   └── lib/                 # Utilities (FHEVM, wagmi)
│   └── package.json
├── hardhat.config.ts            # Hardhat configuration
└── package.json                 # Dependencies and scripts
```

## Available Scripts

| Script             | Description              |
| ------------------ | ------------------------ |
| `npm run compile`  | Compile all contracts    |
| `npm run test`     | Run all tests (local)    |
| `npm run test:sepolia` | Run tests on Sepolia  |
| `npm run coverage` | Generate coverage report |
| `npm run lint`     | Run linting checks       |
| `npm run clean`    | Clean build artifacts    |
| `npm run typechain` | Generate TypeScript types |

## Contract Functions

### For Users
- `submitPrediction()`: Submit encrypted temperature and confidence predictions
- `getPrediction()`: Get prediction metadata
- `getEncryptedTemperature()`: Get encrypted temperature (owner-only before reveal)
- `getEncryptedConfidence()`: Get encrypted confidence (owner-only before reveal)
- `getUserPredictions()`: Get user's prediction IDs
- `getLeaderboardEntry()`: Get leaderboard entry for a prediction

### For Owner
- `revealPrediction()`: Reveal prediction after target date
- `updateLeaderboardAccuracy()`: Update accuracy score after decryption
- `pause()` / `unpause()`: Pause/unpause contract operations

## Network Configuration

- **Local Network**: Chain ID 31337, uses Mock FHEVM
- **Sepolia Testnet**: Chain ID 11155111, uses official FHEVM SDK

## Deployment

### Local Network

```bash
# Start Hardhat node
npx hardhat node

# Deploy contract
npx hardhat deploy --network localhost

# Update ui/src/config/contracts.ts with deployed address
```

### Sepolia Testnet

```bash
# Deploy to Sepolia
npx hardhat deploy --network sepolia

# Update ui/src/config/contracts.ts with deployed address

# Verify contract on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### Vercel Deployment

1. **Get WalletConnect Project ID**
   - Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project or use existing one
   - Copy your Project ID

2. **Update WalletConnect Project ID**
   - Open `ui/src/lib/wagmi.ts`
   - Replace `YOUR_PROJECT_ID` with your actual WalletConnect Project ID

3. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI (if not already installed)
   npm i -g vercel

   # Navigate to ui directory
   cd ui

   # Deploy to Vercel
   vercel

   # Or connect via Vercel dashboard:
   # 1. Go to https://vercel.com
   # 2. Import your Git repository
   # 3. Set Root Directory to "ui"
   # 4. Framework Preset: Vite
   # 5. Build Command: npm run build
   # 6. Output Directory: dist
   ```

4. **Configure Environment Variables (if needed)**
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add any required environment variables

5. **Update Contract Address for Production**
   - After deploying contract to Sepolia, update `ui/src/config/contracts.ts`
   - Set `CONTRACT_ADDRESSES[11155111]` with your Sepolia contract address
   - Redeploy to Vercel

## Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Hardhat Setup Guide](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup)
- [FHEVM Testing Guide](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat/write_test)

## License

This project is licensed under the BSD-3-Clause-Clear License. See the [LICENSE](LICENSE) file for details.

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/zama-ai/fhevm/issues)
- **Documentation**: [FHEVM Docs](https://docs.zama.ai)
- **Community**: [Zama Discord](https://discord.gg/zama)
