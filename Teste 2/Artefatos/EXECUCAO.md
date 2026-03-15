# EXECUCAO – AI Chat Insights (WhatsAnalizer)

## 1. Como executar a aplicação localmente

### Pré-requisitos
- Node.js 20.x ou superior
- npm 9.x ou superior

### Passos

```bash
# 1. Entrar na pasta da aplicação
cd "Teste 2/app"

# 2. Instalar dependências (se ainda não instaladas)
npm install --legacy-peer-deps

# 3. Iniciar o servidor de desenvolvimento
npm start

# 4. Abrir no browser
# http://localhost:4200/whatsanalizer
```

### Fornecimento do token Z.AI

O token **não** é armazenado em nenhum arquivo do projeto. Ele deve ser informado diretamente no campo "Token Z.AI" na interface da aplicação.

- Não crie `.env` com o token real
- Não edite `environment.ts` com o token real
- O campo aceita colagem direta do token (modo password com toggle de visibilidade)

---

## 2. Como executar os testes E2E (Playwright)

### Pré-requisitos adicionais
- Browser Chromium instalado pelo Playwright (`npx playwright install chromium`)
- O Playwright sobe a aplicação automaticamente via `webServer` na config; não é obrigatório rodar `npm start` antes.

### Instalar o browser (apenas na primeira vez)

```bash
cd "Teste 2/app"
npx playwright install chromium
```

### Executar todos os testes

```bash
cd "Teste 2/app"
npm run test:e2e
```

### Executar com interface visual

```bash
npm run test:e2e:ui
```

### Ver relatório HTML após execução

```bash
npm run test:e2e:report
```

### Executar arquivo específico

```bash
npx playwright test e2e/02-upload-and-analyze.spec.ts
```

---

## 3. Estrutura dos testes

```
e2e/
  01-empty-state.spec.ts        # Estado vazio e estrutura da UI
  02-upload-and-analyze.spec.ts # Fluxo completo com mock de rede
  03-error-handling.spec.ts     # Rate limit, JSON inválido, arquivo inválido
  04-filter.spec.ts             # Filtro por participante
  05-partial-response.spec.ts   # Resiliência a payload parcial
  06-filter-csv.spec.ts         # Filtro orientado por CSV (data-driven)
  fixtures/
    mock-analysis-response.json # Mock de resposta válida da Z.AI
    sample-chat.txt             # Arquivo de conversa de exemplo
    participants-filter.csv     # Massa de dados para CT-06
  helpers/
    page-helpers.ts             # Funções auxiliares reutilizáveis
```

---

## 4. Resultado esperado dos testes

Todos os testes utilizam **mocks de rede** (sem chamadas reais à API Z.AI) para garantir execução determinística e sem custo de token.

| Cenário | Arquivo | Testes |
|---------|---------|--------|
| CT-01 Estado vazio | 01-empty-state.spec.ts | 5 |
| CT-02 Upload e análise | 02-upload-and-analyze.spec.ts | 6 |
| CT-03 Tratamento de erros | 03-error-handling.spec.ts | 5 |
| CT-04 Filtro | 04-filter.spec.ts | 4 |
| CT-05 Resposta parcial | 05-partial-response.spec.ts | 2 |
| CT-06 CSV-driven | 06-filter-csv.spec.ts | 4 (dinâmico) |
| **Total** | | **~26** |

---

## 5. Build de produção

```bash
cd "Teste 2/app"
npm run build
# Saída em dist/app/browser/
```

---

## 6. Observações conhecidas

- O Playwright sobe a aplicação automaticamente via `webServer` em `playwright.config.ts`; não é necessário rodar `npm start` antes dos E2E (incluindo CI).
- Node.js 20.x ou superior recomendado; Angular 18 compatível com Node 20+.
- O arquivo `package-lock.json` está preservado para reprodutibilidade.
