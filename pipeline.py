#!/usr/bin/env python3
"""Pipeline estilométrico: curador → extrator → sintetizador."""

import argparse
import json
import os
import sys
import time
from pathlib import Path

import anthropic

PROMPTS_DIR = Path(__file__).parent / "prompts"

MAX_TOKENS = {
    1: 16000,
    2: 8000,
    3: 10000,
}

DEFAULT_MODEL = "claude-sonnet-4-6"


def load_prompt(stage: int) -> str:
    names = {1: "stage1_curador.txt", 2: "stage2_extrator.txt", 3: "stage3_sintetizador.txt"}
    return (PROMPTS_DIR / names[stage]).read_text(encoding="utf-8")


def call_claude(
    client: anthropic.Anthropic,
    system_prompt: str,
    user_content: str,
    model: str,
    max_tokens: int,
    retries: int = 4,
) -> str:
    delay = 2
    last_error = None
    for attempt in range(retries + 1):
        try:
            response = client.messages.create(
                model=model,
                max_tokens=max_tokens,
                system=[
                    {
                        "type": "text",
                        "text": system_prompt,
                        "cache_control": {"type": "ephemeral"},
                    }
                ],
                messages=[{"role": "user", "content": user_content}],
            )
            return response.content[0].text
        except anthropic.RateLimitError as e:
            last_error = e
            if attempt < retries:
                print(f"    Rate limit — aguardando {delay}s...")
                time.sleep(delay)
                delay *= 2
        except anthropic.APIConnectionError as e:
            last_error = e
            if attempt < retries:
                print(f"    Erro de conexão — aguardando {delay}s...")
                time.sleep(delay)
                delay *= 2
    raise last_error


def parse_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        start = 1
        end = len(lines) - 1 if lines[-1].strip() == "```" else len(lines)
        text = "\n".join(lines[start:end])
    return json.loads(text)


def save_json(data: dict, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"    → {path}")


def stage1(client, prompt, txt_path: Path, author: str, tipo_de_persona: str, model: str) -> dict:
    text = txt_path.read_text(encoding="utf-8")
    header = f"tipo_de_persona: {tipo_de_persona}\nauthor: {author}\n\n---\n\n"
    raw = call_claude(client, prompt, header + text, model, MAX_TOKENS[1])
    return parse_json(raw)


def stage2(client, prompt, s1: dict, model: str) -> dict:
    raw = call_claude(client, prompt, json.dumps(s1, ensure_ascii=False), model, MAX_TOKENS[2])
    return parse_json(raw)


def _build_stage3_input(s2_list: list[dict], s1_list: list[dict]) -> str:
    dnas = []
    for s2 in s2_list:
        dnas.append({k: v for k, v in s2.items() if k not in ("_scratchpad", "paragrafos_ancora")})

    corpus_meta = [
        {
            "composicao_do_corpus": s1.get("composicao_do_corpus"),
            "finalidade_downstream": s1.get("finalidade_downstream"),
            "tamanho_amostra_confianca": s1.get("tamanho_amostra_confianca"),
            "cobertura_funcional_proporcoes": s1.get("cobertura_funcional_proporcoes"),
            "lacunas_funcionais": s1.get("lacunas_funcionais"),
        }
        for s1 in s1_list
    ]

    return json.dumps(
        {"dna_fontes": dnas, "corpus_meta_direto": corpus_meta},
        ensure_ascii=False,
    )


def stage3(client, prompt, s2_list: list[dict], s1_list: list[dict], model: str) -> dict:
    raw = call_claude(client, prompt, _build_stage3_input(s2_list, s1_list), model, MAX_TOKENS[3])
    return parse_json(raw)


def load_existing(path: Path) -> dict | None:
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return None


