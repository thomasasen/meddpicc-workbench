import { defineConfig, devices } from '@playwright/test'

const webServerCommand =
  process.env.PLAYWRIGHT_PREBUILT === '1'
    ? 'npm run preview -- --host 127.0.0.1 --port 4173'
    : 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://127.0.0.1:4173/meddpicc-workbench/',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: webServerCommand,
    url: 'http://127.0.0.1:4173/meddpicc-workbench/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 5'] },
    },
  ],
})
