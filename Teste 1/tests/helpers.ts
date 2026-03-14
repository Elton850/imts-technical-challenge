/**
 * Helpers reutilizaveis que delegam ao CalculadoraPage.
 * Facilita migracao gradual e mantem assinaturas estaveis para os specs.
 */
import { Page } from '@playwright/test';
import {
  CalculadoraPage,
  DadosFormulario,
  URL_CALCULADORA,
} from './pages/calculadora.page';

export { URL_CALCULADORA, DadosFormulario };

export async function abrirCalculadora(page: Page): Promise<void> {
  const calc = new CalculadoraPage(page);
  await calc.abrir();
}

export async function preencherFormulario(
  page: Page,
  dados: DadosFormulario
): Promise<void> {
  const calc = new CalculadoraPage(page);
  await calc.preencherFormulario(dados);
}

export async function submeterFormulario(page: Page): Promise<void> {
  const calc = new CalculadoraPage(page);
  await calc.submeter();
}

export async function temErroVisivel(page: Page): Promise<boolean> {
  const calc = new CalculadoraPage(page);
  return calc.temErroVisivel();
}

/** Simula ausencia de selecao no indice via evaluate (select nao possui opcao vazia na UI). */
export async function forcarIndiceVazio(page: Page): Promise<void> {
  const calc = new CalculadoraPage(page);
  await calc.forcarIndiceVazio();
}
