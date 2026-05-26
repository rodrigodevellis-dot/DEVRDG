#!/usr/bin/env python3
"""Extrai texto de PDFs usando Google Document AI (OCR).

Saidas em --outdir:
    textos_paginas/pagina_NNNN.txt   uma pagina por arquivo
    <out>                            texto unificado
    log_ocr.txt                      log execucao
    manifest.json                    metadados
"""
from __future__ import annotations

import argparse
import json
import logging
import sys
import time
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

from google.api_core.client_options import ClientOptions
from google.api_core.exceptions import GoogleAPICallError, RetryError
from google.cloud import documentai
from pdf2image import convert_from_path
from pypdf import PdfReader

# Document AI permite ate 15 paginas por request sincrono
PAGES_PER_BATCH = 15
DPI = 200
MAX_RETRIES = 4


@dataclass
class Manifest:
    pdf: str
    first: int
    last: int
    total_pages: int
    batches: int
    processor: str
    location: str
    project: str
    started_at: str
    finished_at: str
    failed_pages: list[int]


def setup_logging(log_path: Path) -> None:
    log_path.parent.mkdir(parents=True, exist_ok=True)
    handlers: list[logging.Handler] = [
        logging.FileHandler(log_path, encoding="utf-8"),
        logging.StreamHandler(sys.stdout),
    ]
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        handlers=handlers,
    )


def pdf_total_pages(pdf: Path) -> int:
    return len(PdfReader(str(pdf)).pages)


def batches(first: int, last: int, size: int) -> Iterable[tuple[int, int]]:
    cur = first
    while cur <= last:
        end = min(cur + size - 1, last)
        yield cur, end
        cur = end + 1


def docai_client(location: str) -> documentai.DocumentProcessorServiceClient:
    endpoint = f"{location}-documentai.googleapis.com"
    opts = ClientOptions(api_endpoint=endpoint)
    return documentai.DocumentProcessorServiceClient(client_options=opts)


def process_image_bytes(
    client: documentai.DocumentProcessorServiceClient,
    processor_name: str,
    image_bytes: bytes,
) -> str:
    raw = documentai.RawDocument(content=image_bytes, mime_type="image/png")
    req = documentai.ProcessRequest(name=processor_name, raw_document=raw)
    last_err: Exception | None = None
    delay = 2
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = client.process_document(request=req)
            return resp.document.text or ""
        except (GoogleAPICallError, RetryError) as exc:
            last_err = exc
            logging.warning("DocAI falhou (tentativa %d/%d): %s", attempt, MAX_RETRIES, exc)
            time.sleep(delay)
            delay *= 2
    assert last_err is not None
    raise last_err


def write_page(pages_dir: Path, page_num: int, text: str) -> Path:
    out = pages_dir / f"pagina_{page_num:04d}.txt"
    out.write_text(text.strip() + "\n", encoding="utf-8")
    return out


def consolidate(pages_dir: Path, out_file: Path, first: int, last: int) -> None:
    parts: list[str] = []
    for n in range(first, last + 1):
        p = pages_dir / f"pagina_{n:04d}.txt"
        if p.exists():
            parts.append(f"\n\n===== Pagina {n} =====\n\n" + p.read_text(encoding="utf-8"))
    out_file.write_text("".join(parts).lstrip(), encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(description="OCR via Google Document AI")
    ap.add_argument("--pdf", required=True, type=Path)
    ap.add_argument("--first", type=int, default=1)
    ap.add_argument("--last", type=int, default=None)
    ap.add_argument("--outdir", required=True, type=Path)
    ap.add_argument("--out", required=True, help="arquivo .txt unificado (relativo ao outdir)")
    ap.add_argument("--project", required=True)
    ap.add_argument("--location", default="us")
    ap.add_argument("--processor", required=True)
    ap.add_argument("--dpi", type=int, default=DPI)
    args = ap.parse_args()

    pdf: Path = args.pdf.expanduser().resolve()
    if not pdf.is_file():
        print(f"PDF nao encontrado: {pdf}", file=sys.stderr)
        return 2

    outdir: Path = args.outdir.expanduser().resolve()
    pages_dir = outdir / "textos_paginas"
    pages_dir.mkdir(parents=True, exist_ok=True)
    log_path = outdir / "log_ocr.txt"
    setup_logging(log_path)

    total = pdf_total_pages(pdf)
    first = max(1, args.first)
    last = min(args.last or total, total)
    if first > last:
        logging.error("Intervalo invalido: first=%d last=%d total=%d", first, last, total)
        return 2

    processor_name = (
        f"projects/{args.project}/locations/{args.location}/processors/{args.processor}"
    )
    logging.info("PDF=%s total=%d intervalo=%d..%d", pdf.name, total, first, last)
    logging.info("Processor=%s", processor_name)

    client = docai_client(args.location)
    started = time.strftime("%Y-%m-%dT%H:%M:%S")
    failed: list[int] = []
    batches_done = 0

    for b_first, b_last in batches(first, last, PAGES_PER_BATCH):
        logging.info("Lote %d-%d: convertendo para imagens (%d dpi)", b_first, b_last, args.dpi)
        try:
            images = convert_from_path(
                str(pdf),
                dpi=args.dpi,
                first_page=b_first,
                last_page=b_last,
                fmt="png",
            )
        except Exception as exc:  # pdf2image levanta varias excecoes
            logging.error("Falha convertendo lote %d-%d: %s", b_first, b_last, exc)
            failed.extend(range(b_first, b_last + 1))
            continue

        for i, img in enumerate(images):
            page_num = b_first + i
            target = pages_dir / f"pagina_{page_num:04d}.txt"
            if target.exists() and target.stat().st_size > 0:
                logging.info("Pagina %d ja extraida, pulando", page_num)
                continue

            import io
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            try:
                text = process_image_bytes(client, processor_name, buf.getvalue())
                write_page(pages_dir, page_num, text)
                logging.info("Pagina %d OK (%d chars)", page_num, len(text))
            except Exception as exc:
                logging.error("Pagina %d FALHOU: %s", page_num, exc)
                failed.append(page_num)
            finally:
                buf.close()

        batches_done += 1

    out_file = outdir / args.out
    consolidate(pages_dir, out_file, first, last)
    logging.info("Texto unificado: %s", out_file)

    manifest = Manifest(
        pdf=str(pdf),
        first=first,
        last=last,
        total_pages=total,
        batches=batches_done,
        processor=processor_name,
        location=args.location,
        project=args.project,
        started_at=started,
        finished_at=time.strftime("%Y-%m-%dT%H:%M:%S"),
        failed_pages=failed,
    )
    (outdir / "manifest.json").write_text(
        json.dumps(asdict(manifest), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    if failed:
        logging.warning("Paginas com falha: %s", failed)
        return 1
    logging.info("Concluido sem falhas.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
