import { test, expect } from '@playwright/test';
import { navigateToApp, fillTokenAndUploadFile, setupZaiMock } from './helpers/page-helpers';

test.describe('Cenário 2 – Upload e análise com sucesso', () => {
  test.beforeEach(async ({ page }) => {
    await setupZaiMock(page);
    await navigateToApp(page);
  });

  test('deve exibir aviso de privacidade ao ter arquivo e token preenchidos', async ({ page }) => {
    await fillTokenAndUploadFile(page);
    await expect(page.locator('[data-testid="privacy-notice"]')).toBeVisible();
    await expect(page.locator('[data-testid="privacy-notice"]')).toContainText('Z.AI');
    await expect(page.locator('[data-testid="privacy-notice"]')).toContainText('conteúdo da conversa');
  });

  test('deve orientar sobre demora esperada e possibilidade de retentativa', async ({ page }) => {
    await fillTokenAndUploadFile(page);
    await expect(page.locator('[data-testid="processing-notice"]')).toBeVisible();
    await expect(page.locator('[data-testid="processing-notice"]')).toContainText('2,5');
    await expect(page.locator('[data-testid="processing-notice"]')).toContainText('3 segundos');
    await expect(page.locator('[data-testid="processing-notice"]')).toContainText('sem m');
  });

  test('deve aceitar arquivo .txt e habilitar botão de análise', async ({ page }) => {
    await fillTokenAndUploadFile(page);

    // Nome do arquivo deve aparecer
    await expect(page.locator('[data-testid="file-name"]')).toContainText('sample-chat.txt');

    // Botão deve estar habilitado
    const btn = page.locator('[data-testid="analyze-btn"]');
    await expect(btn).not.toBeDisabled();
  });

  test('deve executar análise e exibir dashboard com KPIs', async ({ page }) => {
    await fillTokenAndUploadFile(page);

    // Clica em analisar
    await page.locator('[data-testid="analyze-btn"]').click();

    // Aguarda dashboard aparecer
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="overview-section-header"]')).toContainText('Panorama da conversa');
    await expect(page.locator('[data-testid="action-section-header"]')).toContainText('Itens acionáveis');

    // Verifica KPIs presentes
    await expect(page.locator('[data-testid="kpi-envolvidos"]')).toBeVisible();
    await expect(page.locator('[data-testid="kpi-tarefas"]')).toBeVisible();
    await expect(page.locator('[data-testid="kpi-prazos"]')).toBeVisible();
    await expect(page.locator('[data-testid="kpi-riscos"]')).toBeVisible();
    await expect(page.locator('[data-testid="kpi-conflitos"]')).toBeVisible();
  });

  test('deve exibir resumo executivo após análise', async ({ page }) => {
    await fillTokenAndUploadFile(page);
    await page.locator('[data-testid="analyze-btn"]').click();
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({ timeout: 15000 });

    await expect(page.locator('[data-testid="resumo-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="resumo-text"]')).not.toBeEmpty();
  });

  test('deve exibir análise de sentimento com emoji e título', async ({ page }) => {
    await fillTokenAndUploadFile(page);
    await page.locator('[data-testid="analyze-btn"]').click();
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({ timeout: 15000 });

    await expect(page.locator('[data-testid="sentimento-card"]')).toContainText('Clima majoritariamente');
  });

  test('deve exibir participantes como chips', async ({ page }) => {
    await fillTokenAndUploadFile(page);
    await page.locator('[data-testid="analyze-btn"]').click();
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({ timeout: 15000 });

    await expect(page.locator('[data-testid="participantes-chips"]')).toBeVisible();
    const chips = page.locator('[data-testid="participantes-chips"] .p-chip');
    await expect(chips).toHaveCount(3);
  });

  test('deve exibir as 4 listas de itens', async ({ page }) => {
    await fillTokenAndUploadFile(page);
    await page.locator('[data-testid="analyze-btn"]').click();
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({ timeout: 15000 });

    await expect(page.locator('[data-testid="filter-row"]')).toContainText('Filtrar por participante');
    await expect(page.locator('[data-testid="tarefas-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="prazos-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="riscos-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="conflitos-card"]')).toBeVisible();
  });

  test('deve exibir botão Exportar resumo e baixar .txt ao clicar', async ({ page }) => {
    await fillTokenAndUploadFile(page);
    await page.locator('[data-testid="analyze-btn"]').click();
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({ timeout: 15000 });

    const exportBtn = page.locator('[data-testid="export-summary-btn"]');
    await expect(exportBtn).toBeVisible({ timeout: 10000 });
    await expect(exportBtn).toContainText('Exportar resumo');

    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await exportBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^whatsanalizer-resumo-\d{4}-\d{2}-\d{2}\.txt$/);
  });
});
