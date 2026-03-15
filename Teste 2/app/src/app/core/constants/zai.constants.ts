/**
 * Constantes da integração com a API Z.AI: URL, modelos, timeout e prompt padrão.
 */
export const ZAI_API_URL = 'https://api.z.ai/api/paas/v4/chat/completions';

export const ZAI_MODELS = [
  { label: 'GLM-4.5 Flash', value: 'glm-4.5-flash' },
  { label: 'GLM-4.7', value: 'glm-4.7' },
  { label: 'GLM-5', value: 'glm-5' },
];

export const ZAI_TIMEOUT_MS = 150_000; // 2,5 minutos
export const ZAI_DEFAULT_MODEL = 'glm-4.5-flash';
export const ZAI_DEFAULT_TEMPERATURE = 0.3;
export const ZAI_AUTO_RETRY_ATTEMPTS = 1;
export const ZAI_AUTO_RETRY_DELAY_MS = 1_200;

export const ZAI_HTTP_CONTEXT_KEY = 'ZAI_REQUEST';

export const DEFAULT_SYSTEM_PROMPT = `Você analisa conversas corporativas de WhatsApp.
Retorne somente JSON válido, sem markdown ou texto extra, usando esta estrutura:

{
  "resumo": "Resumo executivo da conversa em 2-4 frases",
  "indicadores": {
    "envolvidos": <número de participantes>,
    "tarefas": <número de tarefas identificadas>,
    "prazos": <número de prazos mencionados>,
    "riscos": <número de riscos identificados>,
    "conflitos": <número de conflitos identificados>,
    "sentimento": <nota de 0 a 10, onde 0 é muito negativo e 10 é muito positivo>
  },
  "sentimentoDescricao": "Descrição do sentimento geral da conversa",
  "participantes": ["nome1", "nome2"],
  "tarefas": [
    { "descricao": "descrição da tarefa", "envolvido": "nome do responsável", "prioridade": "alta|media|baixa" }
  ],
  "prazos": [
    { "descricao": "descrição do prazo", "data": "data mencionada", "envolvido": "nome" }
  ],
  "riscos": [
    { "descricao": "descrição do risco", "envolvido": "nome" }
  ],
  "conflitos": [
    { "descricao": "descrição do conflito", "envolvido": "nome" }
  ]
}

Se um campo não tiver dados, retorne array vazio ou omita o campo. Responda SOMENTE com o JSON.`;
