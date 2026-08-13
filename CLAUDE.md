# CLAUDE.md — Bible Deep Dive

Instructions for Claude Code working in this repo. Read this before touching anything.

## What this is

A long-running critical study of the Bible and religious belief systems, approached historically and analytically rather than devotionally. The research corpus has nine cross-linked Markdown/reference-reader pairs. Eight canonical sources feed the app dataset; `Cited_Persons.md` is intentionally excluded while its entries remain under review.

The owner is not a scholar and does not want to be talked down to. Responses should be dense, direct, and free of hedging. Do not soften findings to be agreeable. The single most valuable thing done in this project so far was auditing prior claims and discovering several were wrong.

**Current phase: consolidation.** The whole-document Markdown-to-reader generator now exists and is CI-gated, but 200 Cited Persons entries remain unresolved. Do not add major new research sections until that verification queue and the control-layer debt are materially reduced. Corrections, source audits, reader synchronization, and control-layer work are allowed.

## Repo structure

```
*.md                          source of truth — edit these
scripts/build-readers.mjs     generates all nine reader HTML files
scripts/build-search-index.mjs generates search-index.json from the readers
scripts/build-reader-site.mjs builds the deployable site
*.html                        GENERATED — never edit by hand
```

## Build

```bash
npm ci
npm run build:readers -- --output .
npm run build:search-index
npm run generate-records
npm run build:standalone
npm run build:reader-site
```

The reader build numbers and IDs headings, converts `#### ⚑ AUDIT` blocks into collapsible cards with status badges, preserves explicit section links, inserts configured cross-document “Connects to” blocks, and generates the sidebar navigation. Bare `§X.Y` text is not auto-linked because a section number alone does not identify its owning reader.

## Verifying a build

Always check for broken anchors after building:

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    for f in ['master-notes','field-guide','history','sources','other-side','translations','method-reference','glossary']:
        pg = b.new_page(); pg.goto(f'file://{PATH}/{f}.html'); pg.wait_for_timeout(1500)
        bad = pg.evaluate('''() => [...document.querySelectorAll('a[href^="#"]')]
            .map(a => a.getAttribute('href'))
            .filter(h => h.length > 1 && !document.getElementById(h.slice(1)))''')
        print(f, bad or 'ok')
```

## Non-negotiable conventions

### 1. The scholarly survey method

For any contested biblical or historical claim:

1. Name the scholars and publications. Never "some scholars argue." Author, title, journal, year.
2. Label the camp in square brackets: `[CRITICAL]`, `[CONSERVATIVE-EVANGELICAL]`, `[NEO-DOCUMENTARIAN]`, `[JEWISH CRITICAL]`, `[MINIMALIST]`, etc. Position is context, not disqualification.
3. Verify by web search. Do not rely on recall. Recall produces confident summaries of positions that do not exist. This has already caused real errors here.
4. Give the strongest case for every side, including the traditional one.
5. State a conclusion with reasoning. A survey that refuses to land is not an answer.
6. Correct overreach openly, then stop hedging.

### 2. Attribution markers

Three markers, rendered as coloured chips by the build:

- `⟨DOCUMENTED⟩` — named scholar, named publication
- `⟨INFERENCE⟩` — Claude's reasoning on documented facts, not published by anyone
- `⟨YOURS⟩` — the owner's own observation

Every analytical leap gets `⟨INFERENCE⟩`. If you write "the mechanism worth naming" or "what this actually demonstrates," that is inference and must be marked. Add a short parenthetical saying which part is documented and which is not.

### 3. Audit format — never overwrite, always append

Original claims are preserved verbatim. Corrections go beneath them as a `#### ⚑ AUDIT — <title>` block, immediately after the section being corrected, followed by `---`.

Required fields, in order:

```markdown
#### ⚑ AUDIT — Short Title

`CHECKED <D Mon YYYY>`

**AS RECORDED:** the original claim, verbatim, with its section reference

**STATUS: Holds / Overstated / Collapses** — one line

**AUDIT**

Named scholars on every side with camp labels. Strongest traditional case included.

**CORRECTED:** *the version that survives, in italics*

**WHY IT LOOKED RIGHT** ⟨INFERENCE⟩**:** what made the original framing attractive
```

The status word drives the badge colour, so it must appear in the STATUS line. `CHECKED` is parsed out and rendered as a date chip — omit it and the audit shows as unverified.

The `WHY IT LOOKED RIGHT` field is the point of the whole exercise. It tracks the pattern of error, not just the error.

### 4. Editing rules

- Edit `.md` only. HTML is generated.
- Adding a section changes the numbering. `scripts/build-readers.mjs` derives IDs from heading numbers (`## 3.2 Foo` → `id="s3-2"`), so renumbering can break every `§3.2` link. Run the anchor and reader-sync checks after structural edits.
- Add technical terms to `Glossary.md`, then regenerate the readers and search index.
- Cross-document links live in `RELATED_BY_DOC` in `scripts/build-readers.mjs`, keyed by output filename.

