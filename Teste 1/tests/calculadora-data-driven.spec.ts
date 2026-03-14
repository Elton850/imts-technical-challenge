/**
 * CT-10 - Teste data-driven com massa externa CSV
 *
 * Cenario: executar o formulario com multiplas combinacoes de dados lidas
 * de um arquivo CSV externo (data/massa-correcao.csv).
 * Cada linha da massa e executada independentemente.
 *
 * Colunas do CSV:
 *   valor        - valor monetario a ser corrigido
 *   dataInicial  - data inicial no formato MM/YYYY
 *   dataFinal    - data final no formato MM/YYYY
 *   indice       - valor do option no select (#selIndice)
 *   resultadoEsperado - descricao do resultado esperado (informativo)
 *   tipoCaso     - "valido" (sem .msgErro) ou "invalido" (com .msgErro)
 *
 * Oraculo por linha:
 *   tipoCaso == "valido"   -> .msgErro NAO visivel
 *   tipoCaso == "invalido" -> .msgErro visivel
 *
 * A massa CSV e validada antes da execucao (colunas obrigatorias, linhas validas).
 */
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import {
  abrirCalculadora,
  preencherFormulario,
  submeterFormulario,
  temErroVisivel,
} from './helpers';
import { validarMassaCSV } from './csv-validator';

interface LinhaMassa {
  valor: string;
  dataInicial: string;
  dataFinal: string;
  indice: string;
  resultadoEsperado: string;
  tipoCaso: string;
}

function lerMassaCSV(): LinhaMassa[] {
  const csvPath = path.join(__dirname, '..', 'data', 'massa-correcao.csv');
  const conteudo = fs.readFileSync(csvPath, 'utf-8');
  const linhas = conteudo.trim().split('\n');
  const cabecalhos = linhas[0].split(',').map((h) => h.trim());

  return linhas.slice(1).map((linha) => {
    const valores = linha.split(',').map((v) => v.trim());
    const obj: Record<string, string> = {};
    cabecalhos.forEach((cabecalho, i) => {
      obj[cabecalho] = valores[i] ?? '';
    });
    return obj as unknown as LinhaMassa;
  });
}

const validacaoCSV = validarMassaCSV();
const massaDados = validacaoCSV.ok ? lerMassaCSV() : [];

test.describe('CT-10 - Teste data-driven com CSV', () => {
  if (!validacaoCSV.ok) {
    test('CSV inválido - validação falhou', () => {
      const msg = [validacaoCSV.erro, ...(validacaoCSV.detalhes ?? [])].join('\n');
      throw new Error(`Validação do CSV falhou:\n${msg}`);
    });
  }

  for (const linha of massaDados) {
    const titulo = `[${linha.tipoCaso.toUpperCase()}] ${linha.dataInicial} -> ${linha.dataFinal} | indice:${linha.indice} | valor:${linha.valor}`;

    test(titulo, async ({ page }) => {
      await abrirCalculadora(page);

      await preencherFormulario(page, {
        indice: linha.indice,
        dataInicial: linha.dataInicial,
        dataFinal: linha.dataFinal,
        valor: linha.valor,
      });

      await submeterFormulario(page);

      const houveErro = await temErroVisivel(page);

      if (linha.tipoCaso === 'valido') {
        expect(
          houveErro,
          `Caso valido "${titulo}" nao deve gerar erro. Resultado esperado: ${linha.resultadoEsperado}`
        ).toBe(false);
      } else {
        expect(
          houveErro,
          `Caso invalido "${titulo}" deve gerar erro. Resultado esperado: ${linha.resultadoEsperado}`
        ).toBe(true);
      }
    });
  }
});
