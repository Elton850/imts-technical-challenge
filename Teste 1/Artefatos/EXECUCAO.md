# EXECUCAO

## Objetivo

Este documento explica como preparar o ambiente e executar os testes do Teste 1.

Para uma leitura mais curta, consulte `README_EXECUCAO_RAPIDA.md`.

## Requisitos

| Item | Como conferir |
|------|----------------|
| **Node.js 18, 19 ou 20** | `node -v` |
| **npm 9+** | `npm -v` |
| **Internet** | acesso ao site do BCB |

Observacoes:

- Node 24+ pode causar `spawn EPERM` no Windows.
- A versao recomendada e **Node 20**, igual ao CI.
- Ha arquivo `.nvmrc` na pasta do projeto.

## Instalacao

Na pasta `Teste 1`:

```bash
npm install
npx playwright install chromium
```

## Estrutura do projeto

```text
Teste 1/
  Artefatos/
    CENARIOS.md
    EXECUCAO.md
    PERFORMANCE.md
    PRODUTO.md
    RETROSPECTIVA.md
  tests/
    pages/
      calculadora.page.ts
    helpers.ts
    calculadora-fluxo-feliz.spec.ts
    calculadora-validacao-valor.spec.ts
    calculadora-regra-data.spec.ts
    calculadora-borda.spec.ts
    calculadora-validacao-indice.spec.ts
    calculadora-data-driven.spec.ts
  data/
    massa-correcao.csv
  scripts/
    doctor.mjs
    cleanup-results.mjs
    show-report.mjs
  playwright.config.ts
  package.json
```

## Comandos principais

| Comando | Uso |
|---------|-----|
| `npm run test:doctor` | valida Node e ambiente local |
| `npm run test:clean` | limpa artefatos antigos |
| `npm run test:verify` | doctor + clean + smoke |
| `npm run test:smoke:local` | roda 4 testes criticos |
| `npm run test:e2e:local` | roda a suite completa |
| `npm run test:e2e:report` | abre o relatorio HTML local |
| `npm run lint` | valida o codigo |
| `npm run format:check` | valida formatacao |

## Fluxo recomendado para avaliacao

### Validacao rapida

```bash
npm run test:verify
```

Esse fluxo:

- valida o ambiente;
- limpa artefatos antigos;
- roda os 4 testes principais.

### Suite completa

```bash
npm run test:e2e:local
```

### Relatorio HTML

```bash
npm run test:e2e:report
```

## Resultado esperado

| Metrica | Valor esperado |
|---|---|
| Smoke | 4 testes |
| Suite completa | 15 testes |
| CI | Node 20 + `npm run test:e2e` |

## CI

O workflow em `.github/workflows/teste1-playwright.yml` executa:

1. `npm ci`
2. `npm run lint`
3. `npx playwright install chromium --with-deps`
4. `npm run test:e2e`

## CSV data-driven

O teste `CT-10` usa `data/massa-correcao.csv`.

Colunas obrigatorias:

- `valor`
- `dataInicial`
- `dataFinal`
- `indice`
- `resultadoEsperado`
- `tipoCaso`

O projeto valida o CSV antes da execucao.

## Decisoes tecnicas

### Mascara de data

A pagina usa mascara `mm/yyyy`. A automacao digita apenas os numeros e deixa a pagina inserir a barra.

### Indice vazio

Como o select nao tem opcao vazia, o teste usa `page.evaluate()` para simular ausencia de selecao.

### Dialogo IPCA-E

Quando o site abre `alert()`, o teste aceita automaticamente antes do clique final.

## Evidencias e artefatos

- Em ambiente local, screenshots, traces e relatorio ficam em `%TEMP%/imts-teste1-playwright/`.
- No CI, o relatorio HTML fica como artifact.

## Problemas comuns

| Problema | Acao recomendada |
|----------|------------------|
| `Node 24 detectado` | use Node 20 |
| `spawn EPERM` | use Node 20 e feche processos que prendem arquivos |
| timeout | tente novamente; o BCB e um sistema externo |
| erro no CSV | revise colunas e arquivo |

## Leitura complementar

- `README_EXECUCAO_RAPIDA.md`
- `ORIENTACOES_EMPRESA.md`
- `Artefatos/CENARIOS.md`
- `Artefatos/PERFORMANCE.md`
- `Artefatos/PRODUTO.md`
- `Artefatos/RETROSPECTIVA.md`
