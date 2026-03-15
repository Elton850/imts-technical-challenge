import { test, expect } from '@playwright/test';
import { navigateToApp, fillTokenAndUploadFile, setupZaiMock } from './helpers/page-helpers';

test.describe('Cenário 4 – Filtro por participante', () => {
  test.beforeEach(async ({ page }) => {
    await setupZaiMock(page);
    await navigateToApp(page);
    await fillTokenAndUploadFile(page);
    await page.locator('[data-testid="analyze-btn"]').click();
    await page.locator('[data-testid="dashboard-content"]').waitFor({ state: 'visible', timeout: 15000 });
  });

  test('deve exibir filtro com opção "Todos" e participantes', async ({ page }) => {
    const filter = page.locator('[data-testid="participant-filter"]');
    await expect(filter).toBeVisible();
    await filter.click();
    await expect(page.locator('.p-select-option').filter({ hasText: 'Todos' })).toBeVisible();
    await expect(page.locator('.p-select-option').filter({ hasText: 'Ana' })).toBeVisible();
    await expect(page.locator('.p-select-option').filter({ hasText: 'Bruno' })).toBeVisible();
    await expect(page.locator('.p-select-option').filter({ hasText: 'Carlos' })).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('badges devem refletir total sem filtro', async ({ page }) => {
    await expect(page.locator('[data-testid="tarefas-card"] [data-testid="tarefa-item"]')).toHaveCount(3);
    await expect(page.locator('[data-testid="prazos-card"] [data-testid="prazo-item"]')).toHaveCount(2);
    await expect(page.locator('[data-testid="riscos-card"] [data-testid="risco-item"]')).toHaveCount(2);
    await expect(page.locator('[data-testid="conflitos-card"] [data-testid="conflito-item"]')).toHaveCount(1);
  });

  test('filtrar por Ana deve atualizar as 4 listas', async ({ page }) => {
    const filter = page.locator('[data-testid="participant-filter"]');
    await filter.click();
    await page.locator('.p-select-option').filter({ hasText: 'Ana' }).click();

    await expect(page.locator('[data-testid="tarefas-card"] [data-testid="tarefa-item"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="prazos-card"] [data-testid="prazo-item"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="riscos-card"] [data-testid="risco-item"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="conflitos-card"] [data-testid="conflito-item"]')).toHaveCount(0);
  });

  test('selecionar Bruno deve refletir contagens (1 tarefa, 1 prazo, 0 riscos, 1 conflito)', async ({ page }) => {
    const filter = page.locator('[data-testid="participant-filter"]');
    await filter.click();
    await page.locator('.p-select-option').filter({ hasText: 'Bruno' }).click();

    await expect(page.locator('[data-testid="tarefas-card"] [data-testid="tarefa-item"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="prazos-card"] [data-testid="prazo-item"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="riscos-card"] [data-testid="risco-item"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="conflitos-card"] [data-testid="conflito-item"]')).toHaveCount(1);
  });
});
