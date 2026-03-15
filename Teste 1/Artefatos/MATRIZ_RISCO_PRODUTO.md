# MATRIZ_RISCO_PRODUTO

## Objetivo

Conectar a automacao E2E com risco de negocio, para que a execucao nao mostre apenas "testes passando", mas tambem o que esta sendo protegido para o usuario e para o produto.

## Como ler

- **Severidade**: impacto caso o problema chegue ao usuario.
- **Probabilidade**: chance de o risco aparecer na jornada real.
- **Cobertura automatizada**: cenario e script que detectam ou monitoram o risco.
- **Status**: se o risco esta prevenido, detectado ou exposto como achado real.

## Matriz executiva

| Risco | Tipo | Severidade | Probabilidade | Impacto no usuario / negocio | Cobertura automatizada | Script | Status | Recomendacao |
|---|---|---|---|---|---|---|---|---|
| RSK-01 | Fluxo principal indisponivel | Alta | Media | Usuario nao consegue concluir a correcao com dados validos | CT-01 | `tests/calculadora-fluxo-feliz.spec.ts` | Prevenido | Manter como teste de entrada para smoke e CI |
| RSK-02 | Data invalida aceita pelo sistema | Alta | Media | Calculo pode ser executado com periodo inconsistente ou gerar resultado enganoso | CT-03 e CT-04 | `tests/calculadora-regra-data.spec.ts` | Prevenido | Preservar validacao e mensagens claras por regra |
| RSK-03 | Sistema nao se recupera apos erro de data | Alta | Baixa | Usuario fica preso em estado inconsistente depois de uma tentativa invalida | CT-04 (regressao) | `tests/calculadora-regra-data.spec.ts` | Prevenido | Manter regressao no smoke para proteger continuidade do fluxo |
| RSK-04 | Indice nao selecionado | Alta | Baixa | Calculo sem parametro economico compromete o resultado apresentado | CT-08 | `tests/calculadora-validacao-indice.spec.ts` | Prevenido | Garantir obrigatoriedade e mensagem de erro consistente |
| RSK-05 | Campo valor vazio processado sem clareza | Alta | Media | Usuario pode receber resultado sem contexto monetario e tomar decisao errada | CT-02 / ACH-01 | `tests/calculadora-validacao-valor.spec.ts` | Exposto como achado real | Tornar o campo obrigatorio ou explicitar que vazio equivale a 0 |

## Prioridade de leitura para avaliacao

1. `RSK-05` mostra o principal diferencial desta entrega: a automacao nao apenas valida o fluxo, mas revela um comportamento de negocio relevante.
2. `RSK-01`, `RSK-02` e `RSK-04` explicam por que o smoke executivo protege as regras mais sensiveis da jornada.
3. `RSK-03` mostra cuidado com regressao e recuperacao do fluxo apos erro.

## Referencias cruzadas

- `CENARIOS.md` - lista de cenarios e rastreabilidade com scripts
- `PRODUTO.md` - analise do impacto e recomendacoes de melhoria
- `EXECUCAO.md` - comandos e fluxo recomendado para rodar a entrega
