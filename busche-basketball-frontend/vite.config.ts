/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split the leaf vendor libraries into their own chunks so the app code
        // can be re-downloaded without re-fetching them. React is deliberately
        // left in the main chunk -- splitting it risks load-order problems.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('@phosphor-icons')) return 'icons'
          if (id.includes('gsap')) return 'gsap'
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
