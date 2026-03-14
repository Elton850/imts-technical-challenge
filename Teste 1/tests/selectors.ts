/**
 * Seletores CSS e atributos do formulario da Calculadora do Cidadao.
 * Centralizados para facilitar manutencao quando o HTML do BCB mudar.
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
