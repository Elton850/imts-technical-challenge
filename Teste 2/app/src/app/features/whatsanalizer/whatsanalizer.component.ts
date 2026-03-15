import { ChangeDetectionStrategy, Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

// PrimeNG 18 standalone components
import { InputTextarea } from 'primeng/inputtextarea';
import { Select } from 'primeng/select';
import { Slider } from 'primeng/slider';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Chip } from 'primeng/chip';
import { Toast } from 'primeng/toast';
import { Tag } from 'primeng/tag';
import { MessageService } from 'primeng/api';

import { ZaiAnalysisService } from '../../core/services/zai-analysis.service';
import { AiAnalysisNormalized } from '../../core/models/ai-analysis.model';
import { AppError } from '../../core/models/ui-state.model';
import { ZAI_MODELS, DEFAULT_SYSTEM_PROMPT } from '../../core/constants/zai.constants';
import { sentimentEmoji } from '../../core/utils/analysis-normalizer';
import { readTextFile } from '../../core/utils/file-reader.util';

@Component({
  selector: 'app-whatsanalizer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    InputTextarea,
    Select,
    Slider,
    Password,
    Button,
    Card,
    Chip,
    Toast,
    Tag,
  ],
  providers: [MessageService],
  templateUrl: './whatsanalizer.component.html',
  styleUrls: ['./whatsanalizer.component.scss'],
})
/**
 * Componente principal do WhatsAnalizer: upload de .txt, calibração (modelo, temperature, token),
 * chamada à Z.AI e exibição do dashboard com KPIs, filtro por participante e listas.
 */
export class WhatsAnalizerComponent implements OnDestroy {
  private readonly analysisService = inject(ZaiAnalysisService);
  private readonly messageService = inject(MessageService);
  private retryCountdownTimer: ReturnType<typeof setInterval> | null = null;

  // ─── Estado de entrada ─────────────────────────────────────────────────────
  readonly systemPrompt = signal<string>(DEFAULT_SYSTEM_PROMPT);
  readonly selectedModel = signal<string>('glm-4.5-flash');
  readonly temperature = signal<number>(0.7);
  readonly token = signal<string>('');
  readonly uploadedFile = signal<File | null>(null);
  readonly chatText = signal<string>('');

  // ─── Estado de request ────────────────────────────────────────────────────
  readonly isLoading = signal<boolean>(false);
  readonly requestError = signal<AppError | null>(null);
  readonly retryCountdown = signal<number>(0);

  // ─── Estado de domínio ────────────────────────────────────────────────────
  readonly analysis = signal<AiAnalysisNormalized | null>(null);

  // ─── Estado de UI ─────────────────────────────────────────────────────────
  readonly selectedParticipant = signal<string>('');

  // ─── Constantes expostas ao template ──────────────────────────────────────
  readonly models = ZAI_MODELS;
  readonly suggestedRetryDelaySeconds = 3;

  // ─── Computados ───────────────────────────────────────────────────────────
  readonly canAnalyze = computed(() =>
    !!this.chatText() && !!this.token() && !this.isLoading() && this.retryCountdown() === 0
  );

  readonly hasAnalysis = computed(() => this.analysis() !== null);

  readonly showProcessingNotice = computed(() => !!this.uploadedFile());

  readonly processingNoticeTitle = computed(() =>
    this.isLoading() ? 'Processamento em andamento' : 'Sobre o processamento'
  );

  readonly processingNoticeMessage = computed(() =>
    this.isLoading()
      ? 'A análise depende do provedor externo Z.AI e pode levar até 2,5 minutos.'
      : 'A análise depende do provedor externo Z.AI, pode levar até 2,5 minutos e pode oscilar por latência, timeout ou limite temporário de requisições.'
  );

  readonly retryGuidanceMessage = computed(() => {
    const remaining = this.retryCountdown();
    if (remaining > 0) {
      return `Nova tentativa liberada em ${remaining}s. O arquivo continua carregado e não precisa ser enviado de novo.`;
    }

    return `Em falhas temporárias, aguarde cerca de ${this.suggestedRetryDelaySeconds} segundos antes de tentar novamente.`;
  });

  readonly requestErrorHint = computed(() => {
    const error = this.requestError();
    if (!error) return '';

    switch (error.type) {
      case 'timeout':
        return `Isso pode acontecer com conversas longas ou em momentos de maior lentidão. Aguarde cerca de ${this.suggestedRetryDelaySeconds} segundos e tente novamente. Se quiser, tente um recorte menor da conversa.`;
      case 'rate_limit':
        return `O limite do provedor externo foi atingido temporariamente. Aguarde cerca de ${this.suggestedRetryDelaySeconds} segundos e tente novamente sem reenviar o arquivo.`;
      case 'parse_error':
        return `O provedor retornou uma resposta em formato inesperado. Isso pode ser temporário. Aguarde cerca de ${this.suggestedRetryDelaySeconds} segundos e tente novamente.`;
      case 'network':
        return `Falhas temporárias de rede ou disponibilidade podem acontecer. Confira sua conexão, aguarde cerca de ${this.suggestedRetryDelaySeconds} segundos e tente novamente.`;
      default:
        return '';
    }
  });

  readonly participantOptions = computed(() => {
    const result = this.analysis();
    if (!result) return [{ label: 'Todos', value: '' }];
    return [
      { label: 'Todos', value: '' },
      ...result.participantes.map((p) => ({ label: p, value: p })),
    ];
  });

  readonly filteredTarefas = computed(() => {
    const result = this.analysis();
    if (!result) return [];
    const filter = this.selectedParticipant().toLowerCase();
    if (!filter) return result.tarefas;
    return result.tarefas.filter((t) => t.envolvido.toLowerCase().includes(filter));
  });

