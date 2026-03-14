# BASELINE DE EXECUCAO

## Objetivo

Registrar o baseline de execucao da suite E2E para protecao contra regressao. Qualquer alteracao que quebre este baseline deve ser justificada e documentada.

## Baseline registrado

| Campo | Valor |
|-------|-------|
| **Data/Hora** | 14/03/2026 |
| **Comando** | `npm run test:e2e` |
| **Total de testes** | 14 |
| **Passando** | 14 |
| **Falhando** | 0 |
| **Tempo total** | ~26s |
| **Retries utilizados** | 0 |
| **Ambiente** | Windows 11 / Chromium |
| **Workers** | 4 |

## Smoke (testes criticos)

| Campo | Valor |
|-------|-------|
| **Comando** | `npm run test:smoke` |
| **Total** | 4 |
| **Passando** | 4 |
| **Tempo** | ~12.7s |

## Criterio de regressao

- **NAO avancar** se `npm run test:e2e` retornar qualquer falha sem diagnostico e correcao.
- **NAO avancar** se tempo total subir significativamente (>50% do baseline) sem justificativa.
- **Documentar** qualquer alteracao de comportamento esperado nos testes.

## Historico de alteracoes

| Data | Alteracao | Impacto |
|------|-----------|---------|
| 14/03/2026 | Baseline inicial (14 testes) | - |
| 14/03/2026 | Upgrade Pleno: 15 testes (CT-11), lint, CI, docs | - |

