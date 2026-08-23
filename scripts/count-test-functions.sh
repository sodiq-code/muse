#!/usr/bin/env bash
# ============================================================================
# Count test functions across the MUSE codebase.
# ----------------------------------------------------------------------------
# A "test function" is any `it(...)`, `test(...)`, or `it.skip/only/each(...)`
# call in `*.test.ts` / `*.spec.ts` files under tests/ or src/.
#
# Used by CI (.github/workflows/ci.yml) and surfaced in the README.
# Stdout: <integer count>   Stderr: human-readable summary
# ============================================================================
set -uo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

# Match test-function calls (it / test, incl. .only/.skip/.concurrent/.each).
COUNT_TEST_PATTERN='\b(it|test)(\.(only|skip|concurrent|each))?\s*\('

# Search only tests/ and src/ — avoids scanning node_modules/.next entirely.
COUNT=0
if command -v rg >/dev/null 2>&1; then
  # --no-ignore-vcs is OFF by default so .gitignore is respected; we also
  # scope the search to two directories for safety + speed.
  RESULT="$(rg -c --no-heading -e "$COUNT_TEST_PATTERN" \
              --glob '*.test.ts' --glob '*.spec.ts' \
              tests src 2>/dev/null || true)"
  if [ -n "$RESULT" ]; then
    COUNT="$(printf '%s\n' "$RESULT" | awk -F: '{s+=$2} END{print s+0}')"
  fi
else
  COUNT="$(grep -rE "$COUNT_TEST_PATTERN" \
            --include='*.test.ts' --include='*.spec.ts' \
            tests src 2>/dev/null | wc -l)"
fi

echo "$COUNT"
echo "MUSE test-function count: $COUNT" >&2
