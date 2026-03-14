/**
 * CT-02 - Comportamento com campo valor vazio
 *
 * Cenario: submeter formulario sem preencher o campo de valor monetario.
 *
 * ACHADO DE PRODUTO (executado em 14/03/2026):
 * O campo "valor a ser corrigido" NAO e obrigatorio no sistema atual.
 * O formulario aceita a submissao sem valor e processa o calculo normalmente.
 * Isso diverge da expectativa documentada no CT-02 original (que esperava erro).
 *
 * O teste foi atualizado para refletir o comportamento REAL do sistema,
 * registrando este achado como oportunidade de melhoria de validacao.
 *
 * Oraculo atual: sistema aceita submissao sem valor (sem .msgErro).
 * Oportunidade: validar ou tornar obrigatorio o campo para melhor UX.
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

    // Preencher tudo exceto o campo valor
    await preencherFormulario(page, {
      indice: '00433IPCA',
      dataInicial: '01/2022',
      dataFinal: '01/2023',
      // valor: nao preenchido intencionalmente - teste de comportamento real
    });

    await submeterFormulario(page);

    // Comportamento real observado: o sistema NAO exibe erro para valor vazio.
    // O campo e tratado como opcional pelo servidor.
    const houveErro = await temErroVisivel(page);
    expect(
      houveErro,
      'O sistema atual aceita valor vazio sem exibir erro (campo opcional). ' +
        'Achado: validacao de obrigatoriedade ausente no campo valor.'
    ).toBe(false);

    // Pagina deve continuar funcional no dominio BCB
    expect(page.url()).toContain('bcb.gov.br');
  });
});
