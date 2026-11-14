import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const target = process.env.API_TARGET || 'http://localhost:4000';

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': target, '/uploads': target } },
  build: {
    rollupOptions: {
      // Separate long-lived vendor chunks: cached across deploys and downloaded in parallel.
      output: { manualChunks: { react: ['react', 'react-dom', 'react-router-dom'], motion: ['framer-motion'] } },
    },
  },
});
