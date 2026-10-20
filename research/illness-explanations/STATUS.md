# Illness Explanations — Research Status

**Updated:** 2026-10-20  
**Tracking PR:** [#213 — Illness, Gods, and Spirits Before Germ Theory](https://github.com/imanisworld/religion-knowledge/pull/213) (draft)  
**Branch:** `research/illness-explanations-20261020`  
**Canonical/public state:** **NOT MERGED; NOT DEPLOYED; NOT IN LIBRARY OR SEARCH.**  
**Research freeze:** Active. No changes to the nine-document core, reader generator, app dataset, or public navigation.

## 1. What is done

| Item | Status | Evidence |
|---|---|---|
| Working research module | Complete as a bounded first pass | [index.md](index.md), nine sections |
| Primary-text source audit | Six source passages checked against named translations | Deut 28:20–22; Num 16:41–50; Mark 9:17–29; John 9:1–3; Job 4, 8, 42; Sirach 38:1–15 |
| Ancient medicine comparison | Source checked, with limits | Hippocratic *On the Sacred Disease* §1–2; Feder (2017, 2019); Scurlock (2018) abstract |
| Germ-theory milestones | Checked against public research histories | CDC John Snow 1854 / Koch 1882; National Academies overview |
| Claim registry | **13 IL-* records added on PR branch only** | `docs/research/claim-registry.json`; 126 → **139 branch entries** |
| Claim classifications | 7 `verified`; 6 `verified_with_qualification` | Verifications are **internal source checks**, not independent external review |
| Claim registry validation | **PASS — GitHub Actions** | Research Governance run #225: Node validator structure check and nonempty-registry check succeeded; an in-memory duplicate/text/format check also passed |
| Source-document readback | Verified | Source Markdown updated; no publication changes |
| Independent outside audit | **Not started / not complete** | [REVIEW.md](REVIEW.md) handoff now prepared; reviewer and claim-specific verdicts still needed |
| Existing corpus and app CI | **PASS — GitHub Actions** | Religion Corpus run #535 passed parser tests, reader regeneration/sync, search-index checks, app validation, phone-sized Chromium, standalone build; new module remains unregistered/unpublished |

**Counting policy:** The 139 records are the **claim registry on this branch**, not the canonical registry on `main`. PR #212 independently edits the registry and must be reconciled if either PR advances. The thirteen statuses indicate how far the primary/secondary *source checks* went, not third-party review or approval to publish.

## 2. Corrections made after first pass

1. **Hippocratic text:** *On the Sacred Disease* §1 explicitly criticizes practitioners who claim recovery credit but deflect failure to gods. This is an accusation in an ancient polemic, not a demonstrated description of all healers.
2. **Hippocratic dating/authorship:** Anonymous, multi-author corpus; placed generally in the late fifth/fourth centuries BCE. Avoid treating “Hippocrates wrote it in exactly 400 BCE” as established.
3. **John 9:** Rejection of sin as the explanation for congenital blindness coexists with a theological explanation in the same passage.
4. **Sirach 38:** Affirmation of physicians, medicines, prayer, repentance and sacrifice includes v. 15's warning about sinners and physicians.
5. **Job:** The challenge to simplistic retribution follows from reading the dialogue and epilogue together. Job 42:7 by itself cannot identify every rejected statement.
6. **Sources:** Replaced inaccessible/NCBI source link with National Academies reading copy. Identified Oxford and Cambridge chapters that were checked **at abstract level only**.

## 3. What remains before publication

| Priority | Work | Why blocked |
|---|---|---|
| 1 | **External independent claim review** of 13 entries | No independent reviewer’s findings yet; check texts, interpretation, stated confidence |
| 2 | **Original-language audit** for contested terms and passages | No full Hebrew/Greek philological audit has been performed |
| 3 | **Verify paywalled chapters** (Scurlock, Lawrence, Cambridge medicine chapter) and the primary Mari editions; reconcile Feder's distinct 2017/2019 arguments | Abstract-level or secondary quotation is an evidential limit |
| 4 | **Reconcile open PR #212 registry edits and any changes to main** | Branch's 126-entry baseline may be stale when merge is considered |
| 5 | **Public reader/search integration after freeze lifted** | Existing corpus/registry CI already passed, but the new module is not registered. Re-run after integration, against latest `main`, and avoid #202 shared-generator conflicts |
| 6 | **Explicit review, merge, publication, and deploy approvals** | Draft PR is noncanonical; main alone is citable/deployable |

## 4. Next safe action

Send the [review brief](REVIEW.md), thirteen staged registry claims, and [index.md](index.md) to an **independent reviewer** with instructions to check primary texts, all interpretive claims, dating, historical medicine sources, and the distinction between narrative and biomedical evidence. Require one explicit verdict per claim ID, exact primary/secondary locators, and corrections where applicable. Apply findings to this branch, then rerun registry and build checks. Keep the draft held until the repository freeze/merge policy permits research expansion.

## 5. Connected existing project work

- `Field_Guide_Conversation_Reference.md` §14.4: God of the gaps.
- `Field_Guide_Conversation_Reference.md` §5.1: Gospel healings.
- `Bible_Deep_Dive_Master_Notes.md` §1.6: Misattribution of healing.
- `Bible_Deep_Dive_Master_Notes.md` §9.6.5: Deuteronomy 28 covenant curses.

The core files above have **not** been changed in PR #213. They are conceptual pointers for eventual integration.
