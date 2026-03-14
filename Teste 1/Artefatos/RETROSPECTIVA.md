# RETROSPECTIVA

## Resumo da execucao

**Data**: 14/03/2026
**Resultado final**: 14/14 testes passando, suite estavel, todos os artefatos atualizados.

Este teste foi conduzido com foco em cobertura funcional, estabilidade da automacao, descoberta de comportamento real e clareza da documentacao.

## Maiores desafios tecnicos

### 1. Mascara de data com auto-insercao de barra

- **Dificuldade**: O campo de data usa uma mascara JavaScript (`Mask("mm/yyyy", "date")`) que auto-insere "/" apos os 2 primeiros digitos do mes. Ao digitar "01/2023" com `pressSequentially`, a barra adicional causava "01//202" — data invalida.
- **Acao**: Alterar a estrategia de preenchimento para digitar apenas os digitos numericos ("012023"), deixando a mascara inserir o separador automaticamente.
- **Resultado**: Datas preenchidas corretamente em todos os testes. Erro eliminado apos 1 ciclo de diagnostico.
- **Risco residual**: baixo — se a mascara mudar de logica, os testes podem precisar de ajuste.

### 2. Descoberta de comportamento nao documentado no campo valor

- **Dificuldade**: CT-02 foi desenhado esperando que o campo "valor" fosse obrigatorio e gerasse erro ao ser submetido vazio. O sistema real NAO valida essa obrigatoriedade.
- **Acao**: Oracle do CT-02 atualizado para refletir o comportamento real do sistema. Achado registrado como oportunidade de melhoria no PRODUTO.md.
- **Resultado**: Teste estabilizado, comportamento documentado com transparencia.

### 3. Indice obrigatorio sem opcao vazia no select

- **Dificuldade**: Para CT-08 (indice nao selecionado), o `<select>` nao possui uma opcao em branco por default — todos os indices possuem valor. Nao ha como "desselecionar" usando a UI normal.
- **Acao**: Uso de `page.evaluate()` para forcas o valor do select para string vazia antes da submissao, simulando a ausencia de selecao de forma controlada.
- **Resultado**: Comportamento de erro corretamente disparado e validado.

### 4. Variacao de resposta do ambiente externo

- **Dificuldade**: Latencia de site governamental (~2-3s de resposta) e eventual variacao de rede.
- **Acao**: Timeout de 60s configurado no playwright.config.ts, com `waitForLoadState('networkidle')` apos submissao.
- **Resultado**: Execucoes previsiveis sem timeout em todas as rodadas observadas.

## Uso de IA durante o processo

- IA foi usada para:
  - Inspecionar o HTML da pagina alvo para identificar seletores corretos antes de escrever os testes (obtendo `id`, `name`, `class` reais dos campos).
  - Propor a estrutura de helpers compartilhados para evitar duplicacao.
  - Diagnosticar rapidamente a causa raiz das falhas (mascara de data) pela leitura do snapshot de erro.
  - Atualizar artefatos de documentacao com dados reais da execucao.
- IA NAO substituiu:
  - A validacao do comportamento real do sistema (descoberto via execucao efetiva).
  - A decisao de ajustar o oracle do CT-02 (juizo sobre o que e correto documentar).

## Justificativa de ferramentas

- **Playwright (TypeScript)**: boa confiabilidade para E2E, relatorio nativo util para evidencia, suporte a dialogs (alert), tracing e screenshots em falha.
- **CSV para massa**: facilita escalabilidade de casos sem duplicar codigo de teste.
- **Sem bibliotecas adicionais**: decisao intencional para manter simplicidade, previsibilidade e foco no escopo oficial. Parsing de CSV feito manualmente (arquivo simples sem aspas ou virgulas em valores).

## O que eu melhoraria com mais tempo

1. **Page Object Model**: extrair seletores e acoes para uma classe `CalculadoraPage` separando responsabilidades (locators vs testes).
2. **Cobertura de borda**: adicionar CT-05 (valor zero), CT-06 (valor maximo), CT-07 (datas limite historicas).
3. **Medicao de performance integrada**: adicionar medicao de `responseTime` em cada teste via interceptacao de rede com `page.route()`.
4. **Pipeline CI**: adicionar GitHub Actions para execucao automatica em push/PR.
5. **Relatorio CSV dos casos data-driven**: exportar resultado por linha da massa em arquivo separado para rastreabilidade.

## Melhorias implementadas (evolucao pos-entrega)

Em ciclos de refinamento, foram aplicadas as seguintes melhorias sem alterar o escopo oficial:

| Melhoria | Descricao |
|----------|-----------|
| **README_EXECUCAO_RAPIDA.md** | Guia enxuto com pre-requisitos, 3 comandos, interpretacao do resultado e solucao para erros comuns. Facilita avaliador nao tecnico. |
| **EXECUCAO.md acessivel** | Linguagem simplificada, tabelas de comandos e troubleshooting em formato amigavel. |
| **Validacao da massa CSV** | Antes dos testes data-driven, o projeto valida colunas obrigatorias e linhas (tipoCaso valido/invalido). Erro amigavel se faltar coluna ou linha invalida. |
| **Modo smoke** | Script `npm run test:smoke` para execucao rapida dos testes criticos (CT-01, CT-04, CT-08). |
| **PRODUTO.md** | Secao "Melhorias UI/UX priorizadas" com mensagens de erro, validacao inline, feedback de carregamento e acessibilidade. |
| **POM incremental** | `tests/pages/calculadora.page.ts` com metodos reutilizaveis (abrir, preencher, submeter, temErroVisivel). Helpers delegam ao POM; comportamento identico. |
| **CT-05, CT-06, CT-07** | Testes de borda: valor zero, valor alto, datas limite. Oraculo: sistema nao quebra. |
| **CI GitHub Actions** | `.github/workflows/teste1-playwright.yml` — checkout, npm ci, playwright install, test:e2e. Artifact playwright-report em falha. |

### Trade-offs

- **Validacao CSV**: adiciona checagem antes dos testes. Em caso de CSV invalido, um teste falha com mensagem clara.
- **Modo smoke**: executa 4 testes; nao substitui a suite completa.
- **POM**: helpers mantidos para compatibilidade; migracao gradual possivel.
- **CI**: depende de site externo (BCB); falhas podem ser por indisponibilidade do alvo.
- **Testes de borda**: oraculos baseados em comportamento observado; datas/valores limite podem variar com o tempo.

### Proximos passos sugeridos

1. Manter suite principal em verde em cada alteracao.
2. Migrar specs para usar CalculadoraPage diretamente (opcional).
3. Avaliar retry no CI para instabilidade de rede.
4. Relatorio CSV dos casos data-driven para rastreabilidade.

---

## Pendencias ou limitacoes

1. **Campo valor nao validado como obrigatorio**: o sistema aceita calculo sem valor informado. Registrado como oportunidade de melhoria (ver PRODUTO.md).
2. **CT-03 nao automatizado**: data inicial invalida (formato); coberto indiretamente. CT-05, CT-06, CT-07 implementados.
3. **Performance sem Lighthouse**: metrica de score Lighthouse nao coletada pois o site usa tecnologia legada que distorce os resultados. Substituido por medicao de tempo da suite Playwright.

