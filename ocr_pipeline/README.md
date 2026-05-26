# Pipeline OCR -> EPUB (Google Document AI)

Automatiza o passo a passo do guia: PDF -> texto OCR -> EPUB -> Cloud Storage.

## Conteudo

| Arquivo | Funcao |
|---|---|
| `ocr_automate.sh` | orquestrador (setup, auth, configure, ocr, epub, upload, download, all) |
| `extrair_ocr_documentai.py` | OCR pagina a pagina via Document AI |
| `gerar_epub_generico.py` | monta EPUB a partir de paginas + CSV de capitulos |
| `epub.css` | folha de estilo default |
| `estrutura_exemplo.csv` | modelo de indice de capitulos |
| `requirements.txt` | dependencias Python |

## Quick start

```bash
cd ocr_pipeline
chmod +x ocr_automate.sh

./ocr_automate.sh setup        # 1x: brew + python libs + gcloud sdk
./ocr_automate.sh auth         # 1x: gcloud auth login + ADC
./ocr_automate.sh configure    # 1x: PROJECT_ID / LOCATION / PROCESSOR_ID / GCS_BUCKET

# pipeline completo
./ocr_automate.sh all ~/Downloads/hall1p.pdf estrutura_hall.csv \
  --title "O Livro do Hall" --author "Renato"
```

A configuracao fica em `.ocr_pipeline.env` (chmod 600) e e carregada automaticamente.

## Comandos individuais

```bash
# so OCR (1 a 628), salva em ocr_hall/ e hall.txt
./ocr_automate.sh ocr ~/Downloads/hall1p.pdf \
  --first 1 --last 628 --outdir ocr_hall --out hall.txt

# so EPUB
./ocr_automate.sh epub ocr_hall/textos_paginas estrutura_hall.csv hall_final.epub \
  --title "Nome do Livro" --author "Autor"

# upload de uma obra ja processada
./ocr_automate.sh upload hall \
  --bucket meu-bucket \
  --pdf ~/Downloads/hall1p.pdf \
  --ocr-dir ocr_hall \
  --csv estrutura_hall.csv \
  --epub hall_final.epub

# baixar depois
./ocr_automate.sh download hall ./hall_baixado
```

## Estrutura gerada

```
ocr_hall/
├── textos_paginas/pagina_0001.txt ... pagina_0628.txt
├── hall.txt          # texto unificado
├── log_ocr.txt
└── manifest.json     # metadados (failed_pages etc.)
```

No bucket:

```
gs://<bucket>/obras/<slug>/
├── origem/<pdf>
├── ocr/<outdir>/
├── estrutura/<csv>
└── epub/<epub>
```

## CSV de capitulos

```csv
pagina_inicio,titulo,nivel
1,Introducao,1
35,Capitulo 1,1
80,Capitulo 2,1
```

`nivel` controla a tag h1/h2/h3 no EPUB. O fim de cada capitulo e a pagina
anterior ao proximo `pagina_inicio` (o ultimo vai ate a ultima pagina extraida).

## Retomada / resiliencia

- Paginas ja extraidas (`pagina_NNNN.txt` nao-vazio) sao puladas em re-runs.
- Cada chamada a Document AI tem retry com backoff exponencial (ate 4x).
- Falhas por pagina ficam em `manifest.json -> failed_pages`.
- Uploads/downloads no Cloud Storage tem retry com backoff.

## Rodar em background

```bash
nohup ./ocr_automate.sh ocr ~/Downloads/hall1p.pdf \
  --first 1 --last 628 --outdir ocr_hall --out hall.txt \
  > hall_run.log 2>&1 &

tail -f hall_run.log
# ou
tail -f ocr_hall/log_ocr.txt
```
