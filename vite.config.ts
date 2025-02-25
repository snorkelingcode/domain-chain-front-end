import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
  },
  server: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "connect-src 'self' https://connect.walletconnect.org https://explorer-api.walletconnect.com",
        "img-src 'self' https://explorer-api.walletconnect.com data: https://thirdweb.com https://*.thirdweb.com https://thirdweb-cdn.com https://*.thirdweb-cdn.com",
        "frame-ancestors 'none'",
      ].join("; "),
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
});