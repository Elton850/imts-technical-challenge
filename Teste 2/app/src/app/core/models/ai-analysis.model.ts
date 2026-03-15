/**
 * Contratos de dados da análise: resposta bruta da API (Z.AI) e modelo normalizado para a UI.
 */
export interface AiIndicadores {
  envolvidos: number;
  tarefas: number;
  prazos: number;
  riscos: number;
  conflitos: number;
  sentimento: number;
}

export interface AiTarefa {
  descricao: string;
  envolvido: string;
  prioridade: string;
}

export interface AiPrazo {
  descricao: string;
  data: string;
  envolvido: string;
}

export interface AiRisco {
  descricao: string;
  envolvido: string;
}

export interface AiConflito {
  descricao: string;
  envolvido: string;
}

export interface AiAnalysisRaw {
  resumo?: string;
  indicadores?: Partial<AiIndicadores>;
  sentimentoDescricao?: string;
  participantes?: string[];
  tarefas?: Partial<AiTarefa>[];
  prazos?: Partial<AiPrazo>[];
  riscos?: Partial<AiRisco>[];
  conflitos?: Partial<AiConflito>[];
}

// Modelo normalizado pronto para a UI
export interface AiAnalysisNormalized {
  resumo: string;
  indicadores: AiIndicadores;
  sentimentoDescricao: string;
  participantes: string[];
  tarefas: AiTarefa[];
  prazos: AiPrazo[];
  riscos: AiRisco[];
  conflitos: AiConflito[];
}
