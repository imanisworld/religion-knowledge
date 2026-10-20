#!/usr/bin/env bash
# Browser-level guard against blank reader pages, broken topic controls,
# and missing original anchors on both laptop and phone-sized screens.
set -euo pipefail

BROWSER=""
for candidate in google-chrome google-chrome-stable chromium chromium-browser; do
  if command -v "$candidate" >/dev/null 2>&1; then
    BROWSER="$candidate"
    break
  fi
done
if [[ -z "$BROWSER" ]]; then
  echo "No Chromium-family browser found for reader smoke test" >&2
  exit 1
fi

python3 - <<'PY'
from pathlib import Path
probe = r'''<script>
setTimeout(() => {
  try {
    const page = document.querySelector('main');
    const chapters = [...page.querySelectorAll(':scope > section')];
    const select = document.querySelector('#reader-section-select');
    const about = document.querySelector('.reader-about');
    const active = chapters.filter(x => !x.hidden);
    const blanks = chapters.filter(section => ![...section.children]
      .some(child => !/^H[1-6]$/.test(child.tagName) &&
        (child.textContent || '').trim().length > 16));
    const heading = active[0]?.querySelector('h1,h2,h3');
    const aboutOk = !!about?.querySelector('#sec-intro');
    const firstOk = active.length === 1 && !!heading &&
      select && select.value === '0' &&
      !/Introduction/i.test(select.options[0].textContent) &&
      chapters.length >= 10 && blanks.length === 0 && aboutOk;
    let navOk = false;
    if (firstOk) {
      const old = select.value;
      document.querySelector('.reader-section-nav .reader-next')?.click();
      navOk = select.value !== old &&
        chapters.filter(x => !x.hidden).length === 1;
    }
    let hashOk = false;
    const target = chapters.slice(2).flatMap(s => [...s.querySelectorAll('[id]')])
      .find(t => t.matches('h2[id],h3[id]'));
    if (target) {
      const jump = document.createElement('a');
      jump.href = '#' + target.id;
      document.body.append(jump);
      jump.click();
      hashOk = !chapters.find(s => s.contains(target))?.hidden;
      jump.remove();
    }
    const isLaptop = innerWidth >= 900 && innerHeight >= 640;
    let laptopOk = true;
    if (isLaptop) {
      const mainBox = page.getBoundingClientRect();
      const section = chapters.find(s => !s.hidden);
      const secBox = section?.getBoundingClientRect();
      const footerBox = document.querySelector('.reader-section-footer')?.getBoundingClientRect();
      laptopOk = !!section && !!footerBox &&
        mainBox.top >= 0 && mainBox.bottom <= innerHeight + 5 &&
        secBox.top >= 0 && secBox.bottom <= innerHeight + 5 &&
        footerBox.bottom <= innerHeight + 5;
    }
    document.body.dataset.readerTopicSmoke =
      (firstOk && navOk && hashOk && laptopOk) ? 'pass' : 'fail';
    document.body.dataset.readerTopicDetail = JSON.stringify({
      chapters:chapters.length,blank:blanks.map(s => s.id).slice(0,8),
      firstOk,navOk,hashOk,laptopOk,viewport:[innerWidth,innerHeight]
    });
  } catch (error) {
    document.body.dataset.readerTopicSmoke = 'fail';
    document.body.dataset.readerTopicDetail = String(error);
  }
}, 0);
</script>'''
for name in ('master-notes', 'field-guide'):
    source = Path(name + '.html').read_text(encoding='utf-8')
    if '</body>' not in source:
        raise SystemExit(name + ': HTML document missing body terminator')
    Path(name + '.reader-smoke.html').write_text(
        source.replace('</body>', probe + '\n</body>'), encoding='utf-8')
PY

python3 -m http.server 8766 --bind 127.0.0.1 >/tmp/religion-reader-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true; rm -f master-notes.reader-smoke.html field-guide.reader-smoke.html' EXIT

READY=0
for _ in {1..40}; do
  if curl -fsS http://127.0.0.1:8766/master-notes.reader-smoke.html >/dev/null 2>&1; then
    READY=1
    break
  fi
  sleep .2
done
if [[ "$READY" -ne 1 ]]; then
  echo "Reader test HTTP server did not start" >&2
  exit 1
fi

for page in master-notes field-guide; do
  for size in 1280,800 390,844; do
    output="/tmp/religion-$page-$size-reader-dom.html"
    log="/tmp/religion-$page-$size-reader-chrome.log"
    "$BROWSER" --headless --no-sandbox --disable-gpu \
      --hide-scrollbars --window-size="$size" --virtual-time-budget=5000 \
      --dump-dom "http://127.0.0.1:8766/$page.reader-smoke.html" \
      >"$output" 2>"$log"
    if ! grep -Fq 'data-reader-topic-smoke="pass"' "$output"; then
      echo "Reader topic navigation failed: $page size $size" >&2
      grep -o 'data-reader-topic-detail="[^"]*"' "$output" | head -1 >&2 || true
      tail -35 "$log" >&2 || true
      exit 1
    fi
    echo "READER_TOPIC_SMOKE=PASS page=$page viewport=$size"
  done
done
