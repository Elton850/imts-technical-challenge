# WhatsAnalizer (AI Chat Insights)

Aplicacao Angular do **Teste 2** para analise de conversas WhatsApp via API Z.AI, com dashboard de KPIs, sentimento, tarefas, prazos, riscos e conflitos.

A interface orienta o usuario sobre latencia esperada, falhas temporarias e retentativa quando o processamento externo oscila, incluindo margem segura de cerca de 3 segundos antes de uma nova tentativa.

## Pre-requisitos

- Node.js 20.x (LTS recomendado)
- npm 9+

Se usar `nvm`, rode `nvm use` dentro de `Teste 2/app`.

## Fluxo local

```bash
npm install
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

## Token Z.AI

O token e informado **no campo da interface**. Nao usar `.env` nem `environment.ts` com valor real; nao commitar segredos.

## Estrutura relevante

- `src/app/features/whatsanalizer/` — componente principal
- `src/app/core/` — services, models, utils, interceptor
- `e2e/` — cenarios Playwright (6 specs, 1 com CSV)

Documentacao completa do teste em [`../Artefatos/`](../Artefatos/) e [`../README.md`](../README.md).
