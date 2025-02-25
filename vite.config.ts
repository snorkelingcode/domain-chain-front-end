import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'  // Note: using react-swc for better performance
import path from 'path'

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
})