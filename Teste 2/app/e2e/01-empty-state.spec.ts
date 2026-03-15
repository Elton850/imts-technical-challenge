import { test, expect } from '@playwright/test';
import { navigateToApp, getAnalyzeButton } from './helpers/page-helpers';

test.describe('Cenário 1 – Estado vazio inicial', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToApp(page);
  });

  test('deve exibir o header com título AI Chat Insights', async ({ page }) => {
    await expect(page.locator('[data-testid="app-header"]')).toBeVisible();
    await expect(page.locator('.header-title')).toContainText('AI Chat Insights');
  });

  test('deve exibir o painel de configuração', async ({ page }) => {
    await expect(page.locator('[data-testid="config-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="system-prompt-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="model-select"]')).toBeVisible();
    await expect(page.locator('[data-testid="temperature-slider"]')).toBeVisible();
    await expect(page.locator('[data-testid="token-input"]')).toBeVisible();
  });

  test('deve exibir o empty state orientando o usuário', async ({ page }) => {
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible();
    await expect(page.locator('[data-testid="empty-state"]')).toContainText('Nenhuma análise carregada');
    await expect(page.locator('[data-testid="empty-state"]')).toContainText('.txt');
  });

  test('deve exibir mensagem de que dados não são armazenados no app', async ({ page }) => {
    await expect(page.locator('[data-testid="empty-state"]')).toContainText('não são armazenados');
  });

  test('botão de análise deve estar desabilitado sem arquivo', async ({ page }) => {
    const btn = getAnalyzeButton(page);
    await expect(btn).toBeVisible();
    await expect(btn).toBeDisabled();
  });

  test('dashboard não deve ser exibido no estado vazio', async ({ page }) => {
    await expect(page.locator('[data-testid="dashboard-content"]')).not.toBeVisible();
  });
});
