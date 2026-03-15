# Execucao Rapida - Teste 1

Guia curto para validar a entrega sem percorrer toda a documentacao.

## Pre-requisitos

Antes de rodar, verifique:

| Requisito | Como conferir |
|-----------|----------------|
| **Node.js** (18, 19 ou 20) | `node -v` |
| **npm** (9+) | `npm -v` |
| **Internet** | acesso ao site do BCB |

Importante:

- Node 24+ pode causar `spawn EPERM` no Windows.
- A versao recomendada e **Node 20**, igual ao CI.
- Se usar `nvm`, rode `nvm use` dentro da pasta `Teste 1`.

## Fluxo recomendado

Na pasta `Teste 1`, execute:

### 1. Instalar dependencias

```bash
npm install
npx playwright install chromium
```

### 2. Rodar a validacao rapida

```bash
npm run test:verify
```

Esse comando valida o ambiente, limpa artefatos antigos, roda os 6 testes criticos e imprime um resumo executivo no terminal.

Para a suite completa:

```bash
npm run test:e2e:local
```

### 3. Abrir o relatorio

```bash
npm run test:e2e:report
```

Se quiser abrir manualmente com Playwright, use a pasta:

```text
%TEMP%/imts-teste1-playwright/report
```

Importante: a pasta correta e `report`, nao `repo`.

## Resultado esperado

### Passou

Voce vera algo como:

```text
6 passed (~20s)   # smoke executivo
16 passed (~60s)  # suite completa
```

- Em falha local, os artefatos ficam em `%TEMP%/imts-teste1-playwright/`.
- No CI, o relatorio HTML fica como artifact.

## Erros comuns

| Erro | Causa provavel | O que fazer |
|------|----------------|-------------|
| `spawn EPERM` ou falha ao iniciar Chromium | Node 24+ ou antivirus | use Node 20 (`nvm use` ou instale LTS) |
| `playwright install` falhou | rede ou permissao | tente novamente |
| `Timeout` | site do BCB lento | aguarde e rode de novo |
| erro ao ler CSV | arquivo ausente ou coluna faltando | revise `data/massa-correcao.csv` |
| comando nao encontrado | terminal fora da pasta | rode `cd "Teste 1"` |

## CI

O workflow em `.github/workflows/teste1-playwright.yml` usa:

- Node 20
- `npm ci`
- `npm run lint`
- `npx playwright install chromium`
- `npm run test:e2e`

## Mais detalhes

Consulte `README.md` para visao geral, `Artefatos/EXECUCAO.md` para detalhes operacionais e `Artefatos/MATRIZ_RISCO_PRODUTO.md` para a leitura de negocio.
