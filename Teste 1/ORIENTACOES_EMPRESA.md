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

2. Documentacao obrigatoria (edital)
- `Artefatos/CENARIOS.md`
- `Artefatos/EXECUCAO.md`
- `Artefatos/PERFORMANCE.md`
- `Artefatos/PRODUTO.md`
- `Artefatos/RETROSPECTIVA.md`

3. Documentacao adicional (bônus)
- `README_EXECUCAO_RAPIDA.md` (validacao em poucos minutos)
- `Artefatos/RESUMO_EXECUTIVO.md`
- `Artefatos/RELATORIO_EXECUCAO_E2E.md`
- `Artefatos/BASELINE_EXECUCAO.md`

4. Esteiras de qualidade
- Pipeline CI em `.github/workflows/teste1-playwright.yml`.
- Script smoke para validacao rapida.

## Como validar rapidamente (avaliador)

Na pasta `Teste 1`:

```bash
npm install
npx playwright install chromium
npm run test:verify
```

Suíte completa (15 testes):

```bash
npm run test:e2e:local
```

Relatório HTML:

```bash
npm run test:e2e:report
```

## Como interpretar o resultado

- Sucesso: `4 passed` (smoke) ou `15 passed` (suíte completa).
- Falha: nome do teste no terminal; relatório HTML para detalhes.
- Evidências de falha: `.pw-out/` (screenshots, traces).

## Pontos de destaque da entrega

- Cobertura orientada a risco.
- Achado real documentado (campo valor opcional no sistema alvo).
- Validacao de CSV com mensagens amigaveis.
- Material legivel para publico tecnico e nao tecnico.

## Limitacoes conhecidas

- Dependencia de sistema externo (latencia/indisponibilidade do BCB).
- Mudancas no HTML da pagina alvo podem exigir ajuste de seletor.

## Contato e continuidade

Se necessario, a execucao pode ser reproduzida seguindo:
- `README_EXECUCAO_RAPIDA.md`
- `Artefatos/EXECUCAO.md`
