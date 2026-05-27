# Prompt: Limpeza de OCR e extracao de amostra

Use este prompt em qualquer LLM (Claude, GPT, Gemini) para limpar o `.txt` gerado
por `extrair_ocr_documentai.py` e devolver uma amostra representativa.

---

## Como usar

1. Abra o `.txt` consolidado da obra (ex.: `ocr_hall/hall.txt`).
2. Copie um trecho contiguo (5-30 paginas, ~10-40 mil caracteres). Modelos tem
   limite de contexto — para o livro inteiro, processe em blocos.
3. Cole o trecho no lugar de `{{TEXTO_BRUTO}}` no prompt abaixo.
4. Ajuste os parametros entre `{{...}}` (idioma, tamanho da amostra, etc.).

---

## Prompt (copie a partir daqui)

```
Voce e um editor de texto especializado em normalizar saidas de OCR de livros
impressos. Recebera um trecho de OCR cru, com artefatos tipicos de digitalizacao,
e devera (1) limpa-lo e (2) extrair uma amostra continua de leitura.

# Parametros
- Idioma do livro: {{IDIOMA}}                (ex.: pt-BR)
- Tamanho da amostra: {{TAMANHO_AMOSTRA}}    (ex.: ~3000 palavras, ou "3 capitulos")
- Tom desejado: preservar 100% do estilo original do autor; nao reescrever,
  nao parafrasear, nao traduzir, nao resumir.
- Preservar nomes proprios, citacoes, numeros, italicos (use *italico*) e
  marcas de enfase do original.

# Regras de limpeza (aplicar em ordem)
1. Remova marcadores tecnicos do pipeline: linhas no formato
   "===== Pagina N =====" e quaisquer cabecalhos repetidos pagina a pagina
   (titulo do livro, nome do autor, numero de pagina isolado em uma linha).
2. Una palavras quebradas com hifen no fim de linha:
   "polit-\nica" -> "politica". Mantenha o hifen apenas em palavras
   genuinamente hifenizadas (ex.: "guarda-chuva").
3. Una linhas dentro de um mesmo paragrafo. Considere fim de paragrafo
   quando houver linha em branco, mudanca clara de assunto ou marcador
   tipografico (—, §, numero+ponto inicial).
4. Corrija erros comuns de OCR no contexto do idioma {{IDIOMA}}:
   l<->1, O<->0, rn<->m, cl<->d, "ii"<->"li", aspas tortas, travessoes
   trocados por hifens curtos. So corrija quando o contexto torna o erro
   inequivoco; na duvida, preserve o original.
5. Normalize espacos: no maximo um espaco entre palavras, sem espacos
   antes de pontuacao, "..." -> reticencia "...".
6. Remova notas de rodape soltas, numeracoes de nota residuais ("¹", "²"
   isolados), marcas d'agua, "Scanned by ...", URLs de scanner, codigos
   de barra reconhecidos como texto.
7. Preserve estrutura de citacoes longas (recuadas), listas e dialogos
   (linhas comecando com "—" ou "-"). Em dialogos, mantenha cada fala
   em paragrafo separado.
8. Se um trecho estiver irrecuperavel (linhas embaralhadas, simbolos sem
   sentido), substitua por "[...trecho ilegivel...]" em vez de inventar.

# Criterio de amostra
Extraia uma amostra **continua** (nao colagem de trechos) de
{{TAMANHO_AMOSTRA}} que:
- Comece no inicio de um paragrafo (preferencialmente inicio de secao
  ou capitulo).
- Termine no fim de um paragrafo.
- Seja representativa do estilo geral (prosa corrida, nao indice nem
  bibliografia, nem pagina inicial com creditos).
- Se o trecho enviado nao contiver material narrativo continuo
  suficiente, retorne o maior bloco utilizavel e sinalize em "notas".

# Formato de saida (JSON estrito, sem texto fora do JSON)
{
  "idioma_detectado": "<ex: pt-BR>",
  "paginas_estimadas": "<intervalo inferido pelos marcadores, ex: '12-19'>",
  "amostra_limpa": "<texto continuo, ja normalizado>",
  "palavras": <inteiro>,
  "alteracoes_aplicadas": [
    "<lista curta dos tipos de correcao aplicados>"
  ],
  "trechos_ilegiveis": <inteiro>,
  "notas": "<observacoes relevantes, ou string vazia>"
}

# Texto bruto a processar
<<<INICIO>>>
{{TEXTO_BRUTO}}
<<<FIM>>>
```

---

## Variacoes uteis

### A. Apenas limpar (sem amostragem)
Troque a secao "Criterio de amostra" por:

```
# Criterio
Limpe o trecho **inteiro**. Nao recorte.
```

E no JSON, renomeie `amostra_limpa` para `texto_limpo` e remova
`paginas_estimadas`.

### B. Devolver texto puro (sem JSON)
Substitua a secao "Formato de saida" por:

```
# Formato de saida
Apenas o texto limpo, em UTF-8, com paragrafos separados por linha em branco.
Nenhum comentario, nenhum cabecalho, nenhuma marcacao alem do necessario
para italicos (*assim*).
```

### C. Multiplas amostras (para anotacao / fine-tuning)
Em "Criterio de amostra":

```
Extraia {{N}} amostras independentes de ~{{TAMANHO_CADA}} palavras cada,
de partes distintas do trecho enviado, evitando sobreposicao.
```

E ajuste o JSON para `"amostras": [ { "amostra_limpa": ..., "palavras": ... }, ... ]`.

---

## Dicas operacionais

- **Trechos > 30k tokens**: divida o `.txt` antes. Sugestao:
  `split -l 2000 hall.txt parte_` (linhas) ou processe por intervalos
  de paginas usando os arquivos `pagina_NNNN.txt`.
- **Validar JSON**: passe a resposta por `jq .` para detectar JSON malformado.
- **Reaproveitar**: salve este prompt junto com a obra
  (`ocr_<obra>/prompt_limpeza.md`) para registrar exatamente como a
  amostra foi gerada.