## Outstanding work

### Task 0 — CLOSED

The original `build.py` and `glossary_data.py` scripts were never committed and are lost. They have been replaced by `scripts/build-readers.mjs`, which generates all nine checked-in reader files from the canonical Markdown. CI regenerates the readers and fails on drift. Do not resume direct HTML maintenance.

### Task 1 — finish the audit queue (the main job)

Seven of roughly thirteen claims are audited. Remaining, from `Bible_Deep_Dive_Master_Notes.md §11.2`, in priority order:

1. Luke softening Roman culpability (§6.3) — medium exposure. Defensible but with real pushback in the literature.
2. Matthew's use of prophecy (§6.2) — the mechanism is well documented; "retrofitted" is loaded framing and should be tested.
3. Isaiah 7:14 — almah / parthenos (§2) — expected to hold, but the conservative counterargument has never been recorded. Cross-reference `Translations.md §5`, which already covers the translation history.
4. Galatians 2 vs. Acts 15 contradiction (§9.3) — real; the degree is argued.
5. Markan priority (§6.1) — near-consensus, likely holds. Note that "most human Jesus" is interpretive gloss, not a finding.
6. ha-satan as adversarial role rather than cosmic villain (§1.3, §2) — expected to hold.

Each gets the full method above. Expect some to survive intact — record that outcome explicitly, since "holds" is a real result and the badge exists for it.

> **Status note (7 Aug 2026):** items 1, 2, 4, 5, and 6 above have since been audited and inserted into `Bible_Deep_Dive_Master_Notes.md` (§11.1/§11.2 now read "11 of 11 complete, queue empty"). Item 3 (Isaiah 7:14 — almah/parthenos) was not part of that batch and is still open.
>
> **Status note (11 Aug 2026):** item 3 (Isaiah 7:14 — almah/parthenos) has since been audited too, closing out Task 1 entirely — Study Notes §11.2 now reads "11 of 11 complete, queue empty," matching the other five. STATUS: Holds — 'almah does not mean virgin, but the "virgin" reading is not Matthew's invention; the Septuagint's parthenos rendering predates him by two centuries. Named sources: Hans Wildberger [CRITICAL], Alec Motyer [CONSERVATIVE-EVANGELICAL]. This correction was also missing from `README.md` and `Method_and_Reference.md` §3, both of which still listed the Study Notes queue as partially open — both corrected in the same pass.

### Task 2 — audit the Observations

`Field_Guide_Conversation_Reference.md §8.4` lists twelve unaudited sections. Two are flagged for early attention:

- §12.8 John 8:44 — must say anti-Jewish, not antisemitic. Antisemitism is a modern racial category (the term dates to 1879) and applying it to a first-century text is anachronistic; it invites a correction that discredits the surrounding argument. Run the case on reception history, which does not require establishing authorial intent. See `Bible_Deep_Dive_Master_Notes.md §8.5`.
- §13 Trinity / Nicaea — verify against `Historical_Framework.md §7`. Nicaea did not vote on the canon and did not invent Jesus's divinity. The documented history concerns an emperor convening a theological dispute, enforcing its outcome, and exiling dissenters.

> **Status note (7 Aug 2026):** the §13 Nicaea/canon mixup has since been corrected in `Field_Guide_Conversation_Reference.md`. §12.8 (John 8:44) is still open.

