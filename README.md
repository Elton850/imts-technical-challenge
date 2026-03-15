<p align="center">
  <img src="https://images.squarespace-cdn.com/content/v1/5c4efc9770e802450d166f79/0cccc4a8-3e2e-40a9-a96e-817bcf996c20/Camada+1+2.png?format=2500w" alt="Logo IMTS" width="220" />
</p>

# Entrega Técnica IMTS

[![Teste 1 - Playwright E2E](https://github.com/IMTS/repo/actions/workflows/teste1-playwright.yml/badge.svg)](https://github.com/IMTS/repo/actions/workflows/teste1-playwright.yml) *(substitua `IMTS/repo` pela URL real do repositório para ativar o badge)*

Repositório com os dois desafios técnicos entregues: automação E2E (Teste 1) e desenvolvimento da aplicação AI Chat Insights (Teste 2), com artefatos de QA e testes Playwright.

## Estrutura

| Pasta | Conteúdo |
|-------|----------|
| [**Teste 1**](./Teste%201/README.md) | Automação E2E com Playwright sobre a Calculadora do Cidadão (Banco Central) |
| [**Teste 2**](./Teste%202/README.md) | Aplicação **WhatsAnalizer** (Angular + Z.AI), testes E2E e artefatos obrigatórios |

```
.
├── README.md
├── Teste 1/
│   ├── README.md
│   ├── Artefatos/
│   ├── tests/
│   └── ...
└── Teste 2/
    ├── README.md
    ├── ESPECIFICACOES_TECNICAS.md
    ├── Artefatos/
    └── app/                    # Aplicação Angular
        ├── src/
        ├── e2e/
        └── ...
```

## Como executar

### Teste 1

```powershell
cd ".\Teste 1"
npm install
npx playwright install chromium
npm run test:verify
```

### Teste 2

```powershell
cd ".\Teste 2\app"
npm install
npx playwright install chromium
npm run build
npm run test:e2e
```

Para rodar a aplicação do Teste 2 localmente: `npm start` (em `Teste 2/app`). A rota é `http://localhost:4200/whatsanalizer`.

## Destaques além do solicitado

Itens que foram além do mínimo pedido em cada desafio, para facilitar avaliação e manutenção.

### Teste 1

- **CI com GitHub Actions** — workflow que roda os testes em push/PR e publica relatório em falha.
- **Validação da massa CSV** — o arquivo de dados é validado (colunas e `tipoCaso`) antes da execução; falhas exibem mensagens objetivas.
- **Scripts de apoio** — `doctor` (checagem de ambiente), `cleanup` (limpeza de resultados) e `show-report` (abertura do relatório HTML).
- **Configuração para Windows** — artefatos do Playwright em diretório temporário do sistema, reduzindo EPERM em pastas sincronizadas (ex.: OneDrive).
- **Achado documentado** — comportamento do campo “valor” (aceita envio vazio) registrado em PRODUTO com sugestão de melhoria.
- **Guias extras** — `README_EXECUCAO_RAPIDA.md` e `ORIENTACOES_EMPRESA.md` para quem for rodar ou integrar o projeto.

### Teste 2

- **Seis cenários E2E** — um a mais que o mínimo; um deles com massa em CSV.
- **Testes unitários** — cobertura para normalizer, error-mapper, file-reader, service e interceptor.
- **E2E autônomo** — Playwright sobe a aplicação via `webServer`; não é preciso rodar `npm start` antes dos testes.
- **Normalização defensiva** — resposta parcial ou inesperada da IA é tratada com defaults seguros, sem quebrar a UI.
- **Segurança reforçada** — limite de 5 MB no upload; token nunca em log ou persistência; mensagens de erro sem expor corpo da API.
- **Código documentado** — JSDoc e comentários nos pontos críticos para manutenção.

## Análise: fatores de destaque (UAU)

Comparando o solicitado com o entregue em cada projeto:

### Teste 1 — O que já é destaque

| Solicitado | Entregue além |
|------------|----------------|
| Automação E2E + CSV + artefatos | **CI (GitHub Actions)** com lint, testes e artifact do relatório em falha |
| Cenários mapeados | **Validação do CSV** antes de rodar (colunas + tipoCaso), com mensagens claras |
| Documentação obrigatória | **Achado real** (campo valor aceita vazio) documentado em PRODUTO com recomendação |
| | **Scripts** doctor, cleanup, show-report; **config para Windows** (EPERM/OneDrive) |
| | **Guias extras** (execução rápida, orientações para a empresa) |

O Teste 1 já entrega mais do que o mínimo: pipeline de qualidade, cuidado com ambiente e documentação que facilita quem for dar continuidade.

### Teste 1 — O que ainda daria um “UAU” extra

- **`.nvmrc`** com `20` — fixa a versão do Node e evita “funcionou na minha máquina” (o README já recomenda Node 20).
- **Badge no README** (ex.: status do CI) — sinal visual de que a suíte está verde e o projeto é levado a sério.

### Teste 2 — O que já é destaque

| Solicitado | Entregue além |
|------------|----------------|
| Angular, Signals, Z.AI, PrimeNG, 1 rota, 1 componente | **Responsividade** conforme spec (900px/600px, KPIs 5→3→2, listas em coluna) |
| Upload .txt, dashboard, filtro, erros | **Acessibilidade**: labels, `aria-label`, `role="alert"`, `role="region"`, `aria-live` |
| ≥5 scripts Playwright, ≥1 com CSV | **6 cenários E2E** + **testes unitários** (normalizer, error-mapper, file-reader, service, interceptor) |
| Timeout, rate limit, JSON inválido | **Normalização defensiva** (payload parcial da IA) + **limite 5 MB** + erro sem expor corpo da API |
| Layout 2 colunas, identidade WhatsApp | **webServer** no Playwright (E2E sobe a aplicação sozinha) + código documentado |

O Teste 2 atende todos os requisitos da especificação e ainda agrega: acessibilidade, responsividade explícita, camada de testes unitários, segurança e documentação no código.

### Teste 2 — O que ainda daria um “UAU” extra

- **CI para o Teste 2** — workflow que rode `npm run build`, testes unitários e E2E no push/PR (hoje só o Teste 1 tem CI). Quem abre o repositório vê os dois projetos com pipeline.
- **Aviso de privacidade** na tela (ex.: “O conteúdo da conversa é enviado à Z.AI para análise”) — o DOCUMENTO_ENTREGA já citou como melhoria; implementado, vira diferencial de transparência.

Resumo: os dois projetos já têm fatores UAU (CI e cuidado com ambiente no 1; acessibilidade, responsividade, testes unitários e segurança no 2). Os “extras” acima são incrementos de baixo esforço que reforçam a impressão de profissionalismo.

## Leitura recomendada

### Avaliar o Teste 1

1. [Teste 1/README.md](./Teste%201/README.md)
2. [Teste 1/Artefatos/CENARIOS.md](./Teste%201/Artefatos/CENARIOS.md)
3. [Teste 1/Artefatos/PRODUTO.md](./Teste%201/Artefatos/PRODUTO.md)
4. [Teste 1/Artefatos/EXECUCAO.md](./Teste%201/Artefatos/EXECUCAO.md)

### Avaliar o Teste 2

1. [Teste 2/README.md](./Teste%202/README.md)
2. [Teste 2/Artefatos/DOCUMENTO_ENTREGA.md](./Teste%202/Artefatos/DOCUMENTO_ENTREGA.md)
3. [Teste 2/Artefatos/CENARIOS.md](./Teste%202/Artefatos/CENARIOS.md)
4. [Teste 2/Artefatos/PRODUTO.md](./Teste%202/Artefatos/PRODUTO.md)
5. [Teste 2/Artefatos/EXECUCAO.md](./Teste%202/Artefatos/EXECUCAO.md)

## Segurança (Teste 2)

O token da API Z.AI **não deve ser commitado**. Uso seguro neste repositório:

- Informar o token **manualmente no campo da interface**.
- Manter qualquer fallback local fora do versionamento.
- Não colocar segredo em `.env`, `environment.ts`, README, logs ou evidências.

## Observações

- Cada teste pode ser avaliado de forma independente.
- Build, `node_modules` e relatórios de execução não são versionados.
- O repositório está organizado para avaliação técnica e reprodução local, pronto para subir ao GitHub.
