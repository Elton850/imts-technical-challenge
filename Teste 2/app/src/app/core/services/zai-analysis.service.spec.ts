import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ZaiAnalysisService } from './zai-analysis.service';
import { SKIP_AUTH, SKIP_GLOBAL_LOADING } from '../interceptors/zai.interceptor';
import { ZAI_API_URL } from '../constants/zai.constants';

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

  it('deve propagar erro de parse quando content nao e JSON valido', () => {
    const mockBody = {
      choices: [{ message: { content: 'nao e json {{{' } }],
    };

    service.analyze('s', 'c', 'm', 0.5, 't').subscribe({
      next: () => fail('deveria ter falhado'),
      error: (err) => {
        expect(err.type).toBe('parse_error');
        expect(err.message).toBeDefined();
      },
    });

    const req = httpMock.expectOne(ZAI_API_URL);
    req.flush(mockBody);
  });

  it('deve propagar erro quando choices vazio ou content ausente', () => {
    service.analyze('s', 'c', 'm', 0.5, 't').subscribe({
      next: () => fail('deveria ter falhado'),
      error: (err) => {
        expect(err.type).toBe('parse_error');
      },
    });

    const req = httpMock.expectOne(ZAI_API_URL);
    req.flush({ choices: [] });
  });
});
