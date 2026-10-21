# Repository Status

**Canonical branch:** `main`  
**Authoritative deployment config:** `wrangler.jsonc` (supersedes `wrangler.toml` — see note below)  
**Last content audit:** 2026-09-26  
**Last research governance update:** 2026-10-20  
**Research edition:** pre-1.0 (versioned releases pending)  
**Religion & Law branch handoff:** [research/religion-law/TODO.md](research/religion-law/TODO.md) — draft PR #240; hold for owner source-limit decision

---

## Latest verified checkpoint — 20 October 2026 (US Eastern)

The following are distinct statuses: **merged to `main`**, **deployed**, **automated-test passed**, **human visual-reviewed**, and **research approved for public publication**. One status does not imply another.

| Workstream | Verified state | Remaining gate |
| --- | --- | --- |
| **Gender Over Time readability** | [PR #248](https://github.com/imanisworld/religion-knowledge/pull/248) **merged** at `2a61696f`; [Cloudflare deployment run 39524339537](https://github.com/imanisworld/religion-knowledge/actions/runs/39524339537) **succeeded** for that exact commit. The neutral light/dark palettes, larger case text and textual evidence labels are on `main`. | A separate unauthenticated live-page visual inspection was unavailable. Preserve this exact styling in future branches and deployments; do not use the pre-#248 colors. |
| **Gender browser visual QA** | [Draft PR #251](https://github.com/imanisworld/religion-knowledge/pull/251) **open and unmerged**. Its [browser QA run 39525306997](https://github.com/imanisworld/religion-knowledge/actions/runs/39525306997) passed Chromium DOM/layout checks at **1280×800 / 390×844** in both light/dark modes and uploaded screenshot artifacts; corpus and research-governance checks also passed for the PR head. | **Human review of the four screenshots** for typography, case-card spacing, label readability and overflow, followed by review/merge of #251 if acceptable. No claim of completed human visual QA. |
| **Cursing / cussing / classism historical dataset** | [PR #246](https://github.com/imanisworld/religion-knowledge/pull/246) **merged** to `main` as **internal research/control files only** (CSV, identity-review notes, tests). Its Buckinghamshire dataset has **355 recorded name appearances** from **34 indexed pages**, **350 index-weighted references**, **52 explicit fines totaling 172 nominal shillings**, and **32 candidate repeated-name groups**. | Original manuscript/facsimile verification, row-level error review, actual person linkage, and scholarly review; **355 is not 355 unique defendants or convictions**, nor an observed class-specific prosecution rate. |
| **Cursing / cussing / classism wider research** | [Issue #234](https://github.com/imanisworld/religion-knowledge/issues/234) remains **open**, with **14 recorded research passes** covering biblical/textual categories, legal rank tiers, named paid fines, stocks and Bridewell news reports, parish redistribution and historical wage comparisons. | A sourced synthesis with distinct documented/inference/unresolved labels; additional original-text checks and authorization under the consolidation freeze before creating a public module. **No public reader, Search module or app-data promotion.** |
| **Cited Persons source gate** | Current canonical count for this checkpoint: **194 documented / 171 unresolved of 365**, as recorded in the status test and corpus; [PR #212](https://github.com/imanisworld/religion-knowledge/pull/212) is **closed, unmerged**. [Merged #216](https://github.com/imanisworld/religion-knowledge/pull/216) records a 171-case source-discovery first pass, **without changing person statuses**. | Require verifiable original source passages before upgrading cases; begin with Archer, Barton, Briggs, MacDonald and MacIntyre. Prior `200/165` proposals are not canonical. |
| **Religion & Law — consolidated draft** | [PR #240](https://github.com/imanisworld/religion-knowledge/pull/240) remains **draft, unmerged and undeployed**. Its proposed dataset has **59 classified law records across 16 states**, 50 first-pass state profiles/context slots and one separate Texas §21.06 causation hold. The technical snapshot `c528356` passed [corpus](https://github.com/imanisworld/religion-knowledge/actions/runs/39525544214) and [governance](https://github.com/imanisworld/religion-knowledge/actions/runs/39525544213) checks, before later status/TODO changes. | Explicit owner acceptance of named limitations **or** independent primary review; fresh final-HEAD CI; reconcile against latest main (preserving #248 and #251 work), then merge/deploy verification. Superseded drafts #218/#219/#221/#223/#225 stay open until #240 merges. [Release TODO](research/religion-law/TODO.md). |

**Other merged research/control changes:** [#222](https://github.com/imanisworld/religion-knowledge/pull/222) retained 18 traditions claims in research-only draft data; [#247](https://github.com/imanisworld/religion-knowledge/pull/247) reconciled public catalog coverage/evidence labels and superseded closed, unmerged #239/#243. Their merge status should not be confused with independent historical source verification.

**To-do source:** [Repository TODO](TODO.md); module follow-ups: [Religion & Law TODO](research/religion-law/TODO.md) and [Cursing & Classism TODO](research/cursing-classism/TODO.md). Other module-owned queues (for example the [Prophecy Audit TODO](research/prophecy-audit/TODO.md)) remain separate. **General consolidation freeze remains in force** except explicitly authorized bounded releases. This status update does not itself authorize a new public research chapter or an unrelated deployment.

---

## Prophecies and Illness — bounded research releases (20 October 2026)

- **PR #202 merged:** Biblical Prophecy Audit, 65 AI-reviewed research cases and 70 Search sections. The original 50-locus seed is mapped; 21 additional leads and further original-language/scholarly source checking remain open. See `research/prophecy-audit/STATUS.md`.
- **PR #213 merged:** Illness Explanations, 13 AI-reviewed claims (4 internally verified and 9 qualified), a nine-section public reader, and 9 Search sections. Canonical claim registry now has **139 unique entries** with the previous 126 unchanged. See `research/illness-explanations/STATUS.md`.
- **Release checks:** Both corpus and research-governance checks passed on merge commit `cf756397`. [Cloudflare deployment workflow](https://github.com/imanisworld/religion-knowledge/actions/runs/39492093720) succeeded for that commit, serving the `religion-knowledge` worker. A separate unauthenticated HTTP check of the live pages could not be completed from the review environment.
- **Evidence controls:** The owner accepted source limitations and waived outside specialist review for these bounded editions only. Unchecked original-language passages, unread paywalled studies and the primary Mari tablets remain flagged. PR #212 was closed without merge; its unverified Cited Persons promotions are not canonical. The broader consolidation freeze remains in force.

---

## Canonical Branch and Publication Policy

`main` is the only branch that is considered canonical, deployable, and citable. All other branches are working branches — experimental, in-progress, or awaiting review. No branch other than `main` should be linked to, cited, or treated as reflecting the project's current research state.

Every change to research content on `main` must arrive through a pull request. The `.github/pull_request_template.md` checklist is required for any PR that adds or changes a factual or interpretive claim.

---

## Deployment Configuration

This repository contains both `wrangler.jsonc` and `wrangler.toml`. **`wrangler.jsonc` is the authoritative configuration.** `wrangler.toml` is a legacy stub retained temporarily during migration. Once the `wrangler.jsonc` configuration has been validated in production, `wrangler.toml` should be deleted and this note updated.

---

## Research Review Status

| Document | Last fact-check | Status | Unresolved items |
|---|---|---|---|
| `Method_and_Reference.md` | 2026-08-10 | ✅ Reviewed | None |
| `Historical_Framework.md` | Pending | ⚠️ Unreviewed | Full audit in progress |
| `Translations.md` | Pending | ⚠️ Unreviewed | Full audit in progress |
| `The_Other_Side.md` | Pending | ⚠️ Unreviewed | Full audit in progress |
| `Bible_Deep_Dive_Master_Notes.md` | Partial (see Method §3–4) | 🔄 Partial | §1, §2, §5, §7, §8.6 audited; others pending |
| `Field_Guide_Conversation_Reference.md` | Partial (see Method §4) | 🔄 Partial | §3.1, §4.1, §8, §13 audited; §1,2,5,9–12,14–17 pending |
| `Sources_and_Primary_Texts.md` | Pending | ⚠️ Unreviewed | Full audit in progress |
| `Cited_Persons.md` | 2026-10-20 marker recount; independent review incomplete | 🔄 Partial | 194 documented / 171 unresolved of 365 (six Paul-and-the-law entries corrected in PR #212 but held unresolved pending original author passages); five-entry source follow-up does not close a case |
| `Glossary.md` | Pending | ⚠️ Unreviewed | Full audit in progress |

## Religion & Law Coverage (20 October 2026)

**Release classification: proposed in draft #240, not yet canonical or deployed.** The branch has **50 first-pass state profiles** (8 expanded anchor profiles), **59 records in the classifiable state-law dataset across 16 states**, and **34 states without normalized classifiable law records**. One additional Texas §21.06 legal record is held **outside A–E** because the provision-specific 1973 enactment motive remains unresolved. Its legal text and *Lawrence* status are documented independently.

The separate `us-state-context.json` branch dataset contains 50 state slots: **50 have verified first-pass demographic/officeholder coverage and 0 remain uncoded**. This first pass includes dated biography sources and unknown present-day religious affiliations; no membership or law causation is inferred from those sources. Montana's 1972 no-aid convention motive account is **provisional**, based on original-transcript OCR and secondary-source cross-checks; independent original Vol. VI page-image and Vol. II committee checks are pending.

The confidence/coverage reader corrections and search update are committed to #240, with [release-readiness review](research/religion-law/reviews/2026-10-20-release-readiness.md) and [source/release TODO](research/religion-law/TODO.md). **No Religion & Law owner waiver or independent source signoff has been recorded.** A green workflow validates code and consistency, not a historical conclusion. Revalidate the newest `main` and the final PR SHA before any approved publication. Close the stacked drafts only after an actual merge.

---

## Cited Persons Follow-up (20 October 2026)

A separate five-entry source-discovery batch addressed Archer, Barton, Briggs, MacDonald, and MacIntyre. Bibliographic information was corroborated for some entries, but the needed source-page checks remain outstanding. **All five remain `UNRESOLVED`.** The current canonical snapshot is **194 documented / 171 unresolved of 365**. An earlier follow-up note referenced a proposed **200/165** state associated with [PR #212](https://github.com/imanisworld/religion-knowledge/pull/212), which is **closed without merge**; do not use that proposal as a completed source upgrade. See `docs/research/cited-persons-five-entry-followup-20261020.md`.

---

## Claim Provenance Layer

A machine-readable claim registry lives at `docs/research/claim-registry.json`. It records individual factual and interpretive claims, their source support, confidence levels, claim type, public location, and review date. The schema is at `docs/research/claim-registry.schema.json`. The `scripts/validate-claim-registry.mjs` script enforces structural integrity and is run by CI on every PR and push to `main`.

Claims not yet entered into the registry should be treated as unreviewed regardless of whether they appear in an audited section.

---

## Correction Policy

Corrections from readers are accepted via GitHub Issues using the correction label. A correction submission must include:

1. The exact claim being disputed
2. The public page and section where it appears
3. The proposed correction
4. A source supporting the correction (author, title, page or URL)

Test or spam submissions will be closed with label `invalid/test` without prejudice. All substantive corrections are tracked and credited.

---

## Versioning

This project does not yet have tagged public releases. Until versioning is established, readers should note the commit SHA shown in the site footer (once implemented) to identify the exact research state they are reading. Tagged releases (`v1.0`, etc.) are planned once the core research documents complete their first full audit pass.

---

## Known Open Issues

- `wrangler.toml` deprecation not yet completed
- Search indexing is CI-verified against the committed readers and research modules; generated results are checked for drift on every PR and push to `main`.
- Several research sections listed above are unreviewed — see `docs/research/claim-registry.json` for tracking
- Site footer does not yet display commit SHA or content-build timestamp
- Versioned public releases not yet tagged
