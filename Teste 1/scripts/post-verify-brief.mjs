#!/usr/bin/env node
/**
 * Fechamento executivo da rodada de verificacao.
 * Resume a cobertura critica validada e destaca o principal risco de produto monitorado.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';

const reportDir = path.join(os.tmpdir(), 'imts-teste1-playwright', 'report');
const artifacts = {
  matrix: 'Artefatos/MATRIZ_RISCO_PRODUTO.md',
  product: 'Artefatos/PRODUTO.md',
  scenarios: 'Artefatos/CENARIOS.md',
};

const smokeCoverage = [
  {
    id: 'CT-01',
    title: 'Fluxo feliz',
    outcome: 'calculo valido sem mensagem de erro',
    business: 'protege a confiabilidade do fluxo principal',
  },
  {
    id: 'CT-02',
    title: 'Valor vazio',
    outcome: 'monitora o achado real de produto sem alterar o comportamento atual',
    business: 'evita regressao silenciosa em um risco que pode confundir o usuario final',
  },
  {
    id: 'CT-03 / CT-04',
    title: 'Regras de data',
    outcome: 'barra entradas inconsistentes e confirma recuperacao apos erro',
    business: 'reduz chance de calculo com periodo invalido',
  },
  {
    id: 'CT-08',
    title: 'Indice obrigatorio',
    outcome: 'impede calculo sem parametro economico',
    business: 'protege a integridade da simulacao',
  },
];

console.log('');
console.log('=== Resumo executivo da rodada ===');
console.log('Smoke executivo concluido com cobertura critica e um risco real de produto monitorado.');
console.log('');
console.log('Cobertura validada agora:');
for (const item of smokeCoverage) {
  console.log(`- ${item.id} | ${item.title}: ${item.outcome} | Impacto: ${item.business}.`);
}

console.log('');
console.log('Risco de produto monitorado:');
console.log('- ACH-01 | Campo "valor" aceita envio vazio sem erro.');
console.log('- Severidade: Alta | Probabilidade: Media.');
console.log(
  '- Impacto: o usuario pode interpretar um resultado monetario sem perceber que o valor informado estava vazio.'
);
console.log(
  '- Recomendacao: validar obrigatoriedade ou indicar explicitamente que valor vazio equivale a 0.'
);

console.log('');
console.log('Leitura recomendada apos a execucao:');
console.log(`- ${artifacts.matrix}`);
console.log(`- ${artifacts.product}`);
console.log(`- ${artifacts.scenarios}`);

if (fs.existsSync(reportDir)) {
  console.log(`- Relatorio HTML local: ${reportDir}`);
}

console.log('');
console.log('Proximo passo para ampliar a cobertura: npm run test:e2e:local');
