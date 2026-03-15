# DOCUMENTO_ENTREGA – Teste 2

## 1. Como foi desenvolvido

### Ordem das implementações

A implementação seguiu a sequência: fundação técnica → arquitetura de estado → integração → normalização → UI → testes → documentação.

1. **Scaffold Angular 18** em `Teste 2/app` com suporte a SCSS e routing standalone
2. **Instalação de dependências:** PrimeNG 18, primeicons, @playwright/test
3. **Modelos e constantes:** `ai-analysis.model.ts`, `ui-state.model.ts`, `zai.constants.ts`
4. **Utilitários:** `analysis-normalizer.ts`, `error-mapper.ts`, `file-reader.util.ts`
5. **Interceptor:** `zai.interceptor.ts` — impede JWT e loading global em chamadas Z.AI
6. **Service:** `zai-analysis.service.ts` — monta requisição, aplica timeout, normaliza retorno
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
| Request | `isLoading`, `requestError` | Estado da chamada HTTP em andamento |
| Domínio | `analysis` | Resultado normalizado da IA |
| UI | `selectedParticipant` | Estado de interação do dashboard |

### Computed principais

- `canAnalyze`: `chatText && token && !isLoading` — controla o botão
- `filteredTarefas`, `filteredPrazos`, `filteredRiscos`, `filteredConflitos`: filtro por participante (substring, case-insensitive) aplicado a cada lista
- `participantOptions`: opções do dropdown de filtro derivadas dos participantes da análise
- `sentimentTitle`: emoji + escala numérica derivados do índice de sentimento
- `hasAnalysis`: flag booleana para controlar visibilidade do dashboard

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
      { role: 'user', content: chatText }
    ],
    temperature,
    stream: false,
    response_format: { type: 'json_object' }
  }
}
```

### Tratamento de erro e parsing

1. **Parsing:** o campo `choices[0].message.content` é parseado como JSON
2. **Payload inválido:** qualquer falha no parse dispara erro `parse_error` com mensagem amigável
3. **Timeout:** `timeout(150_000)` do RxJS — captura como `TimeoutError`, mapeia para mensagem clara
4. **Rate limit:** status 429 ou `error.code === 1302` → mensagem com orientação de retry
5. **Finalize:** `finalize()` garante que `isLoading` é desligado em qualquer desfecho (sucesso, erro, timeout)

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
| Timeout (2,5 min) | `TimeoutError` capturado, `finalize()` ativa | Banner com instrução de retry |
| Rate limit (429 / 1302) | `mapHttpError` → mensagem amigável | Banner com instrução de retry |
| JSON inválido da IA | Try/catch no parse → `parse_error` | Banner explicativo |
| Payload parcial | Normalização com defaults seguros | Dashboard renderiza normalmente |
| Requisição Z.AI com loading global | `SKIP_GLOBAL_LOADING` no contexto HTTP | Sem interferência no estado global |

---

## 6. Melhorias e trade-offs

**Se tivesse mais tempo, priorizaria:**
1. **Aviso de privacidade** — o usuário precisa saber que o conteúdo da conversa é enviado à Z.AI
2. **Exportação do dashboard** — maior valor percebido pelo usuário
3. **ReactiveFormsModule** — tipagem mais forte e validação mais expressiva no painel esquerdo

**Já implementado em sessões posteriores:** testes unitários para `analysis-normalizer.ts`, `error-mapper.ts`, `file-reader.util.ts`, `zai-analysis.service.ts` e interceptor Z.AI; webServer no Playwright para execução autônoma dos E2E.

**Trade-offs conscientes:**
- Sem retry automático → evita custo de token em falhas transitórias
- Sem `.env` para token → segurança sobre conveniência
- PrimeNG CSS global → overhead de ~150 KB inevitável, mas necessário para estilo consistente

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
