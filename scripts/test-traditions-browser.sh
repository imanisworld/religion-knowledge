#!/usr/bin/env bash
set -euo pipefail
BROWSER=""
for candidate in google-chrome google-chrome-stable chromium chromium-browser; do
  if command -v "$candidate" >/dev/null 2>&1; then BROWSER="$candidate"; break; fi
done
if [[ -z "$BROWSER" ]]; then echo 'Chromium-family browser required for traditions test' >&2; exit 1; fi
test -s dist/reader-site/traditions.html

python3 - <<'PY'
from pathlib import Path
source=Path('dist/reader-site/traditions.html').read_text(encoding='utf-8')
probe="""<script>
setTimeout(() => {
  try {
    const items=[...document.querySelectorAll('.tradition-item')];
    const profiles=[...document.querySelectorAll('.tradition-profile')];
    const chooser=document.getElementById('traditionChooser');
    const search=document.getElementById('traditionSearch');
    const initial=profiles.filter(p=>!p.hidden);
    const starting=items.length===27 && profiles.length===27 &&
      initial.length===1 && !!chooser && !!search;
    let filtered=false,deepLink=false,details=false,bounds=true;
    if(starting) {
      search.value='Akan traditional religion';
      search.dispatchEvent(new Event('input',{bubbles:true}));
      const visible=items.filter(i=>!i.hidden);
      filtered=visible.length===1;
      if(filtered) {
        visible[0].click();
        const chosen=document.getElementById('trad_akan_traditional_religion');
        deepLink=location.hash==='#trad_akan_traditional_religion' && !chosen?.hidden;
        details=!!chosen?.textContent.includes('1703') &&
          !!chosen?.textContent.includes('Written attestation');
      }
    }
    if(innerWidth>=850&&innerHeight>=640){
      const workspace=document.querySelector('.traditions-workspace')?.getBoundingClientRect();
      const profile=document.querySelector('.profile-column')?.getBoundingClientRect();
      bounds=!!workspace && !!profile && workspace.bottom<=innerHeight+3 &&
        profile.bottom<=innerHeight+3 && document.documentElement.scrollWidth<=innerWidth+2;
    }
    const root=document.documentElement;
    const theme=document.getElementById('theme');
    const old=root.dataset.theme;
    theme.click();
    const themeChanged=root.dataset.theme!==old;
    theme.click();
    const themeRestored=root.dataset.theme===old;
    document.body.dataset.traditionsBrowser=(starting&&filtered&&deepLink&&details&&bounds&&themeChanged&&themeRestored)?'pass':'fail';
    document.body.dataset.traditionsDiagnostic=JSON.stringify({
      starting,filtered,deepLink,details,bounds,themeChanged,themeRestored,
      viewport:[innerWidth,innerHeight]
    });
  } catch(e) {
    document.body.dataset.traditionsBrowser='fail';
    document.body.dataset.traditionsDiagnostic=String(e);
  }
},0);
</script>"""
Path('dist/reader-site/traditions.smoke.html').write_text(source.replace('</body>',probe+'</body>'),encoding='utf-8')
PY

python3 -m http.server 8768 --bind 127.0.0.1 --directory dist/reader-site >/tmp/religion-traditions-server.log 2>&1 &
PID=$!
trap 'kill "$PID" >/dev/null 2>&1 || true; rm -f dist/reader-site/traditions.smoke.html' EXIT
for _ in {1..30}; do if curl -fsS http://127.0.0.1:8768/traditions.smoke.html >/dev/null 2>&1; then break; fi; sleep .2; done
for size in 1280,800 390,844; do
  "$BROWSER" --headless --no-sandbox --disable-gpu \
    --hide-scrollbars --window-size="$size" --virtual-time-budget=5500 \
    --dump-dom http://127.0.0.1:8768/traditions.smoke.html \
    >"/tmp/traditions-$size-dom.html" 2>"/tmp/traditions-$size-browser.log"
  if ! grep -Fq 'data-traditions-browser="pass"' "/tmp/traditions-$size-dom.html"; then
    echo "Traditions browser check failed: $size" >&2
    grep -o 'data-traditions-diagnostic="[^"]*"' "/tmp/traditions-$size-dom.html" | head -1 >&2 || true
    tail -40 "/tmp/traditions-$size-browser.log" >&2 || true
    exit 1
  fi
  echo "TRADITIONS_BROWSER=PASS viewport=$size historical_profile=visible navigation=pass theme=pass"
done