> **Status note (10 Aug 2026):** the rest of §13 has since been run through a full scholarly-survey audit — four `#### ⚑ AUDIT` blocks inserted at §13.2 (adoptionism-in-Mark: overstated, corrected), §13.3 (Nicaea attendance/dissent numbers: holds, strengthened with real figures), §13.4 (logical questions: overstated by omission — traditional/Chalcedonian answers were missing and are now supplied), and §13.5 (where high Christology comes from: overstated — the late-Hellenistic-import thesis was stated as settled when Hurtado/Bauckham's early-high-Christology case is the mainstream challenger). §12.8 (John 8:44) has since been audited too — terminology corrected to anti-Jewish (not antisemitic, an anachronistic modern racial category), the synagogue-expulsion explanation flagged as Martyn's contested reconstruction rather than settled fact, and the "Judeans" translation explicitly rejected as a fix, following the sourcing already established at `Bible_Deep_Dive_Master_Notes.md` §8.5. Both items originally flagged for early attention under Task 2 are now closed.

### Task 3 — retroactive attribution

`Bible_Deep_Dive_Master_Notes.md §0–§9` and `Field_Guide_Conversation_Reference.md §1–§17` predate the marker convention and are a genuine mix of the owner's notes and Claude's earlier framing. Both documents say so at the top.

Do not fabricate attribution. Where provenance is genuinely unrecoverable, leave it unmarked and leave the disclaimer in place. Where a claim is clearly sourced or clearly analytical, mark it. Accuracy beats coverage here.

### Task 4 — reading continues

Old Testament complete. New Testament through Acts. Currently in the Pauline epistles: Acts → Galatians → Romans → Corinthians.

Galatians, Romans, 1–2 Corinthians are all in the undisputed seven — this is Paul's own voice. The three-tier pseudonymity problem only becomes live at Ephesians and Colossians. See the audit under §6.5.

The live scholarly fault line for this stretch is the New Perspective on Paul — Sanders (1977), Dunn, Wright versus the traditional Lutheran reading. Worth a full survey entry when the reading reaches it.

Also pending from an earlier session: a Deuteronomy review.

> **Status note (7 Aug 2026):** a Galatians opening entry (§9.5, "The Angriest Letter in the Canon") has since been added to `Bible_Deep_Dive_Master_Notes.md`. Galatians 3 (the Abraham argument, the curse of the law, 3:28) and Galatians 4 (the Hagar/Sarah allegory) are queued as the next unit.

## Things that have gone wrong before — do not repeat

- Presenting a hypothesis as a finding. The eleph census argument was recorded as a critical finding. It is primarily an evangelical apologetic tool, and scholars applying the same method get answers spanning 5,550 to 72,000.
- Building a causal story on correlated facts. The delay-of-the-parousia thesis was stated as settled. It is a mid-twentieth-century framework that has been substantially dismantled.
- Repeating a misreading everyone repeats. Thucydides 1.22.1 was cited as licensing invented speeches. He claims fidelity to the general sense of what was said. Both sides misuse it.
- Assuming the "safer" correction is safer. Translating Ioudaioi as "Judeans" looked like a sharpening. Reinhartz and Levine argue against it, and it has been weaponised in a worse direction than the original.
- Citing unverified recall. Two claims were written from memory and flagged as unverified. One was later checked and turned out stronger than written; the other collapsed. Search first.

## Tone

Dense and factual. No rhetorical scaffolding, no walking the reader up to conclusions gradually, no reassurance. Label opinion as opinion. Distinguish documented scholarship from inference every single time. If a finding is inconvenient to the project's direction, say so plainly — that is the whole value of the method.

---

## Note on mobile responsiveness (added 12 Aug 2026)

The original eight `*.html` reader files had a mobile breakpoint at `max-width:1080px` that collapsed the sidebar correctly, but several CSS rules inside the content caused horizontal overflow on phone screens. Fixed in PR #43 (merged 12 Aug 2026), applied uniformly to those eight files; `cited-persons.html` was added afterward and must satisfy the same responsive requirements:

- `.camp{white-space:nowrap}` → `white-space:normal` at mobile breakpoint. Some camp labels are paragraph-length strings; nowrap forced horizontal scroll.
- `.related a{white-space:nowrap}` → `white-space:normal` at mobile breakpoint.
- `.audit .atitle{min-width:14rem}` → `min-width:0` at mobile breakpoint.
- `td:first-child{white-space:nowrap}` → `white-space:normal` at mobile breakpoint.
- `#here` (section-name chip in the sticky toolbar) hidden at mobile breakpoint — was up to `max-width:20rem` and pushed the toolbar past screen edge.
- Added `#overlay` backdrop (semi-transparent, z-index:39) that appears behind the sidebar when open; tapping it closes the sidebar. JS updated to toggle overlay on menu button, dismiss it on overlay click, and clear it on TOC link click.

**Important for anyone changing reader presentation:** edit the CSS/HTML templates in `scripts/build-readers.mjs`, not the generated reader files. Mobile fixes must live in the generator or the next build will overwrite them.

`dist/religion-knowledge-standalone.html` is a separate build (generated by `scripts/build-standalone.mjs` from `app/`) and is already mobile-ready — no changes needed. It was designed mobile-first with `@media (min-width: 720px)` and `@media (min-width: 1024px)` breakpoints scaling up, verified at 375px and 390px with zero horizontal overflow (12 Aug 2026).


---

## Note on the current in-repo pipeline (added 7 Aug 2026)

The replacement reader pipeline is fully committed. `npm run build:readers -- --output .` regenerates all nine reader files from Markdown. CI performs that rebuild, fails on any reader diff, runs `npm run validate:reader-sync`, rebuilds `search-index.json`, and fails on index drift. `npm run sync:reader-audits` remains available for targeted audit-card work but is no longer the only synchronization control.

Separately, the mobile app has a fully committed and CI-enforced pipeline: `scripts/import/parse-markdown.mjs` → `scripts/import/generate-records.mjs` → `data/normalized/generated/records.*.js`, validated by `scripts/import/validate-corpus.mjs`, `scripts/import/validate-app-data.mjs`, `tests/parser.test.mjs`, and `scripts/test-browser.sh` on every PR and direct push to `main`. Its eight-source allowlist intentionally excludes Cited Persons. It recognizes the same `⟨DOCUMENTED⟩` / `⟨INFERENCE⟩` / `⟨YOURS⟩` markers and `#### ⚑ AUDIT` format.
