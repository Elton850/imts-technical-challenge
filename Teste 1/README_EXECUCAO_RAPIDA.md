# Execução Rápida — Teste 1

Guia objetivo para rodar os testes e interpretar o resultado. Ideal para avaliador que precisa validar a entrega rapidamente.

---

## Pré-requisitos

Antes de rodar, confira se você tem:

| Requisito | Como verificar |
|-----------|----------------|
| **Node.js** (versão 18 ou superior) | Abra o terminal e digite: `node -v` |
| **npm** (versão 9 ou superior) | Digite: `npm -v` |
| **Acesso à internet** | O site da Calculadora do Cidadão (BCB) precisa estar acessível |

Se `node -v` ou `npm -v` não funcionar, instale o Node.js em [nodejs.org](https://nodejs.org) (versão LTS).

---

## 3 comandos para rodar

Abra o terminal na pasta **Teste 1** e execute na ordem:

### 1. Instalar dependências

```bash
npm install
npx playwright install chromium
```

*Espere terminar sem erro. Pode levar 1–2 minutos na primeira vez.*

### 2. Rodar os testes

```bash
npm run test:e2e
```

*Os testes abrem o navegador em segundo plano (headless) e acessam o site do BCB.*

### 3. Ver o relatório (opcional)

```bash
npm run test:e2e:report
```

*Abre o relatório HTML no navegador com detalhes de cada teste.*

---

## Interpretação do resultado

### Passou

Você verá algo como:

```
  14 passed (~35s)
```

- **14 passed** = todos os testes concluíram com sucesso.
- O número entre parênteses é o tempo total aproximado.

### Falhou

Você verá algo como:

```
  1 failed
  13 passed
```

- **failed** = pelo menos um teste encontrou um problema.
- O terminal mostrará qual teste falhou e em qual arquivo.
- Screenshots e traces são salvos em `test-results/` para análise.

---

## Modo smoke (testes críticos rápidos)

Para uma verificação rápida (~10 segundos), rode apenas os testes mais importantes:

```bash
npm run test:smoke
```

Isso executa o fluxo feliz e validações essenciais, sem os casos da massa CSV.

---

## Solução rápida para erros comuns

| Erro | Causa provável | O que fazer |
|------|----------------|-------------|
| `node: command not found` ou `npm: command not found` | Node.js não instalado | Instale o Node.js LTS em [nodejs.org](https://nodejs.org) |
| `playwright install` falhou | Problema de rede ou permissão | Tente novamente; em rede corporativa, verifique proxy/firewall |
| `Timeout` nos testes | Site do BCB lento ou indisponível | Aguarde e rode de novo; o site governamental pode ter latência |
| `ECONNREFUSED` ou `net::ERR_INTERNET_DISCONNECTED` | Sem internet ou site fora do ar | Verifique sua conexão e se [bcb.gov.br](https://www3.bcb.gov.br) está acessível |
| Erro ao ler `massa-correcao.csv` | Arquivo CSV ausente ou coluna faltando | Verifique se `data/massa-correcao.csv` existe e tem as colunas: `valor`, `dataInicial`, `dataFinal`, `indice`, `resultadoEsperado`, `tipoCaso` |
| `npm run test:e2e` não encontrado | Comando executado fora da pasta Teste 1 | Navegue até a pasta `Teste 1` com `cd "Teste 1"` antes de rodar |

---

## Estrutura mínima esperada

```
Teste 1/
  data/
    massa-correcao.csv    ← obrigatório para o teste data-driven
  tests/
    *.spec.ts
  package.json
  playwright.config.ts
```

---

## CI (GitHub Actions)

O projeto inclui pipeline em `.github/workflows/teste1-playwright.yml`. Em push/PR para `main` ou `master`, os testes rodam automaticamente. Em caso de falha, o relatório HTML é publicado como artifact.

---

## Mais detalhes

Para instruções completas de setup, scripts e troubleshooting técnico, consulte `Artefatos/EXECUCAO.md`.
