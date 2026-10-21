# Repository Status

**Canonical branch:** `main`  
**Authoritative deployment config:** `wrangler.jsonc` (supersedes `wrangler.toml` — see note below)  
**Last content audit:** 2026-09-26  
**Last research governance update:** 2026-10-20  
**Draft Religion & Law release tracker:** [research/religion-law/TODO.md](research/religion-law/TODO.md) (PR #240; not yet canonical)
**Research edition:** pre-1.0 (versioned releases pending)

---

## Repository handoff — 20 October 2026

**Latest verified baseline:** PR [#248](https://github.com/imanisworld/religion-knowledge/pull/248) merged into `main` at `2a61696f641c648a3642f49e7a04424253a3b0a4` with the Gender Over Time neutral-palette, legibility and evidence-label update. Its [Cloudflare deploy workflow](https://github.com/imanisworld/religion-knowledge/actions/runs/39524339537) was reported successful; a separate independent public HTTP/render check was unavailable. New branches must preserve this deployed design, not restore older Gender reader files.

**Other completed research/integration changes on `main`:** #216 (171-person source-discovery queue, no unsupported status promotions), #222 (18 traditions claims kept in research-only draft data, no public claim-count inflation), #246 (Buckinghamshire swearing-record transcription/identity review, research-only), and #247 (catalog coverage/evidence transparency; replaces closed, unmerged #239 and #243). The separate #212 was **closed without merging**. These merges do not override unresolved source or publication gates.

**Open consolidated release:** [PR #240](https://github.com/imanisworld/religion-knowledge/pull/240) integrates Religion & Law work from still-open drafts #218, #219, #221, #223 and #225. Its last content/CI-validated source-confidence snapshot was `c528356` ([corpus CI](https://github.com/imanisworld/religion-knowledge/actions/runs/39525544214), [governance CI](https://github.com/imanisworld/religion-knowledge/actions/runs/39525544213), both passed). The candidate includes #248 with no changed Gender files. **#240 remains draft, unmerged, unapproved and undeployed.** Document-only changes after that CI snapshot require fresh current-head checks. The next step is explicit owner acceptance of a documented **qualified first-pass** release *or* independent source review, followed by final checks, merge, deploy verification and closure of superseded drafts. See [Religion & Law TODO](research/religion-law/TODO.md).

---

## Prophecies and Illness — bounded research releases (20 October 2026)

- **PR #202 merged:** Biblical Prophecy Audit, 65 AI-reviewed research cases and 70 Search sections. The original 50-locus seed is mapped; 21 additional leads and further original-language/scholarly source checking remain open. See `research/prophecy-audit/STATUS.md`.
- **PR #213 merged:** Illness Explanations, 13 AI-reviewed claims (4 internally verified and 9 qualified), a nine-section public reader, and 9 Search sections. Canonical claim registry now has **139 unique entries** with the previous 126 unchanged. See `research/illness-explanations/STATUS.md`.
- **Release checks:** Both corpus and research-governance checks passed on merge commit `cf756397`. [Cloudflare deployment workflow](https://github.com/imanisworld/religion-knowledge/actions/runs/39492093720) succeeded for that commit, serving the `religion-knowledge` worker. A separate unauthenticated HTTP check of the live pages could not be completed from the review environment.
- **Evidence controls:** The owner accepted source limitations and waived outside specialist review for these bounded editions only. Unchecked original-language passages, unread paywalled studies and the primary Mari tablets remain flagged. PR #212 was closed **without merging**; its unverified Cited Persons promotions were not incorporated into `main`. The broader consolidation freeze remains in force.

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

**On the unmerged #240 branch only:** 50 first-pass state profiles (8 expanded anchors); **59 records in the classifiable state-law dataset across 16 states**, **34 states without normalized classifiable state-law records**, and one Texas §21.06 legal record retained **outside A–E** because its 1973 provision-specific motive is unresolved. The separate demographic/officeholder context has 50 state slots: **50 have verified first-pass context coverage; 0 remain uncoded**, while unknown and historically sourced affiliations remain explicitly qualified. Context coverage is neither proof of current membership nor a legal-causation dataset. On Montana, current legal authorities are distinguishable from a **provisional 1972 mixed-causation interpretation** (transcript OCR/secondary scholarship, without independent original Vol. VI page-image and Vol. II committee inspection). These proposed figures and reader fixes are **not production facts until PR #240 merges**.

The state gap-closure research is consolidated in **draft #240**. Publicly visible reader edits, confidence/coverage labels, Texas and Montana correction records, and the new release checklist all remain **pending source-gate approval and merge**. The tracked gaps are Montana original convention pages and committee records, Texas HB 514 / SB 34 provision-specific intent, dated officeholder sources, court-case/current-law inventories and the remaining 34 states' normalized law rows. The 8 expanded legal profiles are research baselines, not complete state-law encyclopedias. See [module TODO](research/religion-law/TODO.md) and [release-readiness review](research/religion-law/reviews/2026-10-20-release-readiness.md).

---

## Cited Persons Follow-up (20 October 2026)

A separate five-entry source-discovery pass addressed Archer, Barton, Briggs, MacDonald and MacIntyre. Bibliography was corroborated for some, but author/source-page passages remain missing. **All five remain `UNRESOLVED`.** The canonical total is **194 documented / 171 unresolved of 365**. Merged #216 records the 171-case research first pass without changing those public counts; closed, unmerged #212 must not be used to add six promotions. See `docs/research/cited-persons-five-entry-followup-20261020.md` and `docs/research/cited-persons-source-readiness-20261020.md`.

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
