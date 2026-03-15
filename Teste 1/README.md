# Teste 1 - Automacao em Sistema Externo

Automacao E2E da **Calculadora do Cidadao - Correcao de Valores**, do Banco Central, com foco em cobertura funcional, leitura tecnica e execucao reproduzivel.

## Escopo atendido

- cenarios positivos, negativos e de borda;
- massa externa em CSV;
- artefatos obrigatorios de cenarios, execucao, performance, produto e retrospectiva;
- automacao com Playwright + TypeScript;
- pipeline CI para validacao continua.

## Tecnologias usadas

- **TypeScript**
- **Playwright**
- **Node.js / npm**
- **GitHub Actions**
- **Markdown** para documentacao

## Diferenciais tecnicos

- validacao do CSV antes da execucao, com mensagens claras para dados invalidos;
- seletores centralizados e Page Object para manutencao simples;
- scripts de apoio para diagnostico de ambiente, limpeza e abertura do relatorio;
- configuracao local ajustada para Windows, reduzindo falhas `EPERM` em diretorios sincronizados;
- achado de produto documentado a partir de comportamento observado no sistema real;
- matriz de risco de produto ligando cenarios, scripts, severidade e recomendacoes;
- resumo executivo apos `npm run test:verify`, mostrando cobertura critica e impacto de negocio.

## Estrutura da pasta

```text
Teste 1/
|-- README.md
|-- README_EXECUCAO_RAPIDA.md
|-- ORIENTACOES_EMPRESA.md
|-- .nvmrc
|-- package.json
|-- playwright.config.ts
|-- scripts/
|   |-- doctor.mjs
|   |-- cleanup-results.mjs
|   `-- show-report.mjs
|-- data/
|   `-- massa-correcao.csv
|-- tests/
|   |-- pages/
|   |   `-- calculadora.page.ts
|   |-- calculadora-fluxo-feliz.spec.ts
|   |-- calculadora-validacao-valor.spec.ts
|   |-- calculadora-regra-data.spec.ts
|   |-- calculadora-borda.spec.ts
|   |-- calculadora-validacao-indice.spec.ts
|   |-- calculadora-data-driven.spec.ts
|   |-- csv-validator.ts
|   |-- helpers.ts
|   `-- selectors.ts
`-- Artefatos/
```

Artefato novo de leitura executiva:

- `Artefatos/MATRIZ_RISCO_PRODUTO.md`

## Organizacao da automacao

- seletores centralizados em `tests/selectors.ts`;
- interacoes principais encapsuladas em `tests/pages/calculadora.page.ts`;
- specs separadas por comportamento para leitura e manutencao;
- massa externa em `data/massa-correcao.csv`;
- artefatos de execucao enviados para o diretorio temporario do sistema.

## Cenarios cobertos

Os cenarios automatizados incluem:

- fluxo feliz;
- comportamento com valor vazio;
- regra de data invalida;
- validacao de indice obrigatorio;
- cenarios de borda;
- execucao data-driven com CSV.

O detalhamento completo esta em:

- [`Artefatos/CENARIOS.md`](./Artefatos/CENARIOS.md)

## Instalacao

**Node 18, 19 ou 20** recomendado (igual ao CI). Node 24+ pode causar `spawn EPERM` no Windows. Se ocorrer, use `nvm use` ou instale Node 20 LTS.

```bash
npm install
npx playwright install chromium
```

`npm run test:doctor` emite avisos de ambiente, mas nao bloqueia a execucao.

## Como executar

### Validacao rapida

```bash
npm run test:verify
```

Esse fluxo roda `test:doctor`, limpa resultados antigos, executa o smoke principal e fecha com um resumo executivo da rodada.

### Suite completa

```bash
npm run test:e2e:local
```

### Abrir relatorio HTML

```bash
npm run test:e2e:report
```

Se precisar abrir manualmente, o caminho local esperado e `%TEMP%/imts-teste1-playwright/report`.
Importante: a pasta correta e `report`, nao `repo`.

### Rodar um teste especifico

```bash
npx playwright test tests/calculadora-fluxo-feliz.spec.ts
```

## Scripts principais

| Comando | Uso |
|---|---|
| `npm run test:doctor` | emite avisos de Node/ambiente (nao bloqueia) |
| `npm run test:clean` | limpa diretorios de resultado |
| `npm run test:verify` | doctor + clean + smoke + brief |
| `npm run test:smoke:local` | roda 6 testes criticos |
| `npm run test:brief` | imprime o fechamento executivo da rodada |
| `npm run test:e2e:local` | roda a suite completa |
| `npm run test:e2e:report` | abre o relatorio HTML |
| `npm run lint` | valida o codigo |
| `npm run format:check` | valida formatacao |

## Documentos principais

Para avaliacao rapida, estes sao os arquivos mais importantes:

- [`README_EXECUCAO_RAPIDA.md`](./README_EXECUCAO_RAPIDA.md)
- [`ORIENTACOES_EMPRESA.md`](./ORIENTACOES_EMPRESA.md)
- [`Artefatos/CENARIOS.md`](./Artefatos/CENARIOS.md)
- [`Artefatos/EXECUCAO.md`](./Artefatos/EXECUCAO.md)
- [`Artefatos/MATRIZ_RISCO_PRODUTO.md`](./Artefatos/MATRIZ_RISCO_PRODUTO.md)
- [`Artefatos/PERFORMANCE.md`](./Artefatos/PERFORMANCE.md)
- [`Artefatos/PRODUTO.md`](./Artefatos/PRODUTO.md)
- [`Artefatos/RETROSPECTIVA.md`](./Artefatos/RETROSPECTIVA.md)

## Observacoes finais

Este teste depende de um sistema externo, portanto variacoes de lentidao do BCB podem influenciar o tempo de execucao.

Se a avaliacao for curta, a melhor sequencia e:

1. ler este arquivo;
2. rodar `npm run test:verify`;
3. consultar `Artefatos/MATRIZ_RISCO_PRODUTO.md` e `Artefatos/PRODUTO.md`.

