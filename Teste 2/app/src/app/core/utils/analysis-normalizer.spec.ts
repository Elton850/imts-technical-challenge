import { normalizeAnalysis, sentimentEmoji } from './analysis-normalizer';

describe('analysis-normalizer', () => {
  describe('normalizeAnalysis', () => {
    it('deve retornar objeto normalizado com defaults para payload vazio', () => {
      const result = normalizeAnalysis({});
      expect(result.resumo).toBe('Sem resumo disponível.');
      expect(result.indicadores.envolvidos).toBe(0);
      expect(result.indicadores.tarefas).toBe(0);
      expect(result.indicadores.prazos).toBe(0);
      expect(result.indicadores.riscos).toBe(0);
      expect(result.indicadores.conflitos).toBe(0);
      expect(result.indicadores.sentimento).toBe(5);
      expect(result.sentimentoDescricao).toBe('Descrição de sentimento não disponível.');
      expect(result.participantes).toEqual([]);
      expect(result.tarefas).toEqual([]);
      expect(result.prazos).toEqual([]);
      expect(result.riscos).toEqual([]);
      expect(result.conflitos).toEqual([]);
    });

    it('deve aceitar null/undefined como objeto vazio', () => {
      const r1 = normalizeAnalysis(null);
      const r2 = normalizeAnalysis(undefined);
      expect(r1.resumo).toBe('Sem resumo disponível.');
      expect(r2.participantes).toEqual([]);
    });

    it('deve preencher resumo e participantes a partir do raw', () => {
      const result = normalizeAnalysis({
        resumo: ' Resumo da conversa. ',
        participantes: ['Ana', 'Bruno', '  ', 'Carlos'],
      });
      expect(result.resumo).toBe('Resumo da conversa.');
      expect(result.participantes).toEqual(['Ana', 'Bruno', 'Carlos']);
    });

    it('deve recalcular KPIs a partir dos arrays quando indicadores ausentes', () => {
      const result = normalizeAnalysis({
        participantes: ['A', 'B'],
        tarefas: [{ descricao: 'T1', envolvido: 'A', prioridade: 'alta' }, { descricao: 'T2' }],
        prazos: [{ descricao: 'P1', data: '01/01', envolvido: 'A' }],
        riscos: [{ descricao: 'R1', envolvido: 'B' }],
        conflitos: [{ descricao: 'C1', envolvido: 'A' }],
      });
      expect(result.indicadores.envolvidos).toBe(2);
      expect(result.indicadores.tarefas).toBe(2);
      expect(result.indicadores.prazos).toBe(1);
      expect(result.indicadores.riscos).toBe(1);
      expect(result.indicadores.conflitos).toBe(1);
    });

    it('deve limitar sentimento entre 0 e 10', () => {
      expect(normalizeAnalysis({ indicadores: { sentimento: -1 } }).indicadores.sentimento).toBe(0);
      expect(normalizeAnalysis({ indicadores: { sentimento: 15 } }).indicadores.sentimento).toBe(10);
      expect(normalizeAnalysis({ indicadores: { sentimento: 7.4 } }).indicadores.sentimento).toBe(7);
    });

    it('deve filtrar tarefas sem descricao e aplicar safeString', () => {
      const result = normalizeAnalysis({
        tarefas: [
          { descricao: '  Tarefa 1  ', envolvido: 'Ana', prioridade: 'alta' },
          { descricao: '', envolvido: 'X' },
          { descricao: 'Tarefa 2' },
        ],
      });
      expect(result.tarefas.length).toBe(2);
      expect(result.tarefas[0]).toEqual({ descricao: 'Tarefa 1', envolvido: 'Ana', prioridade: 'alta' });
      expect(result.tarefas[1]).toEqual({ descricao: 'Tarefa 2', envolvido: '', prioridade: 'media' });
    });

    it('deve tratar payload nao-objeto como vazio', () => {
      const result = normalizeAnalysis('string');
      expect(result.resumo).toBe('Sem resumo disponível.');
      expect(normalizeAnalysis(42).participantes).toEqual([]);
    });
  });

  describe('sentimentEmoji', () => {
    it('deve retornar emoji por faixa de sentimento', () => {
      expect(sentimentEmoji(0)).toBe('😢');
      expect(sentimentEmoji(2)).toBe('😢');
      expect(sentimentEmoji(3)).toBe('😕');
      expect(sentimentEmoji(4)).toBe('😕');
      expect(sentimentEmoji(5)).toBe('😐');
      expect(sentimentEmoji(6)).toBe('😐');
      expect(sentimentEmoji(7)).toBe('🙂');
      expect(sentimentEmoji(8)).toBe('🙂');
      expect(sentimentEmoji(9)).toBe('😊');
      expect(sentimentEmoji(10)).toBe('😊');
    });
  });
});
