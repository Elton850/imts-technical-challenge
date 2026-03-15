# DOCUMENTO_ENTREGA – Teste 2

## 1. Como foi desenvolvido

### Ordem das implementações

A implementação seguiu a sequência: fundação técnica → arquitetura de estado → integração → normalização → UI → testes → documentação.

1. **Scaffold Angular 18** em `Teste 2/app` com suporte a SCSS e routing standalone
2. **Instalação de dependências:** PrimeNG 18, primeicons, @playwright/test
3. **Modelos e constantes:** `ai-analysis.model.ts`, `ui-state.model.ts`, `zai.constants.ts`
4. **Utilitários:** `analysis-normalizer.ts`, `error-mapper.ts`, `file-reader.util.ts`, `chat-preprocessor.util.ts`
5. **Interceptor / contexto HTTP:** `zai.interceptor.ts` + `HttpContextToken` — marcam chamadas Z.AI com `SKIP_AUTH` e `SKIP_GLOBAL_LOADING`, preservando o Bearer definido pelo service e sinalizando opt-out para eventuais interceptors globais
6. **Service:** `zai-analysis.service.ts` — reduz ruído do chat, monta requisição, aplica timeout, retentativa controlada e normaliza retorno
7. **Componente principal:** `WhatsAnalizerComponent` com todo o template, signals e computed
8. **Rota pública:** `/whatsanalizer` com lazy loading
9. **Testes Playwright:** 6 cenários, 1 CSV-driven
10. **Documentação dos artefatos**

### Decisões de arquitetura

**Único componente de feature:** mantido conforme o enunciado. O componente orquestra o fluxo, mas delega responsabilidades a service (HTTP), utils (transformação) e models (tipagem). Isso cumpre a letra e o espírito do requisito.

**PrimeNG standalone imports:** cada módulo PrimeNG é importado individualmente no componente, habilitando tree-shaking mais eficiente.

---

## 2. Estado e reatividade

### Organização dos Signals

| Grupo | Signals | Finalidade |
|-------|---------|------------|
| Entrada | `systemPrompt`, `selectedModel`, `temperature`, `token`, `uploadedFile`, `chatText` | Dados informados pelo usuário |
| Request | `isLoading`, `requestError`, `retryCountdown` | Estado da chamada HTTP em andamento e janela curta de retentativa |
| Domínio | `analysis` | Resultado normalizado da IA |
| UI | `selectedParticipant` | Estado de interação do dashboard |

### Computed principais

- `canAnalyze`: `chatText && token && !isLoading && retryCountdown === 0` — controla o botão e respeita a janela curta de retentativa após falhas temporárias
- `filteredTarefas`, `filteredPrazos`, `filteredRiscos`, `filteredConflitos`: filtro por participante (substring, case-insensitive) aplicado a cada lista
- `participantOptions`: opções do dropdown de filtro derivadas dos participantes da análise
- `sentimentTitle`: emoji + escala numérica derivados do índice de sentimento
- `hasAnalysis`: flag booleana para controlar visibilidade do dashboard
- `retryGuidanceMessage`: explica quando o usuário já pode tentar novamente sem reenviar o arquivo

---

## 3. Integração com Z.AI

### Montagem da requisição

```typescript
{
  method: 'POST',
  url: 'https://api.z.ai/api/paas/v4/chat/completions',
  headers: {
    'Authorization': 'Bearer <token-da-UI>',
    'Content-Type': 'application/json'
  },
  body: {
    model: selectedModel,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: chatTextPreProcessado }
    ],
    temperature,
    stream: false,
    response_format: { type: 'json_object' }
  }
}
```

### Tratamento de erro e parsing

1. **Pré-processamento do payload:** o histórico é limpo para remover ruído comum de export do WhatsApp e, quando necessário, é reduzido de forma conservadora para priorizar contexto recente e acionável
2. **Parsing:** o campo `choices[0].message.content` é parseado como JSON
3. **Payload inválido:** qualquer falha no parse dispara erro `parse_error` com mensagem amigável
4. **Timeout:** `timeout(150_000)` do RxJS — captura como `TimeoutError`, mapeia para mensagem clara
5. **Rate limit:** status 429 ou `error.code === 1302` → mensagem com orientação de retry manual
6. **Retry automático enxuto:** uma nova tentativa automática após ~1,2s apenas para falhas transitórias rápidas (ex.: rede, `408`, `5xx` e parse inconsistente), sem repetir `429/rate limit`
7. **Cooldown de retentativa manual:** timeout, rate limit, parse error e network iniciam janela curta de ~3 segundos antes de liberar novo clique
8. **Finalize:** `finalize()` garante que `isLoading` é desligado em qualquer desfecho (sucesso, erro, timeout)

### Interceptor Z.AI

- `SKIP_AUTH` e `SKIP_GLOBAL_LOADING` são `HttpContextToken` usados para marcar chamadas à Z.AI.
- Chamadas Z.AI são feitas com `context.set(SKIP_AUTH, true)` e `context.set(SKIP_GLOBAL_LOADING, true)`.
- O **Bearer token** é definido apenas pelo `ZaiAnalysisService` nos headers da requisição. O interceptor **não altera** a requisição (não remove nem sobrescreve `Authorization`), preservando assim o token informado pelo usuário. Se no futuro existir um interceptor de autenticação que adiciona JWT a todas as requisições, esse interceptor deve verificar `SKIP_AUTH` e **não adicionar** `Authorization` nas chamadas Z.AI, para não sobrescrever o Bearer do service.
- `SKIP_GLOBAL_LOADING` está disponível para que um eventual interceptor de loading global ignore chamadas Z.AI.

