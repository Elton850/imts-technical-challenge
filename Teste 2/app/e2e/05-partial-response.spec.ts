import { test, expect } from '@playwright/test';
import { navigateToApp, fillTokenAndUploadFile } from './helpers/page-helpers';

test.describe('Cenário 5 – Resposta parcial da IA não quebra UI', () => {

  test('deve renderizar dashboard mesmo com resposta sem participantes e listas', async ({ page }) => {
    // Mock com payload mínimo (campos opcionais ausentes)
    await page.route('**/api/paas/v4/chat/completions', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              role: 'assistant',
              content: JSON.stringify({
                resumo: 'Conversa simples sem detalhes adicionais.',
                indicadores: { envolvidos: 0, tarefas: 0, prazos: 0, riscos: 0, conflitos: 0, sentimento: 5 },
                // participantes, tarefas, prazos, riscos, conflitos omitidos
              }),
            },
          }],
        }),
      });
    });

    await navigateToApp(page);
    await fillTokenAndUploadFile(page);
    await page.locator('[data-testid="analyze-btn"]').click();

    // Dashboard deve aparecer sem erros
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({ timeout: 15000 });

    // Listas devem existir mas mostrar mensagem de vazio
    await expect(page.locator('[data-testid="tarefas-empty"]')).toBeVisible();
    await expect(page.locator('[data-testid="prazos-empty"]')).toBeVisible();
    await expect(page.locator('[data-testid="riscos-empty"]')).toBeVisible();
    await expect(page.locator('[data-testid="conflitos-empty"]')).toBeVisible();

    // KPIs devem ser 0 mas visíveis
    await expect(page.locator('[data-testid="kpi-tarefas"]')).toContainText('0');
  });

  test('deve renderizar dashboard com sentimento em qualquer faixa', async ({ page }) => {
    await page.route('**/api/paas/v4/chat/completions', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: {
              role: 'assistant',
              content: JSON.stringify({
                resumo: 'Conversa muito negativa.',
                indicadores: { envolvidos: 2, tarefas: 0, prazos: 0, riscos: 0, conflitos: 1, sentimento: 1 },
                sentimentoDescricao: 'Conversa muito negativa.',
                participantes: ['Alice', 'Bob'],
                tarefas: [],
                prazos: [],
                riscos: [],
                conflitos: [{ descricao: 'Desentendimento sério', envolvido: 'Alice' }],
              }),
            },
          }],
        }),
      });
    });

    await navigateToApp(page);
    await fillTokenAndUploadFile(page);
    await page.locator('[data-testid="analyze-btn"]').click();

    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="sentimento-card"]')).toContainText('Conversa muito negativa');
  });
});
