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
    environment: 'happy-dom',   // Lightweight DOM, faster than jsdom
    globals: true,              // No need to import describe/it/expect in every file
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/test/**', 'src/**/*.d.ts'],
    },
  },
});