#!/usr/bin/env python3
"""Gera EPUB a partir de paginas OCR + CSV de estrutura.

CSV (UTF-8):
    pagina_inicio,titulo,nivel
    1,Introducao,1
    35,Capitulo 1,1
    80,Capitulo 2,1
"""
from __future__ import annotations

import argparse
import csv
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

from ebooklib import epub


@dataclass
class Chapter:
    start: int
    title: str
    level: int
    end: int | None = None


def read_csv(path: Path) -> list[Chapter]:
    chapters: list[Chapter] = []
    with path.open("r", encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            try:
                start = int(row["pagina_inicio"].strip())
                title = row["titulo"].strip()
                level = int(row.get("nivel", "1").strip() or "1")
            except (KeyError, ValueError) as exc:
                raise SystemExit(f"CSV invalido em {row}: {exc}")
            chapters.append(Chapter(start=start, title=title, level=level))

    chapters.sort(key=lambda c: c.start)
    for i, ch in enumerate(chapters):
        ch.end = chapters[i + 1].start - 1 if i + 1 < len(chapters) else None
    return chapters


def list_pages(pages_dir: Path) -> dict[int, Path]:
    pages: dict[int, Path] = {}
    rx = re.compile(r"pagina_(\d+)\.txt$")
    for p in pages_dir.iterdir():
        m = rx.match(p.name)
        if m:
            pages[int(m.group(1))] = p
    return pages


def page_text(path: Path) -> str:
    txt = path.read_text(encoding="utf-8").strip()
    # remove cabecalho de pagina inserido pelo OCR script, se houver
    txt = re.sub(r"^===== Pagina \d+ =====\s*", "", txt)
    return txt


def html_escape(s: str) -> str:
    return (
        s.replace("&", "&amp;")
         .replace("<", "&lt;")
         .replace(">", "&gt;")
    )


def text_to_html(text: str) -> str:
    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    return "\n".join(f"<p>{html_escape(p).replace(chr(10), '<br/>')}</p>" for p in paragraphs)


def build_chapter_html(ch: Chapter, pages: dict[int, Path], css_href: str) -> str:
    last = ch.end if ch.end is not None else max(pages)
    parts: list[str] = []
    for n in range(ch.start, last + 1):
        p = pages.get(n)
        if not p:
            continue
        parts.append(f'<div class="page" id="p{n}"><span class="pn">[p. {n}]</span></div>')
        parts.append(text_to_html(page_text(p)))
    body = "\n".join(parts) if parts else "<p><em>(sem texto)</em></p>"

    return f"""<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="pt-BR" lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>{html_escape(ch.title)}</title>
  <link rel="stylesheet" type="text/css" href="{css_href}"/>
</head>
<body>
  <h{ch.level}>{html_escape(ch.title)}</h{ch.level}>
  {body}
</body>
</html>"""


def main() -> int:
    ap = argparse.ArgumentParser(description="Gerador generico de EPUB")
    ap.add_argument("--pages-dir", required=True, type=Path)
    ap.add_argument("--csv", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--title", required=True)
    ap.add_argument("--author", default="Desconhecido")
    ap.add_argument("--language", default="pt-BR")
    ap.add_argument("--css", type=Path, default=None)
    args = ap.parse_args()

    pages_dir: Path = args.pages_dir.expanduser().resolve()
    if not pages_dir.is_dir():
        print(f"pages-dir nao encontrado: {pages_dir}", file=sys.stderr)
        return 2

    pages = list_pages(pages_dir)
    if not pages:
        print(f"Nenhuma pagina_NNNN.txt em {pages_dir}", file=sys.stderr)
        return 2

    chapters = read_csv(args.csv.expanduser().resolve())
    if not chapters:
        print("CSV sem capitulos", file=sys.stderr)
        return 2

    book = epub.EpubBook()
    book.set_identifier(str(uuid4()))
    book.set_title(args.title)
    book.set_language(args.language)
    book.add_author(args.author)

    css_href = "styles/epub.css"
    css_body = ""
    if args.css and args.css.exists():
        css_body = args.css.read_text(encoding="utf-8")
    else:
        css_body = (
            "body{font-family:Georgia,serif;line-height:1.5;margin:1em}"
            "h1,h2,h3{font-family:'Helvetica Neue',Arial,sans-serif}"
            "p{text-align:justify;text-indent:1.2em;margin:0 0 .6em}"
            ".page{margin:1.2em 0 .2em;color:#888;font-size:.8em}"
            ".pn{border-bottom:1px solid #ccc;display:block}"
        )
    css_item = epub.EpubItem(
        uid="style_epub",
        file_name=css_href,
        media_type="text/css",
        content=css_body,
    )
    book.add_item(css_item)

    spine: list = ["nav"]
    toc: list = []
    for idx, ch in enumerate(chapters, start=1):
        file_name = f"chap_{idx:03d}.xhtml"
        item = epub.EpubHtml(
            title=ch.title,
            file_name=file_name,
            lang=args.language,
        )
        item.content = build_chapter_html(ch, pages, css_href)
        item.add_item(css_item)
        book.add_item(item)
        spine.append(item)
        toc.append(epub.Link(file_name, ch.title, f"chap{idx}"))

    book.toc = tuple(toc)
    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())
    book.spine = spine

    out: Path = args.out.expanduser().resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    epub.write_epub(str(out), book)
    print(f"EPUB gerado: {out}  ({len(chapters)} capitulos, {len(pages)} paginas)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
