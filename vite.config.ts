import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
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
  }
});