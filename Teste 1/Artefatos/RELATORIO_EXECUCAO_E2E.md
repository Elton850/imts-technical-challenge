# RELATORIO CONSOLIDADO DE EXECUCAO E2E

## Objetivo

Documentar o resultado da execucao da suite E2E com rastreabilidade cenario -> arquivo -> status -> evidencia.

## Ultima execucao (14/03/2026)

| Metrica | Valor |
|---------|-------|
| Data/Hora | 14/03/2026 |
| Total de testes | 14 |
| Passando | 14 |
| Falhando | 0 |
| Tempo total | ~23s |
| Ambiente | Windows 11 / Chromium |

## Mapeamento cenario -> spec -> status -> evidencia

| Cenario | Arquivo spec | Status | Evidencia em falha |
|--------|--------------|--------|--------------------|
| CT-01 | `calculadora-fluxo-feliz.spec.ts` | Pass | Screenshot + trace em `test-results/` |
| CT-02 | `calculadora-validacao-valor.spec.ts` | Pass | Screenshot + trace em `test-results/` |
| CT-04 | `calculadora-regra-data.spec.ts` | Pass | Screenshot + trace em `test-results/` |
| CT-05 | `calculadora-borda.spec.ts` | Pass | Screenshot + trace em `test-results/` |
| CT-06 | `calculadora-borda.spec.ts` | Pass | Screenshot + trace em `test-results/` |
| CT-07 | `calculadora-borda.spec.ts` | Pass | Screenshot + trace em `test-results/` |
| CT-08 | `calculadora-validacao-indice.spec.ts` | Pass | Screenshot + trace em `test-results/` |
| CT-10 | `calculadora-data-driven.spec.ts` | Pass | Screenshot + trace em `test-results/` |
| CT-11 | `calculadora-borda.spec.ts` | Pass | Screenshot + trace em `test-results/` |

## Evidencia minima em falha

- **Screenshot**: capturado automaticamente pelo Playwright (`screenshot: 'only-on-failure'`).
- **Trace**: gravado em `test-results/<test-name>/trace.zip` para inspecao com `npx playwright show-trace`.
- **Mensagem**: expect com descricao clara do criterio de sucesso em cada teste.

## Como interpretar o relatorio

1. **Pass**: cenario executado e criterio de aceite atendido.
2. **Fail**: cenario falhou; consultar `test-results/` e `playwright-report/` para diagnostico.
3. **Flaky**: se o mesmo teste falhar intermitentemente, verificar latencia do site BCB ou seletores.

