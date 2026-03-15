/**
 * Helpers E2E do WhatsAnalizer: mocks da API Z.AI, navegação e preenchimento de token/arquivo.
 */
import { Page, Route } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const MOCK_RESPONSE = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../fixtures/mock-analysis-response.json'), 'utf-8')
);

/** Intercepta chamadas à Z.AI e responde com mock de análise válida (fixtures). */
export async function setupZaiMock(page: Page): Promise<void> {
  await page.route('**/api/paas/v4/chat/completions', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_RESPONSE),
    });
  });
}

/** Intercepta Z.AI e retorna 429 para testar tratamento de rate limit. */
export async function setupZaiRateLimitMock(page: Page): Promise<void> {
  await page.route('**/api/paas/v4/chat/completions', (route: Route) => {
    route.fulfill({
      status: 429,
      contentType: 'application/json',
      body: JSON.stringify({ error: { code: 1302, message: 'Rate limit exceeded' } }),
    });
  });
}

/** Intercepta Z.AI e aborta a rota para simular timeout. */
export async function setupZaiTimeoutMock(page: Page): Promise<void> {
  await page.route('**/api/paas/v4/chat/completions', (route: Route) => {
    // Não responde — força timeout
    route.abort('timedout');
  });
}

/** Intercepta Z.AI e retorna content não-JSON para testar parse_error. */
export async function setupZaiInvalidJsonMock(page: Page): Promise<void> {
  await page.route('**/api/paas/v4/chat/completions', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        choices: [{ message: { role: 'assistant', content: 'Este não é um JSON válido {{{' } }],
      }),
    });
  });
}

/** Navega para /whatsanalizer e aguarda o header estar visível. */
export async function navigateToApp(page: Page): Promise<void> {
  await page.goto('/whatsanalizer');
  await page.waitForSelector('[data-testid="app-header"]');
}

/** Preenche o campo token e faz upload do arquivo (padrão: sample-chat.txt). */
export async function fillTokenAndUploadFile(page: Page, filePath?: string): Promise<void> {
  // Preenche token
  const tokenInput = page.locator('[data-testid="token-input"] input');
  await tokenInput.fill('test-token-fake-12345');

  // Upload de arquivo
  const fileInput = page.locator('[data-testid="file-input"]');
  const fp = filePath ?? path.join(__dirname, '../fixtures/sample-chat.txt');
  await fileInput.setInputFiles(fp);
}

/** Botão real dentro do p-button (PrimeNG); usado para assertivas de disabled. */
export function getAnalyzeButton(page: Page) {
  return page.locator('[data-testid="analyze-btn"] button');
}
