#!/usr/bin/env bash
# Real browser checks at laptop and phone widths for bounded research readers.
set -euo pipefail
BROWSER=""
for candidate in google-chrome google-chrome-stable chromium chromium-browser; do
  if command -v "$candidate" >/dev/null 2>&1; then BROWSER="$candidate";break;fi
done
[[ -n "$BROWSER" ]] || { echo 'Chromium unavailable' >&2;exit 1; }
python3 - <<'PY'
from pathlib import Path
pages = ['prophecy-audit','gender-over-time','patterns-synthesis',
         'translation-evidence','personal-belief-history']
probe = r'''<script>
setTimeout(() => {
  try {
    const main = document.querySelector('main[data-research-pager]');
    const sections = [...main.children].filter(x=>x.tagName==='SECTION');
    const nav = main.querySelector('.rk-topic-pager');
    const select = nav?.querySelector('select');
    const initial = sections.filter(s=>!s.hidden).length===1;
    select.value='1';select.dispatchEvent(new Event('change'));
    const move = sections[1] && !sections[1].hidden &&
      sections.filter(s=>!s.hidden).length===1;
    const last = sections[sections.length-1];
    location.hash='#'+last.id;
    window.dispatchEvent(new Event('hashchange'));
    const hash = !last.hidden && sections.filter(s=>!s.hidden).length===1;
    const caseSection=sections.find(s=>s.querySelectorAll('article.case').length>=2);
    let cases = true;
    if(caseSection){
      select.value=String(sections.indexOf(caseSection));
      select.dispatchEvent(new Event('change'));
      const cards=[...caseSection.querySelectorAll('article.case')];
      const caseNav=[...caseSection.querySelectorAll('.rk-topic-pager')][0];
      const first=cards.filter(c=>!c.hidden).length===1;
      caseNav.querySelector('button:nth-of-type(2)').click();
      const second=!cards[1].hidden && cards.filter(c=>!c.hidden).length===1;
      cases=first&&second;
    }
    const ok=sections.length>=5&&initial&&move&&hash&&cases;
    document.body.dataset.researchPagerSmoke=ok?'pass':'fail';
    document.body.dataset.researchPagerDetail=JSON.stringify({
      sections:sections.length,initial,move,hash,cases,viewport:[innerWidth,innerHeight]
    });
  }catch(e){document.body.dataset.researchPagerSmoke='fail';
    document.body.dataset.researchPagerDetail=String(e)}
},100);
</script>'''
for name in pages:
    src=Path(name+'.html').read_text()
    Path(name+'.pager-smoke.html').write_text(src.replace('</body>',probe+'\n</body>'))
law=r'''<script>
setTimeout(() => {
  try {
    const root=document.getElementById('content');
    const sections=[...root.querySelectorAll(':scope > section.section-block')];
    const active=sections.filter(s=>!s.hidden);
    const nav=root.querySelector('.rk-topic-pager select');
    const first=nav&&sections.length===4&&active.length===1;
    nav.value='1';nav.dispatchEvent(new Event('change'));
    const switched=!sections[1].hidden&&sections.filter(s=>!s.hidden).length===1;
    nav.value='0';nav.dispatchEvent(new Event('change'));
    const rows=[...root.querySelectorAll('#comparisonBody > tr')];
    const paged=rows.length>0&&rows.length<=10&&!!root.querySelector('#law-row-pager');
    const ok=first&&switched&&paged;
    document.body.dataset.researchPagerSmoke=ok?'pass':'fail';
    document.body.dataset.researchPagerDetail=JSON.stringify({
      sections:sections.length,first,switched,paged,rows:rows.length,
      viewport:[innerWidth,innerHeight]
    });
  }catch(e){document.body.dataset.researchPagerSmoke='fail';
    document.body.dataset.researchPagerDetail=String(e)}
},1500);
</script>'''
src=Path('religion-law.html').read_text()
Path('religion-law.pager-smoke.html').write_text(src.replace('</body>',law+'\n</body>'))
PY
python3 -m http.server 8897 --bind 127.0.0.1 >/tmp/rk-special-http.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true; rm -f -- *.pager-smoke.html' EXIT
for attempt in {1..40}; do
  if curl -fsS http://127.0.0.1:8897/history.html >/dev/null 2>&1; then break;fi
  sleep .2
done
for page in prophecy-audit gender-over-time patterns-synthesis translation-evidence personal-belief-history religion-law; do
  for size in 1280,800 390,844; do
    output="/tmp/rk-special-$page-$size.html"
    "$BROWSER" --headless --no-sandbox --disable-gpu --hide-scrollbars \
      --window-size="$size" --virtual-time-budget=6500 \
      --dump-dom "http://127.0.0.1:8897/$page.pager-smoke.html" \
      >"$output" 2>"/tmp/rk-special-$page-$size.log"
    if ! grep -Fq 'data-research-pager-smoke="pass"' "$output"; then
      echo "RESEARCH_PAGER_SMOKE=FAIL page=$page viewport=$size" >&2
      grep -o 'data-research-pager-detail="[^"]*"' "$output" | head -1 >&2 || true
      tail -12 "/tmp/rk-special-$page-$size.log" >&2 || true
      exit 1
    fi
    echo "RESEARCH_PAGER_SMOKE=PASS page=$page viewport=$size"
  done
done
