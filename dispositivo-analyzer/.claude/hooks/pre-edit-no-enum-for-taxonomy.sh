#!/usr/bin/env bash
# .claude/hooks/pre-edit-no-enum-for-taxonomy.sh
# Triggered as PreToolUse hook on Edit/Write to *.py files.
# Blocks introducing Python enums for taxonomy types that should live
# in the database (CLAUDE.md Hard Rule #1).
#
# Exit code 2 blocks the tool call in Claude Code.

set -euo pipefail

FILE_PATH="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"
NEW_CONTENT="${CLAUDE_TOOL_INPUT_NEW_STRING:-}"

# Only check Python files
if [[ "$FILE_PATH" != *.py ]]; then
  exit 0
fi

# Patterns that indicate forbidden enum usage for taxonomies.
# Keep this list synced with CLAUDE.md Hard Rule #1.
TAXONOMY_TERMS=(
  "ElementType"
  "RelationType"
  "TipoElemento"
  "TipoRelacao"
  "DispositifType"
  "TipoDispositivo"
  "SilenceType"
  "TipoSilencio"
)

VIOLATIONS=()

for term in "${TAXONOMY_TERMS[@]}"; do
  # Match: class <Term>(...Enum...) or class <Term>(...IntEnum...) or StrEnum
  if echo "$NEW_CONTENT" | grep -E "class\s+${term}\s*\(.*(Enum|IntEnum|StrEnum|Flag).*\)" > /dev/null; then
    VIOLATIONS+=("$term")
  fi
done

if [[ ${#VIOLATIONS[@]} -gt 0 ]]; then
  echo "" >&2
  echo "═══════════════════════════════════════════════════════════════════" >&2
  echo "  BLOCKED by .claude/hooks/pre-edit-no-enum-for-taxonomy.sh" >&2
  echo "═══════════════════════════════════════════════════════════════════" >&2
  echo "" >&2
  echo "  The following classes use Python Enum for taxonomy types:" >&2
  for v in "${VIOLATIONS[@]}"; do
    echo "    - ${v}" >&2
  done
  echo "" >&2
  echo "  CLAUDE.md Hard Rule #1: Taxonomies are revisable from the" >&2
  echo "  database, not from code. Element types and relation types live" >&2
  echo "  in DB tables (element_types, relation_types)." >&2
  echo "" >&2
  echo "  Use literal string types or TypeAlias:" >&2
  echo "    ElementTypeName: TypeAlias = str  # validated against DB" >&2
  echo "" >&2
  echo "  If you genuinely need a Python enum here (e.g., for a value that" >&2
  echo "  is NOT user-revisable), document why in a comment and request" >&2
  echo "  user override before retrying." >&2
  echo "═══════════════════════════════════════════════════════════════════" >&2
  echo "" >&2
  exit 2
fi

exit 0
