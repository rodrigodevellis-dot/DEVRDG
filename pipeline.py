#!/usr/bin/env python3
"""Pipeline estilométrico: curador → extrator → sintetizador → gerador/revisor."""

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
    2: 16000,
    3: 16000,
    "4g": 8000,
    "4r": 8000,
}

DEFAULT_MODEL = "claude-sonnet-4-6"


def load_prompt(stage) -> str:
    names = {
        1: "stage1_curador.txt",
        2: "stage2_extrator.txt",
        3: "stage3_sintetizador.txt",
        "4g": "stage4_gerador.txt",
        "4r": "stage4_revisor.txt",
    }
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
            if response.stop_reason == "max_tokens":
                raise RuntimeError(
                    f"Resposta truncada (max_tokens={max_tokens} atingido). "
                    "Aumente o limite em MAX_TOKENS para este estágio."
                )
            return response.content[0].text
        except anthropic.RateLimitError as e:
            last_error = e
            if attempt < retries:
                print(f"    Rate limit — aguardando {delay}s...")
                time.sleep(delay)
                delay *= 2
        except anthropic.APIStatusError as e:
            if e.status_code >= 500:
                last_error = e
                if attempt < retries:
                    print(f"    Erro do servidor ({e.status_code}) — aguardando {delay}s...")
                    time.sleep(delay)
                    delay *= 2
            else:
                raise
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
        # Find the closing fence anywhere in the remaining lines (not just last)
        close = next(
            (i for i in range(len(lines) - 1, 0, -1) if lines[i].strip() == "```"),
            None,
        )
        start = 1
        end = close if close is not None else len(lines)
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


def _clean_persona(persona: dict) -> dict:
    """Remove campos que não devem chegar ao Estágio 4."""
    return {k: v for k, v in persona.items() if k not in ("_scratchpad", "exemplares_sinteticos")}


def stage4_gerar(client, prompt, persona: dict, briefing: dict, model: str) -> dict:
    payload = json.dumps(
        {"persona": _clean_persona(persona), "briefing": briefing},
        ensure_ascii=False,
    )
    raw = call_claude(client, prompt, payload, model, MAX_TOKENS["4g"])
    return parse_json(raw)


def stage4_revisar(client, prompt, persona: dict, revisao: dict, model: str) -> dict:
    payload = json.dumps(
        {"persona": _clean_persona(persona), "revisao": revisao},
        ensure_ascii=False,
    )
    raw = call_claude(client, prompt, payload, model, MAX_TOKENS["4r"])
    return parse_json(raw)


def load_existing(path: Path) -> dict | None:
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return None


def cmd_pipeline(args, client):
    """Subcomando padrão: roda os estágios 1-3."""
    input_dir = Path(args.input)
    output_dir = Path(args.output)

    txt_files = sorted(input_dir.glob("*.txt"))
    if not txt_files and (1 in args.stages or 2 in args.stages):
        print(f"Nenhum arquivo .txt encontrado em '{input_dir}/'.", file=sys.stderr)
        sys.exit(1)

    prompts = {s: load_prompt(s) for s in args.stages}

    s1_map: dict[str, dict] = {}
    s2_map: dict[str, dict] = {}

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
                paired = [
                    (s2_map[a], s1_map.get(a) or load_existing(output_dir / "stage1" / f"{a}.json"))
                    for a in s2_map
                ]
                paired = [(s2, s1) for s2, s1 in paired if s1 is not None]
                if not paired:
                    print("  Estágio 3 ignorado: nenhum par DNA+metadata disponível.", file=sys.stderr)
                    paired = []
                elif len(paired) < len(s2_map):
                    missing = len(s2_map) - len(paired)
                    print(f"  Aviso: {missing} autor(es) sem stage1 JSON — excluídos da síntese.")
                s2_list = [s2 for s2, _ in paired]
                s1_list = [s1 for _, s1 in paired]
                try:
                    result = stage3(client, prompts[3], s2_list, s1_list, args.model)
                    save_json(result, out)
                except Exception as e:
                    print(f"  ERRO estágio 3: {e}", file=sys.stderr)

    print("\nPipeline concluído.")


def cmd_gerar(args, client):
    """Subcomando: gera texto a partir de uma persona."""
    persona_path = Path(args.persona)
    if not persona_path.exists():
        print(f"Erro: persona não encontrada em '{persona_path}'.", file=sys.stderr)
        sys.exit(1)

    persona = json.loads(persona_path.read_text(encoding="utf-8"))

    briefing = {
        "tema": args.tema,
        "extensao_alvo": args.extensao or "400-600 palavras",
        "categoria_funcional_dominante": args.categoria or "livre",
        "instrucoes_adicionais": args.instrucoes or "",
    }

    output_path = Path(args.output)
    if args.resume and output_path.exists():
        print(f"Já existe, pulando: {output_path}")
        return

    print(f"\n=== Estágio 4-G — Gerador ===")
    print(f"  Tema: {args.tema}")
    prompt = load_prompt("4g")
    try:
        result = stage4_gerar(client, prompt, persona, briefing, args.model)
        save_json(result, output_path)
    except Exception as e:
        print(f"  ERRO: {e}", file=sys.stderr)
        sys.exit(1)

    print("\nGeração concluída.")


