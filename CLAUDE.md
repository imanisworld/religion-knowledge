# CLAUDE.md — Bible Deep Dive

Instructions for Claude Code working in this repo. Read this before touching anything.

## What this is

A long-running critical study of the Bible and religious belief systems, approached historically and analytically rather than devotionally. Seven cross-linked reference documents, written in Markdown, built into a static HTML site.

The owner is not a scholar and does not want to be talked down to. Responses should be dense, direct, and free of hedging. Do not soften findings to be agreeable. The single most valuable thing done in this project so far was auditing prior claims and discovering several were wrong.

## Repo structure

```
*.md                 source of truth — edit these
build.py             generates the HTML site from the .md files
glossary_data.py     GLOSSARY dict + RELATED_BY_DOC cross-link map
*.html               GENERATED — never edit by hand, they are overwritten
index.html           redirect to master-notes.html (hand-written, not generated)
```

## Build

```bash
pip install beautifulsoup4 --break-system-packages
# pandoc must be installed

for pair in "Bible_Deep_Dive_Master_Notes:master" \
            "Field_Guide_Conversation_Reference:field" \
            "Historical_Framework:hist" \
            "Sources_and_Primary_Texts:src" \
            "The_Other_Side:other" \
            "Translations:trans" \
            "Glossary:gloss"; do
  src="${pair%%:*}"; dst="${pair##*:}"
  pandoc "$src.md" -t html5 -o "${dst}_frag.html"
done
python3 build.py
```

`build.py` writes to `/mnt/user-data/outputs/` — change those paths to `./` before first use in this repo. That is task 0.

What the build does: numbers and IDs every heading, converts `#### ⚑ AUDIT` blocks into collapsible cards with status badges, linkifies `§X.Y` references, injects glossary tooltips on first use per document, inserts cross-document "Connects to" blocks, and generates the sidebar nav.

## Verifying a build

Always check for broken anchors after building:

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    for f in ['master-notes','field-guide','history','sources','other-side','translations','glossary']:
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
- Adding a section changes the numbering. `build.py` derives IDs from heading numbers (`## 3.2 Foo` → `id="s3-2"`), so renumbering silently breaks every `§3.2` link. Run the anchor check after any structural edit.
- New technical terms go in `glossary_data.py`, then regenerate `Glossary.md` from that dict — do not hand-edit the glossary page.
- Cross-document links live in `RELATED_BY_DOC` in `build.py`, keyed by output filename.

## Outstanding work

### Task 0 — make the build work in-repo

Change the hardcoded `/mnt/user-data/outputs/` paths in `build.py` to relative paths. Add a `Makefile` or `build.sh` wrapping the pandoc loop plus `python3 build.py`. Consider a GitHub Action that rebuilds on push to `main` and publishes to Pages.

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

### Task 2 — audit the Observations

`Field_Guide_Conversation_Reference.md §8.4` lists twelve unaudited sections. Two are flagged for early attention:

- §12.8 John 8:44 — must say anti-Jewish, not antisemitic. Antisemitism is a modern racial category (the term dates to 1879) and applying it to a first-century text is anachronistic; it invites a correction that discredits the surrounding argument. Run the case on reception history, which does not require establishing authorial intent. See `Bible_Deep_Dive_Master_Notes.md §8.5`.
- §13 Trinity / Nicaea — verify against `Historical_Framework.md §7` before use. Nicaea did not vote on the canon and did not invent Jesus's divinity. The popular skeptic version is false and easily refuted. The true version — an emperor convening a theological dispute and exiling the losers — is the stronger argument.

> **Status note (7 Aug 2026):** the §13 Nicaea/canon mixup has since been corrected in `Field_Guide_Conversation_Reference.md`. §12.8 (John 8:44) is still open.

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

## Note on the current in-repo pipeline (added 7 Aug 2026)

The `build.py` / `glossary_data.py` / pandoc pipeline described above is **not yet committed to this repo** (Task 0 is still open). The seven `*.html` readers currently in the repo (`master-notes.html`, `field-guide.html`, `glossary.html`, `history.html`, `sources.html`, `other-side.html`, `translations.html`) were produced by that pipeline elsewhere and checked in as static files; nothing in this repo's CI regenerates or validates their content against the `.md` sources — `scripts/import/validate-corpus.mjs` only checks that each canonical `.md` file has a correspondingly named `.html` file, not that its content matches.

Separately, this repo has a second, fully-committed and CI-enforced pipeline that the mobile app depends on: `scripts/import/parse-markdown.mjs` → `scripts/import/generate-records.mjs` → `data/normalized/generated/records.*.js`, validated by `scripts/import/validate-corpus.mjs`, `scripts/import/validate-app-data.mjs`, `tests/parser.test.mjs`, and `scripts/test-browser.sh` on every PR via `.github/workflows/validate-corpus.yml`. It recognizes the same `⟨DOCUMENTED⟩` / `⟨INFERENCE⟩` / `⟨YOURS⟩` markers and the same `#### ⚑ AUDIT` block format described above, so edits made under this file's conventions parse correctly into the app's data layer without further work. Keep both pipelines in mind: edits to the `.md` files feed the app automatically; getting them to also regenerate the polished `.html` readers still requires Task 0.
