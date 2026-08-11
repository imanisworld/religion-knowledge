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
  // Clean profile: Home leads with the hero fallback (no resume data yet),
  // and the study/questions blocks render.
  const heroFallback = document.querySelector('#home-lead .hero-card');
  const noContinue = !document.querySelector('#home-lead .continue-card');
  const topicChips = document.querySelectorAll('#home-topics .topic-chip').length;
  const questionCards = document.querySelectorAll('#home-questions-list .record-card').length;
  if (heroFallback && noContinue && topicChips > 0 && questionCards > 0) {
    document.body.dataset.homeClean = 'pass';
  }

  const firstRecord = document.querySelector('[data-record-id]');
  if (firstRecord) firstRecord.click();
  const browse = document.querySelector('[data-browse-source="Glossary.md"]');
  if (browse) browse.click();
  setTimeout(() => {
    const search = document.getElementById('search-input');
    const title = document.getElementById('page-title');
    if (search?.value === 'Glossary.md' && title?.textContent === 'Search Results') {
      document.body.dataset.sourceBrowseSmoke = 'pass';
    }

    // Mobile nav "More" sheet: opens, navigates, and closes without a page reload.
    document.getElementById('nav-more')?.click();
    setTimeout(() => {
      if (document.getElementById('more-sheet')?.hasAttribute('open')) {
        document.body.dataset.moreSheetOpen = 'pass';
      }
      document.querySelector('#more-sheet [data-go="compare"]')?.click();
      setTimeout(() => {
        const compareActive = document.getElementById('view-compare')?.classList.contains('active');
        const sheetClosed = !document.getElementById('more-sheet')?.hasAttribute('open');
        if (compareActive && sheetClosed && title?.textContent === 'Compare') {
          document.body.dataset.moreSheetNav = 'pass';
        }

        // Filter badge reflects active filter count, then resets.
        const provenanceFilter = document.getElementById('provenance-filter');
        if (provenanceFilter) {
          provenanceFilter.value = 'SOURCE';
          provenanceFilter.dispatchEvent(new Event('change', { bubbles: true }));
        }
        setTimeout(() => {
          const filterButton = document.getElementById('filter-button');
          const filterCount = document.getElementById('filter-count');
          if (filterButton?.classList.contains('has-filters') && filterCount?.textContent === '1') {
            document.body.dataset.filterBadge = 'pass';
          }
          if (provenanceFilter) {
            provenanceFilter.value = 'ALL';
            provenanceFilter.dispatchEvent(new Event('change', { bubbles: true }));
          }

          // Search Results shows a live result count.
          const searchInput = document.getElementById('search-input');
          if (searchInput) {
            searchInput.value = 'glossary';
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          setTimeout(() => {
            const summary = document.getElementById('search-summary')?.textContent || '';
            if (/result/.test(summary) && summary.includes('glossary')) {
              document.body.dataset.searchSummary = 'pass';
            }
            if (searchInput) {
              searchInput.value = '';
              searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            }

            // Topics view can be filtered by name and fails closed to an empty state.
            document.querySelector('[data-view="topics"]')?.click();
            setTimeout(() => {
              const topicSearch = document.getElementById('topic-search');
              if (topicSearch) {
                topicSearch.value = 'zzz-no-such-topic-zzz';
                topicSearch.dispatchEvent(new Event('input', { bubbles: true }));
              }
              setTimeout(() => {
                const topicsList = document.getElementById('topics-list')?.textContent || '';
                if (topicsList.includes('No topics match your filter')) {
                  document.body.dataset.topicSearch = 'pass';
                }
                if (topicSearch) {
                  topicSearch.value = '';
                  topicSearch.dispatchEvent(new Event('input', { bubbles: true }));
                }

                // Review Queue: progress line and the "Save & review next" control both
                // render on a queued record, without actually mutating any attribution
                // (that would change the committed review count checked below).
                document.querySelector('[data-view="review"]')?.click();
                setTimeout(() => {
                  const progressBefore = document.getElementById('review-progress')?.textContent || '';
                  if (/awaiting review/.test(progressBefore)) {
                    document.body.dataset.reviewProgress = 'pass';
                  }
                  document.querySelector('#review-list [data-record-id]')?.click();
                  setTimeout(() => {
                    if (document.getElementById('save-review-next')) {
                      document.body.dataset.reviewSaveNext = 'pass';
                    }
                    document.getElementById('dialog-close')?.click();

                    // Reader section anchors: a Study Notes record with a numbered
                    // section must render an "Open reader" link that targets the
                    // reader's #s<num> anchor, not the document top.
                    const anchorSearch = document.getElementById('search-input');
                    if (anchorSearch) {
                      anchorSearch.value = 'Jeremiah';
                      anchorSearch.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    setTimeout(() => {
                      document.querySelector('#search-results [data-record-id]')?.click();
                      // Hash routing: openRecord writes the deep link synchronously
                      // during the click, so check in the same tick (later ticks can
                      // race other hash writers under virtual time).
                      if (location.hash.startsWith('#/record/')) {
                        document.body.dataset.recordHash = 'pass';
                      }
                      setTimeout(() => {
                        const readerLink = document.querySelector('#dialog-body [data-original-source-link]');
                        document.body.dataset.readerAnchorHref = readerLink?.getAttribute('href') || 'missing';

                        // Navigating by hash must switch views even with the
                        // record dialog still open.
                        location.hash = '#/audits';
                        setTimeout(() => {
                          setTimeout(() => {
                            const auditsActive = document.getElementById('view-audits')?.classList.contains('active');
                            const dialogClosed = !document.getElementById('record-dialog')?.hasAttribute('open');
                            if (auditsActive && dialogClosed) {
                              document.body.dataset.hashRoute = 'pass';
                            }
                          }, 0);
                        }, 0);
                      }, 0);
                    }, 0);
                  }, 0);
                }, 0);
              }, 0);
            }, 0);
          }, 0);
        }, 0);
      }, 0);
    }, 0);
  }, 0);
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

if ! grep -Fq '<strong>1383</strong><span>Records</span>' /tmp/religion-app-dom.html; then
  echo "Rendered app did not show the expected 1,383 record count" >&2
  tail -100 /tmp/religion-browser.log >&2 || true
  exit 1
fi

if ! grep -Fq '<strong>47</strong><span>Review</span>' /tmp/religion-app-dom.html; then
  echo "Rendered app did not show the expected 47 review count" >&2
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

if ! grep -Fq 'id="export-review-backup"' /tmp/religion-app-dom.html; then
  echo "Review backup export control is missing" >&2
  exit 1
fi

if ! grep -Fq 'id="import-review-backup"' /tmp/religion-app-dom.html; then
  echo "Review backup import control is missing" >&2
  exit 1
fi

if ! grep -Fq 'Original notes and parser output are never included or rewritten.' /tmp/religion-app-dom.html; then
  echo "Review backup safety notice is missing" >&2
  exit 1
fi

SOURCE_LIBRARY_COUNT="$(grep -o 'data-source-library-file=' /tmp/religion-app-dom.html | wc -l | tr -d ' ')"
if [[ "$SOURCE_LIBRARY_COUNT" != "8" ]]; then
  echo "Expected 8 canonical source library cards, found $SOURCE_LIBRARY_COUNT" >&2
  exit 1
fi

if ! grep -Fq 'data-source-browse-smoke="pass"' /tmp/religion-app-dom.html; then
  echo "Browse records did not switch to exact-source Search Results" >&2
  exit 1
fi

if ! grep -Fq 'data-more-sheet-open="pass"' /tmp/religion-app-dom.html; then
  echo "Tapping the More nav item did not open the overflow sheet" >&2
  exit 1
fi

if ! grep -Fq 'data-more-sheet-nav="pass"' /tmp/religion-app-dom.html; then
  echo "Choosing a More sheet item did not navigate and close the sheet" >&2
  exit 1
fi

if ! grep -Fq 'data-filter-badge="pass"' /tmp/religion-app-dom.html; then
  echo "Filter button did not show an active-filter count badge" >&2
  exit 1
fi

if ! grep -Fq 'data-search-summary="pass"' /tmp/religion-app-dom.html; then
  echo "Search Results did not show a live result count" >&2
  exit 1
fi

if ! grep -Fq 'data-topic-search="pass"' /tmp/religion-app-dom.html; then
  echo "Topic search did not fail closed to an empty state for an unmatched query" >&2
  exit 1
fi

if ! grep -Fq 'data-review-progress="pass"' /tmp/religion-app-dom.html; then
  echo "Review Queue progress line is missing" >&2
  exit 1
fi

if ! grep -Fq 'data-review-save-next="pass"' /tmp/religion-app-dom.html; then
  echo "Review Queue \"Save & review next\" control is missing" >&2
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

SOURCE_URL="http://127.0.0.1:8765/app/${SOURCE_HREF%%#*}"
if ! curl -fsS "$SOURCE_URL" >/dev/null; then
  echo "Rendered original-source link does not resolve: $SOURCE_HREF" >&2
  exit 1
fi

READER_ANCHOR_HREF="$(grep -o 'data-reader-anchor-href="[^"]*"' /tmp/religion-app-dom.html | head -1 | sed 's/^data-reader-anchor-href="//; s/"$//')"
if [[ ! "$READER_ANCHOR_HREF" =~ master-notes\.html#s[0-9-]+$ ]]; then
  echo "Study Notes record did not render a section-anchored reader link (got: $READER_ANCHOR_HREF)" >&2
  exit 1
fi

if ! grep -Fq 'class="app-link"' master-notes.html; then
  echo "Reader docswitch is missing the App link back to the knowledge app" >&2
  exit 1
fi

if ! grep -Fq 'data-record-hash="pass"' /tmp/religion-app-dom.html; then
  echo "Opening a record did not write a #/record/ deep link into the URL" >&2
  exit 1
fi

if ! grep -Fq 'data-hash-route="pass"' /tmp/religion-app-dom.html; then
  echo "Setting location.hash did not route to the target view (or the dialog stayed open)" >&2
  exit 1
fi

if ! grep -Fq 'data-home-clean="pass"' /tmp/religion-app-dom.html; then
  echo "Home did not render the clean-profile lead (hero fallback, topic chips, open questions)" >&2
  exit 1
fi

if ! grep -Fq '<optgroup label="AI Analysis">' /tmp/religion-app-dom.html; then
  echo "Provenance filter is missing its grouped options" >&2
  exit 1
fi

if grep -Eq '<span class="badge [a-z]*">(VERBATIM|PARAPHRASE|SUMMARY)</span>' /tmp/religion-app-dom.html; then
  echo "Card faces still show representation-type badges (dialog-only now)" >&2
  exit 1
fi

if ! grep -Fq 'id="home-backup-status"' /tmp/religion-app-dom.html; then
  echo "Home backup-status placeholder is missing" >&2
  exit 1
fi

if grep -Fq 'exist only in this browser' /tmp/religion-app-dom.html; then
  echo "Clean profile should not warn about unexported review decisions" >&2
  exit 1
fi

if ! grep -Fq 'class="side-nav"' /tmp/religion-app-dom.html; then
  echo "Desktop sidebar navigation markup is missing" >&2
  exit 1
fi

if grep -Eqi 'Uncaught|ReferenceError|TypeError|SyntaxError' /tmp/religion-browser.log; then
  echo "Browser log contains a JavaScript runtime error" >&2
  cat /tmp/religion-browser.log >&2
  exit 1
fi

printf 'BROWSER_SMOKE=PASS viewport=390x844 records=1383 review=47 positions=0 review_backup=present source_library=8 source_browse=Glossary.md source_link=%s more_sheet=pass filter_badge=pass search_summary=pass topic_search=pass review_speed=pass\n' "$SOURCE_HREF"
