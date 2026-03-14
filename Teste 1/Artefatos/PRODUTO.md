# PRODUTO

## Diagnostico de produto

## Contexto

A Calculadora do Cidadao atende uma dor real de correcao de valores monetarios historicos. O foco da analise foi clareza de uso, resiliencia de validacao e qualidade da jornada — complementado por achados reais da automacao E2E executada em 14/03/2026.

---

## Melhorias UI/UX priorizadas (recomendacoes para o produto)

As sugestões abaixo foram priorizadas com base nos achados da automação e na experiência do usuário. Ordem por impacto esperado:

| Prioridade | Melhoria | Benefício |
|------------|----------|-----------|
| **Alta** | **Mensagens de erro claras** | O sistema já exibe "Data inicial invalida" para intervalo incorreto — padronizar esse nível de clareza para todos os erros (índice não selecionado, valor inválido etc.). |
| **Alta** | **Validação inline** | Validar cada campo ao sair (blur) ou em tempo real, em vez de só no submit. Reduz ida e volta desnecessária e frustração. |
| **Alta** | **Feedback de carregamento** | Incluir spinner ou estado "Processando..." no botão "Corrigir valor" durante os ~2–3s de resposta. Evita cliques repetidos por impaciência. |
| **Média** | **Acessibilidade básica** | Revisar labels associados aos campos, ordem de foco por teclado e contraste. O layout em tabelas prejudica leitores de tela. |
| **Média** | **Ajuda contextual** | Tooltip curto explicando cada índice (IPCA, IGP-M, INPC) e período disponível. Reduz dúvida e abandono. |

Detalhes adicionais sobre cada item estão nas seções "Oportunidades de melhoria" e "Correção sugerida" abaixo.

---

## Pontos positivos

- Produto util para casos reais (correcao de valores pelo IPCA, IGP-M, INPC etc).
- Objetivo da tela e claro e o fluxo principal e direto.
- Disponibilidade publica sem necessidade de autenticacao.
- Resposta de erro para intervalo de data invalido e clara ("Data inicial invalida").

## Oportunidades de melhoria

1. **Validacao de campo valor (achado da automacao)**
   - O campo "valor a ser corrigido" NAO valida obrigatoriedade no servidor.
   - O formulario aceita envio sem valor e processa sem erro.
   - Recomendacao: tornar o campo obrigatorio com mensagem clara, ou indicar explicitamente que o campo e opcional (com valor default de 0).

2. **UX de validacao**
   - Mostrar validacao inline por campo antes do submit.
   - Exibir mensagens mais especificas por regra (data, indice, valor).

3. **Feedback de processamento**
   - Incluir estado de loading no botao de envio para reduzir cliques repetidos durante o tempo de resposta (~2-3s).

4. **Acessibilidade**
   - Revisar labels, foco de teclado e contraste visual.
   - Formulario usa tabelas para layout, o que compromete leitores de tela.

5. **Ajuda contextual**
   - Tooltip curto explicando cada indice (IPCA, IGP-M, INPC...).
   - Indicar periodo disponivel de cada indice diretamente no campo de data.

6. **Observabilidade funcional**
   - Mensagens de erro mais padronizadas para facilitar analise de incidentes.

## Correcao sugerida (prioridade alta)

- **Validar campo valor como obrigatorio**: o sistema atual permite calculo sem valor, o que pode gerar confusao para o usuario (resultado sem contexto monetario real).
- Reforcar validacao de intervalo de datas e mensagens orientativas.

## Novas funcionalidades sugeridas

- Historico local das ultimas simulacoes (session storage).
- Exportacao simples do resultado (PDF/CSV).
- Comparacao entre dois indices no mesmo periodo.
- Campo de data com seletor visual (datepicker MM/YYYY) para reduzir erro de formato.

## Como IA pode agregar valor

1. **Assistente de preenchimento**
   - IA sugere indice e periodo com base no contexto informado (ex: "contrato firmado em 2019").
2. **Explicacao do resultado**
   - IA gera resumo em linguagem simples do calculo (ex: "R$ 1.000 em jan/2020 equivale a R$ 1.355 em jan/2023, com inflacao acumulada de 35,5% pelo IPCA").
3. **Suporte a testes**
   - IA ajuda a gerar massa sintetica de casos positivos, negativos e borda.
4. **Monitoria de qualidade**
   - IA classifica erros de execucao por causa raiz e prioridade automaticamente.
5. **Deteccao de regressao**
   - IA analisa diferencas entre rodadas de teste e alerta sobre mudancas de comportamento.

## Impacto esperado das melhorias

- Menos erro de preenchimento com validacao inline.
- Menor abandono por duvida de uso com ajuda contextual.
- Mais confianca e velocidade no fluxo com feedback de loading.
- Resultados mais acionaveis com explicacao gerada por IA.
