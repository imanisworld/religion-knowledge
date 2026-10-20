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
| Primary-text source audit | Six source passages checked against named translations | Deut 28:21–22; Num 16:46–50 (context 16:41–50); Mark 9:17–29; John 9:1–3; Job 4, 8, 42; Sirach 38:1–15 |
| Ancient medicine comparison | Source checked, with limits | Hippocratic *On the Sacred Disease* §1–2; Feder (2017, 2019); Scurlock (2018) abstract |
| Germ-theory milestones | Checked against public research histories | CDC John Snow 1854 / Koch 1882; National Academies overview |
| Claim registry | **13 IL-* records added on PR branch only** | `docs/research/claim-registry.json`; 126 → **139 branch entries** |
| Claim classifications | 4 `verified`; 8 `verified_with_qualification`; 1 `needs_qualification` (after pre-review corrections) | Verifications are **internal source checks**, not independent external review |
| Claim registry validation | **PASS — GitHub Actions** | Research Governance run #225: Node validator structure check and nonempty-registry check succeeded; an in-memory duplicate/text/format check also passed |
| Source-document readback | Verified | Source Markdown updated; no publication changes |
| Adversarial pre-review | **Done 20 Oct — internal, not independent** | [PRE-REVIEW.md](PRE-REVIEW.md): 5 hold; 7 hold with qualification ; `IL-HIPBLAME-001` unresolved. **Corrections applied 20 Oct:** `IL-JOHN-001` and `IL-SIRACH-001` downgraded to `verified_with_qualification`; `IL-HIPBLAME-001` to `needs_qualification`; John, Job, Sirach, Mari, Mesopotamian-roles and Snow wording corrected; Poirier, Zapff, Neufeld and MSU Snow sources added |
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
7. **Registry claim texts (20 Oct):** `IL-MARI-001` and `IL-TZARAAT-001` held sentence fragments; both are now complete sentences drawn from the module's own wording.
8. **Verse ranges (20 Oct):** Registry locators corrected to Deut 28:21–22 and Num 16:46–50 (context 41–50) to match the module table. Checked via ESV verse results only; the cited NABRE and NRSVue pages were unreachable.
9. **Scurlock (20 Oct):** The specific claims about `āšipu`/`asû` specialists and contagion are now marked **unverified** in the module. The abstract they relied on could not be reached to confirm them.
10. **Feder label (20 Oct):** One camp label, `[CRITICAL]`, is now used in both sections.

## 3. What remains before publication

| Priority | Work | Why blocked |
|---|---|---|
| 1 | **External independent claim review** of 13 entries | No independent reviewer’s findings yet; check texts, interpretation, stated confidence |
| 2 | **Original-language audit** for contested terms and passages | No full Hebrew/Greek philological audit has been performed |
| 3 | **Verify paywalled chapters** (Scurlock, Lawrence, Cambridge medicine chapter) and the primary Mari editions; reconcile Feder's distinct 2017/2019 arguments | Abstract-level or secondary quotation is an evidential limit |
| 4 | **Reconcile open PR #212 registry edits and any changes to main** | Conflict confirmed and procedure rehearsed; see §3a. Re-check counts at merge time |
| 5 | **Public reader/search integration after freeze lifted** | Existing corpus/registry CI already passed, but the new module is not registered. Re-run after integration, against latest `main`, and avoid #202 shared-generator conflicts |
| 6 | **Explicit review, merge, publication, and deploy approvals** | Draft PR is noncanonical; main alone is citable/deployable |

## 3a. Registry reconciliation with PR #212

Verified on 20 October 2026 against `main` at `ab55625` and PR #212 at `6b096b1`:

- `main` has **126** registry entries. PR #212 adds **9** (`CP-ARCHER-001`, `CP-BARTON-001`, `CP-BARTON-002`, `CP-BRIGGS-001`, `CP-SCHREIN-001`, `LC-NPPNAME-001`, `LC-SANDERS-001`, `LC-SUPERSESS-001`, `LC-TRIPART-001`). This branch adds **13** (`IL-*`). **No IDs overlap**, and neither branch alters any existing entry.
- Both branches append after the same final entry, so whichever merges second gets a **certain textual conflict in `docs/research/claim-registry.json`**. It is the only conflicting file: root `STATUS.md` merges automatically, and PR #212 merges cleanly into `main` by itself.
- **Expected order:** PR #212 first, because this branch is held for independent review and the research freeze.

**Resolution procedure (for whichever PR merges second):**

1. Merge current `main` into the branch. Do not rebase a shared branch.
2. In `claim-registry.json`, keep every entry already on `main` exactly as it is, then append this branch's entries after them. Never accept a whole-file "ours" or "theirs" version; either one silently drops the other PR's claims.
3. Check that the entry count equals `main`'s count plus this branch's additions (**126 + 9 + 13 = 148** if nothing else lands), with unique IDs.
4. Run `node scripts/validate-claim-registry.mjs`, then let both CI workflows run on the merged head.

This procedure was rehearsed in a scratch worktree: the result was 148 entries, a pure append with no changes to existing lines, and "All checks passed."

## 4. Next safe action

Send the [review brief](REVIEW.md), thirteen staged registry claims, and [index.md](index.md) to an **independent reviewer** with instructions to check primary texts, all interpretive claims, dating, historical medicine sources, and the distinction between narrative and biomedical evidence. Require one explicit verdict per claim ID, exact primary/secondary locators, and corrections where applicable. Apply findings to this branch, then rerun registry and build checks. Keep the draft held until the repository freeze/merge policy permits research expansion.

## 5. Connected existing project work

- `Field_Guide_Conversation_Reference.md` §14.4: God of the gaps.
- `Field_Guide_Conversation_Reference.md` §5.1: Gospel healings.
- `Bible_Deep_Dive_Master_Notes.md` §1.6: Misattribution of healing.
- `Bible_Deep_Dive_Master_Notes.md` §9.6.5: Deuteronomy 28 covenant curses.

The core files above have **not** been changed in PR #213. They are conceptual pointers for eventual integration.
