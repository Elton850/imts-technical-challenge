import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ZaiAnalysisService } from './zai-analysis.service';
import { SKIP_AUTH, SKIP_GLOBAL_LOADING } from '../interceptors/zai.interceptor';
import { ZAI_API_URL, ZAI_AUTO_RETRY_DELAY_MS } from '../constants/zai.constants';

describe('ZaiAnalysisService', () => {
  let service: ZaiAnalysisService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ZaiAnalysisService],
    });
    service = TestBed.inject(ZaiAnalysisService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve enviar POST com Authorization Bearer e contexto SKIP_AUTH', () => {
    const token = 'meu-token-zai';
    const mockBody = {
      choices: [{ message: { content: '{"resumo":"Ok","indicadores":{},"sentimentoDescricao":"","participantes":[],"tarefas":[],"prazos":[],"riscos":[],"conflitos":[]}' } }],
    };

    service
      .analyze('system', 'chat', 'glm-4.5-flash', 0.7, token)
      .subscribe((result) => {
        expect(result.resumo).toBe('Ok');
        expect(result.participantes).toEqual([]);
      });

    const req = httpMock.expectOne(ZAI_API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(req.request.context.get(SKIP_AUTH)).toBe(true);
    expect(req.request.context.get(SKIP_GLOBAL_LOADING)).toBe(true);
    expect(req.request.body.model).toBe('glm-4.5-flash');
    expect(req.request.body.temperature).toBe(0.7);
    expect(req.request.body.stream).toBe(false);
    expect(req.request.body.response_format).toEqual({ type: 'json_object' });
    expect(req.request.body.messages[1].content).toBe('chat');
    req.flush(mockBody);
  });

  it('deve pre-processar o chat antes de enviar para a API', () => {
    const mockBody = {
      choices: [{ message: { content: '{"resumo":"Ok","indicadores":{},"sentimentoDescricao":"","participantes":[],"tarefas":[],"prazos":[],"riscos":[],"conflitos":[]}' } }],
    };
    const rawChat = [
      '09/03/2026, 09:00 - Ana: Bom dia',
      '',
      '09/03/2026, 09:01 - Bruno: image omitted',
      '09/03/2026, 09:02 - Carlos: Vamos seguir',
    ].join('\n');

    service.analyze('system', rawChat, 'glm-4.5-flash', 0.7, 'token').subscribe();

    const req = httpMock.expectOne(ZAI_API_URL);
    expect(req.request.body.messages[1].content).toContain('Bom dia');
    expect(req.request.body.messages[1].content).toContain('Vamos seguir');
    expect(req.request.body.messages[1].content).not.toContain('image omitted');
    req.flush(mockBody);
  });

  it('deve normalizar resposta e preencher indicadores a partir dos arrays', () => {
    const mockBody = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              resumo: 'Resumo',
              sentimentoDescricao: 'Sentimento',
              participantes: ['A', 'B'],
              tarefas: [{ descricao: 'T1', envolvido: 'A', prioridade: 'alta' }],
              prazos: [],
              riscos: [],
              conflitos: [],
            }),
          },
        },
      ],
    };

    service
      .analyze('s', 'c', 'glm-5', 0.5, 't')
      .subscribe((result) => {
        expect(result.resumo).toBe('Resumo');
        expect(result.indicadores.envolvidos).toBe(2);
        expect(result.indicadores.tarefas).toBe(1);
        expect(result.tarefas[0].prioridade).toBe('alta');
      });

    const req = httpMock.expectOne(ZAI_API_URL);
    req.flush(mockBody);
  });

  it('deve repetir uma vez quando a API retorna parse invalido e depois falhar', fakeAsync(() => {
    const mockBody = {
      choices: [{ message: { content: 'nao e json {{{' } }],
    };
    let capturedError: { type: string } | undefined;

    service.analyze('s', 'c', 'm', 0.5, 't').subscribe({
      next: () => fail('deveria ter falhado'),
      error: (err) => {
        capturedError = err;
      },
    });

    const firstReq = httpMock.expectOne(ZAI_API_URL);
    firstReq.flush(mockBody);

    tick(ZAI_AUTO_RETRY_DELAY_MS);

    const secondReq = httpMock.expectOne(ZAI_API_URL);
    secondReq.flush(mockBody);
    tick();

    expect(capturedError?.type).toBe('parse_error');
  }));

  it('nao deve repetir automaticamente em rate limit 429', fakeAsync(() => {
    let capturedError: { type: string } | undefined;

    service.analyze('s', 'c', 'm', 0.5, 't').subscribe({
      next: () => fail('deveria ter falhado'),
      error: (err) => {
        capturedError = err;
      },
    });

    const req = httpMock.expectOne(ZAI_API_URL);
    req.flush({ error: { code: 1302 } }, { status: 429, statusText: 'Too Many Requests' });
    tick(ZAI_AUTO_RETRY_DELAY_MS + 50);

    httpMock.expectNone(ZAI_API_URL);
    expect(capturedError?.type).toBe('rate_limit');
  }));

  it('deve propagar erro quando choices vazio ou content ausente', fakeAsync(() => {
    let capturedError: { type: string } | undefined;

    service.analyze('s', 'c', 'm', 0.5, 't').subscribe({
      next: () => fail('deveria ter falhado'),
      error: (err) => {
        capturedError = err;
      },
    });

    const firstReq = httpMock.expectOne(ZAI_API_URL);
    firstReq.flush({ choices: [] });

    tick(ZAI_AUTO_RETRY_DELAY_MS);

    const secondReq = httpMock.expectOne(ZAI_API_URL);
    secondReq.flush({ choices: [] });
    tick();

    expect(capturedError?.type).toBe('parse_error');
  }));

  it('deve repetir uma vez em erro de rede rapido e concluir com sucesso', fakeAsync(() => {
    let resumo = '';

    service.analyze('system', 'chat', 'glm-4.5-flash', 0.7, 'token').subscribe((result) => {
      resumo = result.resumo;
    });

    const firstReq = httpMock.expectOne(ZAI_API_URL);
    firstReq.error(new ProgressEvent('error'));

    tick(ZAI_AUTO_RETRY_DELAY_MS);

    const secondReq = httpMock.expectOne(ZAI_API_URL);
    secondReq.flush({
      choices: [{ message: { content: '{"resumo":"Recuperou","indicadores":{},"sentimentoDescricao":"","participantes":[],"tarefas":[],"prazos":[],"riscos":[],"conflitos":[]}' } }],
    });
    tick();

    expect(resumo).toBe('Recuperou');
  }));
});
