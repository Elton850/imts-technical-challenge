/**
 * CT-03 / CT-04 - Validacao de datas
 *
 * CT-03: mes invalido (ex: 13) deve gerar .msgErro.
 * CT-04: data final anterior a inicial deve gerar .msgErro.
 * Regressao: apos erro, datas validas devem calcular normalmente.
 */
import { test, expect } from '@playwright/test';
import {
  abrirCalculadora,
  preencherFormulario,
  submeterFormulario,
  temErroVisivel,
} from './helpers';

test.describe('CT-03 / CT-04 - Regra de data', () => {
  test('CT-03: deve bloquear calculo quando data inicial tem mes invalido (13)', async ({
    page,
  }) => {
    await abrirCalculadora(page);

    await preencherFormulario(page, {
      indice: '00433IPCA',
      dataInicial: '13/2023',
      dataFinal: '01/2024',
      valor: '1000',
    });

    await submeterFormulario(page);

    const houveErro = await temErroVisivel(page);
    expect(houveErro, 'Data inicial com mes invalido deve gerar mensagem de erro').toBe(
      true
    );
  });

  test('deve bloquear calculo quando data final e anterior a data inicial', async ({
    page,
  }) => {
    await abrirCalculadora(page);

    await preencherFormulario(page, {
      indice: '00433IPCA',
      dataInicial: '06/2023',
      dataFinal: '01/2023',
      valor: '1000',
    });

    await submeterFormulario(page);

    const houveErro = await temErroVisivel(page);
    expect(
      houveErro,
      'Data final anterior a data inicial deve gerar mensagem de erro'
    ).toBe(true);
  });

  test('deve calcular corretamente com datas validas no mesmo cenario', async ({
    page,
  }) => {
    // Regressao: apos erro de data, o sistema deve calcular normalmente com datas validas
    await abrirCalculadora(page);

    await preencherFormulario(page, {
      indice: '00433IPCA',
      dataInicial: '01/2021',
      dataFinal: '01/2023',
      valor: '500',
    });

    await submeterFormulario(page);

    const houveErro = await temErroVisivel(page);
    expect(houveErro, 'Datas validas nao devem gerar mensagem de erro').toBe(false);
  });
});
