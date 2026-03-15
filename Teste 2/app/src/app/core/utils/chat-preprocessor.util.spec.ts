import { MAX_ANALYSIS_INPUT_CHARS, prepareChatForAnalysis } from './chat-preprocessor.util';

describe('chat-preprocessor.util', () => {
  it('deve remover placeholders de midia e linhas vazias', () => {
    const result = prepareChatForAnalysis([
      '09/03/2026, 09:00 - Ana: Bom dia',
      '',
      '09/03/2026, 09:01 - Bruno: image omitted',
      '09/03/2026, 09:02 - Carlos: Vamos seguir',
    ].join('\n'));

    expect(result.content).toContain('Bom dia');
    expect(result.content).toContain('Vamos seguir');
    expect(result.content).not.toContain('image omitted');
    expect(result.wasReduced).toBeTrue();
  });

  it('deve manter contexto pequeno sem truncamento agressivo', () => {
    const content = [
      '09/03/2026, 09:00 - Ana: Bom dia',
      '09/03/2026, 09:01 - Bruno: Vamos alinhar a entrega de quarta',
    ].join('\n');

    const result = prepareChatForAnalysis(content);

    expect(result.content).toBe(content);
    expect(result.finalCharCount).toBe(content.length);
  });

  it('deve reduzir conversas longas preservando linhas importantes e recentes', () => {
    const earlyImportant = '09/03/2026, 09:05 - Ana: Prazo final da entrega ate sexta 18h.';
    const longChat = [
      ...Array.from({ length: 40 }, (_, index) => `09/03/2026, 08:${index.toString().padStart(2, '0')} - Time: Mensagem inicial ${index}`),
      earlyImportant,
      ...Array.from({ length: 420 }, (_, index) => `10/03/2026, 10:${(index % 60).toString().padStart(2, '0')} - Time: Atualizacao generica ${index} ${'x'.repeat(40)}`),
      '11/03/2026, 18:20 - Diego: Ultima atualizacao antes da demo.',
    ].join('\n');

    const result = prepareChatForAnalysis(longChat);

    expect(result.wasReduced).toBeTrue();
    expect(result.finalCharCount).toBeLessThanOrEqual(MAX_ANALYSIS_INPUT_CHARS);
    expect(result.content).toContain(earlyImportant);
    expect(result.content).toContain('Ultima atualizacao antes da demo.');
    expect(result.content).toContain('Trechos intermediarios omitidos');
  });
});
