import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  // Auth tests share state and must run in order, not in parallel
  fullyParallel: false,
  workers: 1,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // No retries locally — if a test fails we want to know immediately
  retries: process.env.CI ? 2 : 0,

  // Plain terminal output — fits naturally alongside pytest and Vitest
  reporter: 'list',

  use: {
    // Quasar dev server — matches the CORS origin in your FastAPI backend
    baseURL: 'http://localhost:9000',

    // Collect trace on first retry to help debug CI failures
    trace: 'on-first-retry',

    // Don't open a browser window — headless fits our shell script approach
    headless: true,
  },

  // Chromium only for now — add firefox/webkit once tests are stable
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // We manage server startup in run_tests.sh, not here
  // webServer: { ... }
});