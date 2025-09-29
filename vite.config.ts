import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },
  test: {
    ...configDefaults,
    environment: 'jsdom', // necesario para simular el DOM
    globals: true,
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8', // or 'istanbul' depending on your needs
    },
  },
})
