import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { ServerOptions } from 'https';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '');
  
  // Default HTTPS options
  const httpsOptions: ServerOptions | undefined = mode === 'development' 
    ? undefined 
    : undefined;

  return {
    // React plugin for React support
    plugins: [
      react(),
      // Add Node.js polyfills for Web3 libraries
      nodePolyfills({
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true,
        // Whether to polyfill global variables like `global`, `process`, etc.
        globals: {
          global: true,
          process: true,
        }
      })
    ],
    
    // Define environment variables
    define: {
      'import.meta.env.VITE_WALLETCONNECT_PROJECT_ID': JSON.stringify(env.VITE_WALLETCONNECT_PROJECT_ID),
      'import.meta.env.VITE_ALCHEMY_ID': JSON.stringify(env.VITE_ALCHEMY_ID),
      // Add other environment variables as needed
      'process.env': {}
    },
    
    // Resolve configuration
    resolve: {
      alias: {
        // Ensure proper resolution of Node.js core modules
        'node:crypto': 'crypto-browserify',
        'node:stream': 'stream-browserify',
        'node:http': 'stream-http',
        'node:https': 'https-browserify',
      }
    },
    
    // Build optimizations
    build: {
      rollupOptions: {
        // Ensure compatibility with Web3 libraries
        external: ['@web3modal/wagmi', 'wagmi', 'viem']
      },
      // Chunk splitting for better performance
      chunkSizeWarningLimit: 1000
    },
    
    // Development server configuration
    server: {
      // Use undefined or proper ServerOptions
      https: httpsOptions,
      // Open browser on server start
      open: true
    },
    
    // Optimizations
    optimizeDeps: {
      // Force pre-bundling of specific libraries
      include: [
        'wagmi',
        'viem',
        '@web3modal/wagmi',
        '@tanstack/react-query'
      ],
      // Exclude browser-specific modules
      exclude: ['@web3modal/html']
    }
  };
});