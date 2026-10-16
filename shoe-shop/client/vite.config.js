import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In local development the API is the Express server running on this machine. Point the dev
// proxy at it instead of the deployed backend (set API_URL to override, e.g. to test the remote
// API). Production rewrites live in vercel.json and are unaffected.
const target = process.env.API_URL || 'http://localhost:4000';
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { '/api': target, '/uploads': target } },
});
