import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import { injected, walletConnect, metaMask } from 'wagmi/connectors';

export const config = createConfig({
  appName: 'Private Weather Guess',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [
    {
      ...hardhat,
      id: 31337,
      name: 'Localhost',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: {
          http: ['http://localhost:8545'],
        },
      },
    },
    sepolia,
  ],
  connectors: [
    injected(),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
    metaMask(),
  ],
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: false,
});
