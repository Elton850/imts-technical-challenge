# RETROSPECTIVA – AI Chat Insights (WhatsAnalizer)

## 1. O que funcionou bem

### Arquitetura com um único componente + suporte de serviços
A restrição de "um único componente" foi interpretada corretamente como "a UI principal em um componente", sem impedir a criação de services, utils, models e interceptors. Isso manteve o componente organizado e o código testável.

### Signals e computed para estado reativo
A separação em quatro grupos de estado (entrada, request, domínio, UI) facilitou muito o raciocínio sobre o fluxo de dados. Os `computed` para listas filtradas eliminaram a necessidade de lógica no template e de gerenciamento manual de eventos.

### Normalização defensiva do retorno da IA
A camada de normalização em `analysis-normalizer.ts` foi um ponto forte: trata campos ausentes, limita o sentimento ao range 0–10, converte arrays nulos em vazios. Isso protege a UI de qualquer variação no payload da IA.

### Mocks de rede no Playwright
A decisão de usar `page.route()` para interceptar chamadas à Z.AI foi acertada. Os testes são 100% determinísticos, rápidos e não dependem de token ou conexão real.

---

## 2. O que gerou atrito

### PrimeNG 18 com Angular 18 standalone
O PrimeNG 18 requer importação explícita de cada módulo no componente standalone. Isso gerou uma lista de imports extensa no componente principal. Em um projeto maior, valeria criar um módulo agregador de UI.

### Formulário sem ReactiveFormsModule
Usar `ngModel` com `[ngModelOptions]="{standalone: true}"` funciona, mas é verboso para formulários maiores. Em um projeto real, `ReactiveFormsModule` com tipagem forte seria preferível.

### Slider do PrimeNG com `ngModel` e Signals
O PrimeNG Slider não aceita um Signal diretamente no `ngModel`. Foi necessário usar `[ngModel]="temperature()"` + `(ngModelChange)="temperature.set($event)"`, o que é funcional mas ligeiramente deselegante.

---

## 3. Decisões tomadas por pragmatismo

| Decisão | Motivo pragmático | Trade-off aceito |
|---------|-------------------|------------------|
| Um único componente principal | Requisito explícito do enunciado | Componente mais longo, mas organizado internamente |
| Retry automático enxuto na API | Reduzir falhas rápidas sem esconder rate limit | Pequeno custo extra de token em casos transitórios |
| PrimeNG Aura com preset WhatsApp (cores #25d366, #075e54) | Alinhamento com identidade WhatsApp | Dependência de CSS global |
| CSV simples (sem biblioteca) | Evitar dependência extra | Parser manual suficiente para formato fixo |
| Token apenas na UI (sem .env) | Política de segurança do projeto | Necessita reinserção a cada sessão |

---

## 4. O que ficaria para próxima iteração

### Funcionalidades
- Exportação do dashboard como PDF ou planilha
- Histórico local de análises (sessionStorage, com aviso de privacidade)
- Aviso explícito de privacidade antes do primeiro envio

### Técnico
- Migrar formulário da esquerda para `ReactiveFormsModule`
- Implementar aviso de arquivo grande (> 500 KB)
- Evoluir o pré-processamento heurístico para chunking/sumarização em múltiplas etapas

**Já realizado:** testes unitários para `analysis-normalizer.ts`, `error-mapper.ts`, `file-reader.util.ts`, `zai-analysis.service.ts` e interceptor; `webServer` no Playwright ativado (E2E sobem a app automaticamente).

### UX
- Progress bar durante análise (se a API suportar streaming parcial)
- Feedback sonoro ou notificação de tab quando análise concluir em background
- Modo de comparação entre duas análises

---

## 5. Riscos conscientemente aceitos

| Risco | Decisão | Justificativa |
|-------|---------|---------------|
| Retorno da IA com formato inesperado | Normalização defensiva | Trata a IA como caixa preta não confiável |
| Arquivo grande causando timeout | Pré-processamento conservador + orientação na UI | Mitiga parte do risco, mas depende do limite e da latência do provedor |
| Sem teste de timeout real | Mock de abort | Timeout real de 2,5 min tornaria os testes lentos demais |
| PrimeNG CSS global | Aceitável | Trade-off padrão de bibliotecas de componentes |
