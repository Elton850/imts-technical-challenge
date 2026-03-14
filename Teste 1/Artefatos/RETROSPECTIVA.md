# RETROSPECTIVA

## Resumo da execucao

**Data**: 14/03/2026
**Resultado final**: 16/16 testes passando, suite estavel.

Foco em cobertura funcional, estabilidade da automacao, descoberta de comportamento real e clareza da documentacao.

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

## O que foi entregue (implementado)

- **Page Object**: `calculadora.page.ts` com metodos reutilizaveis; helpers delegam ao POM.
- **Cobertura de borda**: CT-05 (valor zero), CT-06 (valor alto), CT-07 (datas limite), CT-11 (valor negativo).
- **CI GitHub Actions**: lint + test:e2e em push/PR; artifact playwright-report em falha.
- **Modo smoke**: `test:verify` e `test:smoke:local` para validacao rapida.
- **Validacao CSV**: checagem de colunas e linhas antes dos testes data-driven.
- **Execucao local robusta**: output em `.pw-out/`, workers=1, script de limpeza para Windows.

## O que eu melhoraria com mais tempo

1. **Medicao de performance integrada**: `responseTime` via `page.route()` em cada teste.
2. **Relatorio CSV dos casos data-driven**: exportar resultado por linha para rastreabilidade.
3. **Retry no CI**: para falhas intermitentes por latencia do site BCB.

---

## Pendencias ou limitacoes

1. **Campo valor nao validado como obrigatorio**: o sistema aceita calculo sem valor informado. Registrado como oportunidade de melhoria (ver PRODUTO.md).
2. **CT-03 implementado**: data inicial com mes invalido (ex: 13) gera mensagem de erro.
3. **Performance sem Lighthouse**: metrica de score Lighthouse nao coletada pois o site usa tecnologia legada que distorce os resultados. Substituido por medicao de tempo da suite Playwright.

