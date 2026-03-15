<p align="center">
  <img src="https://images.squarespace-cdn.com/content/v1/5c4efc9770e802450d166f79/0cccc4a8-3e2e-40a9-a96e-817bcf996c20/Camada+1+2.png?format=2500w" alt="Logo IMTS" width="220" />
</p>

# Entrega Técnica IMTS

[![Teste 1 - Playwright E2E](https://github.com/Elton850/imts-technical-challenge/actions/workflows/teste1-playwright.yml/badge.svg)](https://github.com/Elton850/imts-technical-challenge/actions/workflows/teste1-playwright.yml) [![Teste 2 - Angular CI](https://github.com/Elton850/imts-technical-challenge/actions/workflows/teste2-angular.yml/badge.svg)](https://github.com/Elton850/imts-technical-challenge/actions/workflows/teste2-angular.yml)

Repositorio com os dois desafios tecnicos entregues: automacao E2E em sistema externo (Teste 1) e desenvolvimento da aplicacao AI Chat Insights (Teste 2), com artefatos de QA, testes Playwright e CI.

## Sobre mim

Sou **Elton Alves**. Montei esta entrega com foco em clareza, qualidade tecnica, experiencia de avaliacao e manutencao de longo prazo.

Mais sobre mim:

- GitHub: [github.com/Elton850](https://github.com/Elton850)
- LinkedIn: [linkedin.com/in/eltonalves-analytics](https://www.linkedin.com/in/eltonalves-analytics)
- Portfólio: [elton850.github.io/portifolio](https://elton850.github.io/portifolio/)

Gostei genuinamente de desenvolver os dois testes. O **Teste 1** foi interessante por exigir leitura de risco real em um sistema externo, conciliando automacao, estabilidade e analise de produto. O **Teste 2** foi o que eu mais gostei de fazer, por permitir trabalhar UX, robustez tecnica, tratamento de erro, qualidade visual e experiencia do usuario em um fluxo mais completo.

Dificuldades principais que encontrei:

- **Teste 1:** lidar com as variacoes de um sistema externo, manter a suite estavel no Windows e transformar a automacao em algo util tambem do ponto de vista de negocio.
- **Teste 2:** equilibrar interface, experiencia do usuario, integracao com provedor externo, tratamento de instabilidades e testes determinísticos sem depender de token real.

Meu objetivo aqui nao foi apenas "fazer funcionar", mas entregar algo profissional, legivel e agradavel de avaliar.

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
npm ci
npx playwright install chromium
npm run build
npx ng test --watch=false --browsers=ChromeHeadless
npm run test:e2e
```

Para rodar a aplicacao do Teste 2 localmente: `npm start` (em `Teste 2/app`). A rota e `http://localhost:4200/whatsanalizer`.
Para uma instalacao limpa e reprodutivel do Teste 2, prefira Node 20 LTS e `npm ci`. O projeto aceita Node 20+, mas a baseline validada no CI continua sendo Node 20. O projeto tambem desabilita o resumo automatico de `audit` no install para evitar contagem ruidosa de dependencias transitivas de tooling; se quiser validar manualmente a arvore instalada, rode `npm audit` em `Teste 2/app`.

## Diferenciais da entrega

O repositorio foi fechado para avaliacao rapida, reproducao local e continuidade tecnica.

### Teste 1

- **CI com GitHub Actions** para lint, execucao e publicacao de artefatos em falha.
- **Validacao da massa CSV** antes da execucao, com mensagens objetivas para colunas e `tipoCaso`.
- **Scripts de apoio** para diagnostico de ambiente, limpeza e abertura do relatorio HTML.
- **Ajustes para Windows** com artefatos do Playwright em diretorio temporario, reduzindo `EPERM`.
- **Achado de produto documentado** a partir de comportamento observado no sistema real.
- **Matriz de risco de produto** conectando cenarios, scripts e impacto de negocio.

### Teste 2

- **CI dedicado** para build, testes unitarios headless e E2E.
- **Seis cenarios E2E**, sendo um CSV-driven, alem da camada de testes unitarios.
- **Execucao autonoma dos E2E** via `webServer`, sem `npm start` manual.
- **Arquivo de conversa pronto para avaliacao manual** em `Teste 2/Artefatos/EXEMPLO_CONVERSA_AVALIACAO.txt`.
- **Aviso de privacidade, exportacao de resumo e token fora de log ou persistencia.**
- **Orientacao de processamento e retentativa** para explicar latencia esperada, falhas temporarias do provedor externo e janela segura de nova tentativa.
- **Reducao de contexto + retry enxuto** para mitigar payload excessivo e falhas transitórias rapidas sem mascarar rate limit do provedor.
- **Normalizacao defensiva** para payload parcial ou inesperado da IA, preservando a estabilidade da UI.

## Quick Evaluation Path

Para validar os dois projetos em poucos minutos:

```powershell
# Teste 1 — lint, format e smoke
cd ".\Teste 1"
npm install
npm run lint && npm run format:check && npm run test:verify

# Teste 2 — build, unit e E2E
cd "..\Teste 2\app"
npm ci
npx playwright install chromium
npm run build
npx ng test --watch=false --browsers=ChromeHeadless
npm run test:e2e
```

Os dois workflows acima validam essas rotinas automaticamente a cada push.

## Caminho recomendado de leitura

### Avaliar o Teste 1

1. [Teste 1/README.md](./Teste%201/README.md)
2. [Teste 1/Artefatos/CENARIOS.md](./Teste%201/Artefatos/CENARIOS.md)
3. [Teste 1/Artefatos/PRODUTO.md](./Teste%201/Artefatos/PRODUTO.md)
4. [Teste 1/Artefatos/MATRIZ_RISCO_PRODUTO.md](./Teste%201/Artefatos/MATRIZ_RISCO_PRODUTO.md)
5. [Teste 1/Artefatos/EXECUCAO.md](./Teste%201/Artefatos/EXECUCAO.md)

### Avaliar o Teste 2

1. [Teste 2/README.md](./Teste%202/README.md)
2. [Teste 2/Artefatos/DOCUMENTO_ENTREGA.md](./Teste%202/Artefatos/DOCUMENTO_ENTREGA.md)
3. [Teste 2/Artefatos/CENARIOS.md](./Teste%202/Artefatos/CENARIOS.md)
4. [Teste 2/Artefatos/PRODUTO.md](./Teste%202/Artefatos/PRODUTO.md)
5. [Teste 2/Artefatos/EXECUCAO.md](./Teste%202/Artefatos/EXECUCAO.md)

## Segurança (Teste 2)

O token da API Z.AI **nao deve ser commitado**. Uso seguro neste repositorio:

- informar o token manualmente no campo da interface;
- manter qualquer fallback local fora do versionamento;
- nao colocar segredo em `.env`, `environment.ts`, README, logs ou evidencias.

## Observações

- Cada teste pode ser avaliado de forma independente.
- Build, `node_modules` e relatórios de execução não são versionados.
- O repositorio esta organizado para avaliacao tecnica, reproducao local e continuidade.
