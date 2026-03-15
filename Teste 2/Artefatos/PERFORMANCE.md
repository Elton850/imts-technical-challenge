# PERFORMANCE – AI Chat Insights (WhatsAnalizer)

## 1. Visão geral

Este documento analisa o desempenho da aplicação em suas principais dimensões: leitura de arquivo, integração com API, renderização do dashboard e custo de recomputações.

---

## 2. Leitura e processamento do arquivo

### Mecanismo
- FileReader (API nativa do browser), leitura assíncrona com `readAsText`
- Limpeza leve do texto para remover ruído de export do WhatsApp
- Redução conservadora de contexto em conversas longas, priorizando trechos recentes e acionáveis

### Comportamento esperado por tamanho

| Tamanho do arquivo | Tempo estimado de leitura |
|--------------------|--------------------------|
| < 100 KB (típico) | < 50ms |
| 100–500 KB | 50–200ms |
| > 1 MB | > 200ms (aceitável) |

### Gargalo identificado
- Arquivos de WhatsApp com imagens exportadas como texto podem ter payload extenso
- Mesmo com pré-processamento, conversas muito extensas ainda podem pressionar limite de contexto e latência do provedor

### Mitigação implementada
- Remoção de placeholders e linhas sem valor analítico
- Recorte inteligente com foco em recência e linhas potencialmente acionáveis

### Recomendação futura
- Adicionar aviso visual para arquivos > 500 KB
- Evoluir de recorte heurístico para chunking/sumarização em múltiplas etapas

---

## 3. Integração com a API Z.AI

### Configuração
- Timeout: 150.000ms (2,5 minutos)
- Retry automático enxuto: 1 nova tentativa curta apenas para falhas rápidas e transitórias, sem repetir `429/rate limit`
- Mock de rede nos testes E2E elimina dependência de latência real

### Observações
- O tempo de resposta real depende do modelo e do tamanho do contexto
- Modelos mais leves (glm-4.5-flash) tendem a ser mais rápidos
- Rate limit pode causar frustração em sessões de uso intenso
- A maior fonte de variabilidade percebida continua sendo o provedor externo Z.AI, não a renderização local do dashboard

### Janela observada (estimada com mock)
- Tempo de roundtrip local (mock): < 100ms
- Tempo de parseamento e normalização: < 5ms
- Tempo de pré-processamento local: baixo, proporcional ao número de linhas; impacto desprezível frente à latência da API

---

## 4. Renderização do dashboard

### Estratégia
- Signals + `computed`: recomputação somente quando o dado-base muda
- Normalização ocorre uma única vez após a resposta da API
- Filtro por participante: `computed` recalculado somente quando `analysis` ou `selectedParticipant` muda

### Custo das operações

| Operação | Complexidade | Impacto |
|----------|-------------|---------|
| Normalização do JSON | O(n) | Baixo |
| Filtro por participante | O(n) × 4 listas | Baixo |
| Renderização de KPIs | O(1) | Mínimo |
| Renderização de listas | O(n) com `@for` | Baixo |

### Cenário realista
- 50 tarefas: filtro recalcula em < 1ms
- 500 participantes: filtro por substring ainda O(n) — aceitável

---

## 5. Métricas de qualidade percebida

| Evento | Meta | Status |
|--------|------|--------|
| Primeiro conteúdo visível (FCP) | < 1s | Atingível (bundle lazy-loaded) |
| Interação após upload | Imediata | ✅ FileReader não-bloqueante |
| Feedback de loading | Imediato (spinner) | ✅ Implementado |
| Feedback de erro | < 100ms após resposta | ✅ Signals atualizam instantaneamente |
| Filtro aplicado | Imediato (computed) | ✅ Sem debounce necessário |

---

## 6. Oportunidades de melhoria

| Prioridade | Melhoria | Motivo |
|------------|----------|--------|
| Alta | Chunking/sumarização por etapas | Reduzir ainda mais risco de timeout em conversas muito extensas |
| Média | Web Worker para parsing | Evitar travamento em arquivos > 2 MB |
| Baixa | Paginação/virtualização das listas | Somente necessário se listas > 100 itens |
| Baixa | Cache de análise em sessionStorage | UX para reload acidental (requer política de privacidade) |

---

## 7. Notas sobre bundle

- PrimeNG 18 com tree-shaking via standalone imports
- Apenas componentes utilizados incluídos no bundle
- Lazy loading da feature via `loadComponent` reduz bundle inicial
- CSS de PrimeNG importado globalmente (~150 KB minificado, inevitável)
