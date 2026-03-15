/**
 * Utilitário para leitura de arquivos .txt via FileReader.
 * Rejeita arquivos não-.txt, vazios, acima do tamanho máximo ou sem conteúdo legível.
 * Limite de tamanho evita DoS e timeout desnecessário na API.
 */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.txt')) {
      reject(new Error('Apenas arquivos .txt são aceitos.'));
      return;
    }
    if (file.size === 0) {
      reject(new Error('O arquivo está vazio. Carregue um histórico de conversa válido.'));
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      reject(
        new Error(
          `Arquivo muito grande (máximo ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB). Use um histórico menor.`
        )
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) ?? '';
      if (!content.trim()) {
        reject(new Error('O arquivo não contém texto. Carregue um histórico de conversa válido.'));
        return;
      }
      resolve(content);
    };
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo. Tente novamente.'));
    reader.readAsText(file, 'utf-8');
  });
}
