# CENARIOS

## Objetivo

Validar o formulario "Correcao de Valores" da Calculadora do Cidadao (BCB), cobrindo fluxo funcional, validacoes, mensagens de erro e comportamento com dados de borda.

## Escopo

- Tipo de teste: funcional E2E (UI).
- Ferramenta: Playwright (TypeScript).
- Fonte de dados: entrada manual e massa externa `.csv`.

## Premissas

- O ambiente alvo esta disponivel publicamente.
- O navegador abre sem bloqueio de rede local.
- Os indices e campos obrigatorios continuam com comportamento esperado no dia da execucao.

## Cenarios priorizados

| ID | Tipo | Cenario | Entrada principal | Resultado esperado | Prioridade | Status |
|---|---|---|---|---|---|---|
| CT-01 | Positivo | Correcao com dados validos | data inicial/final validas + valor valido + indice selecionado | Resultado calculado exibido sem erro | Alta | Implementado |
| CT-02 | Negativo / Achado | Campo valor vazio | formulario sem valor monetario | **Achado: valor e opcional e sistema calcula sem erro** | Alta | Implementado |
| CT-03 | Negativo | Data inicial invalida | formato invalido ou data impossivel | Mensagem de erro de data | Alta | Nao automatizado (coberto indiretamente) |
| CT-04 | Negativo | Data final menor que inicial | data final anterior | Mensagem de erro de intervalo de datas | Alta | Implementado |
| CT-05 | Borda | Valor zero | valor = 0 | Comportamento consistente | Media | Implementado |
| CT-06 | Borda | Valor muito alto | valor maximo aceitavel | Sistema nao quebra | Media | Implementado |
| CT-07 | Borda | Datas limite | datas muito antigas/recentes permitidas | Regra aplicada sem crash | Media | Implementado |
| CT-08 | Negativo | Indice nao selecionado | select forcado para vazio via JS | Mensagem de erro de indice | Alta | Implementado |
| CT-09 | Regressao | Nova execucao apos erro | fluxo invalido, depois valido | Sistema recupera e calcula | Alta | Coberto no CT-04 (segundo teste) |
| CT-10 | Dados externos | Execucao data-driven CSV | 5 linhas (4 validas, 1 invalida) | Resultado por linha | Alta | Implementado |
| CT-11 | Negativo | Valor negativo | valor = -100 | Sistema responde sem crash | Media | Implementado |

## Achados de produto durante execucao

| ID | Campo | Comportamento Observado | Expectativa Original | Recomendacao |
|---|---|---|---|---|
| ACH-01 | valorCorrecao | Campo e opcional; sistema processa sem valor informado | Erro de obrigatoriedade esperado | Adicionar validacao de obrigatoriedade ou tornar campo claramente opcional |

## Roteiro de automacao (5 obrigatorios + extras)

1. `CT-01` fluxo feliz completo.
2. `CT-02` comportamento com campo valor vazio (achado de produto).
3. `CT-04` regra de data final menor que inicial + regressao com datas validas.
4. `CT-08` validacao de indice obrigatorio.
5. `CT-10` teste com massa externa CSV (5 casos: 4 validos, 1 invalido).

## Rastreabilidade (cenario x script)

| Cenario | Arquivo de teste |
|---|---|
| CT-01 | `tests/calculadora-fluxo-feliz.spec.ts` |
| CT-02 | `tests/calculadora-validacao-valor.spec.ts` |
| CT-04 | `tests/calculadora-regra-data.spec.ts` |
| CT-05 | `tests/calculadora-borda.spec.ts` |
| CT-06 | `tests/calculadora-borda.spec.ts` |
| CT-07 | `tests/calculadora-borda.spec.ts` |
| CT-08 | `tests/calculadora-validacao-indice.spec.ts` |
| CT-11 | `tests/calculadora-borda.spec.ts` |
| CT-10 | `tests/calculadora-data-driven.spec.ts` |

## Cobertura obrigatoria

| Categoria | Minimo | Implementado |
|---|---|---|
| Positivo | 1 | 1 (CT-01) + 4 casos CSV validos |
| Negativo | 2 | 4 (CT-02, CT-04, CT-08, CT-11) |
| Borda | 1 | 4 (CT-04 regressao + CT-05, CT-06, CT-07) |
| Data-driven CSV | 1 | 1 (CT-10 com 5 casos) |

## Evidencias esperadas

- Screenshot em caso de falha (configurado no playwright.config.ts).
- Trace em caso de falha (configurado no playwright.config.ts).
- Artefatos de falha em `.pw-out/`; relatório HTML em `playwright-report/`.
- Log com casos da massa CSV (pass/fail por linha na saída do terminal).

