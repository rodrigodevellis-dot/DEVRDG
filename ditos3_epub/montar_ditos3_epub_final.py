#!/usr/bin/env python3
"""
montar_ditos3_epub_final.py
───────────────────────────
Pipeline de limpeza OCR e montagem de EPUB para
Ditos e Escritos III — Michel Foucault.

Entrada : transcricao_ditos3_completo.txt  (OCR bruto)
          estrutura_ditos3.csv              (sumário manual)
Saída   : ditos3_final.md                  (Markdown limpo)
          ditos3_final.epub                (via Pandoc)

Uso:
    python montar_ditos3_epub_final.py \
        --txt transcricao_ditos3_completo.txt \
        --csv estrutura_ditos3.csv \
        --out ditos3_final.epub
"""

import argparse
import csv
import re
import subprocess
import sys
from pathlib import Path


# ─────────────────────────────────────────────
# 1. CONFIGURAÇÕES E PADRÕES
# ─────────────────────────────────────────────

# Cabeçalhos/rodapés recorrentes a eliminar (regex, case-insensitive).
# Cobre todas as variantes observadas no OCR deste livro.
CABECALHOS = [
    # Forma canônica: "Michel Foucault - Ditos e Escritos"
    r"^Michel\s+Foucault\s*[-–]\s*Ditos\s+e\s+Escritos\s*$",
    r"^Michel\s+Foucault\s+Ditos\s+e\s+Escritos\s*$",
    r"^Ditos\s+e\s+Escritos\s+[-–]\s*Michel\s+Foucault\s*$",
    # Prefixo romano: "VI Michel Foucault - Ditos e Escritos"
    r"^[IVXLCDM]+\s+Michel\s+Foucault.*Ditos\s+e\s+Escritos\s*$",
    # Prefixo arábico: "106 Michel Foucault Ditos e Escritos"
    r"^\d+\s+Michel\s+Foucault.*Ditos\s+e\s+Escritos\s*$",
    # Qualquer linha que contenha ambos (captura variações tipográficas e typos de OCR)
    r"^.*Michel\s+Foucault.*Ditos\s+e\s+[A-Z]\w*.*$",
    # Prefixo arábico (número de página) + Michel Foucault (qualquer sufixo)
    r"^\d{1,3}\s+Michel\s+Foucault.*$",
]

# Paginação romana no cabeçalho/rodapé — padrão: "Apresentação VII"
# ou linha sozinha "IX", "XIV" etc.
ROMANA_CABECALHO = re.compile(
    r"^(?:[A-ZÁÉÍÓÚ][a-záéíóúãõâêô\s]+\s+)?(?:I{1,3}|IV|V?I{0,3}|IX|X{1,3}|XL|L)\s*$"
)

# Separador de página gerado pelo conversor
SEPARADOR_PAGINA = re.compile(r"^-{20,}$")
MARCADOR_PAGINA  = re.compile(r"^P[áa]gina\s+(\d+)\s*$", re.IGNORECASE)

# Hifenização de quebra de linha:
#   palavra-   /  -continuação   →  palavracontinuação
# Mas hífens legítimos (pós-, anti-, J.-P.) são preservados.
HIFEN_QUEBRA = re.compile(r"(\w)-\s*\n\s*(\w)")

# Notas de rodapé — padrões de início de nota
NOTA_INICIO = re.compile(
    r"^(\*{1,3}|\d{1,2}|†)\s+"           # marcador: *, **, 1, 2, †
    r"(?:"
        r"(?:N\s*\.\s*[ATRN]\.[\s)])"     # (N.A.) (N.T.) (N.R.)
        r"|(?:(?:Ed|Org|Trad|ver|Cf|Idem|Ibid|apud)\b\.?)"  # abreviaturas editoriais
        r"|(?:[A-ZÁÉÍÓÚ][^,\n]{3,50},\s+(?:Paris|Rio|São Paulo|London|New York|Lisboa))"  # referência bibliográfica com cidade
        r"|(?:[A-ZÁÉÍÓÚ][a-záéíóúãõ]+\.?\s+(?:Oeuvres|complètes|Éd|Ed\.|Gallimard|Flammarion|Seuil|Minuit))"
    r")",
    re.IGNORECASE,
)

