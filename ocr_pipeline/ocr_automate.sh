#!/usr/bin/env bash
# ocr_automate.sh
# Automatiza o pipeline de OCR (PDF -> texto -> EPUB) usando Google Document AI
# e, opcionalmente, sincroniza os resultados com o Google Cloud Storage.
#
# Uso rapido:
#   ./ocr_automate.sh setup          # instala dependencias (macOS)
#   ./ocr_automate.sh auth           # faz login no gcloud
#   ./ocr_automate.sh configure      # salva PROJECT_ID/LOCATION/PROCESSOR_ID em .ocr_pipeline.env
#   ./ocr_automate.sh ocr <pdf>      # roda OCR em um PDF
#   ./ocr_automate.sh epub <ocr_dir> <csv> <epub_out>   # gera EPUB
#   ./ocr_automate.sh upload <obra>  # sobe arquivos para o Cloud Storage
#   ./ocr_automate.sh download <obra> <dest>            # baixa do Cloud Storage
#   ./ocr_automate.sh all <pdf> [csv_estrutura]         # pipeline completo
#
# Flags suportadas em "ocr" / "all":
#   --first N       primeira pagina (default 1)
#   --last N        ultima pagina (default = total do PDF)
#   --outdir DIR    pasta de saida (default ocr_<nome>)
#   --out FILE      arquivo .txt unificado (default <nome>.txt)
#   --bucket NAME   bucket do Cloud Storage (ativa upload pos-OCR)
#   --title STR     titulo do EPUB (default = nome do PDF)
#   --author STR    autor do EPUB (default "Desconhecido")
#   --no-epub       pula geracao de EPUB no comando "all"

set -euo pipefail

# -----------------------------------------------------------------------------
# Constantes e diretorios
# -----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${OCR_ENV_FILE:-$SCRIPT_DIR/.ocr_pipeline.env}"
PY_OCR="$SCRIPT_DIR/extrair_ocr_documentai.py"
PY_EPUB="$SCRIPT_DIR/gerar_epub_generico.py"
DEFAULT_CSS="$SCRIPT_DIR/epub.css"

C_RESET='\033[0m'
C_BOLD='\033[1m'
C_RED='\033[31m'
C_GREEN='\033[32m'
C_YELLOW='\033[33m'
C_BLUE='\033[34m'

log()  { printf "${C_BLUE}[*]${C_RESET} %s\n"  "$*"; }
ok()   { printf "${C_GREEN}[ok]${C_RESET} %s\n" "$*"; }
warn() { printf "${C_YELLOW}[!]${C_RESET} %s\n" "$*"; }
err()  { printf "${C_RED}[x]${C_RESET} %s\n"   "$*" >&2; }
die()  { err "$*"; exit 1; }

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
have() { command -v "$1" >/dev/null 2>&1; }

is_macos() { [[ "$(uname -s)" == "Darwin" ]]; }

load_env() {
    if [[ -f "$ENV_FILE" ]]; then
        # shellcheck disable=SC1090
        source "$ENV_FILE"
    fi
}

save_env() {
    cat > "$ENV_FILE" <<EOF
# Gerado por ocr_automate.sh em $(date '+%Y-%m-%d %H:%M:%S')
export PROJECT_ID="${PROJECT_ID:-}"
export LOCATION="${LOCATION:-us}"
export PROCESSOR_ID="${PROCESSOR_ID:-}"
export GCS_BUCKET="${GCS_BUCKET:-}"
EOF
    chmod 600 "$ENV_FILE"
    ok "Configuracao salva em $ENV_FILE"
}

require_var() {
    local name="$1"
    if [[ -z "${!name:-}" ]]; then
        die "Variavel $name nao definida. Rode: $0 configure"
    fi
}

slugify() {
    # transforma "Hall 1p.pdf" em "hall_1p"
    local s="$1"
    s="${s##*/}"
    s="${s%.*}"
    printf "%s" "$s" \
        | tr '[:upper:]' '[:lower:]' \
        | sed -E 's/[^a-z0-9]+/_/g; s/^_+|_+$//g'
}

retry() {
    # retry <max> <sleep_base> <cmd...>
    local max="$1"; shift
    local base="$1"; shift
    local n=0
    local delay="$base"
    until "$@"; do
        n=$((n+1))
        if (( n >= max )); then
            return 1
        fi
        warn "Falhou. Tentando de novo em ${delay}s (tentativa $n/$max)..."
        sleep "$delay"
        delay=$(( delay * 2 ))
    done
}

