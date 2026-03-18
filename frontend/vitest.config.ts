import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      // Mirror Quasar's src alias so imports like 'src/stores/auth' work in tests
      src: fileURLToPath(new URL('./src', import.meta.url)),
      // Stub out boot/axios so tests don't need a real axios instance
      'boot/axios': fileURLToPath(new URL('./src/test/mocks/axios.ts', import.meta.url)),
    },
  },

  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
    exclude: ['e2e/**', 'node_modules/**'],  // ← top level of test block
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/test/**', 'src/**/*.d.ts'],  // ← only affects coverage
    },
  },
});