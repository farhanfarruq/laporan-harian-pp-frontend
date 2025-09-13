import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Tambahkan blok 'resolve' ini untuk mendefinisikan alias
  resolve: {
    alias: {
      // Ini memberitahu Vite bahwa '@' adalah shortcut untuk direktori '/src'
      '@': path.resolve(__dirname, './src'),
    },
  },
})

