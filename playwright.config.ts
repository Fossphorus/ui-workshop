import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'npm start -- --host 127.0.0.1 --port 4310',
    url: 'http://127.0.0.1:4310',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000
  },
  use: {
    baseURL: 'http://127.0.0.1:4310',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    }
  ]
});
