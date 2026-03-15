/**
 * Mapeia erros de HTTP e TimeoutError para o tipo AppError exibido na UI.
 * Regra: nunca expor o corpo da resposta (error.error) ao usuário — apenas status e mensagens controladas.
 */
import { HttpErrorResponse } from '@angular/common/http';
import { AppError } from '../models/ui-state.model';

export function mapHttpError(error: unknown): AppError {
  if (error instanceof Error && error.name === 'TimeoutError') {
    return {
      type: 'timeout',
      message: 'A análise demorou mais que o esperado (2,5 min). Isso pode acontecer em momentos de lentidão do provedor.',
    };
  }

  if (error instanceof HttpErrorResponse) {
    // Rate limit - código 1302 ou status 429
    if (error.status === 429 || error.error?.code === 1302 || error.error?.error?.code === 1302) {
      return {
        type: 'rate_limit',
        message: 'Limite de requisições atingido no provedor externo. Aguarde alguns instantes e tente novamente.',
      };
    }
    if (error.status === 401 || error.status === 403) {
      return {
        type: 'network',
        message: 'Token inválido ou sem permissão. Verifique o token Z.AI informado.',
      };
    }
    if (error.status === 0) {
      return {
        type: 'network',
        message: 'Não foi possível conectar à API Z.AI. Verifique sua conexão.',
      };
    }
    return {
      type: 'network',
      message: `Erro da API: ${error.status} – ${error.statusText || 'sem detalhes'}`,
    };
  }

  return {
    type: 'unknown',
    message: 'Ocorreu um erro inesperado. Tente novamente.',
  };
}
