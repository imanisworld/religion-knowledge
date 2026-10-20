# Repository Status

**Canonical branch:** `main`  
**Authoritative deployment config:** `wrangler.jsonc` (supersedes `wrangler.toml` — see note below)  
**Last content audit:** 2026-09-26  
**Last research governance update:** 2026-10-20  
**Research edition:** pre-1.0 (versioned releases pending)

---

## Prophecies and Illness — bounded research releases (20 October 2026)

- **PR #202 merged:** Biblical Prophecy Audit, 65 AI-reviewed research cases and 70 Search sections. The original 50-locus seed is mapped; 21 additional leads and further original-language/scholarly source checking remain open. See `research/prophecy-audit/STATUS.md`.
- **PR #213 merged:** Illness Explanations, 13 AI-reviewed claims (4 internally verified and 9 qualified), a nine-section public reader, and 9 Search sections. Canonical claim registry now has **139 unique entries** with the previous 126 unchanged. See `research/illness-explanations/STATUS.md`.
- **Release checks:** Both corpus and research-governance checks passed on merge commit `cf756397`. [Cloudflare deployment workflow](https://github.com/imanisworld/religion-knowledge/actions/runs/39492093720) succeeded for that commit, serving the `religion-knowledge` worker. A separate unauthenticated HTTP check of the live pages could not be completed from the review environment.
- **Evidence controls:** The owner accepted source limitations and waived outside specialist review for these bounded editions only. Unchecked original-language passages, unread paywalled studies and the primary Mari tablets remain flagged. PR #212 remains a separate draft; its unverified Cited Persons promotions were not merged. The broader consolidation freeze remains in force.

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
| `Cited_Persons.md` | 2026-10-20 marker recount; independent review incomplete | 🔄 Partial | 194 documented / 171 unresolved of 365; five-entry source follow-up does not close a case |
| `Glossary.md` | Pending | ⚠️ Unreviewed | Full audit in progress |

## Religion & Law Coverage (20 October 2026)

The U.S. research has **50 first-pass state profiles**, including **8 expanded priority states**. Its structured `us-state-starter.json` currently contains **59 source-classified state-law records from 16 states (pending PR #218 review), plus one Texas §21.06 provision-specific causation record held outside the A–E comparison**. The separate `us-state-context.json` has **50 state slots**, of which all **50 have verified first-pass demographic/officeholder context** (**0 remain uncoded**; officeholder data as of 20 October 2026). This is partial research coverage; the record count must not be presented as completed legal coverage of every state.

The old research branch `research/state-gap-closure-20260927` is **not merged into `main`** as of this note. It contains five gap-closure research files for Texas, Maine, Montana, cross-state inventories, and a local README. Review/port independently; its conclusions do not alter the canonical 8-state status until accepted.

---

## Cited Persons Follow-up (20 October 2026)

A separate five-entry Perplexity source-discovery batch addressed Archer, Barton, Briggs, MacDonald, and MacIntyre. Bibliographic information was corroborated for some entries, but the needed primary/source-page checks remain outstanding. **All five retain their `UNRESOLVED` markers**; do not subtract them from the 171-person queue. See `docs/research/cited-persons-five-entry-followup-20261020.md`.

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
