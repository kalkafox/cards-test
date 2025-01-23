import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

if (process.env.GH_REPO) {
  console.log('GitHub repo detected!')
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GH_REPO ?? '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client'],
          motion: ['motion', 'motion/react'],
          jotai: ['jotai', 'jotai/utils'],
          countup: ['react-countup'],
          markdown: ['react-markdown'],
          iconify: ['@iconify/react'],
          zod: ['zod'],
        },
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
