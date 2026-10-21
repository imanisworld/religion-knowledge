#!/usr/bin/env bash
set -euo pipefail
BROWSER=""
for cmd in google-chrome google-chrome-stable chromium chromium-browser; do
  if command -v "$cmd" >/dev/null 2>&1; then BROWSER="$cmd"; break; fi
done
[[ -n "$BROWSER" ]] || { echo "Browser unavailable" >&2; exit 1; }
TMP="$(mktemp -d)"
PID=""
cleanup(){ [[ -z "$PID" ]] || kill "$PID" 2>/dev/null || true; rm -f gender-over-time.visual-{light,dark}.html; rm -rf "$TMP"; }
trap cleanup EXIT
python3 - <<'PY'
from pathlib import Path
source = Path("gender-over-time.html").read_text()
probe = r"""
<script>
setTimeout(() => {
  try {
    const theme = "__THEME__";
    document.documentElement.dataset.theme = theme;
    const root = document.querySelector("main[data-research-pager]");
    const sections = [...root.children].filter(n => n.tagName === "SECTION");
    const section = document.querySelector("#cases");
    const select = root.querySelector(".rk-topic-pager select");
    if (!select || !section) throw Error("Cases pager missing");
    select.value = String(sections.indexOf(section));
    select.dispatchEvent(new Event("change", {bubbles:true}));
    setTimeout(() => {
      try {
        const card = [...section.querySelectorAll(".case")].find(c => !c.hidden);
        const para = card?.querySelector("p"), badge = card?.querySelector(".tag");
        const heading = card?.querySelector("h3");
        if (!card || !para || !badge || !heading) throw Error("Case text missing");
        const style = n => getComputedStyle(n);
        const width = window.innerWidth;
        const rect = n => n.getBoundingClientRect();
        const bounded = n => rect(n).left >= -2 && rect(n).right <= width+2;
        const channels = s => (s.match(/\d+/g) || []).slice(0,3).map(Number);
        const lum = s => {
          const v = channels(s).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
          return .2126*v[0]+.7152*v[1]+.0722*v[2];
        };
        const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
        const bg = style(document.body).backgroundColor;
        const expected = theme === "dark" ? "rgb(29, 34, 39)" : "rgb(247, 247, 244)";
        const checks = {
          visibleCases: !section.hidden && !card.hidden,
          theme: document.documentElement.dataset.theme===theme && bg===expected,
          viewport: document.documentElement.scrollWidth <= width+2 && document.body.scrollWidth <= width+2,
          card: bounded(card) && rect(card).width>=240,
          badge: bounded(badge) && !!badge.textContent.trim() &&
             rect(badge).right <= rect(card).right+1 &&
             parseFloat(style(badge).fontSize)>=12 &&
             ratio(style(badge).color,style(badge).backgroundColor)>=7,
          copy: parseFloat(style(para).fontSize)>=16 &&
             ratio(style(para).color,style(card).backgroundColor)>=7,
          heading: parseFloat(style(heading).fontSize)>=20
        };
        document.body.dataset.genderUiPass = Object.values(checks).every(Boolean) ? "1":"0";
        document.body.dataset.genderUiDetail=JSON.stringify({checks,viewport:[width,innerHeight],bodyBG:bg,badge:badge.textContent.trim()});
      } catch(e){document.body.dataset.genderUiPass="0";document.body.dataset.genderUiDetail=String(e);}
    }, 200);
  } catch(e){document.body.dataset.genderUiPass="0";document.body.dataset.genderUiDetail=String(e);}
}, 650);
</script>
"""
for theme in ('light','dark'):
    if source.count('</body>') != 1: raise SystemExit('Missing body terminator')
    Path(f"gender-over-time.visual-{theme}.html").write_text(
        source.replace('</body>', probe.replace('__THEME__',theme) + '\n</body>'))
PY
python3 -m http.server 8898 --bind 127.0.0.1 >"$TMP/server.log" 2>&1 &
PID=$!
for i in {1..50}; do
  if curl -fsS http://127.0.0.1:8898/gender-over-time.visual-light.html >/dev/null 2>&1; then break; fi
  sleep .2
done
curl -fsS http://127.0.0.1:8898/gender-over-time.visual-light.html >/dev/null
mkdir -p gender-visual-screenshots
for theme in light dark; do
  for size in 1280,800 390,844; do
    filename="${theme}-${size/,/x}"
    url="http://127.0.0.1:8898/gender-over-time.visual-${theme}.html"
    "$BROWSER" --headless --no-sandbox --disable-gpu --hide-scrollbars \
      --window-size="$size" --virtual-time-budget=3300 --dump-dom \
      "$url" >"$TMP/${filename}.html" 2>"$TMP/${filename}.log"
    if ! grep -Fq 'data-gender-ui-pass="1"' "$TMP/${filename}.html"; then
      echo "FAIL theme=$theme size=$size" >&2
      grep -o 'data-gender-ui-detail="[^"]*"' "$TMP/${filename}.html" | head -1 >&2 || true
      tail -15 "$TMP/${filename}.log" >&2 || true
      exit 1
    fi
    echo "PASS theme=$theme size=$size"
    "$BROWSER" --headless --no-sandbox --disable-gpu --hide-scrollbars \
      --window-size="$size" --virtual-time-budget=3300 \
      --screenshot="gender-visual-screenshots/${filename}.png" "$url" \
      >/dev/null 2>"$TMP/${filename}.png.log"
  done
done
