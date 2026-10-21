# Illness Explanations — Research Status

**Updated:** 2026-10-20  
**Merged PR:** [#213 — Illness, Gods, and Spirits Before Germ Theory](https://github.com/imanisworld/religion-knowledge/pull/213), 20 October 2026. Original branch: `research/illness-explanations-20261020`.  
**Canonical/public state:** Merged into `main`, registered in Library and Search, and included in a successfully completed [Cloudflare deployment workflow](https://github.com/imanisworld/religion-knowledge/actions/runs/39492093720) for commit `cf756397`. Direct public HTTP retrieval was not independently verified.  
**Research freeze:** Generally active; owner-authorized narrow release exception for PRs #202 and #213. The nine-document core and app dataset remain unchanged.

## 1. What is done

| Item | Status | Evidence |
|---|---|---|
| Working research module | Complete as a bounded first pass | [index.md](index.md), nine sections |
| Primary-text source audit | Six source passages checked against named translations | Deut 28:21–22; Num 16:46–50 (context 16:41–50); Mark 9:17–29; John 9:1–3; Job 4, 8, 42; Sirach 38:1–15 |
| Ancient medicine comparison | Source checked, with limits | Hippocratic *On the Sacred Disease* §1–2; Feder (2017, 2019); Scurlock (2018) abstract |
| Germ-theory milestones | Checked against public research histories | CDC John Snow 1854 / Koch 1882; National Academies overview |
| Claim registry | **13 IL-* records merged into canonical `main`** | `docs/research/claim-registry.json`; 126 → **139 entries**, without altering the original 126 |
| Claim classifications | 4 `verified`; 9 `verified_with_qualification`; 0 `needs_qualification` (after direct-text verification of *On the Sacred Disease* §1) | Verifications are **internal source checks**, not independent external review |
| Claim registry validation | **PASS — GitHub Actions** | Research Governance run #225: Node validator structure check and nonempty-registry check succeeded; an in-memory duplicate/text/format check also passed |
| Source-document readback | Verified | Source Markdown, public HTML reader and Search registration synchronized on integrated release |
| Adversarial pre-review | **Done 20 Oct — internal, not independent** | [PRE-REVIEW.md](PRE-REVIEW.md): 5 hold; 7 hold with qualification ; `IL-HIPBLAME-001` was unresolved in the original pre-review; its English-translation wording is now confirmed. **Corrections applied 20 Oct:** `IL-JOHN-001` and `IL-SIRACH-001` downgraded to `verified_with_qualification`; `IL-HIPBLAME-001` initially to `needs_qualification` and subsequently to `verified_with_qualification` after the §1 translation was retrieved; John, Job, Sirach, Mari, Mesopotamian-roles and Snow wording corrected; Poirier, Zapff, Neufeld and MSU Snow sources added |
| Cross-model AI review | **Done 20 Oct — ChatGPT, posted from the owner's account (review 5590548738)** | 3 hold; 9 hold with qualification; 1 needed a citation fix (`IL-MESMED-001`); 0 disproved. All five required corrections applied: Mesopotamian sources (Scurlock removed as support, Geller 2024 added at abstract level), the exact Sirach 38:15 Hebrew/Greek difference, John 9:3–4 wording, and Deuteronomy wording aligned to the NABRE. **AI review, not outside specialist review** |
| Final AI review (13 claims) | **Done 20 Oct — Claude, not independent** | [PRE-REVIEW.md](PRE-REVIEW.md) final matrix: 4 hold, 9 hold with qualification, 0 collapse |
| Independent outside audit | **Not performed — waived by the owner (20 Oct 2026, reconfirmed)** | See §3b |
| Final corpus and research-governance CI | **PASS — GitHub Actions** | Both workflows passed on the integrated PR commit `2990e760` and main merge `cf756397`; release reader is registered in Library and Search |

**Counting policy (current checkpoint):** The Illness merge raised the registry from **126 to 139** entries, including 13 unique `IL-*` records and no changes to the original 126. **Current `main` contains 148 distinct registry records** after subsequent separate updates; none of those nine additional entries is an illness-source upgrade. [PR #212](https://github.com/imanisworld/religion-knowledge/pull/212) is **closed without merge**. Draft Law PR #240 proposes two additional IDs, which are not yet canonical. Review statuses reflect accessible source checks, not outside specialist verification.

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

## 3. Remaining research and maintenance after release

| Priority | Work | Why blocked |
|---|---|---|
| 1 | **Preserve accepted research limitations** | Outside specialist review waived for this bounded edition; mark Hebrew/Greek/Akkadian, paywalled chapter, and Mari tablet checks as unfinished, not verified |
| 2 | **Preserve registry on future integrations** | #212 was closed without merge. Maintain all current 148 unique claim IDs and the 13 `IL-*` entries; reconcile new draft Law additions from PR #240 without overwriting current entries (§3a) |
| 3 | **Reader, Search and navigation consistency** | Registered on main; preserve merged #202 Prophecy and Religions & Traditions navigation and responsive presentation in subsequent builds |
| 4 | **Scoped freeze exception** | Completed for #202 and #213 only; the general research consolidation freeze stays active for other expansions |
| 5 | **Production HTTP spot check** | Merge, validation and Cloudflare workflow succeeded; an unauthenticated direct GET of live pages could not be independently completed from the review environment |

## 3a. Registry reconciliation with PR #212

Verified on 20 October 2026 against `main` at `ab55625` and PR #212 at `6b096b1`:

- `main` has **126** registry entries. PR #212 adds **9** (`CP-ARCHER-001`, `CP-BARTON-001`, `CP-BARTON-002`, `CP-BRIGGS-001`, `CP-SCHREIN-001`, `LC-NPPNAME-001`, `LC-SANDERS-001`, `LC-SUPERSESS-001`, `LC-TRIPART-001`). This branch adds **13** (`IL-*`). **No IDs overlap**, and neither branch alters any existing entry.
- Both branches append after the same final entry, so whichever merges second gets a **certain textual conflict in `docs/research/claim-registry.json`**. It is the only conflicting file: root `STATUS.md` merges automatically, and PR #212 merges cleanly into `main` by itself.
- **Current status:** #213 merged first with 13 `IL-*` IDs. PR #212 was later **closed without merge**; the six proposed Cited Persons promotions were not accepted as evidence-verified upgrades. Subsequent separate changes increased the canonical registry to **148**, and any new research PR (including draft #240) must preserve the existing IDs.

**Resolution procedure (for whichever PR merges second):**

1. Merge current `main` into the branch. Do not rebase a shared branch.
2. In `claim-registry.json`, keep every entry already on `main` exactly as it is, then append this branch's entries after them. Never accept a whole-file "ours" or "theirs" version; either one silently drops the other PR's claims.
3. Check that the entry count equals **the then-current** `main` count plus only verified distinct additions, with unique IDs. The old **126 + 9 + 13 = 148** calculation was a historical 20 October merge simulation, and is **not** a forecast for later PRs.
4. Run `node scripts/validate-claim-registry.mjs`, then let both CI workflows run on the merged head.

This procedure was rehearsed in a scratch worktree: the result was 148 entries, a pure append with no changes to existing lines, and "All checks passed."

## 3b. Owner decision — review gate (20 October 2026)

**Decision:** The owner accepts the documented limits of the AI reviews in place of an outside specialist review for this module.

**History:** This decision was first recorded in commit ca0e4fc. Commits 4863546–bc16cf9 then withdrew it because no explicit waiver had been verified. On 20 October 2026 the owner was asked directly, in the Claude Code session, whether a waiver had been given ("Did you mean to accept the documented limits in place of outside review?"). The owner answered "Yes — I accept, both PRs", covering this PR and #202. The decision is restored on that basis.

- **Done:** an internal English-translation source check (including Hippocratic §1), an adversarial pre-review, a ChatGPT cross-model review, and a final Claude AI review of all 13 claims, with corrections applied.
- **Not done (accepted as limits):** independent human specialist review; Hebrew, Greek or Akkadian collation; page-level reading of Scurlock, Lawrence or the Cambridge chapter; examination of the primary Mari tablets.
- **Release gates satisfied for this bounded edition:** owner waiver, scoped freeze exception, registry reconciliation with main, public Library/Search registration, integrated CI, merge, and successful Cloudflare workflow. Full Hebrew/Greek/Akkadian collation, original Mari tablet examination, several full chapters, and direct post-deploy public HTTP retrieval remain unverified. #212's person-claim changes stay held. Public material must not claim independent specialist verification.

## 4. Next safe action

The illness reader is merged into `main` with Library/Search/navigation registration; its **13 `IL-*` IDs** are preserved in the current **148-record** registry. At initial release the total was 139. Both main CI workflows and the Cloudflare deployment workflow completed successfully on original release commit `cf756397`. Direct live-site HTTP retrieval remains unconfirmed by the review tool. The narrow freeze exception and outside-review waiver are documented; the edition continues to identify its evidence limitations.

## 5. Connected existing project work

- `Field_Guide_Conversation_Reference.md` §14.4: God of the gaps.
- `Field_Guide_Conversation_Reference.md` §5.1: Gospel healings.
- `Bible_Deep_Dive_Master_Notes.md` §1.6: Misattribution of healing.
- `Bible_Deep_Dive_Master_Notes.md` §9.6.5: Deuteronomy 28 covenant curses.

The core files above have **not** been changed in PR #213. They are conceptual pointers for eventual integration.
