import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Impor modul 'path' bawaan Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Definisikan alias '@' untuk menunjuk ke direktori '/src'
      '@': path.resolve(__dirname, './src'),
    },
  },
})
