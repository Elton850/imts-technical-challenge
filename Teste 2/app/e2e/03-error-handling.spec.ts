import { test, expect } from '@playwright/test';
import {
  navigateToApp,
  fillTokenAndUploadFile,
  setupZaiRateLimitMock,
  setupZaiInvalidJsonMock,
  getAnalyzeButton,
} from './helpers/page-helpers';
import * as path from 'path';

test.describe('Cenário 3 – Tratamento de erros', () => {

  test('deve exibir erro de rate limit ao receber 429', async ({ page }) => {
    await setupZaiRateLimitMock(page);
    await navigateToApp(page);
    await fillTokenAndUploadFile(page);
    await page.locator('[data-testid="analyze-btn"]').click();

    await expect(page.locator('[data-testid="error-banner"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="error-banner"]')).toContainText('Limite de requis');
    await expect(page.locator('[data-testid="error-retry-hint"]')).toContainText('3 segundos');
    await expect(page.locator('[data-testid="retry-cooldown-note"]')).toContainText('3s');

    // Botão deve respeitar a janela curta de retentativa e reabilitar depois
    await expect(getAnalyzeButton(page)).toBeDisabled();
    await expect(getAnalyzeButton(page)).not.toBeDisabled({ timeout: 5000 });
  });

  test('deve exibir erro de parse para JSON inválido', async ({ page }) => {
    await setupZaiInvalidJsonMock(page);
    await navigateToApp(page);
    await fillTokenAndUploadFile(page);
    await page.locator('[data-testid="analyze-btn"]').click();

    await expect(page.locator('[data-testid="error-banner"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="error-banner"]')).toContainText('interpretar');
    await expect(page.locator('[data-testid="error-retry-hint"]')).toContainText('3 segundos');
    await expect(page.locator('[data-testid="retry-cooldown-note"]')).toContainText('3s');
  });

  test('deve exibir erro ao tentar enviar arquivo não .txt', async ({ page }) => {
    await navigateToApp(page);

    // Cria um arquivo fake com extensão .json
    const { writeFileSync, unlinkSync } = await import('fs');
    const tmpPath = path.join(__dirname, 'fixtures', '_temp_test.json');
    writeFileSync(tmpPath, '{"test": true}');

    try {
      const fileInput = page.locator('[data-testid="file-input"]');
      await fileInput.setInputFiles(tmpPath);
      await expect(page.locator('[data-testid="error-banner"]')).toBeVisible({ timeout: 5000 });
    } finally {
      unlinkSync(tmpPath);
    }
  });

  test('botão deve estar desabilitado sem token mesmo com arquivo', async ({ page }) => {
    await navigateToApp(page);

    // Sobe arquivo mas NÃO preenche token
    const fileInput = page.locator('[data-testid="file-input"]');
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures/sample-chat.txt'));

    await expect(getAnalyzeButton(page)).toBeDisabled();
  });

  test('botão deve estar desabilitado durante loading', async ({ page }) => {
    // Mock que demora para responder
    await page.route('**/api/paas/v4/chat/completions', async (route) => {
      await new Promise((r) => setTimeout(r, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{ message: { role: 'assistant', content: '{"resumo":"ok","indicadores":{"envolvidos":1,"tarefas":0,"prazos":0,"riscos":0,"conflitos":0,"sentimento":5},"participantes":["Teste"],"tarefas":[],"prazos":[],"riscos":[],"conflitos":[]}' } }],
        }),
      });
    });

    await navigateToApp(page);
    await fillTokenAndUploadFile(page);
    await page.locator('[data-testid="analyze-btn"]').click();

    // Durante loading, botão deve estar desabilitado
    await expect(getAnalyzeButton(page)).toBeDisabled();
    await expect(page.locator('[data-testid="processing-notice"]')).toContainText('2,5');
    await expect(page.locator('[data-testid="loading-state"]')).toContainText('3 segundos');
  });
});
