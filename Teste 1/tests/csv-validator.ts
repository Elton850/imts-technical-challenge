/**
 * Validação da massa CSV antes da execução dos testes data-driven.
 * Garante colunas obrigatórias e linhas válidas, com mensagens amigáveis.
 */
import * as fs from 'fs';
import * as path from 'path';

export const COLUNAS_OBRIGATORIAS = [
  'valor',
  'dataInicial',
  'dataFinal',
  'indice',
  'resultadoEsperado',
  'tipoCaso',
] as const;

export type TipoCaso = 'valido' | 'invalido';

export interface ResultadoValidacao {
  ok: boolean;
  erro?: string;
  detalhes?: string[];
}

/**
 * Valida o arquivo CSV da massa de correção.
 * Retorna { ok: true } se válido, ou { ok: false, erro, detalhes } em caso de problema.
 */
export function validarMassaCSV(csvPath?: string): ResultadoValidacao {
  const basePath = csvPath ?? path.join(__dirname, '..', 'data', 'massa-correcao.csv');

  if (!fs.existsSync(basePath)) {
    return {
      ok: false,
      erro: `Arquivo CSV não encontrado: ${basePath}`,
      detalhes: [
        'Verifique se o arquivo data/massa-correcao.csv existe na pasta do projeto.',
        'Colunas obrigatórias: valor, dataInicial, dataFinal, indice, resultadoEsperado, tipoCaso',
      ],
    };
  }

  let conteudo: string;
  try {
    conteudo = fs.readFileSync(basePath, 'utf-8');
  } catch (e) {
    return {
      ok: false,
      erro: `Não foi possível ler o arquivo CSV: ${basePath}`,
      detalhes: [(e as Error).message],
    };
  }

  const linhas = conteudo.trim().split('\n');
  if (linhas.length < 2) {
    return {
      ok: false,
      erro: 'O arquivo CSV está vazio ou não possui linhas de dados.',
      detalhes: [
        'O CSV deve ter uma linha de cabeçalho e pelo menos uma linha de dados.',
        `Colunas obrigatórias: ${COLUNAS_OBRIGATORIAS.join(', ')}`,
      ],
    };
  }

  const cabecalhos = linhas[0].split(',').map((h) => h.trim());
  const colunasFaltando = COLUNAS_OBRIGATORIAS.filter((c) => !cabecalhos.includes(c));

  if (colunasFaltando.length > 0) {
    return {
      ok: false,
      erro: `Coluna(s) obrigatória(s) faltando no CSV: ${colunasFaltando.join(', ')}`,
      detalhes: [
        `Colunas encontradas: ${cabecalhos.join(', ')}`,
        `Colunas obrigatórias: ${COLUNAS_OBRIGATORIAS.join(', ')}`,
      ],
    };
  }

  const errosLinha: string[] = [];
  for (let i = 1; i < linhas.length; i++) {
    const valores = linhas[i].split(',').map((v) => v.trim());
    const obj: Record<string, string> = {};
    cabecalhos.forEach((cabecalho, idx) => {
      obj[cabecalho] = valores[idx] ?? '';
    });

    const tipoCaso = obj.tipoCaso?.toLowerCase();
    if (tipoCaso !== 'valido' && tipoCaso !== 'invalido') {
      errosLinha.push(
        `Linha ${i + 1}: "tipoCaso" deve ser "valido" ou "invalido", encontrado: "${obj.tipoCaso ?? '(vazio)'}"`
      );
    }
  }

  if (errosLinha.length > 0) {
    return {
      ok: false,
      erro: `Linha(s) inválida(s) no CSV (${errosLinha.length} problema(s))`,
      detalhes: errosLinha.slice(0, 10),
    };
  }

  return { ok: true };
}