  readonly filteredPrazos = computed(() => {
    const result = this.analysis();
    if (!result) return [];
    const filter = this.selectedParticipant().toLowerCase();
    if (!filter) return result.prazos;
    return result.prazos.filter((p) => p.envolvido.toLowerCase().includes(filter));
  });

  readonly filteredRiscos = computed(() => {
    const result = this.analysis();
    if (!result) return [];
    const filter = this.selectedParticipant().toLowerCase();
    if (!filter) return result.riscos;
    return result.riscos.filter((r) => r.envolvido.toLowerCase().includes(filter));
  });

  readonly filteredConflitos = computed(() => {
    const result = this.analysis();
    if (!result) return [];
    const filter = this.selectedParticipant().toLowerCase();
    if (!filter) return result.conflitos;
    return result.conflitos.filter((c) => c.envolvido.toLowerCase().includes(filter));
  });

  readonly sentimentTitle = computed(() => {
    const result = this.analysis();
    if (!result) return '';
    const s = result.indicadores.sentimento;
    return `${sentimentEmoji(s)} Sentimento da conversa (${s}/10)`;
  });

  readonly prioridadeSeverity = (prioridade: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' => {
    const map: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
      baixa: 'info',
      media: 'warn',
      alta: 'danger',
    };
    return map[prioridade?.toLowerCase()] ?? 'info';
  };

  ngOnDestroy(): void {
    this.clearRetryCooldown();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await readTextFile(file);
      this.uploadedFile.set(file);
      this.chatText.set(text);
      this.requestError.set(null);
      this.clearRetryCooldown();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao ler o arquivo.';
      this.requestError.set({ type: 'invalid_file', message: msg });
      this.uploadedFile.set(null);
      this.chatText.set('');
      this.clearRetryCooldown();
      input.value = '';
    }
  }

  analyze(): void {
    if (!this.canAnalyze()) return;

    if (!this.token()) {
      this.requestError.set({ type: 'missing_token', message: 'Informe o Token Z.AI antes de analisar.' });
      return;
    }

    this.clearRetryCooldown();
    this.isLoading.set(true);
    this.requestError.set(null);
    this.analysis.set(null);
    this.selectedParticipant.set('');

    const startTime = Date.now();

    this.analysisService
      .analyze(
        this.systemPrompt(),
        this.chatText(),
        this.selectedModel(),
        this.temperature(),
        this.token()
      )
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (result) => {
          this.clearRetryCooldown();
          this.analysis.set(result);
          const duration = ((Date.now() - startTime) / 1000).toFixed(1);
          this.messageService.add({
            severity: 'success',
            summary: 'Análise concluída',
            detail: `Processado em ${duration}s`,
            life: 3000,
          });
        },
        error: (err: AppError) => {
          this.requestError.set(err);
          if (this.isTransientRetryableError(err)) {
            this.startRetryCooldown();
          } else {
            this.clearRetryCooldown();
          }
        },
      });
  }

  clearFile(): void {
    this.uploadedFile.set(null);
    this.chatText.set('');
    this.analysis.set(null);
    this.requestError.set(null);
    this.selectedParticipant.set('');
    this.clearRetryCooldown();
  }

  private isTransientRetryableError(error: AppError): boolean {
    return ['timeout', 'rate_limit', 'parse_error', 'network'].includes(error.type);
  }

  private startRetryCooldown(): void {
    this.clearRetryCooldown();
    this.retryCountdown.set(this.suggestedRetryDelaySeconds);
    this.retryCountdownTimer = setInterval(() => {
      const remaining = this.retryCountdown();
      if (remaining <= 1) {
        this.clearRetryCooldown();
        return;
      }

      this.retryCountdown.set(remaining - 1);
    }, 1000);
  }

  private clearRetryCooldown(): void {
    if (this.retryCountdownTimer !== null) {
      clearInterval(this.retryCountdownTimer);
      this.retryCountdownTimer = null;
    }

    this.retryCountdown.set(0);
  }

  /**
   * Exporta resumo da análise para um arquivo .txt local (seguro: sem token, sem conteúdo do chat).
   */
  exportSummary(): void {
    const a = this.analysis();
    if (!a) return;

    const lines: string[] = [
      '=== WhatsAnalizer - Resumo da Análise ===',
      '',
      'Resumo executivo:',
      a.resumo,
      '',
      `Sentimento: ${a.indicadores.sentimento}/10`,
      a.sentimentoDescricao,
      '',
      'Indicadores:',
      `  Envolvidos: ${a.indicadores.envolvidos}`,
      `  Tarefas: ${a.indicadores.tarefas}`,
      `  Prazos: ${a.indicadores.prazos}`,
      `  Riscos: ${a.indicadores.riscos}`,
      `  Conflitos: ${a.indicadores.conflitos}`,
      '',
      'Participantes: ' + a.participantes.join(', '),
      '',
      '--- Tarefas ---',
      ...a.tarefas.map((t) => `- ${t.descricao} (${t.envolvido}, ${t.prioridade})`),
      '',
      '--- Prazos ---',
      ...a.prazos.map((p) => `- ${p.descricao} | ${p.data} (${p.envolvido})`),
      '',
      '--- Riscos ---',
      ...a.riscos.map((r) => `- ${r.descricao} (${r.envolvido})`),
      '',
      '--- Conflitos ---',
      ...a.conflitos.map((c) => `- ${c.descricao} (${c.envolvido})`),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `whatsanalizer-resumo-${new Date().toISOString().slice(0, 10)}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