def cmd_revisar(args, client):
    """Subcomando: revisa texto existente segundo uma persona."""
    persona_path = Path(args.persona)
    if not persona_path.exists():
        print(f"Erro: persona não encontrada em '{persona_path}'.", file=sys.stderr)
        sys.exit(1)

    texto_path = Path(args.texto)
    if not texto_path.exists():
        print(f"Erro: texto não encontrado em '{texto_path}'.", file=sys.stderr)
        sys.exit(1)

    persona = json.loads(persona_path.read_text(encoding="utf-8"))
    texto_original = texto_path.read_text(encoding="utf-8")

    revisao = {
        "texto_original": texto_original,
        "nivel_de_intervencao": args.nivel,
        "preservar_intacto": args.preservar or [],
        "instrucoes_adicionais": args.instrucoes or "",
    }

    output_path = Path(args.output)
    if args.resume and output_path.exists():
        print(f"Já existe, pulando: {output_path}")
        return

    print(f"\n=== Estágio 4-R — Revisor ===")
    print(f"  Nível: {args.nivel}")
    prompt = load_prompt("4r")
    try:
        result = stage4_revisar(client, prompt, persona, revisao, args.model)
        save_json(result, output_path)
    except Exception as e:
        print(f"  ERRO: {e}", file=sys.stderr)
        sys.exit(1)

    print("\nRevisão concluída.")


def main():
    parser = argparse.ArgumentParser(
        description="Pipeline estilométrico: curador → extrator → sintetizador → gerador/revisor",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--model", default=DEFAULT_MODEL,
                        help=f"Modelo Claude (default: {DEFAULT_MODEL})")
    parser.add_argument("--resume", action="store_true",
                        help="Pular arquivos cujos JSONs de saída já existem")

    sub = parser.add_subparsers(dest="cmd", required=True)

    # ── subcomando: pipeline ───────────────────────────────────────────────────
    p_pipe = sub.add_parser("pipeline", help="Roda os estágios 1-3 (curador→extrator→sintetizador)")
    p_pipe.add_argument("--input", default="textos", metavar="DIR")
    p_pipe.add_argument("--output", default="saida", metavar="DIR")
    p_pipe.add_argument("--stages", nargs="+", type=int, choices=[1, 2, 3], default=[1, 2, 3], metavar="N")
    p_pipe.add_argument("--tipo", default="interseção_de_escola",
                        choices=["interseção_de_escola", "híbrido_curatorial"],
                        dest="tipo_de_persona")

    # ── subcomando: gerar ──────────────────────────────────────────────────────
    p_gen = sub.add_parser("gerar", help="Gera texto original a partir de uma persona (4-G)")
    p_gen.add_argument("--persona", default="saida/stage3/persona.json",
                       help="Caminho para o JSON da persona (default: saida/stage3/persona.json)")
    p_gen.add_argument("--tema", required=True, help="Tema ou título do texto a gerar")
    p_gen.add_argument("--extensao", default="400-600 palavras", metavar="FAIXA",
                       help="Faixa de extensão (default: '400-600 palavras')")
    p_gen.add_argument("--categoria", default="livre",
                       choices=["abertura","desenvolvimento","transicao","fechamento",
                                "definicao","exemplo","qualificacao","livre"],
                       help="Categoria funcional dominante (default: livre)")
    p_gen.add_argument("--instrucoes", default="", metavar="TEXTO",
                       help="Instruções adicionais para o gerador")
    p_gen.add_argument("--output", default="saida/stage4/gerado.json", metavar="ARQUIVO")

    # ── subcomando: revisar ────────────────────────────────────────────────────
    p_rev = sub.add_parser("revisar", help="Revisa texto existente segundo uma persona (4-R)")
    p_rev.add_argument("--persona", default="saida/stage3/persona.json",
                       help="Caminho para o JSON da persona (default: saida/stage3/persona.json)")
    p_rev.add_argument("--texto", required=True, metavar="ARQUIVO",
                       help="Arquivo .txt com o texto a revisar")
    p_rev.add_argument("--nivel", default="medio",
                       choices=["leve", "medio", "profundo"],
                       help="Nível de intervenção (default: medio)")
    p_rev.add_argument("--preservar", nargs="*", default=[], metavar="TRECHO",
                       help="Trechos literais que não devem ser alterados")
    p_rev.add_argument("--instrucoes", default="", metavar="TEXTO",
                       help="Instruções adicionais para o revisor")
    p_rev.add_argument("--output", default="saida/stage4/revisado.json", metavar="ARQUIVO")

    args = parser.parse_args()

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Erro: variável ANTHROPIC_API_KEY não definida.", file=sys.stderr)
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    if args.cmd == "pipeline":
        cmd_pipeline(args, client)
    elif args.cmd == "gerar":
        cmd_gerar(args, client)
    elif args.cmd == "revisar":
        cmd_revisar(args, client)


if __name__ == "__main__":
    main()
