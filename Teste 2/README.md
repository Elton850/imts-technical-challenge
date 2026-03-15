# Teste 2 - Desenvolvimento + Automacao

## Acesso rapido

- Especificacoes tecnicas: [`ESPECIFICACOES_TECNICAS.md`](./ESPECIFICACOES_TECNICAS.md)
- Documento de entrega: [`Artefatos/DOCUMENTO_ENTREGA.md`](./Artefatos/DOCUMENTO_ENTREGA.md)
- Aplicacao Angular: [`app/README.md`](./app/README.md)
- Artefatos obrigatorios: pasta `Artefatos`

## Objetivo

Entregar a aplicacao **AI Chat Insights (WhatsAnalizer)** conforme a especificacao tecnica e, sobre ela, produzir a camada de QA, automacao e analise exigida no desafio.

## O que foi entregue

- aplicacao Angular 18 com rota publica `/whatsanalizer`;
- dashboard com KPIs, sentimento, filtros e secoes analiticas;
- documento de entrega e artefatos obrigatorios de QA em `Artefatos/`;
- 6 cenarios E2E com Playwright, sendo 1 CSV-driven;
- testes unitarios para utilitarios e servicos centrais;
- CI dedicado para build, unit e E2E.

## Diferenciais alem do solicitado

- **CI dedicado do Teste 2** — workflow em GitHub Actions para `build`, testes unitarios headless e E2E.
- **Aviso de privacidade** — a UI informa explicitamente que o conteudo da conversa e enviado para a Z.AI.
- **Orientacao de processamento** — a UI explica que a analise depende de provedor externo, pode levar ate 2,5 min e recomenda retentativa com janela segura de cerca de 3 segundos.
- **Dashboard com contexto visual** — os resultados ficam agrupados em secoes nomeadas para leitura rapida de panorama e itens acionaveis.
- **Exportacao de resumo** — a analise pode ser exportada em `.txt` sem token e sem conteudo bruto do chat.
- **Testes unitarios + E2E** — cobertura do fluxo principal, erros, filtro, payload parcial e utilitarios centrais.
- **Execucao autonoma dos E2E** — Playwright sobe a aplicacao via `webServer`, sem depender de `npm start` manual.

## Estrutura

- `README.md` — visao geral do teste
- `ESPECIFICACOES_TECNICAS.md` — base do desafio
- `Artefatos/` — documentos obrigatorios e documento de entrega
- `app/` — aplicacao Angular, testes unitarios e E2E

## Como executar

A aplicacao e os testes ficam em `app/`. Na pasta `Teste 2/app`:

| Acao | Comando |
|------|---------|
| Instalar dependencias | `npm install` |
| Instalar browser (1a vez) | `npx playwright install chromium` |
| Subir a aplicacao | `npm start` -> `http://localhost:4200/whatsanalizer` |
| Build | `npm run build` |
| Testes unitarios headless | `npx ng test --watch=false --browsers=ChromeHeadless` |
| Testes E2E | `npm run test:e2e` ou `npm run test:headless` |

O token Z.AI deve ser informado **na interface**; nao commitar em arquivos. Detalhes em [`Artefatos/EXECUCAO.md`](./Artefatos/EXECUCAO.md).
Versao recomendada de runtime: **Node 20**. Ha um arquivo `.nvmrc` em `Teste 2/app`.

## Arquivo pronto para avaliacao

Se quiser ir direto ao ponto na avaliacao manual, use o arquivo:

- [`Artefatos/EXEMPLO_CONVERSA_AVALIACAO.txt`](./Artefatos/EXEMPLO_CONVERSA_AVALIACAO.txt)

Ele foi montado para gerar uma analise mais rica, com:

- varios participantes;
- tarefas e prazos distribuidos;
- riscos operacionais e de produto;
- divergencias de equipe;
- discussoes sobre UX, QA, escopo e estabilidade tecnica.

## Validacao rapida

Na pasta `Teste 2/app`:

```bash
npm install
npx playwright install chromium
npm run build
npx ng test --watch=false --browsers=ChromeHeadless
npm run test:e2e
```

Esse fluxo valida build, testes unitarios e E2E com mocks da Z.AI.

## Leitura recomendada

1. [`Artefatos/DOCUMENTO_ENTREGA.md`](./Artefatos/DOCUMENTO_ENTREGA.md)
2. [`Artefatos/CENARIOS.md`](./Artefatos/CENARIOS.md)
3. [`Artefatos/PRODUTO.md`](./Artefatos/PRODUTO.md)
4. [`Artefatos/EXECUCAO.md`](./Artefatos/EXECUCAO.md)
5. [`app/README.md`](./app/README.md)
