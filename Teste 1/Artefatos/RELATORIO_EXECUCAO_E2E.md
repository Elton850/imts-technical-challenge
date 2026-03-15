# RELATORIO CONSOLIDADO DE EXECUCAO E2E

## Objetivo

Rastreabilidade cenario -> arquivo -> status -> evidencia.

## Ultima execucao (14/03/2026)

| Metrica | Valor |
|---------|-------|
| Total de testes | 16 |
| Passando | 16 |
| Tempo local | ~55s |
| Ambiente | Windows 11 / Chromium |

## Mapeamento cenario -> spec -> evidencia em falha

| Cenario | Arquivo spec | Evidencia em falha |
|--------|--------------|--------------------|
| CT-01 | `calculadora-fluxo-feliz.spec.ts` | `%TEMP%/imts-teste1-playwright/` |
| CT-02 | `calculadora-validacao-valor.spec.ts` | `%TEMP%/imts-teste1-playwright/` |
| CT-03, CT-04 | `calculadora-regra-data.spec.ts` | `%TEMP%/imts-teste1-playwright/` |
| CT-05, CT-06, CT-07, CT-11 | `calculadora-borda.spec.ts` | `%TEMP%/imts-teste1-playwright/` |
| CT-08 | `calculadora-validacao-indice.spec.ts` | `%TEMP%/imts-teste1-playwright/` |
| CT-10 | `calculadora-data-driven.spec.ts` | `%TEMP%/imts-teste1-playwright/` |

## Evidencia minima em falha

- **Screenshot**: `screenshot: 'only-on-failure'` no config.
- **Trace**: em `%TEMP%/imts-teste1-playwright/`; inspecao com `npx playwright show-trace`.
- **Relatorio HTML**: pasta temporaria (local) ou artifact (CI).

## Como interpretar

1. **Pass**: criterio de aceite atendido.
2. **Fail**: consultar `%TEMP%/imts-teste1-playwright/` (local) ou artifact (CI).
3. **Flaky**: verificar latencia do site BCB ou seletores.