# -----------------------------------------------------------------------------
# Comandos
# -----------------------------------------------------------------------------
cmd_setup() {
    log "Instalando dependencias..."

    if is_macos; then
        if ! have brew; then
            log "Homebrew nao encontrado. Instalando..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        else
            ok "Homebrew ja instalado"
        fi

        for pkg in poppler pandoc; do
            if brew list --formula | grep -qx "$pkg"; then
                ok "$pkg ja instalado"
            else
                log "Instalando $pkg..."
                brew install "$pkg"
            fi
        done

        if brew list --cask 2>/dev/null | grep -qx "google-cloud-sdk"; then
            ok "google-cloud-sdk ja instalado"
        else
            log "Instalando google-cloud-sdk..."
            brew install --cask google-cloud-sdk || warn "Falha instalando google-cloud-sdk via cask"
        fi
    else
        warn "Sistema nao-Mac detectado. Pulando brew."
        warn "Instale manualmente: poppler-utils, pandoc, google-cloud-sdk"
    fi

    if ! have python3; then
        die "python3 nao encontrado. Instale Python 3.9+."
    fi

    log "Instalando bibliotecas Python..."
    python3 -m pip install --upgrade --user \
        google-cloud-documentai \
        google-cloud-storage \
        pdf2image \
        ebooklib \
        beautifulsoup4

    ok "Setup concluido"
}

cmd_auth() {
    have gcloud || die "gcloud nao encontrado. Rode: $0 setup"
    log "Login no gcloud..."
    gcloud auth login
    log "Credenciais Application Default..."
    gcloud auth application-default login
    ok "Autenticado"
}

cmd_configure() {
    have gcloud || die "gcloud nao encontrado. Rode: $0 setup"
    load_env

    echo
    echo "== Configuracao do pipeline =="
    echo "Projetos disponiveis:"
    gcloud projects list --format="table(projectId,name)" 2>/dev/null || true
    echo

    read -r -p "PROJECT_ID [${PROJECT_ID:-}]: " input
    PROJECT_ID="${input:-${PROJECT_ID:-}}"
    [[ -n "$PROJECT_ID" ]] || die "PROJECT_ID obrigatorio"

    read -r -p "LOCATION [${LOCATION:-us}]: " input
    LOCATION="${input:-${LOCATION:-us}}"

    read -r -p "PROCESSOR_ID [${PROCESSOR_ID:-}]: " input
    PROCESSOR_ID="${input:-${PROCESSOR_ID:-}}"
    [[ -n "$PROCESSOR_ID" ]] || warn "Sem PROCESSOR_ID. Crie um em https://console.cloud.google.com/ai/document-ai/processors"

    read -r -p "GCS_BUCKET (opcional) [${GCS_BUCKET:-}]: " input
    GCS_BUCKET="${input:-${GCS_BUCKET:-}}"

    log "Definindo projeto ativo..."
    gcloud config set project "$PROJECT_ID"

    log "Ativando API Document AI..."
    gcloud services enable documentai.googleapis.com

    if [[ -n "$GCS_BUCKET" ]]; then
        log "Ativando API Cloud Storage..."
        gcloud services enable storage.googleapis.com
    fi

    save_env
}

cmd_ocr() {
    load_env
    require_var PROJECT_ID
    require_var LOCATION
    require_var PROCESSOR_ID

    local pdf="" outdir="" out="" first="1" last="" bucket="${GCS_BUCKET:-}"
    while (( $# )); do
        case "$1" in
            --first)  first="$2"; shift 2 ;;
            --last)   last="$2";  shift 2 ;;
            --outdir) outdir="$2"; shift 2 ;;
            --out)    out="$2";   shift 2 ;;
            --bucket) bucket="$2"; shift 2 ;;
            -*)       die "Flag desconhecida: $1" ;;
            *)        if [[ -z "$pdf" ]]; then pdf="$1"; else die "Argumento extra: $1"; fi; shift ;;
        esac
    done

    [[ -n "$pdf" ]] || die "Uso: $0 ocr <pdf> [--first N] [--last N] [--outdir DIR] [--out FILE]"
    [[ -f "$pdf" ]] || die "PDF nao encontrado: $pdf"

    local slug; slug="$(slugify "$pdf")"
    outdir="${outdir:-ocr_${slug}}"
    out="${out:-${slug}.txt}"

    log "PDF: $pdf"
    log "Pages: $first..${last:-fim}"
    log "Saida: $outdir/  -> $out"

    local args=(
        --pdf      "$pdf"
        --first    "$first"
        --outdir   "$outdir"
        --out      "$out"
        --project  "$PROJECT_ID"
        --location "$LOCATION"
        --processor "$PROCESSOR_ID"
    )
    [[ -n "$last" ]] && args+=(--last "$last")

    python3 "$PY_OCR" "${args[@]}"

    ok "OCR finalizado em $outdir/"

    if [[ -n "$bucket" ]]; then
        log "Enviando para gs://$bucket/obras/$slug/"
        cmd_upload "$slug" --ocr-dir "$outdir" --pdf "$pdf" --bucket "$bucket"
    fi

    printf "OCR_OUTDIR=%s\nOCR_OUT=%s\n" "$outdir" "$out"
}

