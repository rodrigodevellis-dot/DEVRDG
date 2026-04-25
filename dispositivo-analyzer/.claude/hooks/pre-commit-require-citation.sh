#!/usr/bin/env bash
# .claude/hooks/pre-commit-require-citation.sh
# Triggered as PreCommit hook.
# Blocks commit if any interpretive module lacks a Foucauldian citation
# in its module docstring (CLAUDE.md convention).
#
# Exit code non-zero blocks the commit.

set -euo pipefail

INTERPRETIVE_DIRS=(
  "src/dispositivo/analysis"
  "src/dispositivo/reflexivity"
  "src/dispositivo/transversal"
)

# Citation patterns. Must appear within the first 30 lines of the file
# (where module docstrings live).
CITATION_PATTERNS=(
  "Vigiar e Punir"
  "Surveiller et Punir"
  "Discipline and Punish"
  "A Vontade de Saber"
  "La Volonté de Savoir"
  "Volonté de Savoir"
  "History of Sexuality"
  "Le jeu de Michel Foucault"
  "The Confession of the Flesh"
  "Sécurité, Territoire, Population"
  "Security, Territory, Population"
  "Naissance de la Biopolitique"
  "The Birth of Biopolitics"
  "Cf\\. Foucault"
  "Foucault \\("
)

VIOLATIONS=()

for dir in "${INTERPRETIVE_DIRS[@]}"; do
  if [[ ! -d "$dir" ]]; then
    continue
  fi

  while IFS= read -r file; do
    # Skip empty __init__.py and tests
    if [[ "$(basename "$file")" == "__init__.py" ]] || [[ "$(basename "$file")" == test_* ]]; then
      continue
    fi

    # Read first 30 lines (where module docstring lives)
    head_content=$(head -n 30 "$file" 2>/dev/null || echo "")
    found=0

    for pat in "${CITATION_PATTERNS[@]}"; do
      if echo "$head_content" | grep -E "$pat" > /dev/null; then
        found=1
        break
      fi
    done

    if [[ $found -eq 0 ]]; then
      VIOLATIONS+=("$file")
    fi
  done < <(find "$dir" -name "*.py" -type f 2>/dev/null)
done

if [[ ${#VIOLATIONS[@]} -gt 0 ]]; then
  echo "" >&2
  echo "═══════════════════════════════════════════════════════════════════" >&2
  echo "  BLOCKED by .claude/hooks/pre-commit-require-citation.sh" >&2
  echo "═══════════════════════════════════════════════════════════════════" >&2
  echo "" >&2
  echo "  The following interpretive modules lack a Foucauldian citation" >&2
  echo "  in their module docstring (first 30 lines):" >&2
  echo "" >&2
  for f in "${VIOLATIONS[@]}"; do
    echo "    - ${f}" >&2
  done
  echo "" >&2
  echo "  Add a 'Cf. <source>' line to the module docstring of each file." >&2
  echo "" >&2
  echo "  Example:" >&2
  echo '    """' >&2
  echo '    Strategic unit detection in dispositif networks." >&2
  echo "" >&2
  echo "    Cf. Vigiar e Punir, Parte III, "Os corpos dóceis" (1975)." >&2
  echo '    """' >&2
  echo "" >&2
  echo "  Accepted citation patterns include any of: Vigiar e Punir," >&2
  echo "  Surveiller et Punir, A Vontade de Saber, La Volonté de Savoir," >&2
  echo "  Le jeu de Michel Foucault, Sécurité Territoire Population," >&2
  echo "  Naissance de la Biopolitique, etc." >&2
  echo "═══════════════════════════════════════════════════════════════════" >&2
  echo "" >&2
  exit 1
fi

exit 0
