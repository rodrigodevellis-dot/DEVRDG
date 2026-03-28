#!/usr/bin/env python3
"""
Extrator de artigos do The New Yorker por seção editorial.

Uso:
    python newyorker_extractor.py --url <URL_DO_ARTIGO>
    python newyorker_extractor.py --secao <NOME_DA_SECAO> [--limite N]
    python newyorker_extractor.py --listar-secoes
"""

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass, field, asdict
from datetime import datetime
from urllib.parse import urlparse

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Dependências necessárias não encontradas.")
    print("Instale com: pip install requests beautifulsoup4")
    sys.exit(1)


# ---------------------------------------------------------------------------
# Configuração das seções
# ---------------------------------------------------------------------------

SECOES = {
    "news": {
        "nome": "News",
        "url_base": "https://www.newyorker.com/news",
        "subsecoes": ["daily-comment", "news-desk", "our-columnists", "the-news"],
    },
    "culture": {
        "nome": "Culture",
        "url_base": "https://www.newyorker.com/culture",
        "subsecoes": ["cultural-comment", "culture-desk", "persons-of-interest"],
    },
    "books": {
        "nome": "Books & Culture",
        "url_base": "https://www.newyorker.com/books",
        "subsecoes": ["page-turner", "book-reviews", "second-read", "under-review"],
    },
    "fiction": {
        "nome": "Fiction & Poetry",
        "url_base": "https://www.newyorker.com/fiction-and-poetry",
        "subsecoes": ["fiction", "poetry", "flash-fiction"],
    },
    "humor": {
        "nome": "Humor & Cartoons",
        "url_base": "https://www.newyorker.com/humor",
        "subsecoes": [
            "daily-shouts",
            "shouts-and-murmurs",
            "daily-cartoon",
            "borowitz-report",
        ],
    },
    "critics": {
        "nome": "The Critics",
        "url_base": "https://www.newyorker.com/magazine/critics",
        "subsecoes": [
            "a-critic-at-large",
            "the-art-world",
            "books",
            "the-current-cinema",
            "musical-events",
            "the-theatre",
            "on-television",
            "tables-for-two",
        ],
    },
    "magazine": {
        "nome": "Magazine",
        "url_base": "https://www.newyorker.com/magazine",
        "subsecoes": [
            "talk-of-the-town",
            "profiles",
            "annals",
            "reporting",
            "letter-from",
            "comment",
        ],
    },
    "science": {
        "nome": "Science & Tech",
        "url_base": "https://www.newyorker.com/tech",
        "subsecoes": ["annals-of-technology", "elements"],
    },
    "goings-on": {
        "nome": "Goings On About Town",
        "url_base": "https://www.newyorker.com/goings-on-about-town",
        "subsecoes": ["art", "movies", "music", "theatre", "night-life", "food-and-drink"],
    },
    "podcasts": {
        "nome": "Podcasts & Video",
        "url_base": "https://www.newyorker.com/podcast",
        "subsecoes": [
            "the-new-yorker-radio-hour",
            "fiction-podcast",
            "poetry-podcast",
            "politics-and-more",
            "the-writers-voice",
        ],
    },
}

OUTPUT_DIR = "output"
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


# ---------------------------------------------------------------------------
# Dataclasses
# ---------------------------------------------------------------------------

@dataclass
class Imagem:
    url: str = ""
    legenda: str = ""
    credito: str = ""


@dataclass
class Artigo:
    secao: str = ""
    titulo: str = ""
    subtitulo: str = ""
    autor: str = ""
    data_publicacao: str = ""
    url: str = ""
    tags: list = field(default_factory=list)
    resumo: str = ""
    corpo: str = ""
    imagens: list = field(default_factory=list)
    metadata: dict = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Funções de extração
# ---------------------------------------------------------------------------

def detectar_secao(url: str) -> str:
    """Detecta a seção a partir da URL do artigo."""
    path = urlparse(url).path.lower()

    mapa = {
        "/news/": "news",
        "/culture/": "culture",
        "/books/": "books",
        "/fiction-and-poetry/": "fiction",
        "/fiction/": "fiction",
        "/poetry/": "fiction",
        "/humor/": "humor",
        "/cartoons/": "humor",
        "/magazine/critics/": "critics",
        "/magazine/": "magazine",
        "/tech/": "science",
        "/science/": "science",
        "/goings-on-about-town/": "goings-on",
        "/podcast/": "podcasts",
        "/video/": "podcasts",
    }

    # Tentar match mais específico primeiro (critics antes de magazine)
    for prefixo in sorted(mapa, key=len, reverse=True):
        if prefixo in path:
            return mapa[prefixo]

    return "magazine"  # fallback


