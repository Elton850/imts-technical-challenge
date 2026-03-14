# Especificacoes Tecnicas - Teste 2 (AI Chat Insights / WhatsAnalizer)

## 1) Objetivo e contexto

- Produto: aplicacao web que transforma historicos de conversa do WhatsApp (`.txt`) em dashboard de inteligencia.
- Stack esperada:
  - Angular (versao do projeto)
  - Estado com Signals
  - Integracao com API Z.AI (chat completions)
  - PrimeNG quando fizer sentido (ex.: Slider)
- Escopo: uma unica rota publica (ex.: `/whatsanalizer`) e um unico componente concentrando a funcionalidade.
- Seguranca: chave da API nao deve ser commitada; suportar variavel de ambiente e/ou campo na tela.

## 2) Arquitetura da tela

- Layout em 2 colunas:
  - Esquerda: calibracao da IA + upload + botao de analise (largura limitada, conteudo pode ser sticky).
  - Direita: dashboard (indicadores, resumo, envolvidos, filtro e listas), ocupando o restante.
- Responsividade:
  - Em telas menores (ex.: `< 900px`), empilhar em 1 coluna.
- Identidade visual inspirada no WhatsApp:
  - Cores base: `#25d366`, `#075e54`, `#e5ddd5`
  - Fonte no estilo Segoe UI / Helvetica
  - Header com logo (SVG do WhatsApp ou equivalente) e titulo `AI Chat Insights`.

## 3) Calibracao da IA (coluna esquerda)

Campos em coluna, com 100% da largura do container:

1. `System Prompt`: textarea editavel (valor inicial em PT-BR pedindo resposta em JSON no formato definido).
2. `Modelo`: select com opcoes Z.AI (ex.: GLM-5, GLM-4.7, GLM-4.5 Flash).
3. `Temperature`: controle de 0 a 1 usando Slider do PrimeNG (nao usar input numerico).
4. `Token Z.AI`: campo tipo password, sempre visivel, vindo de variavel de ambiente e/ou digitado na tela.

Botao `Enviar para Analise`:

- largura 100%;
- desabilitado sem texto de arquivo ou durante loading.

Loading:

- deve permanecer em estado local ate o fim da requisicao (sucesso, erro ou timeout);
- nao deve acionar loading global da aplicacao para chamadas Z.AI;
- usar `finalize()` (ou equivalente) para garantir desligamento em qualquer final de fluxo.

## 4) Upload e analise

- Aceitar apenas arquivo `.txt` (export do WhatsApp).
- Ler conteudo no cliente (ex.: `FileReader`) e enviar texto para API.

Requisicao Z.AI:

- Metodo: `POST`
- Endpoint exemplo: `https://api.z.ai/api/paas/v4/chat/completions`
- Header: `Authorization: Bearer <token>` (nao usar JWT da aplicacao)
- Body com:
  - `model`
  - `messages` (system + user com texto)
  - `temperature`
  - `stream: false`
  - `response_format: { type: "json_object" }`

Tratamento esperado:

- timeout adequado (ex.: 2,5 minutos) com mensagem clara em portugues;
- rate limit (ex.: codigo 1302 ou mensagem equivalente) com mensagem amigavel orientando tentar novamente;
- parsing de JSON obrigatorio; em retorno invalido ou ausente, exibir erro adequado.

## 5) Dashboard - estrutura e conteudo

- 5 KPIs em uma linha (grid 5 colunas em telas grandes):
  - Envolvidos
  - Tarefas
  - Prazos
  - Riscos
  - Conflitos
- Cada card com numero destacado e label.

Blocos principais:

- `Resumo executivo`: card em linha inteira com texto retornado em `resumo`.
- `Analise de sentimento`: card em linha inteira abaixo do resumo:
  - Titulo com emoji por faixa:
    - 0-2: 😢
    - 3-4: 😕
    - 5-6: 😐
    - 7-8: 🙂
    - 9-10: 😊
  - Formato do titulo: `Sentimento da conversa (X/10)`.
  - Corpo com `sentimentoDescricao`; se ausente, mostrar mensagem padrao.
- `Envolvidos`: lista em formato chips/pills, com quebra de linha.
- `Filtro por participante`: select com `Todos` + cada participante; bloco alinhado a direita.

Listas:

- 4 cards: `Tarefas`, `Prazos`, `Riscos`, `Conflitos`.
- Cada titulo deve ter badge de quantidade (itens exibidos apos filtro).

## 6) Contrato de dados da IA

O system prompt deve orientar retorno **apenas** em JSON (sem markdown), no formato:

```json
{
  "resumo": "string",
  "indicadores": {
    "envolvidos": 0,
    "tarefas": 0,
    "prazos": 0,
    "riscos": 0,
    "conflitos": 0,
    "sentimento": 0
  },
  "sentimentoDescricao": "string",
  "participantes": ["string"],
  "tarefas": [
    { "descricao": "string", "envolvido": "string", "prioridade": "string" }
  ],
  "prazos": [
    { "descricao": "string", "data": "string", "envolvido": "string" }
  ],
  "riscos": [{ "descricao": "string", "envolvido": "string" }],
  "conflitos": [{ "descricao": "string", "envolvido": "string" }]
}
```

Notas:

- `sentimento` deve variar de 0 (negativo) a 10 (positivo).
- Campos opcionais podem ser omitidos pela IA.

## 7) Regras de filtro e listas

- O filtro `Filtrar por participante` deve afetar conjuntamente as 4 listas (`tarefas`, `prazos`, `riscos`, `conflitos`) pelo campo `envolvido`.
- Regra de match: substring, case-insensitive (ou criterio equivalente definido).
- Badges das listas devem refletir contagem apos filtro.
- Sem resultado de analise, o dashboard deve orientar usuario a carregar `.txt` e clicar em `Enviar para Analise`.

## 8) Requisitos nao funcionais (resumo)

- Uso de Signals para estado reativo (calibracao, arquivo, loading, resultado, filtro).
- Interceptors:
  - nao enviar JWT para API Z.AI;
  - nao exibir loading global para chamadas Z.AI.
- Responsividade:
  - 2 colunas -> 1 coluna;
  - KPIs: 5 -> 3 -> 2 colunas;
  - listas: 2 -> 1 coluna.
- Acessibilidade:
  - labels associados;
  - titulos de secao;
  - `aria-label` quando fizer sentido.

## 9) Criterios de avaliacao sugeridos

- Atendimento aos requisitos funcionais (calibracao, upload, analise, dashboard, filtro, layout).
- Uso correto de Signals e `computed` para listas filtradas e opcoes do select.
- Integracao correta com API Z.AI (URL, headers, body, tratamento de erro, timeout, rate limit).
- Funcionalidade concentrada em unico componente (sem subcomponentes adicionais).
- Layout conforme especificado (2 colunas, KPIs em linha, sentimento dedicado, envolvidos em chips, filtro a direita, botao 100%, badges nas listas).
- Identidade visual proxima ao WhatsApp.
- Codigo legivel, tipagem adequada e boas praticas Angular.