# Referência bibliográfica inline (nota perdida no corpo)
# Ex.: "* Le bain de Diane, Paris, Ed. Gallimard, p. 9."
NOTA_INLINE = re.compile(
    r"^\s*\*{1,3}\s+[A-ZÁÉÍÓÚ].{10,120}(?:p\.\s*\d+|Ed\.|Éd\.|Gallimard|Seuil|Flammarion|Minuit)\s*\.?\s*$"
)

# Placeholder de imagem
IMAGEM_PLACEHOLDER = re.compile(r"image\[\[.*?\]\]", re.IGNORECASE)

# Linhas que são apenas algarismos romanos soltos (paginação da Apresentação)
APENAS_ROMANA = re.compile(r"^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$")


# ─────────────────────────────────────────────
# 2. LEITURA DO CSV DE ESTRUTURA
# ─────────────────────────────────────────────

def ler_estrutura(csv_path: Path) -> list[dict]:
    """Retorna lista de capítulos com pagina_inicio e titulo."""
    capitulos = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            capitulos.append({
                "pagina": int(row["pagina_inicio"]),
                "titulo": row["titulo"].strip(),
                "nivel":  int(row.get("nivel", 1)),
            })
    # ordena por página (garante ordem mesmo se o CSV não estiver ordenado)
    capitulos.sort(key=lambda c: c["pagina"])
    return capitulos


# ─────────────────────────────────────────────
# 3. PARSE DO TXT — SEPARA PÁGINAS
# ─────────────────────────────────────────────

def parsear_paginas(txt_path: Path) -> dict[int, list[str]]:
    """
    Lê o TXT do OCR e agrupa linhas por número de página.
    Retorna {numero_pagina: [linhas brutas]}.
    """
    paginas: dict[int, list[str]] = {}
    pagina_atual = 0
    linhas_pagina: list[str] = []

    with open(txt_path, encoding="utf-8") as f:
        for linha in f:
            linha = linha.rstrip("\n")

            if SEPARADOR_PAGINA.match(linha):
                continue

            m = MARCADOR_PAGINA.match(linha)
            if m:
                if pagina_atual > 0:
                    paginas[pagina_atual] = linhas_pagina
                pagina_atual = int(m.group(1))
                linhas_pagina = []
                continue

            linhas_pagina.append(linha)

    if pagina_atual > 0 and linhas_pagina:
        paginas[pagina_atual] = linhas_pagina

    return paginas


# ─────────────────────────────────────────────
# 4. LIMPEZA POR LINHA
# ─────────────────────────────────────────────

def eh_cabecalho(linha: str) -> bool:
    for pat in CABECALHOS:
        if re.match(pat, linha.strip(), re.IGNORECASE):
            return True
    return False


def eh_romana_cabecalho(linha: str) -> bool:
    s = linha.strip()
    if not s:
        return False
    # linha do tipo "Apresentação VII" ou só "IX"
    if ROMANA_CABECALHO.match(s):
        return True
    # "Apresentação IX" — título + romana
    partes = s.rsplit(None, 1)
    if len(partes) == 2 and APENAS_ROMANA.match(partes[-1]):
        return True
    return False


def eh_apenas_romana(linha: str) -> bool:
    s = linha.strip()
    return bool(s and APENAS_ROMANA.match(s))


def limpar_linha(linha: str) -> str:
    """Limpeza pontual de uma linha: imagens, espaços duplos."""
    linha = IMAGEM_PLACEHOLDER.sub("[imagem omitida]", linha)
    linha = re.sub(r"  +", " ", linha)
    return linha.strip()