def extrair_artigo(url: str, secao_override: str = None) -> Artigo:
    """Extrai um artigo do The New Yorker a partir da URL."""
    print(f"Extraindo: {url}")

    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    artigo = Artigo(url=url)

    # Seção
    secao_key = secao_override or detectar_secao(url)
    secao_info = SECOES.get(secao_key, {})
    artigo.secao = secao_info.get("nome", secao_key)

    # Título
    tag_titulo = soup.find("h1")
    if tag_titulo:
        artigo.titulo = tag_titulo.get_text(strip=True)

    # Subtítulo / dek
    dek = soup.find("div", class_=re.compile(r"dek|subtitle|sub-heading", re.I))
    if not dek:
        dek = soup.find("h2")
    if dek:
        artigo.subtitulo = dek.get_text(strip=True)

    # Autor
    autor_tag = soup.find("a", class_=re.compile(r"byline|author", re.I))
    if not autor_tag:
        autor_tag = soup.find("span", class_=re.compile(r"byline|author", re.I))
    if autor_tag:
        artigo.autor = autor_tag.get_text(strip=True).replace("By ", "")

    # Data de publicação
    time_tag = soup.find("time")
    if time_tag:
        dt_str = time_tag.get("datetime", "") or time_tag.get_text(strip=True)
        artigo.data_publicacao = dt_str[:10]  # YYYY-MM-DD

    # Tags
    tags_container = soup.find_all("a", class_=re.compile(r"tag", re.I))
    artigo.tags = [t.get_text(strip=True) for t in tags_container]

    # Corpo do artigo
    corpo_div = soup.find("div", class_=re.compile(r"body|article-body|content-body", re.I))
    if not corpo_div:
        corpo_div = soup.find("article")

    if corpo_div:
        paragrafos = corpo_div.find_all("p")
        artigo.corpo = "\n\n".join(p.get_text(strip=True) for p in paragrafos if p.get_text(strip=True))

        # Resumo = primeiros 2-3 parágrafos
        textos = [p.get_text(strip=True) for p in paragrafos if p.get_text(strip=True)]
        artigo.resumo = " ".join(textos[:3])[:500]

    # Imagens
    for img in soup.find_all("figure"):
        imagem = Imagem()
        img_tag = img.find("img")
        if img_tag:
            imagem.url = img_tag.get("src", "") or img_tag.get("data-src", "")
        caption = img.find("figcaption")
        if caption:
            credito_tag = caption.find("span", class_=re.compile(r"credit", re.I))
            if credito_tag:
                imagem.credito = credito_tag.get_text(strip=True)
                credito_tag.decompose()
            imagem.legenda = caption.get_text(strip=True)
        artigo.imagens.append(asdict(imagem))

    # Metadata específica por seção
    artigo.metadata = extrair_metadata(soup, secao_key, artigo)

    return artigo


def extrair_metadata(soup: BeautifulSoup, secao: str, artigo: Artigo) -> dict:
    """Extrai metadados específicos de cada seção."""
    meta = {"subsecao_detectada": ""}

    # Tentar detectar subsection do breadcrumb ou URL
    breadcrumb = soup.find("nav", class_=re.compile(r"breadcrumb", re.I))
    if breadcrumb:
        links = breadcrumb.find_all("a")
        if links:
            meta["subsecao_detectada"] = links[-1].get_text(strip=True)

    if secao == "news":
        meta.update({
            "pessoas_mencionadas": [],
            "locais_mencionados": [],
            "contexto_temporal": "",
        })

    elif secao == "books":
        meta.update({
            "livro_resenhado": {
                "titulo": "",
                "autor": "",
                "editora": "",
                "genero": "",
            },
            "avaliacao_geral": "",
        })

    elif secao == "fiction":
        meta.update({
            "tipo": "Conto" if "fiction" in artigo.url else "Poema",
            "temas": [],
            "nota_do_autor": "",
        })

    elif secao == "humor":
        meta.update({
            "formato": "",
            "alvo_satirico": "",
            "cartunista": "",
        })

    elif secao == "critics":
        meta.update({
            "critico": artigo.autor,
            "obra_criticada": {"titulo": "", "criador": "", "tipo": ""},
            "avaliacao": "",
        })

    elif secao == "magazine":
        meta.update({
            "edicao": artigo.data_publicacao,
            "tipo_reportagem": "",
            "fontes_citadas": [],
        })

    elif secao == "science":
        meta.update({
            "area_cientifica": "",
            "estudos_citados": [],
            "conceitos_tecnicos": [],
        })

    elif secao == "goings-on":
        meta.update({
            "evento": {
                "nome": artigo.titulo,
                "local": "",
                "endereco": "",
                "datas": "",
                "preco": "",
            },
        })

    elif secao == "podcasts":
        meta.update({
            "tipo_midia": "Podcast" if "podcast" in artigo.url else "Vídeo",
            "duracao": "",
            "participantes": [],
        })

    return meta


