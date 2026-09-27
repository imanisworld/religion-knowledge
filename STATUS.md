# Repository Status

**Canonical branch:** `main`  
**Authoritative deployment config:** `wrangler.jsonc` (supersedes `wrangler.toml` — see note below)  
**Last content audit:** 2026-09-26  
**Last research governance update:** 2026-09-26  
**Research edition:** pre-1.0 (versioned releases pending)

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
| `Cited_Persons.md` | Pending | ⚠️ Unreviewed | Full audit in progress |
| `Glossary.md` | Pending | ⚠️ Unreviewed | Full audit in progress |

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
- Search index (`search-index.json`) not yet verified as current with source Markdown
- Several research sections listed above are unreviewed — see `docs/research/claim-registry.json` for tracking
- Site footer does not yet display commit SHA or content-build timestamp
- Versioned public releases not yet tagged