def main():
    parser = argparse.ArgumentParser(
        description="Pipeline estilométrico: curador → extrator → sintetizador",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemplos:
  python pipeline.py                          # pipeline completo em textos/
  python pipeline.py --stages 1 2             # só curador + extrator
  python pipeline.py --resume                 # pula arquivos já processados
  python pipeline.py --tipo interseção_de_escola --model claude-opus-4-7
        """,
    )
    parser.add_argument("--input", default="textos", metavar="DIR",
                        help="Diretório com .txt (um arquivo por autor)")
    parser.add_argument("--output", default="saida", metavar="DIR",
                        help="Diretório de saída (default: saida/)")
    parser.add_argument("--stages", nargs="+", type=int, choices=[1, 2, 3], default=[1, 2, 3],
                        metavar="N", help="Estágios a executar (default: 1 2 3)")
    parser.add_argument("--tipo", default="interseção_de_escola",
                        choices=["interseção_de_escola", "híbrido_curatorial"],
                        dest="tipo_de_persona",
                        help="tipo_de_persona para o curador (default: interseção_de_escola)")
    parser.add_argument("--model", default=DEFAULT_MODEL,
                        help=f"Modelo Claude (default: {DEFAULT_MODEL})")
    parser.add_argument("--resume", action="store_true",
                        help="Pular arquivos cujos JSONs de saída já existem")
    args = parser.parse_args()

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Erro: variável ANTHROPIC_API_KEY não definida.", file=sys.stderr)
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)
    input_dir = Path(args.input)
    output_dir = Path(args.output)

    txt_files = sorted(input_dir.glob("*.txt"))
    if not txt_files and (1 in args.stages or 2 in args.stages):
        print(f"Nenhum arquivo .txt encontrado em '{input_dir}/'.", file=sys.stderr)
        sys.exit(1)

    prompts = {s: load_prompt(s) for s in args.stages}

    s1_map: dict[str, dict] = {}
    s2_map: dict[str, dict] = {}

    # ── Estágio 1 ─────────────────────────────────────────────────────────────
    if 1 in args.stages:
        print(f"\n=== Estágio 1 — Curador ({len(txt_files)} arquivo(s)) ===")
        for txt in txt_files:
            author = txt.stem
            out = output_dir / "stage1" / f"{author}.json"
            if args.resume and out.exists():
                print(f"  [{author}] já existe, pulando")
                s1_map[author] = load_existing(out)
                continue
            print(f"  [{author}] processando...")
            try:
                result = stage1(client, prompts[1], txt, author, args.tipo_de_persona, args.model)
                save_json(result, out)
                s1_map[author] = result
            except Exception as e:
                print(f"  ERRO [{author}] estágio 1: {e}", file=sys.stderr)
    else:
        for txt in txt_files:
            author = txt.stem
            existing = load_existing(output_dir / "stage1" / f"{author}.json")
            if existing:
                s1_map[author] = existing

    # ── Estágio 2 ─────────────────────────────────────────────────────────────
    if 2 in args.stages:
        authors_for_s2 = list(s1_map.keys()) if s1_map else [t.stem for t in txt_files]
        print(f"\n=== Estágio 2 — Extrator ({len(authors_for_s2)} fonte(s)) ===")
        for author in authors_for_s2:
            s1_data = s1_map.get(author) or load_existing(output_dir / "stage1" / f"{author}.json")
            if not s1_data:
                print(f"  [{author}] saída do estágio 1 não encontrada, pulando", file=sys.stderr)
                continue
            out = output_dir / "stage2" / f"{author}.json"
            if args.resume and out.exists():
                print(f"  [{author}] já existe, pulando")
                s2_map[author] = load_existing(out)
                continue
            print(f"  [{author}] processando...")
            try:
                result = stage2(client, prompts[2], s1_data, args.model)
                save_json(result, out)
                s2_map[author] = result
            except Exception as e:
                print(f"  ERRO [{author}] estágio 2: {e}", file=sys.stderr)
    else:
        for txt in txt_files:
            author = txt.stem
            existing = load_existing(output_dir / "stage2" / f"{author}.json")
            if existing:
                s2_map[author] = existing

    # ── Estágio 3 ─────────────────────────────────────────────────────────────
    if 3 in args.stages:
        if not s2_map:
            print("\nEstágio 3 ignorado: nenhum DNA do extrator disponível.", file=sys.stderr)
        else:
            n = len(s2_map)
            print(f"\n=== Estágio 3 — Sintetizador ({n} fonte(s)) ===")
            if n == 1:
                print("  Aviso: apenas 1 fonte — sem consenso real (DNA reembalado).")
            elif n == 2:
                print("  Aviso: apenas 2 fontes — base estreita para interseção.")
            out = output_dir / "stage3" / "persona.json"
            if args.resume and out.exists():
                print("  já existe, pulando")
            else:
                s2_list = list(s2_map.values())
                s1_list = [s1_map.get(a) or load_existing(output_dir / "stage1" / f"{a}.json")
                           for a in s2_map]
                s1_list = [s for s in s1_list if s is not None]
                try:
                    result = stage3(client, prompts[3], s2_list, s1_list, args.model)
                    save_json(result, out)
                except Exception as e:
                    print(f"  ERRO estágio 3: {e}", file=sys.stderr)

    print("\nPipeline concluído.")


if __name__ == "__main__":
    main()
