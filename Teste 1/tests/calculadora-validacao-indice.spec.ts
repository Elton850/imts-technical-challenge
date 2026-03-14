/**
 * CT-08 - Validacao de indice nao selecionado
 *
 * Cenario: submeter formulario sem selecionar um indice valido.
 * O valor do select e forçado para vazio via JS para simular ausencia de selecao.
 * Resultado esperado: mensagem de erro (.msgErro) visivel.
 *
 * Oraculo: .msgErro visivel com indicacao de indice invalido/nao cadastrado.
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