def filtrar_linhas_pagina(linhas: list[str]) -> tuple[list[str], list[str]]:
    """
    Filtra uma lista de linhas de uma página.
    Retorna (linhas_corpo, notas_coletadas).
    """
    corpo: list[str] = []
    notas: list[str] = []
    em_nota = False

    for linha in linhas:
        s = linha.strip()

        # Pula vazias (tratadas depois na junção de parágrafos)
        if not s:
            if em_nota:
                notas.append("")
            else:
                corpo.append("")
            continue

        # Cabeçalhos e paginação romana
        if eh_cabecalho(s) or eh_romana_cabecalho(s) or eh_apenas_romana(s):
            continue

        # Notas inline (tipo "* Le bain de Diane, Paris, ...")
        if NOTA_INLINE.match(linha):
            notas.append(limpar_linha(linha))
            em_nota = True
            continue

        # Início de nota numerada ou com asterisco
        if NOTA_INICIO.match(s):
            notas.append(limpar_linha(linha))
            em_nota = True
            continue

        # Continuação de nota (linha indentada ou sem quebra de parágrafo)
        if em_nota and (linha.startswith("  ") or (not s[0].isupper())):
            notas.append(limpar_linha(linha))
            continue

        em_nota = False
        corpo.append(limpar_linha(linha))

    return corpo, notas


# ─────────────────────────────────────────────
# 5. RECONSTRUÇÃO DE PARÁGRAFOS
# ─────────────────────────────────────────────

def resolver_hifenizacao(texto: str) -> str:
    """
    Remove hífens de quebra de linha do PDF impresso.
    Preserva hífens legítimos (compostos, nomes próprios, siglas).

    Usa um loop interno para resolver hifenizações encadeadas:
    se a linha resultante ainda terminar com hífen, continua unindo
    com a próxima linha não-vazia.

    Pula linhas vazias ao procurar a continuação (resolve quebras entre páginas).

    Regras:
    - `palavra-` + `continuação` (minúscula) → une sem hífen.
    - `palavra-` + `Continuação` (maiúscula, ≤ 12 chars) → une COM hífen.
    - Hífens não-finais de linha (J.-P., pós-estruturalismo) → preservados.
    """
    linhas = texto.split("\n")
    resultado: list[str] = []
    i = 0
    while i < len(linhas):
        linha = linhas[i].rstrip()

        # Loop interno: resolve hifenizações encadeadas (ex.: "re-\nvo-\nlução")
        while linha.endswith("-"):
            # Encontra próxima linha não-vazia
            j = i + 1
            while j < len(linhas) and not linhas[j].strip():
                j += 1

            if j >= len(linhas):
                break  # fim do texto — mantém hífen como está

            proxima = linhas[j].strip()
            if not proxima:
                break

            if proxima[0].islower():
                # Quebra de linha com hífen: remove hífen e une
                linha = linha[:-1] + proxima
                i = j  # avança i para j; outer loop fará i += 1
            elif proxima[0].isupper():
                resto = proxima[1:]
                if len(proxima) <= 12 and resto == resto.lower():
                    # Composto iniciando com maiúscula (ex.: "Pós-Modernismo")
                    linha = linha + proxima
                    i = j
                else:
                    break  # início de nova frase — não une
            else:
                break

        resultado.append(linha)
        i += 1

    return "\n".join(resultado)


