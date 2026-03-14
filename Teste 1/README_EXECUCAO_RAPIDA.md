# Execucao Rapida - Teste 1

Guia curto para validar a entrega rapidamente.

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

## 3 comandos para rodar

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

Esse comando:

- valida o ambiente com `test:doctor`;
- limpa artefatos antigos;
- roda os 4 testes criticos.

Para a suite completa:

```bash
npm run test:e2e:local
```

### 3. Abrir o relatorio

```bash
npm run test:e2e:report
```

## Como interpretar o resultado

### Passou

Voce vera algo como:

```text
4 passed (~15s)
15 passed (~55s)
```

### Falhou

- O terminal mostra qual teste falhou.
- Em ambiente local, os artefatos ficam em `%TEMP%/imts-teste1-playwright/`.
- No CI, o relatorio HTML fica como artifact.

## Smoke

Para rodar apenas o smoke sem limpeza:

```bash
npm run test:smoke:local
```

## Erros comuns

| Erro | Causa provavel | O que fazer |
|------|----------------|-------------|
| `[doctor] Bloqueadores: Node 24 detectado` | Node fora da faixa suportada | use Node 20 |
| `spawn EPERM` | Node 24+ ou bloqueio do Windows/antivirus | use Node 20 e feche processos que segurem arquivos |
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

Consulte `Artefatos/EXECUCAO.md`.
