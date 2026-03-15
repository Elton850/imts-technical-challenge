export interface PreparedChatPayload {
  content: string;
  originalCharCount: number;
  finalCharCount: number;
  originalLineCount: number;
  finalLineCount: number;
  wasReduced: boolean;
}

export const MAX_ANALYSIS_INPUT_CHARS = 18_000;

const INITIAL_CONTEXT_LINE_COUNT = 12;
const RECENT_CONTEXT_LINE_COUNT = 180;
const IMPORTANT_CONTEXT_LINE_COUNT = 60;
const GAP_MARKER = '[Trechos intermediarios omitidos para reduzir latencia]';

const IMPORTANT_LINE_PATTERN =
  /\b(prazo|deadline|entrega|entregar|amanh|hoje|sexta|segunda|terc|quarta|quinta|sabado|domingo|risco|bloque|urgente|prioridade|conflito|pendenc|pendente|respons|tarefa|preciso|precisamos|corrigir|ajustar|revisar|aprovar|validar|cliente|qa|teste|erro|falha|bug|escopo|reuni)\b/i;
const DATE_OR_TIME_PATTERN =
  /\b\d{1,2}[\/-]\d{1,2}(?:[\/-]\d{2,4})?\b|\b\d{1,2}:\d{2}\b|\b\d{1,2}h\b/i;
const NOISE_PATTERNS = [
  /arquivo de m.dia omitido/i,
  /m.dia oculta/i,
  /image omitted/i,
  /video omitted/i,
  /audio omitted/i,
  /document omitted/i,
  /sticker omitted/i,
  /gif omitted/i,
  /mensagens e chamadas s.o protegidas/i,
];

export function prepareChatForAnalysis(chatText: string): PreparedChatPayload {
  const normalizedText = chatText.replace(/\r\n/g, '\n').trim();
  const cleanedLines = normalizedText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !isNoiseLine(line));

  if (!cleanedLines.length) {
    return {
      content: normalizedText,
      originalCharCount: normalizedText.length,
      finalCharCount: normalizedText.length,
      originalLineCount: normalizedText ? normalizedText.split('\n').length : 0,
      finalLineCount: normalizedText ? normalizedText.split('\n').length : 0,
      wasReduced: false,
    };
  }

  const cleanedContent = cleanedLines.join('\n');
  const originalLineCount = normalizedText ? normalizedText.split('\n').length : 0;

  if (cleanedContent.length <= MAX_ANALYSIS_INPUT_CHARS) {
    return {
      content: cleanedContent,
      originalCharCount: normalizedText.length,
      finalCharCount: cleanedContent.length,
      originalLineCount,
      finalLineCount: cleanedLines.length,
      wasReduced: cleanedContent.length < normalizedText.length || cleanedLines.length < originalLineCount,
    };
  }

  const selectedLines = selectRelevantLines(cleanedLines);
  const content = renderSelectedLines(cleanedLines, selectedLines);

  return {
    content,
    originalCharCount: normalizedText.length,
    finalCharCount: content.length,
    originalLineCount,
    finalLineCount: selectedLines.length,
    wasReduced: true,
  };
}

function selectRelevantLines(lines: string[]): number[] {
  const priorities = new Map<number, number>();
  const mark = (index: number, priority: number) => {
    priorities.set(index, Math.max(priority, priorities.get(index) ?? 0));
  };

  const recentStart = Math.max(lines.length - RECENT_CONTEXT_LINE_COUNT, 0);

  for (let index = recentStart; index < lines.length; index += 1) {
    mark(index, 2);
  }

  let importantAdded = 0;
  for (let index = recentStart - 1; index >= 0 && importantAdded < IMPORTANT_CONTEXT_LINE_COUNT; index -= 1) {
    if (isImportantLine(lines[index])) {
      mark(index, 3);
      importantAdded += 1;
    }
  }

  for (let index = 0; index < Math.min(INITIAL_CONTEXT_LINE_COUNT, lines.length); index += 1) {
    mark(index, 1);
  }

  const selected = [...priorities.keys()].sort((left, right) => left - right);
  let rendered = renderSelectedLines(lines, selected);

  while (rendered.length > MAX_ANALYSIS_INPUT_CHARS && selected.length > 1) {
    const removablePosition = findRemovablePosition(selected, priorities);
    selected.splice(removablePosition, 1);
    rendered = renderSelectedLines(lines, selected);
  }

  return selected;
}

function findRemovablePosition(selected: number[], priorities: Map<number, number>): number {
  let candidatePosition = 0;
  let lowestPriority = Number.POSITIVE_INFINITY;

  for (let position = 0; position < selected.length; position += 1) {
    const priority = priorities.get(selected[position]) ?? 0;
    if (priority < lowestPriority) {
      lowestPriority = priority;
      candidatePosition = position;
    }
  }

  return candidatePosition;
}

function renderSelectedLines(lines: string[], selected: number[]): string {
  const chunks: string[] = [];
  let previousIndex = -1;

  for (const index of selected) {
    if (previousIndex !== -1 && index - previousIndex > 1) {
      chunks.push(GAP_MARKER);
    }

    chunks.push(lines[index]);
    previousIndex = index;
  }

  return chunks.join('\n');
}

function isImportantLine(line: string): boolean {
  const messageContent = extractMessageContent(line);
  return IMPORTANT_LINE_PATTERN.test(messageContent) || DATE_OR_TIME_PATTERN.test(messageContent);
}

function isNoiseLine(line: string): boolean {
  return NOISE_PATTERNS.some((pattern) => pattern.test(line));
}

function extractMessageContent(line: string): string {
  const contentStart = line.indexOf(': ');
  return contentStart >= 0 ? line.slice(contentStart + 2) : line;
}
