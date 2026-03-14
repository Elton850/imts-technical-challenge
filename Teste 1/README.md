# Teste 1 - Automacao em Sistema Externo

## Sobre esta entrega

Este projeto automatiza a **Calculadora do Cidadao - Correcao de Valores**, do Banco Central.

A proposta aqui foi atender o que o teste pediu de forma objetiva:

- mapear cenarios relevantes;
- automatizar os fluxos principais com Playwright;
- usar massa externa em CSV;
- registrar analise de performance;
- documentar achados de produto, execucao e retrospectiva.

O foco foi entregar um projeto facil de avaliar, facil de rodar e com boa leitura tecnica.

## O que foi feito

Esta entrega inclui:

- testes E2E com **Playwright + TypeScript**;
- cenarios positivos, negativos e de borda;
- teste data-driven com arquivo CSV;
- organizacao com Page Object;
- validacao da massa CSV antes da execucao;
- documentacao obrigatoria em `Artefatos`;
- pipeline CI com GitHub Actions.

## Tecnologias usadas

- **TypeScript**
- **Playwright**
- **Node.js / npm**
- **GitHub Actions**
- **Markdown** para documentacao

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
|   `-- cleanup-results.mjs
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

## O que esperar ao avaliar

Ao analisar este teste, a ideia e encontrar:

- cobertura dos pontos mais importantes do formulario;
- rastreabilidade entre cenarios e scripts;
- execucao reproduzivel;
- documentacao clara para publico tecnico e nao tecnico;
- cuidado com problemas reais de ambiente local e estabilidade.

Pontos de destaque desta entrega:

- existe um achado real documentado: o campo de valor pode ser processado vazio;
- o CSV e validado antes do teste rodar;
- a execucao local recebeu ajustes para contornar `EPERM` em ambiente Windows/OneDrive;
- a suite foi organizada para leitura rapida de quem esta avaliando muitos projetos.

## Como a automacao foi feita

A automacao foi montada com foco em simplicidade e manutencao.

- Os seletores ficam centralizados.
- As interacoes principais com a pagina ficam no Page Object `calculadora.page.ts`.
- Os testes foram separados por comportamento para facilitar leitura.
- O cenario com massa externa usa `data/massa-correcao.csv`.
- A configuracao local foi adaptada para reduzir falhas de permissao e lock de arquivos no Windows.

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

Node 18+ (recomendado 20, igual ao CI). Arquivo `.nvmrc` presente para nvm.

```bash
npm install
npx playwright install chromium
```

## Como executar

### Validacao rapida

```bash
npm run test:verify
```

Esse comando limpa resultados anteriores e roda os testes principais.

### Suite completa

```bash
npm run test:e2e:local
```

### Abrir relatorio HTML

```bash
npm run test:e2e:report
```

### Rodar um teste especifico

```bash
npx playwright test tests/calculadora-fluxo-feliz.spec.ts
```

## Scripts principais

| Comando | Uso |
|---|---|
| `npm run test:clean` | limpa diretorios de resultado |
| `npm run test:verify` | validacao rapida local |
| `npm run test:smoke:local` | roda apenas testes criticos |
| `npm run test:e2e:local` | roda a suite completa |
| `npm run test:e2e:report` | abre o relatorio HTML |
| `npm run lint` | valida o codigo |
| `npm run format:check` | valida formatacao |

## Documentos importantes

Para quem estiver avaliando o projeto, estes sao os arquivos principais:

- [`README_EXECUCAO_RAPIDA.md`](./README_EXECUCAO_RAPIDA.md)
- [`ORIENTACOES_EMPRESA.md`](./ORIENTACOES_EMPRESA.md)
- [`Artefatos/CENARIOS.md`](./Artefatos/CENARIOS.md)
- [`Artefatos/EXECUCAO.md`](./Artefatos/EXECUCAO.md)
- [`Artefatos/PERFORMANCE.md`](./Artefatos/PERFORMANCE.md)
- [`Artefatos/PRODUTO.md`](./Artefatos/PRODUTO.md)
- [`Artefatos/RETROSPECTIVA.md`](./Artefatos/RETROSPECTIVA.md)

## Observacoes finais

Este teste foi pensado para ser direto de avaliar:

- o que foi pedido esta documentado;
- a automacao esta organizada;
- os guias de uso estao separados;
- os achados e limitacoes ficaram registrados com clareza.

Se a avaliacao for curta, a melhor sequencia e:

1. ler este arquivo;
2. rodar `npm run test:verify`;
3. consultar `Artefatos/CENARIOS.md` e `Artefatos/PRODUTO.md`.
