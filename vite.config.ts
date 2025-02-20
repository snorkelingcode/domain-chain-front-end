import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size limit
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Manually split large dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});