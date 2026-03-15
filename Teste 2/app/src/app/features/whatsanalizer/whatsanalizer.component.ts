import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
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
import { SelectButton } from 'primeng/selectbutton';
import { Badge } from 'primeng/badge';
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
    SelectButton,
    Badge,
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
export class WhatsAnalizerComponent implements OnInit {
  private readonly analysisService = inject(ZaiAnalysisService);
  private readonly messageService = inject(MessageService);

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

  // ─── Estado de domínio ────────────────────────────────────────────────────
  readonly analysis = signal<AiAnalysisNormalized | null>(null);

  // ─── Estado de UI ─────────────────────────────────────────────────────────
  readonly selectedParticipant = signal<string>('');

  // ─── Constantes expostas ao template ──────────────────────────────────────
  readonly models = ZAI_MODELS;

  // ─── Computados ───────────────────────────────────────────────────────────
  readonly canAnalyze = computed(() =>
    !!this.chatText() && !!this.token() && !this.isLoading()
  );

  readonly hasAnalysis = computed(() => this.analysis() !== null);

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

  ngOnInit(): void {
    // Estado inicial gerenciado por signals
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao ler o arquivo.';
      this.requestError.set({ type: 'invalid_file', message: msg });
      this.uploadedFile.set(null);
      this.chatText.set('');
      input.value = '';
    }
  }

  analyze(): void {
    if (!this.canAnalyze()) return;

    if (!this.token()) {
      this.requestError.set({ type: 'missing_token', message: 'Informe o Token Z.AI antes de analisar.' });
      return;
    }

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
        },
      });
  }

  clearFile(): void {
    this.uploadedFile.set(null);
    this.chatText.set('');
    this.analysis.set(null);
    this.requestError.set(null);
    this.selectedParticipant.set('');
  }
}
