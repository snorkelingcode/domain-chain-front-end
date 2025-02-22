import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react(), nodePolyfills()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'web3': ['wagmi', '@web3modal/wagmi'],
            'react-vendor': ['react', 'react-dom'],
            'ui-components': ['recharts', 'lucide-react']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    define: {
      // Ensure env variables are properly stringified
      'process.env.VITE_WALLETCONNECT_PROJECT_ID': JSON.stringify(env.VITE_WALLETCONNECT_PROJECT_ID),
      // Add other environment variables as needed
      'process.env.VITE_DOMAIN_NFT_CONTRACT_ADDRESS': JSON.stringify(env.VITE_DOMAIN_NFT_CONTRACT_ADDRESS),
      'process.env.VITE_TOKEN_CONTRACT_ADDRESS': JSON.stringify(env.VITE_TOKEN_CONTRACT_ADDRESS),
      'process.env.VITE_TREASURY_CONTRACT_ADDRESS': JSON.stringify(env.VITE_TREASURY_CONTRACT_ADDRESS),
      'process.env.VITE_ESCROW_CONTRACT_ADDRESS': JSON.stringify(env.VITE_ESCROW_CONTRACT_ADDRESS),
      'process.env.VITE_VERIFICATION_CONTRACT_ADDRESS': JSON.stringify(env.VITE_VERIFICATION_CONTRACT_ADDRESS)
    }
  };
});