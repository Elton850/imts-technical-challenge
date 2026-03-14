/**
 * CT-02 - Campo valor vazio
 *
 * Submete o formulario sem preencher o campo de valor monetario.
 *
 * Achado de produto: o sistema NAO valida obrigatoriedade do campo valor.
 * O formulario aceita submissao sem valor e processa o calculo normalmente.
 * Oraculo: sem .msgErro (comportamento real). Oportunidade: validar ou tornar obrigatorio.
 */
import { test, expect } from '@playwright/test';
import {
  abrirCalculadora,
  preencherFormulario,
  submeterFormulario,
  temErroVisivel,
} from './helpers';

test.describe('CT-02 - Comportamento com campo valor vazio', () => {
  test('campo valor e opcional: sistema processa calculo sem valor informado', async ({
    page,
  }) => {
    await abrirCalculadora(page);

    // Preenche indice e datas; valor omitido intencionalmente
    await preencherFormulario(page, {
      indice: '00433IPCA',
      dataInicial: '01/2022',
      dataFinal: '01/2023',
    });

    await submeterFormulario(page);

    // Sistema atual trata o campo como opcional
    const houveErro = await temErroVisivel(page);
    expect(
      houveErro,
      'O sistema atual aceita valor vazio sem exibir erro (campo opcional). ' +
        'Achado: validacao de obrigatoriedade ausente no campo valor.'
    ).toBe(false);

    // Pagina de resultado carregada
    expect(page.url()).toContain('bcb.gov.br');
  });
});
