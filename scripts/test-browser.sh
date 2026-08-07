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

SMOKE_PAGE="app/.browser-smoke.html"
python3 - <<'PY'
from pathlib import Path
source = Path('app/index.html').read_text(encoding='utf-8')
injection = '''<script>
setTimeout(() => {
  const firstRecord = document.querySelector('[data-record-id]');
  if (firstRecord) firstRecord.click();
}, 0);
</script>'''
if '</body>' not in source:
    raise SystemExit('app/index.html is missing </body>')
Path('app/.browser-smoke.html').write_text(source.replace('</body>', injection + '\n</body>'), encoding='utf-8')
PY

python3 -m http.server 8765 --bind 127.0.0.1 >/tmp/religion-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true; rm -f "$SMOKE_PAGE"' EXIT

READY=0
for _ in {1..30}; do
  if curl -fsS http://127.0.0.1:8765/app/.browser-smoke.html >/dev/null 2>&1; then
    READY=1
    break
  fi
  sleep 0.2
done

if [[ "$READY" -ne 1 ]]; then
  echo "Static test server did not become ready" >&2
  cat /tmp/religion-http.log >&2 || true
  exit 1
fi

"$BROWSER" \
  --headless \
  --disable-gpu \
  --no-sandbox \
  --hide-scrollbars \
  --window-size=390,844 \
  --virtual-time-budget=5000 \
  --dump-dom \
  http://127.0.0.1:8765/app/.browser-smoke.html \
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

if ! grep -Fq 'id="view-positions"' /tmp/religion-app-dom.html; then
  echo "Position History view was not injected before app initialization" >&2
  exit 1
fi

if ! grep -Fq 'No explicit positions yet' /tmp/religion-app-dom.html; then
  echo "Position History did not fail closed when no MY_POSITION records exist" >&2
  exit 1
fi

if ! grep -Fq 'data-go="positions"' /tmp/religion-app-dom.html; then
  echo "Position History navigation control is missing" >&2
  exit 1
fi

if ! grep -Fq 'data-original-source-link="true"' /tmp/religion-app-dom.html; then
  echo "Opening a record did not render an original-source link" >&2
  tail -100 /tmp/religion-app-dom.html >&2 || true
  exit 1
fi

SOURCE_HREF="$(python3 - <<'PY'
import re
from pathlib import Path
html = Path('/tmp/religion-app-dom.html').read_text(encoding='utf-8', errors='replace')
match = re.search(r'<a[^>]*href="([^"]+)"[^>]*data-original-source-link="true"', html)
if not match:
    match = re.search(r'<a[^>]*data-original-source-link="true"[^>]*href="([^"]+)"', html)
if match:
    print(match.group(1))
PY
)"

if [[ -z "$SOURCE_HREF" ]]; then
  echo "Could not recover rendered original-source href" >&2
  exit 1
fi

SOURCE_URL="http://127.0.0.1:8765/app/$SOURCE_HREF"
if ! curl -fsS "$SOURCE_URL" >/dev/null; then
  echo "Rendered original-source link does not resolve: $SOURCE_HREF" >&2
  exit 1
fi

if grep -Eqi 'Uncaught|ReferenceError|TypeError|SyntaxError' /tmp/religion-browser.log; then
  echo "Browser log contains a JavaScript runtime error" >&2
  cat /tmp/religion-browser.log >&2
  exit 1
fi

printf 'BROWSER_SMOKE=PASS viewport=390x844 records=1198 review=650 positions=0 source_link=%s\n' "$SOURCE_HREF"
