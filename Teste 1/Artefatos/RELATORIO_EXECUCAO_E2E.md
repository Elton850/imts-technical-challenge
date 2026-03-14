# RELATORIO CONSOLIDADO DE EXECUCAO E2E

## Objetivo

Rastreabilidade cenario -> arquivo -> status -> evidencia.

## Ultima execucao (14/03/2026)

| Metrica | Valor |
|---------|-------|
| Total de testes | 15 |
| Passando | 15 |
| Tempo local | ~55s |
| Ambiente | Windows 11 / Chromium |

## Mapeamento cenario -> spec -> evidencia em falha

| Cenario | Arquivo spec | Evidencia em falha |
|--------|--------------|--------------------|
| CT-01 | `calculadora-fluxo-feliz.spec.ts` | `.pw-out/` |
| CT-02 | `calculadora-validacao-valor.spec.ts` | `.pw-out/` |
| CT-04 | `calculadora-regra-data.spec.ts` | `.pw-out/` |
| CT-05, CT-06, CT-07, CT-11 | `calculadora-borda.spec.ts` | `.pw-out/` |
| CT-08 | `calculadora-validacao-indice.spec.ts` | `.pw-out/` |
| CT-10 | `calculadora-data-driven.spec.ts` | `.pw-out/` |

## Evidencia minima em falha

- **Screenshot**: `screenshot: 'only-on-failure'` no config.
- **Trace**: em `.pw-out/`; inspecao com `npx playwright show-trace`.
- **Relatorio HTML**: `playwright-report/`.

## Como interpretar

1. **Pass**: criterio de aceite atendido.
2. **Fail**: consultar `.pw-out/` e `playwright-report/`.
3. **Flaky**: verificar latencia do site BCB ou seletores.

