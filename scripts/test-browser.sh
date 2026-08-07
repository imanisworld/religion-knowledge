#!/usr/bin/env bash
set -euo pipefail

BROWSER=""
for candidate in google-chrome google-chrome-stable chromium chromium-browser; do
  if command -v "$candidate" >/dev/null 2>&1; then
    BROWSER="$candidate"
    break
  fi
done

if [[ -z "$BROWSER" ]]; then
  echo "No Chromium-family browser found on runner" >&2
  exit 1
fi

python3 -m http.server 8765 --bind 127.0.0.1 >/tmp/religion-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT

for _ in {1..30}; do
  if curl -fsS http://127.0.0.1:8765/app/index.html >/dev/null; then
    break
  fi
  sleep 0.2
done

"$BROWSER" \
  --headless \
  --disable-gpu \
  --no-sandbox \
  --hide-scrollbars \
  --window-size=390,844 \
  --virtual-time-budget=5000 \
  --dump-dom \
  http://127.0.0.1:8765/app/index.html \
  >/tmp/religion-app-dom.html \
  2>/tmp/religion-browser.log

if ! grep -Fq '<strong>1198</strong><span>Records</span>' /tmp/religion-app-dom.html; then
  echo "Rendered app did not show the expected 1,198 record count" >&2
  tail -100 /tmp/religion-browser.log >&2 || true
  exit 1
fi

if ! grep -Fq '<strong>650</strong><span>Review</span>' /tmp/religion-app-dom.html; then
  echo "Rendered app did not show the expected 650 review count" >&2
  tail -100 /tmp/religion-browser.log >&2 || true
  exit 1
fi

if grep -Eqi 'Uncaught|ReferenceError|TypeError|SyntaxError' /tmp/religion-browser.log; then
  echo "Browser log contains a JavaScript runtime error" >&2
  cat /tmp/religion-browser.log >&2
  exit 1
fi

python3 - <<'PY'
from pathlib import Path
html = Path('/tmp/religion-app-dom.html').read_text(encoding='utf-8', errors='replace')
if 'overflow-x' in html.lower():
    pass
print('BROWSER_SMOKE=PASS viewport=390x844 records=1198 review=650')
PY
