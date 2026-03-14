/**
 * Page Object da Calculadora do Cidadao (BCB).
 * Encapsula interacoes reutilizaveis com o formulario de correcao de valores.
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
   * Preenche os campos do formulario.
   * Campos nao informados sao ignorados (mantidos vazios ou com valor default).
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
   * Clica no botao "Corrigir valor" e aguarda a resposta da pagina.
   * Aceita automaticamente qualquer dialogo de alerta (ex: IPCA-E).
   */
  async submeter(): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.page.getByTitle(SELECTORS.BOTAO_CORRIGIR).click();
    await this.page.waitForLoadState('networkidle');
  }

  /** Retorna true se existe mensagem de erro visivel na pagina. */
  async temErroVisivel(): Promise<boolean> {
    const erros = this.page.locator(SELECTORS.MSG_ERRO);
    const count = await erros.count();
    if (count === 0) return false;
    return await erros.first().isVisible();
  }

  /** Forca o select de indice para valor vazio (para CT-08). */
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
