import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const authFile = 'playwright/.auth/admin.json';

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.(spec|test)\.(ts|tsx)/,
  testIgnore: ['**/src/**', '**/node_modules/**'],
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  globalSetup: require.resolve('./tests/global.setup'),
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      dependencies: ['setup'],
    },
  ],
});
