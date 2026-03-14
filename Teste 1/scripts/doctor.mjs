#!/usr/bin/env node
/**
 * Valida ambiente local antes de rodar testes.
 * Falha com exit 1 se Node fora da faixa 18-20 (evita spawn EPERM com Node 24+ no Windows).
 */
const nodeMajor = Number(process.versions.node.split('.')[0]);
const cwd = process.cwd();
const blockers = [];
const warnings = [];

if (nodeMajor < 18 || nodeMajor >= 21) {
  blockers.push(
    `Node ${process.versions.node} detectado. Este projeto requer Node 18, 19 ou 20. ` +
      `Node 24+ pode causar spawn EPERM no Windows. Use: nvm use (se .nvmrc) ou instale Node 20 LTS.`
  );
}

if (/OneDrive/i.test(cwd)) {
  warnings.push('Projeto em pasta OneDrive — pode causar EPERM. Artefatos sao salvos em %TEMP%.');
}

if (process.platform === 'win32') {
  warnings.push('Windows: feche previews de relatorio e processos que segurem arquivos antes de rodar.');
}

if (blockers.length > 0) {
  console.error('[doctor] Bloqueadores:');
  for (const b of blockers) console.error(`  - ${b}`);
  if (warnings.length > 0) {
    console.error('[doctor] Alertas:');
    for (const w of warnings) console.error(`  - ${w}`);
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.log('[doctor] Alertas:');
  for (const w of warnings) console.log(`  - ${w}`);
} else {
  console.log('[doctor] Ambiente OK.');
}
process.exit(0);