def reconstruir_paragrafos(linhas: list[str], titulo_capitulo: str = "") -> list[str]:
    """
    Reconstrói parágrafos a partir das linhas OCR de um capítulo.

    Estratégia em dois passos:

    Passo 1 — Agrupa por linhas vazias (separadores de página artificiais
    inseridos entre páginas) em blocos de ~1 página cada.

    Passo 2 — Dentro de cada bloco (página), junta todas as linhas em
    texto corrido e depois divide nos limites de sentença: `. ` ou `! `
    ou `? ` seguido de letra maiúscula que não seja sigla de 1 char.

    Linhas muito curtas isoladas (≤ 38 chars, sem pontuação de fim) são
    promovidas a subtítulos `##`. O threshold de 38 chars foi escolhido
    porque:
      • OCR lines normais têm ~55-65 chars (largura de coluna do livro).
      • Subtítulos reais (ex. "Nascimento da literatura" = 24 chars)
        ficam bem abaixo desse limiar.
      • False positives acima de 38 são raros neste livro.
    """
    FINS_SENTENCA = set(".!?…")
    # Abreviações que geram ponto mas NÃO encerram sentença
    ABREV = re.compile(
        r"\b(?:p|pp|vol|ed|éd|org|trad|cf|vs|obs|sr|sra|dr|prof|etc|al|apud|op|cit|ibid)"
        r"\.$",
        re.IGNORECASE,
    )

    # ── Passo 1: agrupa por linhas vazias ──────────────────────────────
    blocos: list[list[str]] = []
    grupo: list[str] = []
    for linha in linhas:
        s = linha.strip()
        if not s:
            if grupo:
                blocos.append(grupo)
                grupo = []
        else:
            grupo.append(s)
    if grupo:
        blocos.append(grupo)

    # ── Passo 2: processa cada bloco ───────────────────────────────────
    paragrafos: list[str] = []

    for bloco in blocos:
        # Remove linha duplicada do título do capítulo no início do bloco
        if bloco and titulo_capitulo and bloco[0].strip() == titulo_capitulo.strip():
            bloco = bloco[1:]
        if not bloco:
            continue

        texto = " ".join(bloco).strip()
        if not texto:
            continue

        # Artefato OCR (≤ 3 chars): descarta silenciosamente
        if len(texto) <= 3:
            continue

        # Bloco muito curto → possível subtítulo (mas não para fragmentos de frase)
        # Exclui linhas que começam com minúscula ou com "(", ",", "-" — são continuações.
        if (
            len(texto) <= 38
            and texto[-1] not in FINS_SENTENCA
            and texto[0].isupper()
            and not texto.startswith(("(", ",", "-", "—", "–"))
            and not re.match(r"^\d", texto)
        ):
            paragrafos.append(f"__SUBTITULO__{texto}")
            continue

        # Bloco de tamanho moderado → parágrafo único (não tenta dividir)
        if len(texto) < 400:
            paragrafos.append(texto)
            continue

        # Bloco longo (página inteira) → divide em parágrafos por fim de sentença
        # Usa lookahead: ". Capital" (excluindo siglas e abreviações)
        partes = re.split(r'(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÀÂÃÊÕÔ][a-záéíóúàâãêõôç])', texto)

        for parte in partes:
            parte = parte.strip()
            if parte:
                paragrafos.append(parte)

    return paragrafos


# ─────────────────────────────────────────────
# 6. MONTAGEM DO MARKDOWN POR CAPÍTULO
# ─────────────────────────────────────────────

def paginas_do_capitulo(
    capitulos: list[dict], idx: int, todas_paginas: dict[int, list[str]]
) -> tuple[list[str], list[str]]:
    """
    Retorna (linhas_corpo_totais, notas_totais) para o capítulo idx,
    varrendo da sua página de início até a página anterior ao próximo capítulo.
    """
    inicio = capitulos[idx]["pagina"]
    fim = capitulos[idx + 1]["pagina"] if idx + 1 < len(capitulos) else max(todas_paginas.keys()) + 1

    corpo_total: list[str] = []
    notas_total: list[str] = []

    for num_pag in range(inicio, fim):
        if num_pag not in todas_paginas:
            continue
        corpo, notas = filtrar_linhas_pagina(todas_paginas[num_pag])
        corpo_total.extend(corpo)
        corpo_total.append("")   # separação de página vira linha vazia → possível quebra de parágrafo
        notas_total.extend(notas)

    return corpo_total, notas_total


def formatar_capitulo_md(cap: dict, paragrafos: list[str], notas: list[str]) -> str:
    """Formata um capítulo completo em Markdown."""
    nivel = "#" * cap["nivel"]
    linhas_md: list[str] = []

    linhas_md.append(f"{nivel} {cap['titulo']}\n")

    for p in paragrafos:
        if not p.strip():
            continue
        if p.startswith("__SUBTITULO__"):
            subtitulo = p[len("__SUBTITULO__"):]
            linhas_md.append(f"\n## {subtitulo}\n")
        else:
            linhas_md.append(f"\n{p}\n")

    # Bloco de notas ao fim do capítulo
    notas_limpas = [n for n in notas if n.strip()]
    if notas_limpas:
        linhas_md.append("\n---\n")
        linhas_md.append("\n**Notas**\n")
        for nota in notas_limpas:
            linhas_md.append(f"\n{nota}\n")

    return "\n".join(linhas_md)


# ─────────────────────────────────────────────
# 7. METADADOS DO EPUB
# ─────────────────────────────────────────────

