/**
 * Page Object do formulario "Correcao de Valores" da Calculadora do Cidadao (BCB).
 * Centraliza navegacao, preenchimento, submissao e verificacao de erros.
 */
import { Page } from '@playwright/test';
import { SELECTORS } from '../selectors';

export const URL_CALCULADORA =
  'https://www3.bcb.gov.br/CALCIDADAO/publico/corrigirPorIndice.do?method=corrigirPorIndice';

export interface DadosFormulario {
  indice?: string;
  dataInicial?: string;
  dataFinal?: string;
  valor?: string;
}

export class CalculadoraPage {
  constructor(private readonly page: Page) {}

  /** Navega para a calculadora e aguarda o formulario estar pronto. */
  async abrir(): Promise<void> {
    await this.page.goto(URL_CALCULADORA);
    await this.page.waitForSelector(SELECTORS.FORM, { state: 'visible' });
  }

  /**
   * Preenche os campos do formulario conforme DadosFormulario.
   * Campos omitidos permanecem vazios. Data: digita apenas digitos; a mascara mm/yyyy insere a barra.
   */
  async preencherFormulario(dados: DadosFormulario): Promise<void> {
    if (dados.indice !== undefined) {
      await this.page.locator(SELECTORS.SELECT_INDICE).selectOption(dados.indice);
    }

    if (dados.dataInicial !== undefined) {
      const campo = this.page.locator(SELECTORS.DATA_INICIAL);
      await campo.click();
      await campo.pressSequentially(dados.dataInicial.replace('/', ''), { delay: 80 });
    }

    if (dados.dataFinal !== undefined) {
      const campo = this.page.locator(SELECTORS.DATA_FINAL);
      await campo.click();
      await campo.pressSequentially(dados.dataFinal.replace('/', ''), { delay: 80 });
    }

    if (dados.valor !== undefined) {
      const campo = this.page.locator(SELECTORS.VALOR_CORRECAO);
      await campo.click();
      await campo.fill(dados.valor);
    }
  }

  /**
   * Submete o formulario e aguarda networkidle.
   * Registra handler para dialogo (alert) antes do clique — IPCA-E dispara aviso.
   */
  async submeter(): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.page.getByTitle(SELECTORS.BOTAO_CORRIGIR).click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Verifica se a classe .msgErro esta visivel (erro de validacao do sistema). */
  async temErroVisivel(): Promise<boolean> {
    const erros = this.page.locator(SELECTORS.MSG_ERRO);
    const count = await erros.count();
    if (count === 0) return false;
    return await erros.first().isVisible();
  }

  /** Define select e input de indice como vazios via evaluate (simula ausencia de selecao). */
  async forcarIndiceVazio(): Promise<void> {
    await this.page.evaluate(
      ({ selIndice, idIndice }) => {
        const select = document.querySelector<HTMLSelectElement>(selIndice);
        if (select) select.value = '';
        const input = document.querySelector<HTMLInputElement>(idIndice);
        if (input) input.value = '';
      },
      {
        selIndice: SELECTORS.SELECT_INDICE,
        idIndice: SELECTORS.INPUT_ID_INDICE,
      }
    );
  }
}
