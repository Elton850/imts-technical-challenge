/**
 * CT-08 - Indice obrigatorio
 *
 * Submete o formulario sem indice selecionado (valor do select forçado via evaluate).
 * O select nao possui opcao vazia na UI; a ausencia e simulada por evaluate.
 * Oraculo: .msgErro visivel.
 */
import { test, expect } from '@playwright/test';
import {
  abrirCalculadora,
  forcarIndiceVazio,
  preencherFormulario,
  submeterFormulario,
  temErroVisivel,
} from './helpers';

test.describe('CT-08 - Validacao de indice obrigatorio', () => {
  test('deve exibir erro quando nenhum indice valido esta selecionado', async ({
    page,
  }) => {
    await abrirCalculadora(page);

    await preencherFormulario(page, {
      dataInicial: '01/2022',
      dataFinal: '01/2023',
      valor: '1000',
    });

    await forcarIndiceVazio(page);

    await submeterFormulario(page);

    const houveErro = await temErroVisivel(page);
    expect(houveErro, 'Indice nao selecionado deve gerar mensagem de erro').toBe(true);
  });
});
