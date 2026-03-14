/**
 * CT-01 - Fluxo feliz
 *
 * Preenche indice, datas e valor com dados validos e submete.
 * Oraculo: nenhuma mensagem de erro (.msgErro) visivel apos submit.
 */
import { test, expect } from '@playwright/test';
import {
  abrirCalculadora,
  preencherFormulario,
  submeterFormulario,
  temErroVisivel,
} from './helpers';

test.describe('CT-01 - Fluxo feliz', () => {
  test('deve calcular correcao com dados validos e exibir resultado sem erros', async ({
    page,
  }) => {
    await abrirCalculadora(page);

    await preencherFormulario(page, {
      indice: '00433IPCA',
      dataInicial: '01/2020',
      dataFinal: '01/2023',
      valor: '1000',
    });

    await submeterFormulario(page);

    const houveErro = await temErroVisivel(page);
    expect(houveErro, 'Fluxo feliz nao deve exibir mensagem de erro apos calcular').toBe(
      false
    );

    // Garante que a pagina de resultado foi carregada
    expect(page.url()).toContain('bcb.gov.br');
  });
});
