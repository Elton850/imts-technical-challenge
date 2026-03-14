/**
 * Seletores criticos centralizados.
 * Alteracoes em um unico local facilitam manutencao.
 */
export const SELECTORS = {
  FORM: '#corrigirPorIndiceForm',
  SELECT_INDICE: '#selIndice',
  INPUT_ID_INDICE: '[name="idIndice"]',
  DATA_INICIAL: '[name="dataInicial"]',
  DATA_FINAL: '[name="dataFinal"]',
  VALOR_CORRECAO: '[name="valorCorrecao"]',
  MSG_ERRO: '.msgErro',
  BOTAO_CORRIGIR: 'Corrigir valor',
} as const;