def listar_artigos_secao(secao: str, limite: int = 10) -> list:
    """Lista URLs de artigos recentes de uma seção."""
    info = SECOES.get(secao)
    if not info:
        print(f"Seção '{secao}' não encontrada.")
        return []

    url = info["url_base"]
    print(f"Buscando artigos em: {url}")

    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    urls = []

    for link in soup.find_all("a", href=True):
        href = link["href"]
        if not href.startswith("http"):
            href = f"https://www.newyorker.com{href}"

        parsed = urlparse(href)
        if parsed.netloc == "www.newyorker.com" and len(parsed.path.split("/")) >= 4:
            if href not in urls and not href.endswith(info["url_base"].replace("https://www.newyorker.com", "")):
                urls.append(href)

        if len(urls) >= limite:
            break

    return urls


def salvar_artigo(artigo: Artigo) -> str:
    """Salva o artigo extraído como JSON."""
    secao_slug = artigo.secao.lower().replace(" & ", "-").replace(" ", "-")
    dir_saida = os.path.join(OUTPUT_DIR, secao_slug)
    os.makedirs(dir_saida, exist_ok=True)

    titulo_slug = re.sub(r"[^\w\s-]", "", artigo.titulo.lower())
    titulo_slug = re.sub(r"[\s]+", "-", titulo_slug)[:60]

    data = artigo.data_publicacao or datetime.now().strftime("%Y-%m-%d")
    nome_arquivo = f"{data}_{titulo_slug}.json"
    caminho = os.path.join(dir_saida, nome_arquivo)

    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(asdict(artigo), f, ensure_ascii=False, indent=2)

    print(f"Salvo em: {caminho}")
    return caminho


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Extrator de artigos do The New Yorker por seção editorial."
    )
    parser.add_argument("--url", help="URL de um artigo específico para extrair")
    parser.add_argument(
        "--secao",
        choices=list(SECOES.keys()),
        help="Seção para listar e extrair artigos",
    )
    parser.add_argument(
        "--limite",
        type=int,
        default=10,
        help="Número máximo de artigos a extrair por seção (padrão: 10)",
    )
    parser.add_argument(
        "--listar-secoes",
        action="store_true",
        help="Listar todas as seções disponíveis",
    )
    parser.add_argument(
        "--apenas-urls",
        action="store_true",
        help="Apenas listar URLs sem extrair conteúdo",
    )
    parser.add_argument(
        "--saida",
        default=OUTPUT_DIR,
        help=f"Diretório de saída (padrão: {OUTPUT_DIR})",
    )

    args = parser.parse_args()
    global OUTPUT_DIR
    OUTPUT_DIR = args.saida

    if args.listar_secoes:
        print("\nSeções disponíveis:\n")
        print(f"{'Slug':<15} {'Nome':<25} {'URL Base'}")
        print("-" * 75)
        for slug, info in SECOES.items():
            print(f"{slug:<15} {info['nome']:<25} {info['url_base']}")
            for sub in info["subsecoes"]:
                print(f"  └─ {sub}")
        return

    if args.url:
        artigo = extrair_artigo(args.url, secao_override=args.secao)
        caminho = salvar_artigo(artigo)
        print(f"\nArtigo extraído com sucesso!")
        print(f"Título: {artigo.titulo}")
        print(f"Autor: {artigo.autor}")
        print(f"Seção: {artigo.secao}")
        print(f"Arquivo: {caminho}")
        return

    if args.secao:
        urls = listar_artigos_secao(args.secao, args.limite)
        if not urls:
            print("Nenhum artigo encontrado.")
            return

        print(f"\n{len(urls)} artigos encontrados:\n")

        if args.apenas_urls:
            for u in urls:
                print(f"  {u}")
            return

        for url in urls:
            try:
                artigo = extrair_artigo(url, secao_override=args.secao)
                salvar_artigo(artigo)
            except Exception as e:
                print(f"Erro ao extrair {url}: {e}")

        print(f"\nExtração concluída! Verifique a pasta '{OUTPUT_DIR}/'.")
        return

    parser.print_help()


if __name__ == "__main__":
    main()
