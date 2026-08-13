# Bible Deep Dive — Document Set

*Nine-document research corpus. Last rebuilt August 2026.*

## The two formats, and why it matters

**`.md` files → put these in Project knowledge.** Plain text. Claude reads them cleanly and searches them well.

**`.html` files → do NOT put these in Project knowledge.** They are for *reading* — bookmark them or keep them in a folder. Each one is 60–80% invisible markup (styling, scripts, tooltips). Putting them in Project knowledge fills it with code instead of content and makes searches worse, not better.

The Markdown is canonical. Each canonical document has a reader representation, and CI verifies that every checked audit in Markdown is present in its reader. The polished readers are not yet generated wholesale from Markdown; do not assume arbitrary prose edits have propagated until the reader-sync check and build pass.

## Attribution markers

Three markers run through every document, so you always know whose claim you are looking at:

- **⟨DOCUMENTED⟩** — a named scholar in a named publication. Checkable.
- **⟨INFERENCE⟩** — Claude's reasoning on top of documented facts. Not published by anyone. Never cite it as though it were.
- **⟨YOURS⟩** — your own observation, kept because it survived scrutiny.

Audit entries also carry a `CHECKED` date. Anything without one has not been verified.

**Honest limitation:** the older sections of the Study Notes and Observations predate this convention and are a genuine mix of your notes and Claude's earlier framing. They cannot be cleanly separated after the fact, and each document says so at the top. Everything written from 7 August 2026 onward is marked.

## The documents

| # | Document | What it holds |
|---|---|---|
| 1 | **Study Notes** | Findings and textual analysis from the reading, with audit corrections filed inline beneath the claims they revise |
| 2 | **Observations** | Reading observations, common claims, contextual notes, and questions for conversation |
| 3 | **Historical Framework** | Chronology, historical context, how evidence works, and commonly misstated claims |
| 4 | **Sources & Primary Texts** | What each primary source says, with links to free full texts |
| 5 | **The Strongest Case** | Theologians and apologists worth engaging, plus how the literal/allegorical switch works |
| 6 | **Translations** | Translation philosophies, committee bias, and where versions diverge |
| 7 | **Method & Reference** | Survey method, where to look things up, audit-status tracking, and the reading timeline |
| 8 | **Glossary** | Every technical term in plain English |
| 9 | **Cited Persons** | A source-orientation index showing who cited people are, their positions, and flags requiring verification |

### Two corpus scopes

- **Research corpus:** nine Markdown documents / nine reader HTML documents, including `Cited_Persons.md`.
- **App dataset:** eight canonical sources. Cited Persons is intentionally excluded while its 360-entry source audit remains incomplete; including the index would duplicate person descriptions already embedded throughout the study while presenting partially audited reference material as app-ready data.

## Reading order for the HTML set

Open `master-notes.html` first. All nine link to each other from the sidebar — keep them in the same folder or the links break.

## Current status

- **Consolidation freeze:** do not add major new research sections until a whole-document Markdown-to-reader generator is committed and the Cited Persons verification queue is materially reduced. Corrections, source audits, and control-layer work remain in scope.
- Audit: Study Notes queue closed — 11 of 11 complete (§11.2). Observations queue in progress — see Method & Reference §4.
- Reading: Old Testament complete; New Testament through Acts; Pauline epistles in progress (Acts → Galatians → Romans → Corinthians).
- Standing method at Study Notes §11.1 — applies to everything.
