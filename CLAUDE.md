# CLAUDE.md — AI Assistant Guide for DEVRDG

## Project Overview

**DEVRDG** (Develop RDG) is a minimal Python command-line utility that converts JSON files into human-readable formatted text files. It supports arbitrary nesting depth through recursive flattening.

- **Language:** Python 3 (standard library only — no external dependencies)
- **Type:** Single-file CLI script
- **Locale:** Brazilian Portuguese (error messages, docstrings, and field names are in pt-BR)

---

## Repository Structure

```
DEVRDG/
├── json_to_txt.py   # Main converter script (only source file)
├── exemplo.json     # Sample input: 2 records with nested objects and arrays
├── exemplo.txt      # Expected output from running the converter on exemplo.json
├── conversas        # Large JSON export of conversation records (~93 items, 7.3 MB)
├── README.md        # Minimal project title placeholder
└── CLAUDE.md        # This file
```

There are no subdirectories, build systems, or package managers.

---

## Core Functionality

### `json_to_txt.py`

The single source file exposes two functions and a CLI entry point:

#### `flatten(obj, parent_key="", sep=".")`
Recursively flattens a nested dictionary/list into a list of `(key, value)` tuples.
- Nested dicts use dot notation: `endereco.rua`
- List elements use bracket notation: `telefones[0]`

#### `json_to_txt(input_path, output_path=None)`
Reads a JSON file and writes a formatted `.txt` file.
- If `output_path` is omitted, it replaces the input file extension with `.txt`
- For JSON arrays: each element becomes a numbered record block (`--- Registro N ---`) with 2-space-indented key-value lines
- For JSON objects: key-value pairs written directly, one per line
- Files are read/written with explicit `utf-8` encoding

#### CLI Usage

```bash
python json_to_txt.py <arquivo.json> [arquivo_saida.txt]
```

Example:
```bash
python json_to_txt.py exemplo.json          # outputs to exemplo.txt
python json_to_txt.py conversas output.txt  # explicit output path
```

---

## Output Format

For a JSON array input:
```
--- Registro 1 ---
  nome: João Silva
  endereco.rua: Rua das Flores, 123
  telefones[0]: 11999990000

--- Registro 2 ---
  nome: Maria Souza
```

For a JSON object input:
```
nome: João Silva
endereco.rua: Rua das Flores, 123
```

---

## Code Conventions

- **Docstrings:** Written in Brazilian Portuguese
- **Error messages:** Written in Brazilian Portuguese, printed to stdout, exit with `sys.exit(1)`
- **Encoding:** All file I/O uses `encoding="utf-8"` explicitly
- **Style:** No external linters configured; follow PEP 8
- **No type annotations** are used in the existing code — keep consistent when editing
- **No logging framework** — use `print()` for user-facing messages

---

## Testing

There is no formal test framework. Testing is example-based:

1. Run the converter on the sample file:
   ```bash
   python json_to_txt.py exemplo.json exemplo_test.txt
   ```
2. Compare output against `exemplo.txt` manually or with `diff`:
   ```bash
   diff exemplo.txt exemplo_test.txt
   ```

When adding functionality, update `exemplo.json` / `exemplo.txt` accordingly as the reference test pair.

---

## Development Workflow

### Making Changes

1. Edit `json_to_txt.py` directly — it is the only source file
2. Validate manually using the sample files
3. Commit with a clear, descriptive message

### Git Conventions

- Commits are **SSH-signed** automatically (configured globally for this environment)
- Branch naming: `claude/<description>-<session-id>` for AI-assisted work
- Use `git push -u origin <branch-name>` when pushing

### No Build Step

There is nothing to compile or install. Run the script directly with Python 3:
```bash
python3 json_to_txt.py ...
```

---

## Key Files for AI Assistants

| File | Purpose | When to modify |
|------|---------|----------------|
| `json_to_txt.py` | All application logic | Adding features, fixing bugs |
| `exemplo.json` | Reference input data | When input format changes |
| `exemplo.txt` | Reference expected output | After any output format changes |
| `conversas` | Real-world data export | Not typically modified; use as large test input |

---

## What This Project Does NOT Have

- No external Python dependencies (`requirements.txt` not needed)
- No web framework or API
- No database
- No automated test suite or CI/CD pipeline
- No Docker or containerization
- No environment variables or `.env` files
- No `setup.py` / `pyproject.toml` (not a distributable package)

If any of these are added in the future, update this file accordingly.
