import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  retries: process.env.CI ? 2 : 0,
  webServer: {
    // Build first so e2e always runs against the current source, never a stale dist/.
    // CI's workflow has already built (its dist/ also feeds the pages artifact), so skip the rebuild there.
    command: process.env.CI ? 'npm run preview' : 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:4173',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
