#!/usr/bin/env python3
"""Conversor de JSON para TXT."""

import json
import sys
import os


def flatten(obj, parent_key="", sep="."):
    """Achata um dicionário/lista aninhado em pares chave-valor simples."""
    items = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            items.extend(flatten(v, new_key, sep))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            new_key = f"{parent_key}[{i}]"
            items.extend(flatten(v, new_key, sep))
    else:
        items.append((parent_key, obj))
    return items


def json_to_txt(input_path, output_path=None):
    """Lê um arquivo JSON e gera um arquivo TXT com o conteúdo formatado."""
    if not os.path.isfile(input_path):
        print(f"Erro: arquivo '{input_path}' não encontrado.")
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Erro ao ler JSON: {e}")
            sys.exit(1)

    if output_path is None:
        base, _ = os.path.splitext(input_path)
        output_path = base + ".txt"

    lines = []

    if isinstance(data, list):
        for idx, item in enumerate(data):
            lines.append(f"--- Registro {idx + 1} ---")
            for key, value in flatten(item):
                lines.append(f"  {key}: {value}")
            lines.append("")
    elif isinstance(data, dict):
        for key, value in flatten(data):
            lines.append(f"{key}: {value}")
    else:
        lines.append(str(data))

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(f"Arquivo TXT gerado com sucesso: {output_path}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python json_to_txt.py <arquivo.json> [arquivo_saida.txt]")
        print("  <arquivo.json>        Caminho do arquivo JSON de entrada")
        print("  [arquivo_saida.txt]   Caminho do arquivo TXT de saída (opcional)")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    json_to_txt(input_file, output_file)
