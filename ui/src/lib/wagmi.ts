import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, hardhat } from "wagmi/chains";
import { http, createConfig } from "wagmi";
import { injected, metaMask } from "wagmi/connectors";

// For local development, we use a placeholder project ID
// In production, replace with your actual WalletConnect project ID from https://cloud.walletconnect.com
const PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "a797aa35c0fadbfc1a53e7f675162ed5";

export const config = createConfig({
  appName: "Private Weather Guess",
  chains: [
    {
      ...hardhat,
      id: 31337,
      name: "Localhost",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: {
        default: {
          http: ["http://localhost:8545"],
        },
      },
    },
    sepolia,
  ],
  connectors: [
    injected(),
    metaMask(),
    // WalletConnect is optional for local development
    // Uncomment and add your PROJECT_ID for production
    // walletConnect({ projectId: PROJECT_ID }),
  ],
  transports: {
    [hardhat.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: false,
});
