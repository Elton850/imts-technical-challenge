import { defineConfig, devices } from '@playwright/test';

const isLocal = !process.env.CI;

export default defineConfig({
  testDir: './tests',
  // Output isolado para evitar EPERM em pastas sincronizadas (OneDrive/Desktop)
  outputDir: '.pw-out',
  // Timeout generoso para site externo governamental
  timeout: 60000,
  expect: { timeout: 15000 },
  // Retry: 2 em CI, 1 local (reduz flakiness por rede)
  retries: process.env.CI ? 2 : 1,
  // workers=1 local: reduz spawn EPERM e lock entre processos no Windows
  workers: isLocal ? 1 : undefined,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list'],
  ],
  use: {
    baseURL: 'https://www3.bcb.gov.br',
    // Screenshot apenas em falha (evidencia rastreavel)
    screenshot: 'only-on-failure',
    // Trace em falha para diagnostico
    trace: 'retain-on-failure',
    headless: true,
    // Viewport padrao desktop
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
