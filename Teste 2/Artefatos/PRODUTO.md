# PRODUTO – AI Chat Insights (WhatsAnalizer)

## 1. Proposta de valor

O WhatsAnalizer transforma históricos de conversa do WhatsApp em inteligência acionável para equipes e gestores. Em vez de reler longas conversas para identificar o que foi decidido, quem ficou responsável, e quais riscos surgiram, o usuário obtém um dashboard estruturado em segundos.

**Problema central:** conversas corporativas no WhatsApp são ricas em contexto, mas difíceis de processar e auditar.

**Solução:** análise assistida por IA que extrai automaticamente tarefas, prazos, riscos, conflitos e sentimento da conversa.

---

## 2. Jornada do usuário

```
Exportar .txt do WhatsApp
        ↓
Abrir a aplicação
        ↓
Configurar modelo e temperature (opcional)
        ↓
Inserir token Z.AI
        ↓
Fazer upload do arquivo
        ↓
Clicar em "Enviar para Análise"
        ↓
Aguardar análise (até 2,5 min)
        ↓
Explorar dashboard (KPIs, resumo, sentimento, filtros)
```

### Clareza da jornada

**Pontos fortes:**
- O estado vazio orienta explicitamente o usuário com passos numerados
- O botão desabilitado comunica pré-requisitos sem mensagem de erro desnecessária
- O loading com mensagem de tempo esperado reduz ansiedade

**Pontos de atenção:**
- Exportação do WhatsApp não é trivial: usuário precisa conhecer o caminho no app
- Token Z.AI é um conceito técnico — pode ser barreira para usuários não-técnicos
- Sem feedback visual de progresso real (apenas spinner genérico)

---

## 3. Confiança e transparência sobre IA

**O que a aplicação comunica:**
- Que o token não é armazenado (hint no campo)
- Que a análise é gerada por IA (contexto do sistema)

**O que poderia comunicar melhor:**
- Que o resultado é probabilístico e pode conter imprecisões
- Que o conteúdo da conversa é enviado a um provedor externo (Z.AI)
- Que o modelo escolhido afeta a qualidade do resultado

**Recomendação:** adicionar um aviso de privacidade antes do primeiro envio, informando que o conteúdo será processado pela API Z.AI.

---

## 4. Valor dos blocos do dashboard

| Bloco | Valor | Observações |
|-------|-------|-------------|
| KPIs | Alto | Resumo quantitativo imediato |
| Resumo executivo | Alto | Economia de leitura |
| Sentimento | Médio | Útil para triagem; subjetivo por natureza |
| Envolvidos (chips) | Médio | Identifica stakeholders rapidamente |
| Filtro por participante | Alto | Permite accountability por pessoa |
| Tarefas | Alto | Core da tomada de decisão |
| Prazos | Alto | Essencial para follow-up |
| Riscos | Alto | Prevenção de problemas |
| Conflitos | Médio | Útil para gestão de equipe; sensível |

---

## 5. Limitações conhecidas

- **Qualidade depende do modelo:** modelos mais leves podem gerar resultados imprecisos
- **Formato do export varia:** exportações antigas do WhatsApp têm formatos ligeiramente diferentes
- **Sem histórico:** cada análise é independente; não há comparação entre conversas
- **Sem exportação:** o dashboard não pode ser exportado como PDF ou planilha
- **Sem edição:** o usuário não pode corrigir erros da IA diretamente no dashboard

---

## 6. Oportunidades de evolução

| Oportunidade | Impacto | Esforço |
|-------------|---------|---------|
| Exportar dashboard como PDF | Alto | Médio |
| Histórico de análises (local) | Alto | Médio |
| Comparar duas conversas | Médio | Alto |
| Edição inline dos itens extraídos | Médio | Alto |
| Suporte a outros formatos (Telegram, Teams) | Alto | Alto |
| Internacionalização | Baixo | Médio |
| Aviso de privacidade antes do envio | Alto (confiança) | Baixo |
| Breakdown de sentimento por participante | Médio | Médio |
