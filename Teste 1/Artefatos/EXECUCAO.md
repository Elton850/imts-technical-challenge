# EXECUCAO

## Objetivo

Este documento explica, em linguagem acessível, como preparar o ambiente e executar os testes automatizados do Teste 1. Se você é avaliador e não tem experiência avançada com automação, este guia foi feito para você.

> **Guia rápido**: Para uma versão ainda mais enxuta (3 comandos + interpretação do resultado), consulte `README_EXECUCAO_RAPIDA.md` na raiz do Teste 1.

---

## O que você vai precisar

| Item | Descrição | Como conferir |
|------|-----------|---------------|
| **Node.js** | Programa que roda o código dos testes (18+; recomendado 20, igual ao CI) | No terminal: `node -v` |
| **npm** | Gerenciador de pacotes do Node (versão 9 ou superior) | No terminal: `npm -v` |
| **Internet** | Os testes acessam o site da Calculadora do Cidadão (BCB) | O site [bcb.gov.br](https://www3.bcb.gov.br) deve estar acessível |

Se `node -v` ou `npm -v` retornar erro, instale o Node.js em [nodejs.org](https://nodejs.org) (versão LTS recomendada).

---

## Preparando o ambiente (primeira vez)

Abra o terminal na pasta **Teste 1** e execute:

```bash
npm install
npx playwright install chromium
```

- **npm install**: baixa as dependências do projeto.
- **npx playwright install chromium**: instala o navegador Chromium usado pelos testes.

Aguarde a conclusão sem erros. Na primeira execução pode levar 1–2 minutos.

## Estrutura do projeto

```text
Teste 1/
  Artefatos/
    CENARIOS.md
    EXECUCAO.md
    PERFORMANCE.md
    PRODUTO.md
    RETROSPECTIVA.md
  tests/
    pages/
      calculadora.page.ts               # Page Object da calculadora
    helpers.ts                          # Utilitarios (delega ao POM)
    calculadora-fluxo-feliz.spec.ts     # CT-01
    calculadora-validacao-valor.spec.ts # CT-02
    calculadora-regra-data.spec.ts      # CT-04
    calculadora-borda.spec.ts           # CT-05, CT-06, CT-07
    calculadora-validacao-indice.spec.ts# CT-08
    calculadora-data-driven.spec.ts     # CT-10
  data/
    massa-correcao.csv                  # Massa de dados para CT-10
  playwright.config.ts
  package.json
  playwright-report/                    # Relatorio HTML (gerado apos execucao)
  .pw-out/                              # Screenshots e traces de falha
```

## Comandos para rodar os testes

| Comando | O que faz |
|---------|-----------|
| `npm run test:verify` | Limpa resultados e roda smoke (4 testes). Validação rápida local. |
| `npm run test:e2e:local` | Roda a suíte completa (15 testes). |
| `npm run test:smoke:local` | Roda apenas os testes críticos, sem limpar. |
| `npm run test:e2e:headed` | Roda os testes com o navegador visível. |
| `npm run test:e2e:report` | Abre o relatório HTML no navegador. |

### Validação rápida (recomendado para avaliador)

```bash
npm run test:verify
```

Limpa `.pw-out/` e `playwright-report/`, roda os 4 testes críticos (~15s).

### Suíte completa

```bash
npm run test:e2e:local
```

15 testes, ~55s. O CI usa `npm run test:e2e` (mesmo comando, workers paralelos).

### Ver o relatório detalhado

```bash
npm run test:e2e:report
```

Abra este comando **após** rodar os testes. O relatório mostra cada teste, tempo de execução e evidências em caso de falha.

### Rodar um teste específico

```bash
npx playwright test tests/calculadora-fluxo-feliz.spec.ts
```

## Resultado da execucao real

| Metrica | Valor |
|---|---|
| Total de testes | 15 |
| Passando | 15 |
| Smoke (test:verify) | 4 testes, ~15s |
| Suíte completa (test:e2e:local) | 15 testes, ~55s |
| Ambiente local | Windows 11 / Chromium / workers=1 |
| CI | Node 20, `npm run test:e2e` |

*CI em `.github/workflows/teste1-playwright.yml`: checkout → npm ci → lint → playwright install → test:e2e.*

### Como interpretar o CI (para avaliador)

| Status no GitHub | Significado |
|------------------|-------------|
| **Verde (passou)** | Lint e os 15 testes E2E passaram. |
| **Vermelho (falhou)** | Lint ou algum teste falhou. Artifact `playwright-report-failure` contém o relatório HTML. |
| **Timeout** | Job limite 10 min. Site BCB lento ou indisponível pode causar timeout. |

## Massa externa CSV

O teste CT-10 usa dados de um arquivo CSV para rodar vários cenários de uma vez.

- **Arquivo**: `data/massa-correcao.csv`
- **Colunas obrigatórias** (todas devem existir no cabeçalho):
  - `valor` — valor monetário a ser corrigido
  - `dataInicial` — data inicial no formato MM/YYYY
  - `dataFinal` — data final no formato MM/YYYY
  - `indice` — código do índice (ex.: 00433IPCA)
  - `resultadoEsperado` — descrição do resultado esperado (informativo)
  - `tipoCaso` — `valido` (sem erro esperado) ou `invalido` (erro esperado)

Antes de rodar os testes data-driven, o projeto valida automaticamente se o CSV existe e tem todas as colunas. Se faltar alguma coluna ou houver linha inválida, uma mensagem clara será exibida.

## Decisoes tecnicas de implementacao

### Mascara de data (onkeydown)
O campo de data usa mascara JavaScript `Mask("mm/yyyy", "date")` que auto-insere "/" apos os 2 digitos do mes. A solucao adotada foi digitar apenas os numeros (ex: "012023") via `pressSequentially`, deixando a mascara inserir o separador automaticamente. Digitar "01/2023" com a barra causava duplicacao ("01//").

### Campo indice vazio (CT-08)
O select `#selIndice` nao possui opcao em branco por default. Para simular ausencia de selecao, o valor do select e forcado para string vazia via `page.evaluate()` antes da submissao.

### Dialogo IPCA-E
O indice IPCA-E (10764IPC-E) dispara um `alert()` de aviso. O helper `submeterFormulario` registra um handler `page.once('dialog', ...)` que aceita automaticamente qualquer dialogo antes do clique no botao.

## Entendendo o resultado

- **Passou**: `4 passed` (smoke) ou `15 passed` (suíte completa).
- **Falhou**: terminal indica qual teste falhou. Screenshots e traces em `.pw-out/`.

---

## Solução de problemas comuns

| Problema | Possível causa | O que tentar |
|----------|----------------|--------------|
| `node` ou `npm` não encontrado | Node.js não instalado | Instale o Node.js LTS em [nodejs.org](https://nodejs.org) |
| Timeout nos testes | Site do BCB lento ou indisponível | Aguarde e rode novamente; o site governamental pode ter latência |
| Erro de conexão (`ECONNREFUSED`, `ERR_INTERNET_DISCONNECTED`) | Sem internet ou site fora do ar | Verifique sua conexão e se [bcb.gov.br](https://www3.bcb.gov.br) está acessível |
| Erro ao ler o arquivo CSV | Arquivo `data/massa-correcao.csv` ausente ou com coluna faltando | Verifique se o arquivo existe e tem as colunas: `valor`, `dataInicial`, `dataFinal`, `indice`, `resultadoEsperado`, `tipoCaso` |
| Comando não encontrado | Terminal fora da pasta Teste 1 | Navegue até a pasta com `cd "Teste 1"` antes de rodar |

Para detalhes técnicos (timeout, seletores, máscara de data), consulte a seção "Decisoes tecnicas de implementacao" neste documento.

