/**
 * CT-01 - Fluxo feliz: correcao com dados validos
 *
 * Cenario: preencher todos os campos obrigatorios com dados validos
 * e verificar que o sistema calcula e exibe resultado sem erros.
 *
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
      indice: '00433IPCA', // IPCA (IBGE) - indice comum e disponivel
      dataInicial: '01/2020',
      dataFinal: '01/2023',
      valor: '1000',
    });

    await submeterFormulario(page);

    const houveErro = await temErroVisivel(page);
    expect(houveErro, 'Fluxo feliz nao deve exibir mensagem de erro apos calcular').toBe(
      false
    );

    // Verificar que ainda estamos em pagina do BCB (resultado carregado)
    expect(page.url()).toContain('bcb.gov.br');
  });
});
