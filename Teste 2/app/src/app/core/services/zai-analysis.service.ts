import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, TimeoutError, throwError, timer } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';
import {
  ZAI_API_URL,
  ZAI_TIMEOUT_MS,
  ZAI_AUTO_RETRY_ATTEMPTS,
  ZAI_AUTO_RETRY_DELAY_MS,
} from '../constants/zai.constants';
import { SKIP_AUTH, SKIP_GLOBAL_LOADING } from '../interceptors/zai.interceptor';
import { mapHttpError } from '../utils/error-mapper';
import { normalizeAnalysis } from '../utils/analysis-normalizer';
import { prepareChatForAnalysis } from '../utils/chat-preprocessor.util';
import { AiAnalysisNormalized } from '../models/ai-analysis.model';
import { AppError } from '../models/ui-state.model';

export interface ZaiRequestPayload {
  model: string;
  messages: { role: 'system' | 'user'; content: string }[];
  temperature: number;
  stream: boolean;
  response_format: { type: 'json_object' };
}

/**
 * Serviço de análise via API Z.AI: monta requisição, aplica timeout,
 * extrai JSON do corpo da resposta e normaliza para AiAnalysisNormalized.
 */
@Injectable({ providedIn: 'root' })
export class ZaiAnalysisService {
  private readonly http = inject(HttpClient);

  /** Envia conversa para a Z.AI e retorna análise normalizada ou lança AppError. */
  analyze(
    systemPrompt: string,
    chatText: string,
    model: string,
    temperature: number,
    token: string
  ): Observable<AiAnalysisNormalized> {
    const preparedChat = prepareChatForAnalysis(chatText);
    const payload: ZaiRequestPayload = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: preparedChat.content },
      ],
      temperature,
      stream: false,
      response_format: { type: 'json_object' },
    };

    // Token usado apenas no header desta requisição; nunca persistido nem logado.
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const context = new HttpContext()
      .set(SKIP_AUTH, true)
      .set(SKIP_GLOBAL_LOADING, true);

    return this.http.post<unknown>(ZAI_API_URL, payload, { headers, context }).pipe(
      timeout(ZAI_TIMEOUT_MS),
      map((response) => this.extractAndNormalize(response)),
      retry({
        count: ZAI_AUTO_RETRY_ATTEMPTS,
        delay: (err: unknown) =>
          shouldAutoRetry(err) ? timer(ZAI_AUTO_RETRY_DELAY_MS) : throwError(() => err),
      }),
      catchError((err: unknown) => {
        if (err instanceof TimeoutError) {
          return throwError(() => ({ type: 'timeout' as const, message: 'A análise demorou mais que o esperado (2,5 min). Tente novamente com um arquivo menor.' }));
        }
        if (isAppError(err)) {
          return throwError(() => err);
        }
        return throwError(() => mapHttpError(err));
      })
    );
  }

  /** Extrai content de choices[0].message, faz parse JSON e normaliza; lança AppError se inválido. */
  private extractAndNormalize(response: unknown): AiAnalysisNormalized {
    // Resposta da API Z.AI: { choices: [{ message: { content: '...' } }] }
    const res = response as Record<string, unknown>;
    const choices = Array.isArray(res?.['choices']) ? res['choices'] : [];
    const content = (choices[0] as Record<string, unknown>)?.['message'];
    const contentStr = (content as Record<string, unknown>)?.['content'];

    if (typeof contentStr !== 'string' || !contentStr.trim()) {
      throw { type: 'parse_error', message: 'A IA retornou uma resposta vazia ou inválida.' };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(contentStr);
    } catch {
      throw { type: 'parse_error', message: 'Não foi possível interpretar a resposta da IA. Tente novamente.' };
    }

    return normalizeAnalysis(parsed);
  }
}

/** Type guard para erros já no formato AppError (ex.: parse_error lançado por extractAndNormalize). */
function isAppError(value: unknown): value is AppError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    'message' in value &&
    typeof (value as AppError).message === 'string'
  );
}

function shouldAutoRetry(error: unknown): boolean {
  if (isAppError(error)) {
    return error.type === 'parse_error';
  }

  if (error instanceof HttpErrorResponse) {
    return error.status === 0 || error.status === 408 || error.status >= 500;
  }

  return false;
}
