#!/usr/bin/env node
/**
 * Abre o relatorio HTML do Playwright no navegador.
 * O relatorio e gerado em os.tmpdir()/imts-teste1-playwright/report (ambiente local).
 */
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';

const defaultReportDir = path.join(os.tmpdir(), 'imts-teste1-playwright', 'report');

function resolveReportDir(inputArg) {
  if (!inputArg) return defaultReportDir;

  const provided = path.resolve(inputArg);
  if (fs.existsSync(provided)) return provided;

  // Correcao de erro comum: "repo" em vez de "report".
  if (path.basename(provided).toLowerCase() === 'repo') {
    const siblingReport = path.join(path.dirname(provided), 'report');
    if (fs.existsSync(siblingReport)) return siblingReport;
  }

  return provided;
}

const requestedDir = process.argv[2];
const reportDir = resolveReportDir(requestedDir);

if (!fs.existsSync(reportDir)) {
  console.error('[show-report] Relatorio nao encontrado.');
  console.error(`[show-report] Caminho informado/resolvido: ${reportDir}`);
  console.error(`[show-report] Caminho esperado local: ${defaultReportDir}`);
  console.error('[show-report] Se estiver abrindo manualmente, use a pasta "report" (nao "repo").');
  console.error('[show-report] Gere o relatorio com: npm run test:verify');
  console.error('[show-report] Depois abra com: npm run test:e2e:report');
  process.exit(1);
}

const child = spawn('npx', ['playwright', 'show-report', reportDir], {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
