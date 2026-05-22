# Diagnóstico e Checklist — Ditos e Escritos III EPUB

## 1. Diagnóstico técnico

### 1.1 O que foi analisado

- `transcricao_ditos3_completo.txt` — saída bruta do OCR, formatada em blocos de página  
  separados por linhas `---` e marcadores `Página N`.
- `estrutura_ditos3.csv` — sumário manual com página de início e título de cada texto.
- `ditos3_sem_paginas_sumario.epub` — EPUB gerado na etapa anterior, com os problemas listados abaixo.

---

### 1.2 Problemas confirmados na transcrição

#### Problema 1 — Quebra de parágrafos ruim

O OCR preservou o layout de colunas do PDF impresso: cada linha tipográfica virou uma linha
de texto no TXT. O script anterior tentou juntar heuristicamente, mas:

- parágrafos longos da Apresentação ficaram partido no meio da frase;
- subtítulos internos como "Nascimento da literatura" (p. 10) foram tratados como corpo;
- sem regra de "fim de sentença + próxima começa com maiúscula → novo parágrafo".

**Evidência direta no TXT (p. 7–20):** cada linha tem ~60–65 caracteres — largura de coluna
do livro impresso, não parágrafos editoriais.

#### Problema 2 — Hifenização de fim de linha

Confirmados padrões como:
```
contem-            →  contemporânea
pora-
nea
```
e também compostos legítimos como `pós-estruturalismo`, `J.-P.` que NÃO devem ser desfeitos.

A regra implementada: hífen + quebra de linha + **minúscula** → une sem hífen.
Hífen + quebra + **maiúscula** → une COM hífen (pode ser composto).

#### Problema 3 — Paginação romana da Apresentação

Confirmado no TXT. Exemplos encontrados:
```
Página 8: "VI Michel Foucault - Ditos e Escritos"
Página 9: "Apresentação VII"
Página 11: "Apresentação IX"
Página 12: "X Michel Foucault - Ditos e Escritos"
Página 13: "Apresentação XI"
Página 15: "Apresentação XIII"
Página 17: "Apresentação XV"
Página 19: "Apresentação XVII"
Página 20: "XVIII Michel Foucault Ditos e Escritos"
```
São cabeçalhos de página do livro impresso, completamente fora de lugar no EPUB.

#### Problema 4 — Cabeçalhos correntes no corpo

As linhas do tipo `Michel Foucault - Ditos e Escritos` e `Apresentação VII` ocorrem
a cada duas páginas (frente e verso) no original impresso. No OCR, aparecem no meio do texto.

#### Problema 5 — Notas de rodapé misturadas ao corpo

Confirmadas notas no meio dos parágrafos da Apresentação, incluindo:
```
* Le bain de Diane, Paris, Ed. Gallimard, p. 9.
** Le bain de Diane, p. 9.
*Bataille. Oeuvres complètes 1 - Premiers écrits 1922-1940. Paris, Ed. Gallimard, 1970, p. 14.
```
Essas referências interrompem o fluxo do texto principal.

#### Problema 6 — Hierarquia editorial

Subtítulos internos da Apresentação como:
- "Nascimento da literatura" (p. 10)
- "A função autor e os fundadores de discursividade" (p. 21)

estavam sendo promovidos a capítulos no sumário, poluindo a navegação do EPUB.

#### Problema 7 — Marcadores de página

O TXT usa `Página N` e `---` como separadores. Sem remoção, entram no EPUB como texto.

#### Problema 8 — Placeholders de imagem

Não foram encontrados `image[[...]]` na Apresentação, mas o padrão está implementado
preventivamente para os capítulos com ilustrações (As Damas de Companhia, etc.).

---

## 2. Estratégia de correção

