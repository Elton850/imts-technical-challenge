/**
 * Tipos de estado da UI: erros mapeados e metadados opcionais de requisição.
 */
export type AppError =
  | { type: 'timeout'; message: string }
  | { type: 'rate_limit'; message: string }
  | { type: 'parse_error'; message: string }
  | { type: 'empty_file'; message: string }
  | { type: 'invalid_file'; message: string }
  | { type: 'missing_token'; message: string }
  | { type: 'network'; message: string }
  | { type: 'unknown'; message: string };

export interface ZaiRequestMeta {
  model: string;
  temperature: number;
  timestamp: number;
  durationMs?: number;
}