---

## 4. Maiores desafios

### Desafio 1: Compatibilidade PrimeNG Slider com Angular Signals
**O que era difícil:** `p-slider` não aceita `WritableSignal` diretamente no `ngModel`.
**Como resolveu:** binding bidirecional manual: `[ngModel]="temperature()"` + `(ngModelChange)="temperature.set($event)"`.
**Resultado:** funcional, mas ligeiramente mais verboso que o ideal.

### Desafio 2: Normalização defensiva de payload variável
**O que era difícil:** a IA pode retornar campos ausentes, tipos diferentes ou estruturas inesperadas.
**Como resolveu:** normalização em `analysis-normalizer.ts` trata a resposta como `unknown`, valida cada campo, preenche defaults seguros e recalcula KPIs a partir dos arrays quando indicadores estão ausentes.
**Resultado:** a UI nunca quebra por ausência de campo opcional.

### Desafio 3: Testes estáveis sem token real
**O que era difícil:** os testes E2E não podem depender de token real ou conexão com a Z.AI.
**Como resolveu:** `page.route()` do Playwright intercepta todas as chamadas ao endpoint Z.AI e retorna um mock controlado.
**Resultado:** testes 100% determinísticos, rápidos e sem custo de API.

---

## 5. Tratamento de erros e edge cases

| Cenário | Tratamento | Feedback ao usuário |
|---------|-----------|---------------------|
| Arquivo não .txt | FileReader rejeita antes do upload | Banner de erro imediato |
| Arquivo vazio | FileReader rejeita antes do upload | Banner de erro imediato |
| Token ausente | `canAnalyze` computed → botão desabilitado | Estado visual do botão |
| Loading em andamento | `canAnalyze` computed → botão desabilitado | Estado visual do botão + spinner |
| Timeout (2,5 min) | `TimeoutError` capturado, `finalize()` ativa | Banner com instrução de retry + cooldown curto |
| Rate limit (429 / 1302) | `mapHttpError` → mensagem amigável | Banner com instrução de retry + cooldown curto |
| JSON inválido da IA | Try/catch no parse → `parse_error` | 1 retry automático curto; se persistir, banner explicativo + cooldown curto |
| Falha de rede rápida / `5xx` | Retry RxJS controlado | 1 retry automático curto antes de exibir erro |
| Retry imediato após falha transitória | `retryCountdown` controla liberação do botão | Contagem regressiva visível por ~3s |
| Payload parcial | Normalização com defaults seguros | Dashboard renderiza normalmente |
| Conversa longa com muito ruído | Pré-processamento conservador | Menor chance de timeout sem quebrar contrato da UI |
| Requisição Z.AI com loading global | `SKIP_GLOBAL_LOADING` no contexto HTTP | Sem interferência no estado global |

---

## 6. Melhorias e trade-offs

**Já implementado (incl. nesta entrega):**
1. **Aviso de privacidade** — exibido quando há arquivo e token preenchidos; informa que o conteúdo é enviado à Z.AI e orienta a não usar dados sensíveis.
2. **Exportação do resumo** — botão "Exportar resumo (.txt)" no card do resumo executivo; gera arquivo local com resumo, sentimento, KPIs e listas (sem token, sem conteúdo bruto do chat).
3. **Empty state + guidance operacional** — mensagem de que os dados não são armazenados no aplicativo; loading com hint "Isso pode levar até 2,5 min"; orientação explícita de aguardar ~3 segundos em falhas temporárias.
4. **Pré-processamento de conversas longas** — limpeza de placeholders e redução conservadora de contexto para priorizar trechos recentes e acionáveis.
5. **Retry automático enxuto** — uma única nova tentativa automática para falhas rápidas e transitórias, preservando previsibilidade para rate limit.

**Já implementado em sessões posteriores:** testes unitários para `analysis-normalizer.ts`, `error-mapper.ts`, `file-reader.util.ts`, `zai-analysis.service.ts` e interceptor Z.AI; webServer no Playwright para execução autônoma dos E2E.

**Se tivesse mais tempo, priorizaria:** ReactiveFormsModule para tipagem e validação mais expressiva no painel esquerdo.

**Trade-offs conscientes:**
- Retry automático limitado a 1 tentativa e sem repetir `429` → reduz ruído de falhas rápidas sem mascarar instabilidade do provedor nem inflar custo de token de forma agressiva
- Pré-processamento conservador do contexto → melhora latência e estabilidade, mas prioriza recência e sinais acionáveis quando o histórico é muito longo
- Sem `.env` para token → segurança sobre conveniência
- PrimeNG CSS global → overhead de ~150 KB inevitável, mas necessário para estilo consistente

**Observação importante para avaliação:** a aplicação mitiga o que está sob seu controle (payload, mensagens, cooldown, retry curto e normalização), mas não consegue eliminar completamente oscilações inerentes ao provedor externo Z.AI, como rate limit, timeout e latência variável.

---

## 7. O que faria diferente

**Estrutura:**
- Usaria `ReactiveFormsModule` para o formulário de calibração desde o início
- Criaria um módulo agregador de imports PrimeNG para reduzir verbosidade no componente

**Padrões:**
- Adicionaria validação de schema mais formal (Zod ou similar) na normalização do retorno da IA
- Separaria o sistema de mensagens de erro do componente em um serviço de notificações

**Requisito que interpretaria diferente:**
- "Um único componente" — hoje interpretei como "um único componente de feature na UI". Reafirmaria essa interpretação, mas documentaria mais explicitamente a decisão de ter helpers/services ao redor.
