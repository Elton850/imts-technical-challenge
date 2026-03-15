/**
 * Configuração Playwright para o Teste 1 (Calculadora do Cidadão).
 * Local: artefatos em diretório temporário para evitar EPERM no Windows/OneDrive.
 */
import os from 'os';
import path from 'path';
import { defineConfig, devices } from '@playwright/test';

const isLocal = !process.env.CI;
const localRuntimeDir = path.join(os.tmpdir(), 'imts-teste1-playwright');
const outputDir = isLocal ? path.join(localRuntimeDir, 'artifacts') : '.pw-out';
const reportDir = isLocal ? path.join(localRuntimeDir, 'report') : 'playwright-report';

export default defineConfig({
  testDir: './tests',
  // Local: artefatos em os.tmpdir() para evitar EPERM em pastas sincronizadas (OneDrive).
  // CI: artefatos no projeto para upload do relatorio.
  outputDir,
  timeout: 60000,
  expect: { timeout: 15000 },
  retries: process.env.CI ? 2 : 1,
  workers: isLocal ? 1 : undefined, // workers=1 local: reduz spawn EPERM e lock no Windows
  reporter: [
    ['html', { open: 'never', outputFolder: reportDir }],
    ['list'],
  ],
  use: {
    baseURL: 'https://www3.bcb.gov.br',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
