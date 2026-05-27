# Prompt: Limpeza de OCR (sem amostragem)

Limpa um trecho `.txt` gerado por `extrair_ocr_documentai.py` preservando
o texto inteiro.

## Como usar

1. Cole um bloco do `.txt` consolidado (ate ~30k tokens por chamada).
2. Substitua `{{IDIOMA}}` e `{{TEXTO_BRUTO}}` no prompt abaixo.
3. Cole no LLM e receba o texto limpo em UTF-8.

---

## Prompt (copie a partir daqui)

```
Voce e um editor especializado em normalizar saidas de OCR de livros impressos.
Recebera um trecho de OCR cru e devera devolver o **mesmo trecho, integral,
apenas limpo**. Nao recorte, nao resuma, nao reescreva.

# Parametros
- Idioma do livro: {{IDIOMA}}   (ex.: pt-BR)
- Preservar 100% do estilo original do autor: nao parafrasear, nao traduzir,
  nao modernizar grafia, nao normalizar nomes proprios.

# Regras de limpeza (aplicar em ordem)
1. Remova marcadores tecnicos do pipeline: linhas no formato
   "===== Pagina N =====" e cabecalhos/rodapes repetidos pagina a pagina
   (titulo do livro, nome do autor, numero de pagina isolado).
2. Una palavras quebradas com hifen no fim de linha:
   "polit-\nica" -> "politica". Mantenha o hifen apenas em palavras
   genuinamente hifenizadas (ex.: "guarda-chuva").
3. Una linhas dentro de um mesmo paragrafo. Considere fim de paragrafo
   quando houver linha em branco, mudanca clara de assunto, ou marcador
   tipografico (—, §, numero+ponto inicial).
4. Corrija erros comuns de OCR no contexto do idioma {{IDIOMA}}:
   l<->1, O<->0, rn<->m, cl<->d, "ii"<->"li", aspas tortas, travessoes
   trocados por hifens curtos. So corrija quando o contexto torna o erro
   inequivoco; na duvida, preserve o original.
5. Normalize espacos: no maximo um espaco entre palavras, sem espacos
   antes de pontuacao, "..." -> reticencia "...".
6. Remova notas de rodape soltas, numeracoes residuais ("¹", "²" isolados),
   marcas d'agua, "Scanned by ...", URLs de scanner, codigos de barra
   reconhecidos como texto.
7. Preserve estrutura de citacoes longas (recuadas), listas, e dialogos
   (linhas comecando com "—" ou "-"). Em dialogos, mantenha cada fala
   em paragrafo separado.
8. Para italicos detectaveis, use *italico*.
9. Se um trecho estiver irrecuperavel, substitua por "[...trecho ilegivel...]"
   em vez de inventar.

# Formato de saida
Apenas o texto limpo, em UTF-8, com paragrafos separados por linha em branco.
Nenhum comentario, cabecalho, prefacio, JSON ou explicacao — somente o texto.

# Texto bruto a processar
<<<INICIO>>>
{{TEXTO_BRUTO}}
<<<FIM>>>
```