```
transcricao_ditos3_completo.txt
         │
         ▼
┌─────────────────────────────────────────────┐
│  parsear_paginas()                          │
│  • separa texto por número de página        │
│  • descarta marcadores "Página N" e "---"   │
└─────────────────────────────────────────────┘
         │  {pagina: [linhas brutas]}
         ▼
┌─────────────────────────────────────────────┐
│  filtrar_linhas_pagina()  [por página]      │
│  • remove cabeçalhos correntes              │
│  • remove paginação romana                  │
│  • extrai notas de rodapé do corpo          │
└─────────────────────────────────────────────┘
         │  (corpo, notas)
         ▼
┌─────────────────────────────────────────────┐
│  resolver_hifenizacao()                     │
│  • hífen + quebra + minúscula → une         │
│  • hífen + quebra + maiúscula → une c/ hífen│
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│  reconstruir_paragrafos()                   │
│  • linha vazia → quebra garantida           │
│  • fim de sentença + maiúscula → quebra     │
│  • linha curta/sem pontuação → subtítulo ## │
│  • caso contrário → continuação             │
└─────────────────────────────────────────────┘
         │  [parágrafos e subtítulos]
         ▼
┌─────────────────────────────────────────────┐
│  formatar_capitulo_md()                     │
│  • # Título (do CSV)                        │
│  • parágrafos                               │
│  • ## subtítulos internos                   │
│  • bloco "Notas" ao fim                     │
└─────────────────────────────────────────────┘
         │
         ▼
    ditos3_final.md   →  Pandoc  →  ditos3_final.epub
```

### Decisão sobre notas de rodapé

A conversão para notas EPUB (`<aside epub:type="footnote">`) exige processar o HTML
do EPUB diretamente, o que aumentaria muito a complexidade. A solução adotada — bloco
"Notas" ao fim de cada capítulo — é a mais robusta para um uso de estudo pessoal:
as notas ficam acessíveis, separadas do corpo, e o sumário não é afetado.

Se quiser notas inline EPUB no futuro, use a opção `--citeproc` do Pandoc com formato
Footnote Markdown: `texto[^1]` + `[^1]: nota`. O script pode ser extendido para gerar
esse formato na etapa `formatar_capitulo_md()`.

---

## 3. Como usar o script

### Dependências

```bash
pip install --upgrade pip   # nenhuma dependência Python externa
```

O script usa apenas biblioteca padrão. Pandoc deve estar instalado:

```bash
# Ubuntu / Debian
sudo apt install pandoc

# macOS
brew install pandoc

# Windows
winget install JohnMacFarlane.Pandoc
```

Versão mínima recomendada: **Pandoc 3.0+**.

### Execução básica

```bash
cd ditos3_epub/

python montar_ditos3_epub_final.py \
    --txt transcricao_ditos3_completo.txt \
    --csv estrutura_ditos3.csv \
    --out ditos3_final.epub
```

### Execução com caminhos explícitos

```bash
python montar_ditos3_epub_final.py \
    --txt ../transcricao_ditos3_completo.txt \
    --csv estrutura_ditos3.csv \
    --out ~/Documentos/ditos3_final.epub
```

### Comando Pandoc avulso (se quiser gerar o EPUB manualmente do Markdown)

```bash
pandoc ditos3_final.md \
    --output ditos3_final.epub \
    --from markdown+smart \
    --to epub3 \
    --toc \
    --toc-depth=1 \
    --epub-chapter-level=1 \
    --css ditos3.css \
    --metadata lang=pt-BR \
    --standalone
```

---

## 4. Checklist de qualidade do EPUB final

