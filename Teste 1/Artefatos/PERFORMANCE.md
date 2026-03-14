# PERFORMANCE

## Objetivo

Apresentar uma analise simples de performance do fluxo principal do formulario da Calculadora do Cidadao, com baseline, variacao e gargalos claramente separados.

## Ferramenta escolhida

- **Playwright** — medicao via tempo de execucao reportado pela suite
- Medicao integrada (sem ferramenta externa)
- Lighthouse nao utilizado: site usa HTTP/1.1 e tecnologia legada que distorce scores de SPA

## Metodo

1. Fluxo critico: abrir pagina → preencher → submeter → aguardar resultado
2. Minimo 3 rodadas para estabilidade
3. Metrica: tempo total reportado pelo Playwright

## Metricas observadas (14/03/2026)

### Tempo de execucao da suite completa (3 rodadas)

| Rodada | Total de testes | Tempo total | Media por teste |
|--------|-----------------|-------------|-----------------|
| 1 | 14 | 26.2s | 1.75s |
| 2 | 14 | 26.1s | 1.74s |
| 3 | 14 | 26.2s | 1.75s |

**Baseline**: ~26.2s | **Variacao**: <1% | **Ambiente**: Windows 11 / Chromium

### Tempo de resposta apos submit (fluxo feliz)

- CT-01: ~4–5s total (carregamento + preenchimento + resposta)
- Estimativa servidor BCB: ~2–3s por requisicao POST
- Sem timeouts com configuracao de 60s

## Analise (metricas vs recomendacoes)

| Metrica observada | Valor |
|-------------------|-------|
| Estabilidade | Suite previsivel em 3 rodadas |
| Gargalo principal | Latencia de rede (site externo) |
| Timeout | Nenhum observado |

| Recomendacao sugerida | Base |
|----------------------|------|
| Feedback de loading no botao | Reduzir cliques repetidos |
| Cache servidor para calculos repetidos | Otimizacao hipotetica |
| Validacao inline antes do submit | Evitar round-trip de erro |

## Evidencias

- Data: 14/03/2026
- Ambiente: Windows 11 / Chromium (Playwright v1.41)
- Relatorio: `playwright-report/index.html`

