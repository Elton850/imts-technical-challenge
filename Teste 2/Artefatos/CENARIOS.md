# CENARIOS – AI Chat Insights (WhatsAnalizer)

## Metodologia de priorização

Cenários priorizados por risco e valor: fluxo principal (happy path), tratamento de erros críticos, e comportamento de filtro que constitui o diferencial central do produto.

---

## CT-01 – Estado vazio inicial

**Arquivo:** `e2e/01-empty-state.spec.ts`
**Tipo:** Smoke / Estrutural
**Prioridade:** Alta

### Pré-condições
- Aplicação acessível em http://localhost:4200

### Passos
1. Navegar para `/whatsanalizer`
2. Observar a tela sem interação

### Resultados esperados
- Header com título "AI Chat Insights" visível
- Painel de calibração (system prompt, modelo, temperature, token) visível
- Dashboard exibe **estado vazio** com instrução ao usuário
- Botão "Enviar para Análise" **desabilitado**
- Nenhum KPI ou lista de itens visível

---

## CT-02 – Upload e análise com sucesso (mock)

**Arquivo:** `e2e/02-upload-and-analyze.spec.ts`
**Tipo:** Funcional / Happy path
**Prioridade:** Alta
**Mock:** `e2e/fixtures/mock-analysis-response.json`

### Pré-condições
- API Z.AI interceptada com mock de resposta válida
- Arquivo `sample-chat.txt` disponível

### Passos
1. Preencher token
2. Fazer upload do `sample-chat.txt`
3. Clicar em "Enviar para Análise"
4. Aguardar resposta

### Resultados esperados
- Nome do arquivo exibido no painel
- Botão habilitado após upload + token
- Dashboard renderizado com 5 KPIs
- Resumo executivo com texto
- Sentimento com emoji e escala `/10`
- 3 chips de participantes (Ana, Bruno, Carlos)
- 4 listas de itens visíveis (tarefas, prazos, riscos, conflitos)

---

## CT-03 – Tratamento de erros

**Arquivo:** `e2e/03-error-handling.spec.ts`
**Tipo:** Negativo / Resiliência
**Prioridade:** Alta

### Subcenários

| Sub | Entrada | Resultado esperado |
|-----|---------|-------------------|
| 03a | API retorna 429 | Banner de erro com "Limite de requisições"; cooldown curto (~3s) e botão reabilitado ao fim da janela |
| 03b | API retorna JSON inválido | Banner com "interpretar a resposta" + cooldown curto (~3s) |
| 03c | Upload de arquivo `.json` (não .txt) | Banner de erro de tipo de arquivo |
| 03d | Sem token com arquivo | Botão permanece desabilitado |
| 03e | Durante loading | Botão desabilitado até resposta |

---

## CT-04 – Filtro por participante

**Arquivo:** `e2e/04-filter.spec.ts`
**Tipo:** Funcional / Interatividade
**Prioridade:** Alta

### Pré-condições
- Análise carregada com mock (3 participantes, itens distribuídos)

### Passos
1. Abrir filtro de participante
2. Selecionar participante específico
3. Observar badges e listas

### Resultados esperados
- Opções: Todos, Ana, Bruno, Carlos
- Filtrar "Ana" → tarefas:1, prazos:1, riscos:1, conflitos:0
- Filtrar "Bruno" → tarefas:1, prazos:1, riscos:0, conflitos:1
- Selecionar "Todos" e contagens completas cobertos pelo CT-06 (CSV)
- Todas as 4 listas afetadas simultaneamente

---

## CT-05 – Resposta parcial não quebra a UI

**Arquivo:** `e2e/05-partial-response.spec.ts`
**Tipo:** Resiliência / Edge case
**Prioridade:** Média

### Subcenários

| Sub | Payload da IA | Resultado esperado |
|-----|--------------|-------------------|
| 05a | Sem participantes, tarefas, prazos, riscos, conflitos | Dashboard renderiza; listas mostram "Nenhum item encontrado" |
| 05b | Sentimento = 1 (muito negativo) | Emoji 😢; título "1/10" |

---

## CT-06 – Filtro por participante orientado por CSV

**Arquivo:** `e2e/06-filter-csv.spec.ts`
**Massa:** `e2e/fixtures/participants-filter.csv`
**Tipo:** Data-driven
**Prioridade:** Média

### Estrutura do CSV

```
participant,expectedTarefas,expectedPrazos,expectedRiscos,expectedConflitos
Ana,1,1,1,0
Bruno,1,1,0,1
Carlos,1,0,1,0
,3,2,2,1
```

### Comportamento
- Para cada linha do CSV, executa um teste parametrizado
- Valida badges após aplicar o filtro correspondente
- Linha sem `participant` = seleção "Todos"

---

## Cobertura total

| Funcionalidade | Coberta |
|---------------|---------|
| Estado vazio inicial | ✅ CT-01 |
| Upload de arquivo .txt | ✅ CT-02 |
| Integração Z.AI (mock) | ✅ CT-02 |
| KPIs no dashboard | ✅ CT-02 |
| Resumo executivo | ✅ CT-02 |
| Análise de sentimento | ✅ CT-02, CT-05 |
| Chips de participantes | ✅ CT-02 |
| Rate limit (429) | ✅ CT-03 |
| JSON inválido | ✅ CT-03 |
| Arquivo tipo inválido | ✅ CT-03 |
| Botão desabilitado sem token | ✅ CT-03 |
| Botão desabilitado durante loading | ✅ CT-03 |
| Filtro por participante | ✅ CT-04 |
| Badges refletem filtro | ✅ CT-04, CT-06 |
| Resposta parcial sem quebra | ✅ CT-05 |
| Teste data-driven (CSV) | ✅ CT-06 |

**Total:** 6 cenários, 20+ asserções, 1 teste orientado por CSV
