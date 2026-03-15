# Teste 2 - Desenvolvimento + Automacao

## Acesso rapido

- Especificacoes tecnicas: [`ESPECIFICACOES_TECNICAS.md`](./ESPECIFICACOES_TECNICAS.md)
- Documento de entrega: [`Artefatos/DOCUMENTO_ENTREGA.md`](./Artefatos/DOCUMENTO_ENTREGA.md)
- Artefatos obrigatorios: pasta `Artefatos`

## Objetivo

Executar o desafio em duas etapas:

1. Desenvolver a aplicacao **AI Chat Insights (WhatsAnalizer)** conforme as especificacoes tecnicas.
2. Realizar diagnostico de qualidade, automacao e analise estrategica sobre a propria aplicacao desenvolvida.

## Ordem obrigatoria das etapas

### Etapa 1 - Desenvolvimento e respostas

1. Desenvolver a aplicacao com base no documento de especificacoes: [`ESPECIFICACOES_TECNICAS.md`](./ESPECIFICACOES_TECNICAS.md).
2. Responder o formulario/documento de entrega: [`Artefatos/DOCUMENTO_ENTREGA.md`](./Artefatos/DOCUMENTO_ENTREGA.md).

### Etapa 2 - Diagnostico e automacao

Aplicar estrategia de QA sobre a aplicacao desenvolvida na Etapa 1.

## Escopo do teste tecnico (Etapa 2)

- **Alvo do teste:** aplicacao AI Chat Insights (WhatsAnalizer) criada na primeira etapa deste teste.
- **Tecnologia obrigatoria:** Playwright (TypeScript ou JavaScript).
- **Formato de entrega:** repositorio publico no GitHub com documentacao em Markdown (`.md`).
- **Codigo-fonte obrigatorio:** o repositorio deve conter o codigo-fonte da aplicacao desenvolvida e os artefatos solicitados.

## Itens obrigatorios no repositorio

1. **Codigo-fonte da aplicacao**
   - Implementacao da aplicacao AI Chat Insights (WhatsAnalizer) no mesmo repositorio dos artefatos.
2. **Mapeamento de cenarios**
   - Arquivo: `Artefatos/CENARIOS.md`
3. **Scripts de automacao (Playwright)**
   - No minimo 5 scripts de testes funcionais.
   - Pelo menos 1 script executando com massa externa (`.csv`).
4. **Teste de performance**
   - Arquivo: `Artefatos/PERFORMANCE.md`
5. **Diagnostico de produto**
   - Arquivo: `Artefatos/PRODUTO.md`
6. **Relatorio de execucao**
   - Arquivo: `Artefatos/EXECUCAO.md`
7. **Relatorio de retrospectiva**
   - Arquivo: `Artefatos/RETROSPECTIVA.md`

## Documentos base do Teste 2

- Instrucoes gerais: `README.md` (este arquivo)
- Especificacoes tecnicas: [`ESPECIFICACOES_TECNICAS.md`](./ESPECIFICACOES_TECNICAS.md)
- Documento de entrega: [`Artefatos/DOCUMENTO_ENTREGA.md`](./Artefatos/DOCUMENTO_ENTREGA.md)

## Estrutura

- `README.md` (este arquivo)
- `ESPECIFICACOES_TECNICAS.md`
- `Artefatos/` — CENARIOS.md, PERFORMANCE.md, PRODUTO.md, EXECUCAO.md, RETROSPECTIVA.md, DOCUMENTO_ENTREGA.md
- `app/` — aplicação Angular (código-fonte e testes E2E)

## Como executar

A aplicação e os testes ficam em `app/`. Na pasta `Teste 2/app`:

| Ação | Comando |
|------|---------|
| Instalar dependências | `npm install` |
| Instalar browser (1ª vez) | `npx playwright install chromium` |
| Subir a aplicação | `npm start` → http://localhost:4200/whatsanalizer |
| Build | `npm run build` |
| Testes E2E | `npm run test:e2e` ou `npm run test:headless` |

O token Z.AI deve ser informado **na interface**; não commitar em arquivos. Detalhes em [`Artefatos/EXECUCAO.md`](./Artefatos/EXECUCAO.md).