cmd_epub() {
    local pages_dir="" csv="" out="" title="" author="Desconhecido" css="$DEFAULT_CSS"
    while (( $# )); do
        case "$1" in
            --title)  title="$2";  shift 2 ;;
            --author) author="$2"; shift 2 ;;
            --css)    css="$2";    shift 2 ;;
            -*)       die "Flag desconhecida: $1" ;;
            *)
                if   [[ -z "$pages_dir" ]]; then pages_dir="$1"
                elif [[ -z "$csv" ]];       then csv="$1"
                elif [[ -z "$out" ]];       then out="$1"
                else die "Argumento extra: $1"
                fi
                shift ;;
        esac
    done

    [[ -n "$pages_dir" && -n "$csv" && -n "$out" ]] \
        || die "Uso: $0 epub <pages_dir> <csv> <epub_out> [--title T] [--author A] [--css PATH]"
    [[ -d "$pages_dir" ]] || die "Diretorio nao encontrado: $pages_dir"
    [[ -f "$csv" ]]       || die "CSV nao encontrado: $csv"

    title="${title:-$(basename "${out%.*}")}"

    log "Gerando EPUB: $out"
    python3 "$PY_EPUB" \
        --pages-dir "$pages_dir" \
        --csv       "$csv" \
        --out       "$out" \
        --title     "$title" \
        --author    "$author" \
        --css       "$css"

    ok "EPUB gerado: $out"
}

cmd_upload() {
    load_env
    have gsutil || have gcloud || die "gsutil/gcloud nao encontrado. Rode: $0 setup"

    local obra="" bucket="${GCS_BUCKET:-}" pdf="" ocr_dir="" csv="" epub=""
    while (( $# )); do
        case "$1" in
            --bucket)  bucket="$2"; shift 2 ;;
            --pdf)     pdf="$2";    shift 2 ;;
            --ocr-dir) ocr_dir="$2"; shift 2 ;;
            --csv)     csv="$2";    shift 2 ;;
            --epub)    epub="$2";   shift 2 ;;
            -*)        die "Flag desconhecida: $1" ;;
            *)         if [[ -z "$obra" ]]; then obra="$1"; else die "Argumento extra: $1"; fi; shift ;;
        esac
    done

    [[ -n "$obra" ]]   || die "Uso: $0 upload <obra> [--bucket B] [--pdf P] [--ocr-dir D] [--csv C] [--epub E]"
    [[ -n "$bucket" ]] || die "Defina --bucket ou GCS_BUCKET no .ocr_pipeline.env"

    local base="gs://$bucket/obras/$obra"
    log "Destino: $base/"

    local gsutil_cmd
    if have gsutil; then gsutil_cmd="gsutil"; else gsutil_cmd="gcloud storage"; fi

    local copy_cmd
    if [[ "$gsutil_cmd" == "gsutil" ]]; then
        copy_cmd=(gsutil -m cp)
    else
        copy_cmd=(gcloud storage cp)
    fi

    [[ -n "$pdf"  && -f "$pdf"  ]] && retry 4 2 "${copy_cmd[@]}" "$pdf"  "$base/origem/"
    [[ -n "$csv"  && -f "$csv"  ]] && retry 4 2 "${copy_cmd[@]}" "$csv"  "$base/estrutura/"
    [[ -n "$epub" && -f "$epub" ]] && retry 4 2 "${copy_cmd[@]}" "$epub" "$base/epub/"

    if [[ -n "$ocr_dir" && -d "$ocr_dir" ]]; then
        if [[ "$gsutil_cmd" == "gsutil" ]]; then
            retry 4 2 gsutil -m cp -r "$ocr_dir" "$base/ocr/"
        else
            retry 4 2 gcloud storage cp -r "$ocr_dir" "$base/ocr/"
        fi
    fi

    ok "Upload concluido: $base/"
}

