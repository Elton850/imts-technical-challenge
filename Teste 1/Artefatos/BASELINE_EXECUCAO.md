# BASELINE DE EXECUCAO

## Objetivo

Registrar o baseline da suite E2E para protecao contra regressao. Alteracoes que quebrem este baseline devem ser justificadas.

## Baseline registrado

| Campo | Valor |
|-------|-------|
| **Data** | 14/03/2026 |
| **Total de testes** | 16 |
| **Passando** | 16 |
| **Comando local** | `npm run test:e2e:local` |
| **Comando CI** | `npm run test:e2e` |
| **Tempo local** | ~55s (workers=1) |
| **Tempo CI** | ~30s (workers paralelos) |
| **Ambiente** | Windows 11 / Chromium (local); Node 20 (CI) |

## Smoke (testes criticos)

| Campo | Valor |
|-------|-------|
| **Comando** | `npm run test:verify` ou `npm run test:smoke:local` |
| **Total** | 5 |
| **Tempo** | ~18s |

## Criterio de regressao

- **NAO avancar** se `npm run test:e2e:local` ou `npm run test:e2e` (CI) retornar falha sem diagnostico.
- **Documentar** alteracoes de comportamento esperado nos testes.

