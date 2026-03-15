import { AiAnalysisNormalized, AiAnalysisRaw, AiTarefa, AiPrazo, AiRisco, AiConflito } from '../models/ai-analysis.model';

/**
 * Normaliza a resposta bruta da API (ou qualquer objeto) para o contrato AiAnalysisNormalized.
 * Garante valores padrão, tipos seguros e recalcula indicadores a partir dos arrays quando necessário.
 */
export function normalizeAnalysis(raw: unknown): AiAnalysisNormalized {
  const data = (raw && typeof raw === 'object' ? raw : {}) as AiAnalysisRaw;

  const indicadores = data.indicadores ?? {};
  const participantes = Array.isArray(data.participantes) ? data.participantes.filter(isNonEmptyString) : [];

  const tarefas: AiTarefa[] = Array.isArray(data.tarefas)
    ? data.tarefas.map(t => ({
        descricao: safeString(t?.descricao),
        envolvido: safeString(t?.envolvido),
        prioridade: safeString(t?.prioridade, 'media'),
      })).filter(t => t.descricao)
    : [];

  const prazos: AiPrazo[] = Array.isArray(data.prazos)
    ? data.prazos.map(p => ({
        descricao: safeString(p?.descricao),
        data: safeString(p?.data),
        envolvido: safeString(p?.envolvido),
      })).filter(p => p.descricao)
    : [];

  const riscos: AiRisco[] = Array.isArray(data.riscos)
    ? data.riscos.map(r => ({
        descricao: safeString(r?.descricao),
        envolvido: safeString(r?.envolvido),
      })).filter(r => r.descricao)
    : [];

  const conflitos: AiConflito[] = Array.isArray(data.conflitos)
    ? data.conflitos.map(c => ({
        descricao: safeString(c?.descricao),
        envolvido: safeString(c?.envolvido),
      })).filter(c => c.descricao)
    : [];

  const sentimentoRaw = typeof indicadores.sentimento === 'number' ? indicadores.sentimento : 5;
  const sentimento = Math.max(0, Math.min(10, Math.round(sentimentoRaw)));

  return {
    resumo: safeString(data.resumo, 'Sem resumo disponível.'),
    indicadores: {
      envolvidos: safeNumber(indicadores.envolvidos, participantes.length),
      tarefas: safeNumber(indicadores.tarefas, tarefas.length),
      prazos: safeNumber(indicadores.prazos, prazos.length),
      riscos: safeNumber(indicadores.riscos, riscos.length),
      conflitos: safeNumber(indicadores.conflitos, conflitos.length),
      sentimento,
    },
    sentimentoDescricao: safeString(data.sentimentoDescricao, 'Descrição de sentimento não disponível.'),
    participantes,
    tarefas,
    prazos,
    riscos,
    conflitos,
  };
}

/** Converte valor para string não vazia; usa fallback se inválido ou vazio. */
function safeString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return fallback;
  return String(value).trim() || fallback;
}

/** Converte valor para número inteiro não negativo; usa fallback se NaN ou negativo. */
function safeNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return isNaN(n) || n < 0 ? fallback : Math.round(n);
}

/** Type guard: string não vazia após trim. */
function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

/** Retorna emoji de sentimento conforme a nota (0–10). */
export function sentimentEmoji(sentimento: number): string {
  if (sentimento <= 2) return '😢';
  if (sentimento <= 4) return '😕';
  if (sentimento <= 6) return '😐';
  if (sentimento <= 8) return '🙂';
  return '😊';
}
