const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://127.0.0.1:5173', browserName: 'chromium', headless: true },
  webServer: [
    {
      command: 'npm start',
      cwd: './backend',
      url: 'http://127.0.0.1:3001/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1',
      cwd: './frontend',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
  ],
});
