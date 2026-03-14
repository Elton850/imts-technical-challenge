# Teste 1 - Automacao em Sistema Externo

## Objetivo

Realizar o diagnostico de qualidade, a automacao e a analise estrategica do sistema **Calculadora do Cidadao (Correcao de Valores)** do Banco Central do Brasil.

## Escopo do Teste

- **Alvo do teste:** formulario da Calculadora do Cidadao ([acessar formulario](https://www3.bcb.gov.br/CALCIDADAO/publico/corrigirPorIndice.do?method=corrigirPorIndice)).
- **Tecnologia obrigatoria:** Playwright (TypeScript ou JavaScript).
- **Formato de entrega:** repositorio publico no GitHub com documentacao em Markdown (`.md`).

## Documentos de apoio para avaliacao

- Orientacao para empresa: [`ORIENTACOES_EMPRESA.md`](./ORIENTACOES_EMPRESA.md)
- Execucao rapida: [`README_EXECUCAO_RAPIDA.md`](./README_EXECUCAO_RAPIDA.md)

## Itens obrigatorios no repositorio

1. **Mapeamento de cenarios (`Artefatos/CENARIOS.md`)**
   - Documentar cenarios de teste positivos, negativos e de borda para validar a aplicacao.
2. **Scripts de automacao (Playwright)**
   - Implementar no minimo 5 scripts de testes funcionais.
   - Pelo menos 1 script deve consumir dados de uma massa externa (`.csv`).
3. **Teste de performance (`Artefatos/PERFORMANCE.md`)**
   - Apresentar um relatorio simples com os resultados da analise de performance.
   - Pode usar a ferramenta de sua preferencia (ex.: Lighthouse, k6 ou JMeter).
4. **Diagnostico de produto (`Artefatos/PRODUTO.md`)**
   - Sugerir melhorias, correcoes e novas funcionalidades.
   - Explicar como Inteligencia Artificial poderia agregar valor ao servico.
5. **Relatorio de execucao (`Artefatos/EXECUCAO.md`)**
   - Descrever passo a passo para configurar o ambiente, instalar dependencias e rodar os testes.
6. **Relatorio de retrospectiva (`Artefatos/RETROSPECTIVA.md`)**
   - Registrar maiores desafios tecnicos.
   - Explicar como a IA foi utilizada para apoiar o processo.
   - Justificar a escolha de bibliotecas/ferramentas adicionais.
   - Indicar o que seria melhorado com mais tempo.

## O que e valorizado

Nao esperamos perfeicao, esperamos evolucao.

Se algum requisito tecnico nao for concluido, descreva de forma transparente:

- qual foi a dificuldade encontrada;
- o que foi tentado para resolver;
- quais aprendizados ficaram do processo.

## Referencia original

- Arquivo base: `README.md` (este arquivo).

## Estrutura esperada

- `README.md` (este arquivo)
- `Artefatos/CENARIOS.md`
- `Artefatos/PERFORMANCE.md`
- `Artefatos/PRODUTO.md`
- `Artefatos/EXECUCAO.md`
- `Artefatos/RETROSPECTIVA.md`
