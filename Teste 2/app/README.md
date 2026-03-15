# WhatsAnalizer (AI Chat Insights)

Aplicacao Angular do **Teste 2** para analise de conversas WhatsApp via API Z.AI, com dashboard de KPIs, sentimento, tarefas, prazos, riscos e conflitos.

A interface orienta o usuario sobre latencia esperada, falhas temporarias e retentativa quando o processamento externo oscila, incluindo margem segura de cerca de 3 segundos antes de uma nova tentativa.

## Pre-requisitos

- Node.js 20+ (20 LTS recomendado e usado como baseline validada)
- npm 9+

Se usar `nvm`, rode `nvm use` dentro de `Teste 2/app`.
Versoes superiores do Node podem funcionar, mas o projeto foi validado e mantido com Node 20 no CI.

## Fluxo local

```bash
npm ci
npm start
```

Abre em `http://localhost:4200/whatsanalizer`.

Se quiser avaliar a aplicacao sem preparar uma conversa manualmente, use o arquivo pronto em [`../Artefatos/EXEMPLO_CONVERSA_AVALIACAO.txt`](../Artefatos/EXEMPLO_CONVERSA_AVALIACAO.txt).

## Validacao

### Build

```bash
npm run build
```

Saida em `dist/`.

### Testes unitarios

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

### Testes E2E (Playwright)

Os testes usam mock da API Z.AI; nao e necessario token real.

```bash
npx playwright install chromium   # primeira vez
npm run test:e2e
# ou
npm run test:headless
```

A configuracao sobe a aplicacao automaticamente (`webServer` no `playwright.config.ts`).

## Observacao sobre `npm ci`, Node e `npm audit`

Este projeto usa `audit=false` em `.npmrc` para evitar o resumo automatico de vulnerabilidades durante `npm ci`/`npm install`, porque o `npm` pode exibir uma contagem ruidosa ou inconsistente para dependencias transitivas de tooling mesmo quando o `npm audit` manual nao aponta vulnerabilidades abertas na arvore instalada.
O projeto aceita Node 20+, mas a baseline validada da entrega continua sendo Node 20 LTS.

Se quiser conferir manualmente, rode:

```bash
npm audit
```

Nao e recomendado executar `npm audit fix --force` durante a avaliacao, porque isso altera a arvore de dependencias validada do desafio.

## Token Z.AI

O token e informado **no campo da interface**. Nao usar `.env` nem `environment.ts` com valor real; nao commitar segredos.

## Estrutura relevante

- `src/app/features/whatsanalizer/` — componente principal
- `src/app/core/` — services, models, utils, interceptor
- `e2e/` — cenarios Playwright (6 specs, 1 com CSV)

Documentacao completa do teste em [`../Artefatos/`](../Artefatos/) e [`../README.md`](../README.md).
