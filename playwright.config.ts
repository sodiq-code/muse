import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration for Muse.
 *
 * Tests run against the local dev server (simulate mode) so they don't
 * consume Minds cognition credits. Set MUSE_E2E_BASE_URL to test a
 * deployed environment instead.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: process.env.MUSE_E2E_BASE_URL ?? 'http://localhost:3456',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'bun run dev:e2e',
    url: 'http://localhost:3456',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
