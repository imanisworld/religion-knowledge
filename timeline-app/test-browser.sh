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
  echo "No Chromium-family browser found" >&2
  exit 1
fi

SMOKE_PAGE="timeline-app/.browser-smoke.html"
python3 - <<'PY'
from pathlib import Path
source = Path('timeline-app/index.html').read_text(encoding='utf-8')
injection = r'''<script>
setTimeout(() => {
  const lanes = document.querySelectorAll('#timeline .lane').length;
  const visible = document.getElementById('visible-summary')?.textContent || '';
  const truth = document.getElementById('truth-window');
  if (lanes > 0 && /visible claim/.test(visible) && truth?.style.width) {
    document.body.dataset.timelineRender = 'pass';
  }

  const parseZoom = (value) => {
    const match = /^Z([0-7])$/.exec(String(value || ''));
    return match ? Number(match[1]) : null;
  };
  const currentZoom = () => {
    const value = Number(new URLSearchParams(location.search).get('z'));
    return Number.isInteger(value) ? value : null;
  };
  const candidates = (window.TIMELINE_RESEARCH_DATA?.claims || []).filter((claim) => {
    const min = parseZoom(claim.zoom_min);
    const max = parseZoom(claim.zoom_max);
    return ['verified', 'published'].includes(claim.status)
      && Number.isFinite(claim.date?.earliest)
      && Array.isArray(claim.region) && claim.region.length > 0
      && min !== null && max !== null;
  });

  const target = candidates.find((claim) => parseZoom(claim.zoom_min) <= parseZoom(claim.zoom_max));
  if (!target) return;

  const targetZoom = parseZoom(target.zoom_min);
  let guard = 0;
  while (currentZoom() !== targetZoom && guard < 12) {
    const z = currentZoom();
    if (z === null) break;
    const control = z < targetZoom ? document.getElementById('zoom-in') : document.getElementById('zoom-out');
    if (!control) break;
    control.click();
    guard += 1;
  }

  const center = (target.date.earliest + (Number.isFinite(target.date.latest) ? target.date.latest : target.date.earliest)) / 2;
  const jumpOpen = document.getElementById('jump-open');
  const jumpInput = document.getElementById('jump-year');
  const jumpSubmit = document.getElementById('jump-submit');
  if (jumpOpen && jumpInput && jumpSubmit) {
    jumpOpen.click();
    jumpInput.value = String(Math.round(center));
    jumpSubmit.click();
  }

  setTimeout(() => {
    const targetClaim = document.querySelector(`#timeline [data-claim-id="${CSS.escape(target.id)}"]`);
    if (!targetClaim) return;
    document.body.dataset.zoomClaim = 'pass';
    targetClaim.click();

    setTimeout(() => {
      const inspector = document.getElementById('inspector');
      if (inspector?.open && document.getElementById('inspector-title')?.textContent) {
        document.body.dataset.inspector = 'pass';
      }
      document.getElementById('inspector-close')?.click();
      document.getElementById('view-toggle')?.click();

      setTimeout(() => {
        const listVisible = !document.getElementById('list-view')?.hidden;
        const listClaim = document.querySelector(`#list-content [data-claim-id="${CSS.escape(target.id)}"]`);
        if (listVisible && listClaim) document.body.dataset.listView = 'pass';
      }, 0);
    }, 0);
  }, 0);
}, 0);
</script>'''
if '</body>' not in source:
    raise SystemExit('timeline-app/index.html is missing </body>')
Path('timeline-app/.browser-smoke.html').write_text(source.replace('</body>', injection + '\n</body>'), encoding='utf-8')
PY

python3 -m http.server 8766 --bind 127.0.0.1 >/tmp/timeline-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true; rm -f "$SMOKE_PAGE"' EXIT

for _ in {1..30}; do
  if curl -fsS http://127.0.0.1:8766/timeline-app/.browser-smoke.html >/dev/null 2>&1; then break; fi
  sleep 0.2
done

"$BROWSER" --headless --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=390,844 --virtual-time-budget=5000 --dump-dom \
  http://127.0.0.1:8766/timeline-app/.browser-smoke.html \
  >/tmp/timeline-dom.html 2>/tmp/timeline-browser.log

for marker in 'data-timeline-render="pass"' 'data-zoom-claim="pass"' 'data-inspector="pass"' 'data-list-view="pass"'; do
  if ! grep -Fq "$marker" /tmp/timeline-dom.html; then
    echo "Timeline browser smoke missing $marker" >&2
    tail -120 /tmp/timeline-browser.log >&2 || true
    exit 1
  fi
done

if grep -Fq 'Not Found' /tmp/timeline-dom.html; then
  echo "Timeline browser smoke rendered a missing-resource page" >&2
  exit 1
fi

echo "TIMELINE_BROWSER_SMOKE=PASS viewport=390x844 zoom-aware=true"
