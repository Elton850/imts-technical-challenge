import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { navigateToApp, fillTokenAndUploadFile, setupZaiMock } from './helpers/page-helpers';

// ─── Leitura do CSV ─────────────────────────────────────────────────────────
interface FilterRow {
  participant: string;
  expectedTarefas: number;
  expectedPrazos: number;
  expectedRiscos: number;
  expectedConflitos: number;
}

function readCsv(filePath: string): FilterRow[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h.trim()] = (values[i] ?? '').trim(); });
    return {
      participant: row['participant'],
      expectedTarefas: parseInt(row['expectedTarefas'], 10),
      expectedPrazos: parseInt(row['expectedPrazos'], 10),
      expectedRiscos: parseInt(row['expectedRiscos'], 10),
      expectedConflitos: parseInt(row['expectedConflitos'], 10),
    };
  });
}

const csvPath = path.join(__dirname, 'fixtures/participants-filter.csv');
const testCases = readCsv(csvPath);

// ─── Testes orientados por CSV ───────────────────────────────────────────────
test.describe('Cenário 6 – Filtro por participante (CSV-driven)', () => {
  for (const tc of testCases) {
    const label = tc.participant || 'Todos';

    test(`filtrar por "${label}" → tarefas:${tc.expectedTarefas} prazos:${tc.expectedPrazos} riscos:${tc.expectedRiscos} conflitos:${tc.expectedConflitos}`, async ({ page }) => {
      await setupZaiMock(page);
      await navigateToApp(page);
      await fillTokenAndUploadFile(page);
      await page.locator('[data-testid="analyze-btn"]').click();
      await page.locator('[data-testid="dashboard-content"]').waitFor({ state: 'visible', timeout: 15000 });

      const filter = page.locator('[data-testid="participant-filter"]');
      await filter.click();

      if (tc.participant) {
        await page.locator('.p-select-option').filter({ hasText: tc.participant }).click();
      } else {
        await page.locator('.p-select-option').filter({ hasText: 'Todos' }).click();
      }

      await expect(page.locator('[data-testid="tarefas-card"] [data-testid="tarefa-item"]')).toHaveCount(tc.expectedTarefas);
      await expect(page.locator('[data-testid="prazos-card"] [data-testid="prazo-item"]')).toHaveCount(tc.expectedPrazos);
      await expect(page.locator('[data-testid="riscos-card"] [data-testid="risco-item"]')).toHaveCount(tc.expectedRiscos);
      await expect(page.locator('[data-testid="conflitos-card"] [data-testid="conflito-item"]')).toHaveCount(tc.expectedConflitos);
    });
  }
});
