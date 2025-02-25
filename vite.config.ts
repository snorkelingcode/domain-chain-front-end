import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "connect-src 'self' 'https://connect.walletconnect.org'",
        "img-src 'self' 'https://explorer-api.walletconnect.com' 'https://thirdweb.com' 'https://*.thirdweb.com' 'https://thirdweb-cdn.com' 'https://*.thirdweb-cdn.com' 'data:' 'https://domainchain.link'",
        "frame-ancestors 'none'",
      ].join("; "),
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
});