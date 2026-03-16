#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$ROOT/ugc"

cd "$APP_DIR"

rm -rf .next

start_port=3000
max_tries=50
port="$start_port"

is_port_in_use() {
  nc -z 127.0.0.1 "$1" >/dev/null 2>&1
}

for ((i = 0; i < max_tries; i++)); do
  if is_port_in_use "$port"; then
    port=$((port + 1))
    continue
  fi
  break
done

if is_port_in_use "$port"; then
  echo "ERROR: Could not find a free port starting at ${start_port}." >&2
  exit 1
fi

url="http://localhost:${port}"
echo ""
echo "========================================"
echo "Dev server URL: ${url}"
echo "Opening: ${url}/login"
echo "========================================"
echo ""

if command -v open >/dev/null 2>&1; then
  (
    for _ in {1..120}; do
      if is_port_in_use "$port"; then
        open "${url}/login" >/dev/null 2>&1 || true
        exit 0
      fi
      sleep 0.25
    done
  ) &
fi

npm run dev -- -p "$port"
