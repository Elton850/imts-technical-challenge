#!/usr/bin/env node
/**
 * Verifica o ambiente antes da execucao dos testes.
 * Emite avisos sem bloquear: Node 24+ e outros fatores de risco.
 * Em caso de spawn EPERM no Windows, usar Node 20 (nvm use ou LTS).
 */
const nodeMajor = Number(process.versions.node.split('.')[0]);
const cwd = process.cwd();
const warnings = [];

// Node 18-20 recomendado; Node 24+ pode causar spawn EPERM ao lancar Chromium no Windows
if (nodeMajor < 18 || nodeMajor >= 21) {
  warnings.push(
    `Node ${process.versions.node} detectado. Recomendado: Node 18, 19 ou 20. ` +
      `Node 24+ pode causar spawn EPERM no Windows. Se falhar: nvm use ou instale Node 20 LTS.`
  );
}

// Pastas sincronizadas (OneDrive, etc.) podem gerar locks e EPERM em operacoes de arquivo
if (/OneDrive/i.test(cwd)) {
  warnings.push('Projeto em pasta OneDrive — pode causar EPERM. Artefatos sao salvos em %TEMP%.');
}

// No Windows, processos que seguram arquivos abertos podem impedir limpeza ou escrita
if (process.platform === 'win32') {
  warnings.push('Windows: feche previews de relatorio e processos que segurem arquivos antes de rodar.');
}

if (warnings.length > 0) {
  console.log('[doctor] Alertas (execucao continua):');
  for (const w of warnings) console.log(`  - ${w}`);
} else {
  console.log('[doctor] Ambiente OK.');
}
process.exit(0);
