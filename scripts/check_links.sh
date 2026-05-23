#!/usr/bin/env bash
# Check that all external URLs across pythia-studio HTML files return a valid HTTP status.
# Usage: ./check_links.sh
# Requires: curl

set -euo pipefail

DIR="$(dirname "$0")"
TIMEOUT=12
FAIL=0

urls=$(grep -rhoE 'https?://[a-zA-Z0-9._~:/?#\[\]@!$&'"'"'()*+,;=%-]+' "$DIR"/../tools/*.html \
  | sort -u \
  | grep -v 'fonts\.googleapis\|fonts\.gstatic\|cdn\.jsdelivr\|githubusercontent\.com/googlefonts\|hfg-gmuend\|twemoji\|microlink\.io')

total=$(echo "$urls" | wc -l | tr -d ' ')

echo "Checking $total unique URLs across pythia-studio HTML files…"
echo ""

while IFS= read -r url; do
  status=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time "$TIMEOUT" "$url" 2>/dev/null || echo "ERR")
  if [[ "$status" =~ ^(200|301|302|303|307|308)$ ]]; then
    printf "  ✅  %s  %s\n" "$status" "$url"
  else
    printf "  ❌  %s  %s\n" "$status" "$url"
    FAIL=$((FAIL + 1))
  fi
done <<< "$urls"

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "All $total links OK."
else
  echo "$FAIL/$total link(s) failed."
  exit 1
fi
