import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';

// Token de contexto para identificar chamadas à Z.AI
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);
export const SKIP_GLOBAL_LOADING = new HttpContextToken<boolean>(() => false);

/**
 * Interceptor que garante que JWT da aplicação NÃO seja enviado para a API Z.AI.
 * Chamadas Z.AI são marcadas com SKIP_AUTH=true no contexto; o Bearer token é
 * definido pelo ZaiAnalysisService. Este interceptor não altera a requisição
 * (preserva o Authorization: Bearer <token> colocado pelo service). Se no futuro
 * um interceptor de auth adicionar JWT a todas as requisições, esse interceptor
 * deve verificar SKIP_AUTH e não adicionar Authorization nas chamadas Z.AI.
 */
export const zaiAuthInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
