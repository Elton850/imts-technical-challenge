import { readTextFile } from './file-reader.util';

describe('file-reader.util', () => {
  it('deve rejeitar arquivo que nao termina em .txt', async () => {
    const file = new File(['conteudo'], 'documento.pdf', { type: 'application/pdf' });
    await expectAsync(readTextFile(file)).toBeRejectedWithError(/\.txt/);
  });

  it('deve rejeitar arquivo vazio', async () => {
    const file = new File([], 'chat.txt', { type: 'text/plain' });
    await expectAsync(readTextFile(file)).toBeRejectedWithError(/vazio|válido/);
  });

  it('deve resolver com conteudo quando arquivo .txt valido', async () => {
    const content = 'Linha 1\nLinha 2 do chat';
    const file = new File([content], 'chat.txt', { type: 'text/plain' });
    const result = await readTextFile(file);
    expect(result).toBe(content);
  });

  it('deve rejeitar quando leitura retorna vazio apos trim', async () => {
    const file = new File(['   \n\t  '], 'chat.txt', { type: 'text/plain' });
    await expectAsync(readTextFile(file)).toBeRejectedWithError(/texto|válido/);
  });

  it('deve rejeitar arquivo maior que 5 MB', async () => {
    const sixMb = new Blob([new ArrayBuffer(6 * 1024 * 1024)]);
    const file = new File([sixMb], 'grande.txt', { type: 'text/plain' });
    await expectAsync(readTextFile(file)).toBeRejectedWithError(/máximo|5/);
  });
});
