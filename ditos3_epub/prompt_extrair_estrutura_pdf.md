# Prompt — Extração de estrutura editorial do PDF para reprodução em EPUB

> **Como usar:** envie este prompt junto com o arquivo `Ditos3.pdf` para um modelo
> com capacidade de leitura de PDF (Claude com upload, GPT-4o, Gemini 1.5 Pro, etc.).
> O modelo vai devolver um CSV e anotações que você cola direto no pipeline Python.

---

## Prompt

Você é um editor técnico especializado em OCR e produção de EPUB. Vou te fornecer o PDF original do livro **Ditos e Escritos III — Michel Foucault** (Forense Universitária, 2.ª edição).

Preciso que você leia o PDF com atenção e me devolva as informações abaixo, que serão usadas para reproduzir fielmente a estrutura editorial no EPUB. **Não resuma, não traduza, não reescreva nada.** Apenas colete e organize as informações estruturais.

---

### Tarefa 1 — CSV de capítulos (já existe, confirme ou corrija)

Tenho este CSV de estrutura. Verifique se está correto comparando com o sumário e o corpo do PDF. Corrija páginas erradas, títulos com erros tipográficos e capítulos faltando ou a mais:

```
pagina_inicio,titulo,nivel
7,Apresentação,1
53,Dizer e Ver em Raymond Roussel,1
65,Um Saber Tão Cruel,1
80,Prefácio à Transgressão,1
99,A Linguagem ao Infinito,1
"112","Distância, Aspecto, Origem",1
127,Posfácio a Flaubert,1
162,A Prosa de Acteão,1
176,Debate sobre o Romance,1
231,Por que se Reedita a Obra de Raymond Roussel?,1
"235","O Mallarmé de J.-P. Richard",1
246,As Damas de Companhia,1
264,Por Trás da Fábula,1
273,O Pensamento do Exterior,1
297,Um Nadador entre Duas Palavras,1
301,Isto Não É um Cachimbo,1
318,O que É um Autor?,1
353,Sete Proposições sobre o Sétimo Anjo,1
"367","Haverá Escândalo, Mas...",1
370,As Monstruosidades da Crítica,1
384,Anti-retro,1
400,A Pintura Fotogênica,1
410,Sobre Marguerite Duras,1
"420","Sade, Sargento do Sexo",1
425,As Manhãs Cinzentas da Tolerância,1
428,Eugène Sue que Eu Amo,1
432,Os Quatro Cavaleiros do Apocalipse e os Vermes Cotidianos,1
435,A Imaginação do Século XIX,1
"441","Pierre Boulez, a Tela Atravessada",1
445,A Música Contemporânea e o Público,1
454,Arqueologia de uma Paixão,1
465,Outros Espaços,1
477,Índice de Obras,1
481,Índice Onomástico,1
485,Organização da Obra Ditos e Escritos,1
```

Devolva o CSV corrigido no mesmo formato, com aspas nos títulos que contêm vírgula.

---

### Tarefa 2 — Subtítulos internos de cada capítulo

Para cada capítulo, liste os subtítulos internos (seções, subseções) **exatamente como aparecem no PDF**, com a página em que cada um começa. Use este formato:

```
CAPÍTULO: Apresentação
  p.10  Nascimento da literatura
  p.21  A função autor e os fundadores de discursividade
  p.XX  [próximo subtítulo]
  ...

CAPÍTULO: Dizer e Ver em Raymond Roussel
  [sem subtítulos internos / ou liste-os]
  ...
```

Se um capítulo não tiver subtítulos internos, escreva `[sem subtítulos]`.

---

### Tarefa 3 — Padrões de cabeçalho e rodapé

Olhe as primeiras 30 páginas do PDF e me diga:

1. Qual é o texto exato do **cabeçalho da página esquerda** (par)? Ex.: `Michel Foucault — Ditos e Escritos`
2. Qual é o texto exato do **cabeçalho da página direita** (ímpar)? Ex.: `Apresentação`
3. O cabeçalho muda de capítulo para capítulo? (sim/não)
4. As páginas da **Apresentação** usam numeração romana? (sim/não) Se sim, de qual página a qual página (ex.: VI a XXVI)?
5. A partir de qual página começa a numeração arábica?

---

### Tarefa 4 — Notas de rodapé

Verifique as notas de rodapé nas páginas 7 a 52 (Apresentação) e me diga:

1. Qual é o marcador usado: asterisco (`*`), número (`1`, `2`) ou ambos?
2. As notas aparecem no rodapé da mesma página ou agrupadas ao fim do capítulo?
3. Liste as **3 primeiras notas** exatamente como aparecem no PDF (texto completo), para eu calibrar o detector automático.

---

### Tarefa 5 — Primeiros e últimos parágrafos de cada capítulo

Para os capítulos abaixo, copie **exatamente** o primeiro parágrafo completo e o último parágrafo completo, respeitando a pontuação e acentuação do original. Isso vai me permitir verificar se o EPUB está reproduzindo o conteúdo corretamente.

Capítulos a verificar:
- Apresentação (p. 7)
- Prefácio à Transgressão (p. 80)
- O que É um Autor? (p. 318)
- Outros Espaços (p. 465)

Formato:

```
CAPÍTULO: Apresentação
PRIMEIRO PARÁGRAFO:
[texto exato]

ÚLTIMO PARÁGRAFO:
[texto exato]
```

---

### Tarefa 6 — Imagens e ilustrações

Liste todas as páginas do PDF que contêm imagens, ilustrações, reproduções de quadros ou fotografias. Para cada uma:

```
p.XX — [descrição breve do que é a imagem, ex.: "reprodução do quadro As Meninas de Velázquez"]
```

---

### O que fazer com as respostas

Com as respostas das 6 tarefas, o pipeline Python (`montar_ditos3_epub_final.py`) será ajustado:

- **Tarefa 1** → substitui diretamente o arquivo `estrutura_ditos3.csv`
- **Tarefa 2** → os subtítulos serão inseridos como `##` dentro de cada capítulo
- **Tarefa 3** → os padrões de cabeçalho serão adicionados à lista `CABECALHOS` no script
- **Tarefa 4** → o detector de notas (`NOTA_INICIO`, `NOTA_INLINE`) será calibrado
- **Tarefa 5** → será usado como teste de regressão (comparar início/fim de cada capítulo no EPUB com o original)
- **Tarefa 6** → as páginas com imagens receberão marcação `[imagem omitida]` ou descrição

---

**Importante:** responda as 6 tarefas em ordem, usando os formatos especificados. Não adicione comentários extras entre os blocos de dados — apenas os dados pedidos, para eu poder copiar e colar diretamente no pipeline.
