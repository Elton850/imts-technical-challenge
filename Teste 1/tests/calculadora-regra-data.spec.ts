/**
 * CT-04 - Regra de data: data final menor que data inicial
 *
 * Cenario: informar data final anterior a data inicial.
 * Resultado esperado: mensagem de erro (.msgErro visivel) indicando
 * intervalo de datas invalido.
 *
 * Oraculo: .msgErro visivel apos submit.
 */
import { test, expect } from '@playwright/test';
import {
  abrirCalculadora,
  preencherFormulario,
  submeterFormulario,
  temErroVisivel,
} from './helpers';

test.describe('CT-04 - Regra de data', () => {
  test('deve bloquear calculo quando data final e anterior a data inicial', async ({
    page,
  }) => {
    await abrirCalculadora(page);

    await preencherFormulario(page, {
      indice: '00433IPCA',
      dataInicial: '06/2023', // data inicial mais recente
      dataFinal: '01/2023', // data final mais antiga -> invalido
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
    // Teste de regressao: apos erro de data, sistema deve funcionar normalmente
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
