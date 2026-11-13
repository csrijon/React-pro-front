import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The mock catalogue is bundled with the app, so the main chunk is a little larger than the default limit.
  build: { chunkSizeWarningLimit: 800, manifest: true }, // manifest: lets scripts/postbuild.mjs preload each route's chunks
})
