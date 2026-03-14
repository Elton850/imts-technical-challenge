/**
 * CT-05, CT-06, CT-07 - Testes de borda
 *
 * CT-05: valor zero -> sistema processa sem crash nem .msgErro.
 * CT-06: valor muito alto -> sistema nao quebra.
 * CT-07: datas limite (antigas/recentes) -> sistema processa sem crash.
 * CT-11: valor negativo -> sistema responde de forma consistente (rejeita ou aceita).
 */
import { test, expect } from '@playwright/test';
import {
  abrirCalculadora,
  preencherFormulario,
  submeterFormulario,
  temErroVisivel,
} from './helpers';

test.describe('CT-05 - Borda: valor zero', () => {
  test('deve processar valor zero sem crash e sem erro de validacao', async ({
    page,
  }) => {
    await abrirCalculadora(page);

    await preencherFormulario(page, {
      indice: '00433IPCA',
      dataInicial: '01/2020',
      dataFinal: '01/2023',
      valor: '0',
    });

    await submeterFormulario(page);

    const houveErro = await temErroVisivel(page);
    expect(
      houveErro,
      'Valor zero deve ser aceito sem mensagem de erro (comportamento consistente)'
    ).toBe(false);

    expect(page.url()).toContain('bcb.gov.br');
  });
});

test.describe('CT-06 - Borda: valor muito alto', () => {
  test('deve processar valor alto sem quebrar o sistema', async ({ page }) => {
    await abrirCalculadora(page);

    await preencherFormulario(page, {
      indice: '00433IPCA',
      dataInicial: '01/2020',
      dataFinal: '01/2023',
      valor: '999999999999',
    });

    await submeterFormulario(page);

    const houveErro = await temErroVisivel(page);
    expect(
      houveErro,
      'Valor alto nao deve causar crash; sistema deve responder (com ou sem erro de negocio)'
    ).toBe(false);

    expect(page.url()).toContain('bcb.gov.br');
  });
});

test.describe('CT-07 - Borda: datas limite', () => {
  test('deve processar datas antigas (limite inferior) sem crash', async ({ page }) => {
    await abrirCalculadora(page);

    await preencherFormulario(page, {
      indice: '00433IPCA',
      dataInicial: '07/1994',
      dataFinal: '01/2023',
      valor: '1000',
    });

    await submeterFormulario(page);

    const houveErro = await temErroVisivel(page);
    expect(
      houveErro,
      'Datas antigas podem gerar erro de negocio, mas nao devem causar crash'
    ).toBe(false);

    expect(page.url()).toContain('bcb.gov.br');
  });

  test('deve processar datas recentes (limite superior) sem crash', async ({ page }) => {
    await abrirCalculadora(page);

    await preencherFormulario(page, {
      indice: '00433IPCA',
      dataInicial: '01/2024',
      dataFinal: '12/2024',
      valor: '1000',
    });

    await submeterFormulario(page);

    const houveErro = await temErroVisivel(page);
    expect(
      houveErro,
      'Datas recentes podem gerar erro de negocio, mas nao devem causar crash'
    ).toBe(false);

    expect(page.url()).toContain('bcb.gov.br');
  });
});

test.describe('CT-11 - Negativo: valor negativo', () => {
  test('deve responder de forma consistente a valor negativo (rejeitar ou aceitar)', async ({
    page,
  }) => {
    await abrirCalculadora(page);

    await preencherFormulario(page, {
      indice: '00433IPCA',
      dataInicial: '01/2020',
      dataFinal: '01/2023',
      valor: '-100',
    });

    await submeterFormulario(page);

    expect(page.url()).toContain('bcb.gov.br');
  });
});