METADADOS_MD = """\
---
title: "Estética: Literatura e Pintura, Música e Cinema"
subtitle: "Ditos e Escritos III"
author: "Michel Foucault"
editor: "Manoel Barros da Motta"
translator: "Inês Autran Dourado Barbosa"
publisher: "Forense Universitária"
lang: pt-BR
toc: true
toc-depth: 1
toc-title: "Sumário"
---

"""

PAGINA_ROSTO_MD = """\
# Ditos e Escritos III {.unnumbered}

**Estética: Literatura e Pintura, Música e Cinema**

Michel Foucault

Organização e seleção de textos: Manoel Barros da Motta

Tradução: Inês Autran Dourado Barbosa

2.ª edição — Forense Universitária, Rio de Janeiro

"""


# ─────────────────────────────────────────────
# 8. PIPELINE PRINCIPAL
# ─────────────────────────────────────────────

def processar(txt_path: Path, csv_path: Path, out_epub: Path) -> None:
    print("[1/6] Lendo estrutura de capítulos...")
    capitulos = ler_estrutura(csv_path)

    print("[2/6] Parseando páginas do OCR...")
    todas_paginas = parsear_paginas(txt_path)
    print(f"      {len(todas_paginas)} páginas encontradas.")

    print("[3/6] Processando capítulos e limpando texto...")
    blocos_md: list[str] = [METADADOS_MD, PAGINA_ROSTO_MD]

    for idx, cap in enumerate(capitulos):
        nome = cap["titulo"]
        print(f"      → {nome[:55]}...")

        linhas_corpo, notas = paginas_do_capitulo(capitulos, idx, todas_paginas)

        # Resolve hifenização antes de reconstruir parágrafos
        texto_bruto = "\n".join(linhas_corpo)
        texto_sem_hifen = resolver_hifenizacao(texto_bruto)
        linhas_limpas = texto_sem_hifen.split("\n")

        paragrafos = reconstruir_paragrafos(linhas_limpas, titulo_capitulo=cap["titulo"])
        bloco = formatar_capitulo_md(cap, paragrafos, notas)
        blocos_md.append(bloco)

    md_path = out_epub.with_suffix(".md")
    print(f"[4/6] Gravando Markdown em {md_path}...")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("\n\n---\n\n".join(blocos_md))

    print("[5/6] Gerando EPUB com Pandoc...")
    css_path = Path(__file__).parent / "ditos3.css"
    cmd = [
        "pandoc",
        str(md_path),
        "--output", str(out_epub),
        "--from", "markdown+smart",
        "--to", "epub3",
        "--toc",
        "--toc-depth=1",
        "--epub-chapter-level=1",
        f"--css={css_path}",
        "--metadata", "lang=pt-BR",
        "--standalone",
    ]
    print("      " + " ".join(cmd))
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("ERRO no Pandoc:")
        print(result.stderr)
        sys.exit(1)

    print(f"[6/6] EPUB gerado: {out_epub}")
    tamanho = out_epub.stat().st_size / 1024
    print(f"      Tamanho: {tamanho:.1f} KB")


# ─────────────────────────────────────────────
# 9. CLI
# ─────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Monta EPUB limpo de Ditos e Escritos III."
    )
    parser.add_argument(
        "--txt",
        default="transcricao_ditos3_completo.txt",
        help="Arquivo TXT do OCR (padrão: transcricao_ditos3_completo.txt)",
    )
    parser.add_argument(
        "--csv",
        default="estrutura_ditos3.csv",
        help="CSV de estrutura de capítulos (padrão: estrutura_ditos3.csv)",
    )
    parser.add_argument(
        "--out",
        default="ditos3_final.epub",
        help="Arquivo EPUB de saída (padrão: ditos3_final.epub)",
    )
    args = parser.parse_args()

    txt_path = Path(args.txt)
    csv_path = Path(args.csv)
    out_epub = Path(args.out)

    if not txt_path.exists():
        print(f"Erro: arquivo TXT não encontrado: {txt_path}")
        sys.exit(1)
    if not csv_path.exists():
        print(f"Erro: arquivo CSV não encontrado: {csv_path}")
        sys.exit(1)

    processar(txt_path, csv_path, out_epub)


if __name__ == "__main__":
    main()
