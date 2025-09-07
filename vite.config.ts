import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
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
