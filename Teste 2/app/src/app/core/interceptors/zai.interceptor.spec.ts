import { HttpRequest, HttpContext, HttpHeaders, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { zaiAuthInterceptor, SKIP_AUTH } from './zai.interceptor';

describe('zaiAuthInterceptor', () => {
  it('deve repassar a requisicao sem alterar headers (preserva Bearer do service)', (done) => {
    const bearer = 'Bearer token-zai-123';
    const req = new HttpRequest('POST', 'https://api.z.ai/api/paas/v4/chat/completions', {}, {
      headers: new HttpHeaders({ Authorization: bearer }),
      context: new HttpContext().set(SKIP_AUTH, true),
    });
    let captured: HttpRequest<unknown> | null = null;
    const next = (r: HttpRequest<unknown>) => {
      captured = r;
      return of(new HttpResponse({ status: 200 }));
    };
    zaiAuthInterceptor(req, next).subscribe(() => {
      expect(captured).toBe(req);
      expect(captured!.headers.get('Authorization')).toBe(bearer);
      done();
    });
  });

  it('deve repassar requisicao sem contexto SKIP_AUTH sem alteracao', (done) => {
    const req = new HttpRequest('GET', '/api/local', {});
    let captured: HttpRequest<unknown> | null = null;
    const next = (r: HttpRequest<unknown>) => {
      captured = r;
      return of(new HttpResponse({ status: 200 }));
    };
    zaiAuthInterceptor(req, next).subscribe(() => {
      expect(captured).toBe(req);
      done();
    });
  });
});
