import { HttpErrorResponse } from '@angular/common/http';
import { mapHttpError } from './error-mapper';

describe('error-mapper', () => {
  it('deve mapear TimeoutError para tipo timeout', () => {
    const err = new Error('Timeout');
    err.name = 'TimeoutError';
    const result = mapHttpError(err);
    expect(result.type).toBe('timeout');
    expect(result.message).toContain('2,5 min');
  });

  it('deve mapear status 429 para rate_limit', () => {
    const err = new HttpErrorResponse({ status: 429 });
    const result = mapHttpError(err);
    expect(result.type).toBe('rate_limit');
    expect(result.message).toContain('Limite de requis');
    expect(result.message).toContain('provedor externo');
  });

  it('deve mapear error.code 1302 para rate_limit', () => {
    const err = new HttpErrorResponse({ status: 200, error: { code: 1302 } });
    const result = mapHttpError(err);
    expect(result.type).toBe('rate_limit');
  });

  it('deve mapear error.error.code 1302 para rate_limit', () => {
    const err = new HttpErrorResponse({ status: 400, error: { error: { code: 1302 } } });
    const result = mapHttpError(err);
    expect(result.type).toBe('rate_limit');
  });

  it('deve mapear 401/403 para network com mensagem de token', () => {
    const r401 = mapHttpError(new HttpErrorResponse({ status: 401 }));
    const r403 = mapHttpError(new HttpErrorResponse({ status: 403 }));
    expect(r401.type).toBe('network');
    expect(r401.message).toContain('Token');
    expect(r403.type).toBe('network');
  });

  it('deve mapear status 0 para network (conexao)', () => {
    const result = mapHttpError(new HttpErrorResponse({ status: 0 }));
    expect(result.type).toBe('network');
    expect(result.message).toContain('conectar');
  });

  it('deve mapear outro status HTTP para network generico', () => {
    const result = mapHttpError(new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' }));
    expect(result.type).toBe('network');
    expect(result.message).toContain('500');
  });

  it('deve mapear erro desconhecido para unknown', () => {
    const result = mapHttpError('string error');
    expect(result.type).toBe('unknown');
    expect(result.message).toContain('inesperado');
  });
});
