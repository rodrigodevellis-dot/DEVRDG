#!/usr/bin/env bash
# .claude/hooks/post-edit-mypy-strict.sh
# Triggered as PostToolUse hook on Edit/Write to *.py files.
# Runs mypy --strict on the edited file and reports issues.
# Does NOT block (exit 0 even on errors); alerts only.

set -uo pipefail

FILE_PATH="${CLAUDE_TOOL_INPUT_FILE_PATH:-}"

# Only check Python source files in src/ and tests/
if [[ "$FILE_PATH" != *.py ]]; then
  exit 0
fi

if [[ "$FILE_PATH" != src/* ]] && [[ "$FILE_PATH" != tests/* ]]; then
  exit 0
fi

# Skip if mypy is not installed
if ! command -v mypy &> /dev/null; then
  echo "  [post-edit hook] mypy not installed; skipping type check." >&2
  exit 0
fi

# Run mypy --strict on the file. Capture output.
MYPY_OUTPUT=$(mypy --strict "$FILE_PATH" 2>&1 || true)

# If mypy found errors, alert (but do not block)
if echo "$MYPY_OUTPUT" | grep -q "error:"; then
  echo "" >&2
  echo "─────────────────────────────────────────────────────────────────" >&2
  echo "  ⚠️  mypy --strict reported errors in ${FILE_PATH}" >&2
  echo "─────────────────────────────────────────────────────────────────" >&2
  echo "$MYPY_OUTPUT" >&2
  echo "─────────────────────────────────────────────────────────────────" >&2
  echo "  This is a non-blocking alert. Fix before committing." >&2
  echo "─────────────────────────────────────────────────────────────────" >&2
  echo "" >&2
fi

exit 0
