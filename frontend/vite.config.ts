import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: '../',
  server: {
    port: 3000,
    host: true
  },
  base: '/market-intelligence-project/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
})
