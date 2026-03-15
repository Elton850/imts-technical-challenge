# ORIENTACOES PARA A EMPRESA - TESTE 1

## Resumo executivo

Este projeto implementa automacao E2E da Calculadora do Cidadao (Banco Central), com Playwright em TypeScript, cobrindo cenarios positivos, negativos, borda e data-driven com CSV.

Objetivo da entrega:

- demonstrar capacidade tecnica de QA;
- documentar evidencias de execucao;
- propor melhorias de produto baseadas em achados reais.

## O que foi entregue

1. Automacao E2E
- Suite com testes funcionais em `tests/`.
- Casos criticos, validacoes e borda.
- Execucao data-driven com `data/massa-correcao.csv`.

2. Documentacao obrigatoria
- `Artefatos/CENARIOS.md`
- `Artefatos/EXECUCAO.md`
- `Artefatos/PERFORMANCE.md`
- `Artefatos/PRODUTO.md`
- `Artefatos/RETROSPECTIVA.md`

3. Documentacao adicional
- `README_EXECUCAO_RAPIDA.md`
- `Artefatos/MATRIZ_RISCO_PRODUTO.md`
- `Artefatos/RESUMO_EXECUTIVO.md`
- `Artefatos/RELATORIO_EXECUCAO_E2E.md`
- `Artefatos/BASELINE_EXECUCAO.md`

4. Esteira de qualidade
- Pipeline CI em `.github/workflows/teste1-playwright.yml`.
- Script smoke para validacao rapida.

## Como validar rapidamente

Para uma validacao objetiva:

1. abrir `README_EXECUCAO_RAPIDA.md`;
2. rodar `npm run test:verify` na pasta `Teste 1`;
3. consultar `Artefatos/MATRIZ_RISCO_PRODUTO.md`, `Artefatos/PRODUTO.md` e `Artefatos/EXECUCAO.md`.

Esse fluxo costuma ser suficiente para avaliar cobertura, estabilidade e qualidade da entrega sem percorrer todo o repositorio.

## Pontos de destaque

- Cobertura orientada a risco.
- Achado real documentado: campo valor opcional.
- Matriz de risco ligando cobertura tecnica com impacto de negocio.
- Validacao de CSV com mensagens claras.
- Material facil de ler para publico tecnico e nao tecnico.

## Limitacoes conhecidas

- Dependencia de sistema externo do BCB.
- Mudancas no HTML da pagina podem exigir ajuste de seletor.
- No Windows, Node 24+ pode causar `spawn EPERM`; usar Node 20 evita esse risco.

## Continuidade

Se necessario, a execucao pode ser reproduzida seguindo:

- `README_EXECUCAO_RAPIDA.md`
- `Artefatos/EXECUCAO.md`
