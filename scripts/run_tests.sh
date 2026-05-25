#!/usr/bin/env bash
# Run visual regression tests across all three browsers.
# First run: creates baselines in tests/snapshots/ (tests are skipped, not failed).
# Subsequent runs: compares against baselines.
#
# Usage:
#   ./scripts/run_tests.sh            # run all browsers
#   ./scripts/run_tests.sh --update   # overwrite baselines with current screenshots
#
# Requires: pip install -r tests/requirements.txt && playwright install

set -euo pipefail
cd "$(dirname "$0")/.."

UPDATE=0
[[ "${1:-}" == "--update" ]] && UPDATE=1

if [[ "$UPDATE" -eq 1 ]]; then
  echo "Deleting existing baselines…"
  rm -rf tests/snapshots
fi

ARGS=(tests/ --browser chromium --browser firefox --browser webkit -v "$@")

if command -v pytest &>/dev/null; then
  pytest "${ARGS[@]}"
else
  conda run -n pinky-studio pytest "${ARGS[@]}"
fi
