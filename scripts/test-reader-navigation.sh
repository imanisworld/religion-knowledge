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
    const documentPicker = document.querySelector('#document-switcher');
    const compactNavOk = documentPicker?.options.length === 11 &&
      !document.querySelector('.docswitch');
    const active = chapters.filter(x => !x.hidden);
    const blanks = chapters.filter(section => ![...section.children]
      .some(child => !/^H[1-6]$/.test(child.tagName) &&
        (child.textContent || '').trim().length > 16));
    const heading = active[0]?.querySelector('h1,h2,h3');
    const aboutOk = !!about?.querySelector('#sec-intro');
    const firstOk = active.length === 1 && !!heading &&
      select && select.value === '0' &&
      !/Introduction/i.test(select.options[0].textContent) &&
      chapters.length >= 3 && blanks.length === 0 && aboutOk && compactNavOk;
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
      firstOk,navOk,hashOk,laptopOk,compactNavOk,viewport:[innerWidth,innerHeight]
    });
  } catch (error) {
    document.body.dataset.readerTopicSmoke = 'fail';
    document.body.dataset.readerTopicDetail = String(error);
  }
}, 0);
</script>'''
for name in ('master-notes', 'field-guide', 'history', 'sources',
             'other-side', 'translations', 'method-reference', 'glossary'):
    source = Path(name + '.html').read_text(encoding='utf-8')
    if '</body>' not in source:
        raise SystemExit(name + ': HTML document missing body terminator')
    Path(name + '.reader-smoke.html').write_text(
        source.replace('</body>', probe + '\n</body>'), encoding='utf-8')
PY

python3 -m http.server 8766 --bind 127.0.0.1 >/tmp/religion-reader-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true; rm -f -- *.reader-smoke.html master-notes.return-smoke.html field-guide.return-smoke.html' EXIT

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

for page in master-notes field-guide history sources other-side translations method-reference glossary; do
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


# Cited Persons is hand-maintained. Verify its alphabet pager, global search,
# flagged-only filter and deep links instead of trusting the shared generator.
python3 - <<'PY'
from pathlib import Path
probe = r'''<script>
setTimeout(() => {
  try {
    const chapters = [...document.querySelectorAll('main > section')];
    const select = document.getElementById('person-letter-select');
    const picker = document.getElementById('document-switcher');
    const oneAtATime = chapters.length >= 20 &&
      chapters.filter(s => !s.hidden).length === 1 &&
      select?.options.length === chapters.length &&
      picker?.options.length === 11;
    document.querySelector('.person-letter-nav .reader-next')?.click();
    const nextWorks = select?.value === '1' &&
      chapters.filter(s => !s.hidden).length === 1;
    const search = document.getElementById('search');
    search.value = 'Augustine';
    search.dispatchEvent(new Event('input', { bubbles:true }));
    const searchWorks = chapters.filter(s => !s.hidden).length === 1 &&
      [...chapters].some(s => !s.hidden && s.textContent.toLowerCase().includes('augustine'));
    search.value = '';
    search.dispatchEvent(new Event('input', { bubbles:true }));
    const flag = document.getElementById('flag-filter');
    flag.click();
    const flaggedOnly = flag.getAttribute('aria-pressed') === 'true' &&
      chapters.filter(s => !s.hidden).length === 1 &&
      [...document.querySelectorAll('main section p[id]:not(.hidden-entry)')]
        .some(p => p.querySelector('.flag-tag'));
    flag.click();
    location.hash = '#person-macdonald-dennis-r';
    setTimeout(() => {
      const target = document.getElementById('person-macdonald-dennis-r');
      const deepLinkWorks = target && !target.closest('section').hidden;
      const pass = oneAtATime && nextWorks && searchWorks && flaggedOnly && deepLinkWorks;
      document.body.dataset.personPagerSmoke = pass ? 'pass' : 'fail';
      document.body.dataset.personPagerDetail = JSON.stringify({
        oneAtATime,nextWorks,searchWorks,flaggedOnly,deepLinkWorks,
        viewport:[innerWidth,innerHeight]
      });
    }, 60);
  } catch (e) {
    document.body.dataset.personPagerSmoke = 'fail';
    document.body.dataset.personPagerDetail = String(e);
  }
},0);
</script>'''
source = Path('cited-persons.html').read_text(encoding='utf-8')
Path('cited-persons.reader-smoke.html').write_text(
  source.replace('</body>', probe + '\n</body>'), encoding='utf-8')
PY

for size in 1280,800 390,844; do
  output="/tmp/religion-cited-$size-reader-dom.html"
  "$BROWSER" --headless --no-sandbox --disable-gpu --hide-scrollbars \
    --window-size="$size" --virtual-time-budget=7000 \
    --dump-dom "http://127.0.0.1:8766/cited-persons.reader-smoke.html" \
    >"$output" 2>"/tmp/religion-cited-$size-chrome.log"
  if ! grep -Fq 'data-person-pager-smoke="pass"' "$output"; then
    echo "Cited Persons alphabet navigation failed at $size" >&2
    grep -o 'data-person-pager-detail="[^"]*"' "$output" | head -1 >&2 || true
    exit 1
  fi
  echo "CITED_PERSONS_PAGER_SMOKE=PASS viewport=$size"
done


# Cross-document round trip: a saved Study Notes topic must survive visiting
# Observations; explicit deep links, browser back and the selected light theme
# must still take priority. Fresh browser profile per viewport.
python3 - <<'PY'
from pathlib import Path
master_probe = r'''<script>
setTimeout(() => {
  const key = 'reader-roundtrip-stage';
  const stage = sessionStorage.getItem(key);
  const select = document.getElementById('reader-section-select');
  const active = [...document.querySelectorAll('main > section')].filter(s => !s.hidden);
  if (!stage) {
    // Simulate choosing a topic and leaving through the document navigation.
    if (!select || select.options.length < 4) {
      document.body.dataset.readerRoundtrip = 'fail-no-topics'; return;
    }
    select.value = '2';
    select.dispatchEvent(new Event('change', { bubbles:true }));
    const selected = document.querySelector('main > section:not([hidden])');
    const expected = selected?.id || '';
    if (!expected || sessionStorage.getItem('religion-reader-topic:' + location.pathname) !== expected) {
      document.body.dataset.readerRoundtrip = 'fail-not-saved'; return;
    }
    sessionStorage.setItem('reader-roundtrip-original-topic', expected);
    sessionStorage.setItem(key, 'visiting-observations');
    location.href = 'field-guide.return-smoke.html#s2-1';
    return;
  }
  if (stage === 'returning-to-study') {
    const id = sessionStorage.getItem('reader-roundtrip-original-topic');
    const section = document.getElementById(id);
    const resumed = !!section && !section.hidden && active.length === 1;
    const light = document.documentElement.dataset.theme === 'light';
    const about = !!document.querySelector('.reader-about #sec-intro');
    const laptop = innerWidth < 900 || (
      getComputedStyle(document.querySelector('main')).overflow === 'hidden' &&
      getComputedStyle(section).overflowY === 'auto'
    );
    document.body.dataset.readerRoundtrip = resumed && light && about && laptop
      ? 'pass' : 'fail';
    document.body.dataset.readerRoundtripDetail = JSON.stringify({
      resumed,light,about,laptop,id,active:active[0]?.id,viewport:[innerWidth,innerHeight]
    });
  }
},0);
</script>'''
field_probe = r'''<script>
setTimeout(() => {
  if (sessionStorage.getItem('reader-roundtrip-stage') !== 'visiting-observations') return;
  const target = document.getElementById('s2-1');
  const source = target?.closest('main > section');
  if (!source || source.hidden || document.documentElement.dataset.theme !== 'light') {
    document.body.dataset.readerRoundtrip = 'fail-deep-link'; return;
  }
  // Visit another topic by hash then use the browser Back action.
  const link = document.createElement('a');
  link.href = '#s3-2';
  document.body.append(link);
  link.click();
  const other = document.getElementById('s3-2')?.closest('main > section');
  if (!other || other.hidden) {
    document.body.dataset.readerRoundtrip = 'fail-in-page-link'; return;
  }
  history.back();
  setTimeout(() => {
    const restored = document.getElementById('s2-1')?.closest('main > section');
    if (!restored || restored.hidden || location.hash !== '#s2-1') {
      document.body.dataset.readerRoundtrip = 'fail-back-button'; return;
    }
    sessionStorage.setItem('reader-roundtrip-stage','returning-to-study');
    location.href = 'master-notes.return-smoke.html';
  },150);
},0);
</script>'''
for name, probe in [('master-notes',master_probe),('field-guide',field_probe)]:
    html = Path(name+'.html').read_text(encoding='utf-8')
    Path(name+'.return-smoke.html').write_text(
        html.replace('</body>',probe+'\n</body>'),encoding='utf-8')
PY

for size in 1280,800 390,844; do
  output="/tmp/religion-$size-reader-roundtrip-dom.html"
  log="/tmp/religion-$size-reader-roundtrip-chrome.log"
  "$BROWSER" --headless --no-sandbox --disable-gpu \
    --hide-scrollbars --window-size="$size" --virtual-time-budget=12000 \
    --dump-dom "http://127.0.0.1:8766/master-notes.return-smoke.html" \
    >"$output" 2>"$log"
  if ! grep -Fq 'data-reader-roundtrip="pass"' "$output"; then
    echo "Reader navigation/session roundtrip failed at $size" >&2
    grep -o 'data-reader-roundtrip-detail="[^"]*"' "$output" | head -1 >&2 || true
    grep -o 'data-reader-roundtrip="[^"]*"' "$output" | head -1 >&2 || true
    tail -35 "$log" >&2 || true
    exit 1
  fi
  echo "READER_ROUNDTRIP_SMOKE=PASS viewport=$size saved_section=restored hash_navigation=pass browser_back=pass light_theme=pass"
done