cmd_download() {
    load_env
    have gsutil || have gcloud || die "gsutil/gcloud nao encontrado. Rode: $0 setup"

    local obra="${1:-}" dest="${2:-}"
    local bucket="${GCS_BUCKET:-}"
    [[ -n "$obra" && -n "$dest" ]] || die "Uso: $0 download <obra> <dest> (com GCS_BUCKET no .env)"
    [[ -n "$bucket" ]] || die "Defina GCS_BUCKET no .ocr_pipeline.env"

    mkdir -p "$dest"
    log "Baixando gs://$bucket/obras/$obra/ -> $dest/"

    if have gsutil; then
        retry 4 2 gsutil -m cp -r "gs://$bucket/obras/$obra/*" "$dest/"
    else
        retry 4 2 gcloud storage cp -r "gs://$bucket/obras/$obra/*" "$dest/"
    fi

    ok "Download concluido em $dest/"
}

cmd_all() {
    local pdf="" csv="" first="1" last="" outdir="" out=""
    local title="" author="Desconhecido" bucket="${GCS_BUCKET:-}"
    local make_epub=1

    while (( $# )); do
        case "$1" in
            --first)   first="$2";  shift 2 ;;
            --last)    last="$2";   shift 2 ;;
            --outdir)  outdir="$2"; shift 2 ;;
            --out)     out="$2";    shift 2 ;;
            --title)   title="$2";  shift 2 ;;
            --author)  author="$2"; shift 2 ;;
            --bucket)  bucket="$2"; shift 2 ;;
            --no-epub) make_epub=0; shift ;;
            -*)        die "Flag desconhecida: $1" ;;
            *)
                if   [[ -z "$pdf" ]]; then pdf="$1"
                elif [[ -z "$csv" ]]; then csv="$1"
                else die "Argumento extra: $1"
                fi
                shift ;;
        esac
    done

    [[ -n "$pdf" && -f "$pdf" ]] || die "Uso: $0 all <pdf> [csv_estrutura] [flags]"

    local slug; slug="$(slugify "$pdf")"
    outdir="${outdir:-ocr_${slug}}"
    out="${out:-${slug}.txt}"
    title="${title:-$slug}"

    log "==> Etapa 1/3: OCR"
    local ocr_args=( --first "$first" --outdir "$outdir" --out "$out" )
    [[ -n "$last" ]] && ocr_args+=(--last "$last")
    cmd_ocr "$pdf" "${ocr_args[@]}"

    if (( make_epub )); then
        if [[ -z "$csv" ]]; then
            warn "CSV nao informado. Gerando estrutura minima (1 capitulo por OCR)."
            csv="$outdir/estrutura_${slug}.csv"
            printf "pagina_inicio,titulo,nivel\n%s,%s,1\n" "$first" "$title" > "$csv"
        fi
        log "==> Etapa 2/3: EPUB"
        local epub_out="${slug}.epub"
        cmd_epub "$outdir/textos_paginas" "$csv" "$epub_out" \
            --title "$title" --author "$author"
    else
        warn "Pulando EPUB (--no-epub)"
    fi

    if [[ -n "$bucket" ]]; then
        log "==> Etapa 3/3: Upload Cloud Storage"
        local up_args=( --bucket "$bucket" --pdf "$pdf" --ocr-dir "$outdir" )
        [[ -n "${csv:-}" && -f "${csv:-}" ]] && up_args+=(--csv "$csv")
        [[ -f "${slug}.epub" ]] && up_args+=(--epub "${slug}.epub")
        cmd_upload "$slug" "${up_args[@]}"
    else
        warn "Sem GCS_BUCKET. Pulando upload."
    fi

    ok "Pipeline completo para $slug"
}

cmd_help() {
    awk '/^# ocr_automate/{p=1} p{print} /^set -euo/{exit}' "$0" | sed '$d'
}

# -----------------------------------------------------------------------------
# Dispatch
# -----------------------------------------------------------------------------
main() {
    local sub="${1:-help}"
    [[ $# -gt 0 ]] && shift || true

    case "$sub" in
        setup)     cmd_setup     "$@" ;;
        auth)      cmd_auth      "$@" ;;
        configure) cmd_configure "$@" ;;
        ocr)       cmd_ocr       "$@" ;;
        epub)      cmd_epub      "$@" ;;
        upload)    cmd_upload    "$@" ;;
        download)  cmd_download  "$@" ;;
        all)       cmd_all       "$@" ;;
        help|-h|--help) cmd_help ;;
        *) err "Comando desconhecido: $sub"; cmd_help; exit 1 ;;
    esac
}

main "$@"