Use esta lista para inspecionar o EPUB gerado. Recomenda-se abrir em
[Calibre](https://calibre-ebook.com/) e em um leitor de EPUB real (Apple Books, Kobo, etc.).

### 4.1 Estrutura e navegação

- [ ] O sumário (TOC) contém exatamente 35 entradas (os 32 textos + 3 índices/organização)
- [ ] Nenhum subtítulo interno da Apresentação aparece no TOC principal
- [ ] Cada entrada do TOC leva ao início correto do capítulo
- [ ] A página de rosto (título, autor, editora) aparece antes da Apresentação
- [ ] Não há entradas "Página 7", "Página 53" etc. no TOC

### 4.2 Cabeçalhos e paginação

- [ ] Nenhuma linha do tipo "Michel Foucault - Ditos e Escritos" aparece no corpo
- [ ] Nenhuma linha do tipo "Apresentação VII" ou "Apresentação IX" aparece no corpo
- [ ] Nenhum algarismo romano isolado (VI, VII, VIII, IX, X…) aparece no texto
- [ ] Nenhum marcador "Página N" ou linha de traços "---" aparece no texto

### 4.3 Hifenização e palavras

- [ ] "contemporânea" aparece como uma palavra, não como "contem-" + "porânea"
- [ ] "intervenções" aparece inteiro
- [ ] "pós-estruturalismo" mantém o hífen
- [ ] "anti-retro" mantém o hífen (é o título do capítulo)
- [ ] "J.-P." mantém os pontos e o hífen (referência ao autor J.-P. Richard)
- [ ] Não há palavras grudadas sem sentido (ex: "contemporânea" não virou "contemporneaa")

### 4.4 Parágrafos

- [ ] A Apresentação tem parágrafos fluentes, sem quebras no meio de frases
- [ ] Subtítulos como "Nascimento da literatura" aparecem como `##` dentro da Apresentação
- [ ] Não há linhas curtas isoladas que deveriam ser continuação do parágrafo anterior
- [ ] Não há parágrafos colados que deveriam ser separados

### 4.5 Notas de rodapé

- [ ] As referências bibliográficas (Le bain de Diane, Oeuvres complètes etc.)  
  aparecem no bloco "Notas" ao fim da Apresentação, NÃO no corpo do texto
- [ ] O bloco "Notas" está separado do corpo por uma linha horizontal (`---`)
- [ ] O corpo da Apresentação flui sem interrupções de citação bibliográfica

### 4.6 Capítulos principais (amostragem)

Abra ao menos 5 capítulos diferentes e verifique:
- [ ] "Prefácio à Transgressão" (p. 80): texto filosófico denso, sem quebras indevidas
- [ ] "As Damas de Companhia" (p. 246): texto sobre pintura, verificar marcadores [imagem omitida]
- [ ] "O que É um Autor?" (p. 318): um dos textos mais citados, verificar fluxo
- [ ] "Outros Espaços" (p. 465): último texto longo, verificar completude
- [ ] "Índice de Obras" (p. 477): deve ser uma lista legível, não texto corrido

### 4.7 Tipografia e leitura

- [ ] O CSS está sendo aplicado (fonte serifada, justificado, espaçamento adequado)
- [ ] Nenhum placeholder `image[[...]]` visível no texto
- [ ] Não há linhas em branco excessivas (mais de 2 seguidas) no corpo
- [ ] Citações longas aparecem recuadas (blockquote) quando necessário

---

## 5. Ajustes finos comuns

### Se ainda sobrar cabeçalho específico

Adicione o padrão à lista `CABECALHOS` no topo do script:
```python
CABECALHOS = [
    r"^Michel\s+Foucault\s*[-–]\s*Ditos\s+e\s+Escritos\s*$",
    r"^Seu Novo Padrão Aqui\s*$",   # ← adicione aqui
    ...
]
```

### Se subtítulo virar capítulo indevidamente

Ajuste o limiar de tamanho em `reconstruir_paragrafos()`:
```python
if len(s) <= 60   # aumente para 80 se subtítulos longos estiverem escapando
```

### Se nota de rodapé ainda aparecer no corpo

Adicione o padrão ao regex `NOTA_INICIO` ou `NOTA_INLINE` no topo do script.

### Para gerar notas EPUB inline (opcional, avançado)

Substitua o bloco de notas por sintaxe de nota de rodapé Pandoc:
```
texto principal[^1]

[^1]: Conteúdo da nota.
```
e use `--from markdown+footnotes` no comando Pandoc.

---

## 6. Arquivos do projeto

```
ditos3_epub/
├── montar_ditos3_epub_final.py   # script principal
├── ditos3.css                    # stylesheet do EPUB
├── estrutura_ditos3.csv          # sumário manual (fonte da verdade)
├── DIAGNOSTICO_E_CHECKLIST.md   # este arquivo
│
# (colocar na mesma pasta ou passar via --txt / --csv):
├── transcricao_ditos3_completo.txt
│
# (gerados pelo script):
├── ditos3_final.md               # Markdown intermediário (inspecionável)
└── ditos3_final.epub             # EPUB final
```
