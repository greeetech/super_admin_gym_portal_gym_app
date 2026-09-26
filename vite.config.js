import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      '/admin': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})