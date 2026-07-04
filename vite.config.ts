import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Allow the Cloudflare Tunnel preview hostname to reach the local Vite server.
    // Keep this explicit. Do not use allowedHosts: true.
    allowedHosts: ['review.lastmileinc.ai'],
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure public files are copied to build output
    copyPublicDir: true,
  },
})