# DOCUMENTO_ENTREGA - Teste 2

## Orientacao geral

Responder de forma objetiva (sugestao: 1 a 3 paginas), deixando claro o raciocinio e as decisoes tomadas no desenvolvimento.

## 1) Como voce desenvolveu

- Ordem das implementacoes: por onde comecou (rota, layout, calibracao, API, dashboard etc.) e por que.
- Decisoes de arquitetura: manter tudo em um componente foi intencional? Houve consideracao de extrair componentes/servicos?
- Estado e reatividade: como organizou os Signals (dados x UI)? Como utilizou `computed` para listas filtradas e opcoes do filtro por participante?
- Integracao com Z.AI: como montou requisicao (headers, body, `response_format`)? Como tratou parsing de JSON e respostas invalidas/parciais?

## 2) Maiores desafios

Descrever ate 3 dificuldades (tecnicas, de requisito ou de tempo).  
Para cada uma:

- o que era dificil;
- como tentou resolver;
- qual foi o resultado (resolveu totalmente, contornou ou deixou pendente e por que).

Se algum ponto do enunciado foi ambiguo, explicar interpretacao adotada e justificativa.

## 3) Tratamento de erros e edge cases

- Quais cenarios de erro foram considerados (timeout, rate limit, JSON invalido, arquivo vazio, token ausente etc.)?
- Como o usuario e informado em cada caso (mensagens, estado do botao, loading)?
- A requisicao para Z.AI interfere no loading global da aplicacao? Como o comportamento desejado foi garantido?

## 4) Melhorias e trade-offs

- Se tivesse mais tempo, o que faria primeiro (testes, acessibilidade, refatoracao, UX, performance)?
- Houve trade-off consciente? Descrever brevemente.

## 5) O que voce faria diferente

- O que mudaria em uma segunda versao (estrutura, nomes, padroes, bibliotecas)?
- Algum requisito seria interpretado de forma diferente hoje? Qual e como?
