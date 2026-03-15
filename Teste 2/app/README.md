# WhatsAnalizer (AI Chat Insights)

Aplicação Angular do **Teste 2** — análise de conversas WhatsApp via API Z.AI, com dashboard de KPIs, sentimento, tarefas, prazos, riscos e conflitos.

## Pré-requisitos

- Node.js 20.x (LTS recomendado)
- npm 9+

## Desenvolvimento

```bash
npm install
npm start
```

Abre em `http://localhost:4200/whatsanalizer`.

## Build

```bash
npm run build
```

Saída em `dist/`.

## Testes E2E (Playwright)

Os testes usam mock da API Z.AI; não é necessário token real.

```bash
npx playwright install chromium   # primeira vez
npm run test:e2e
# ou
npm run test:headless
```

A configuração sobe a aplicação automaticamente (`webServer` no `playwright.config.ts`).

## Token Z.AI

O token é informado **no campo da interface**. Não usar `.env` nem `environment.ts` com valor real; não commitar segredos.

## Estrutura relevante

- `src/app/features/whatsanalizer/` — componente principal
- `src/app/core/` — services, models, utils, interceptor
- `e2e/` — cenários Playwright (6 specs, 1 com CSV)

Documentação completa do teste em [`../Artefatos/`](../Artefatos/) e [`../README.md`](../README.md).
