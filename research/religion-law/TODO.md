# Religion & Law — Status and TODO

**Snapshot:** 20 October 2026 (branch-specific; update after release)  
**Working PR:** [#240 — consolidated Religion & Law](https://github.com/imanisworld/religion-knowledge/pull/240)  
**Release status:** **DRAFT / SOURCE-GATE HOLD — unmerged, not deployed**  
**Production baseline to preserve:** [#248](https://github.com/imanisworld/religion-knowledge/pull/248), merged into `main` at `2a61696f641c648a3642f49e7a04424253a3b0a4` (Gender Over Time readability).

This checklist tracks the current consolidated candidate. An unchecked source-research item may remain open after an **explicitly approved, qualified first-pass release** only when its limitations are accurately disclosed. A green CI run never grants source approval. `main` is canonical until #240 merges.

## Completed in draft #240

- [x] Consolidate #218, #219, #221, #223 and #225; reconcile the current reader navigation, search data and build tooling.
- [x] Populate 50 first-pass state profiles and 50 first-pass demographic/officeholder context slots, retaining unknown religious affiliations as unknown.
- [x] Produce **59 classified state-law records across 16 states**; identify **34 states with no normalized classifiable state-law entries**; keep 1 Texas §21.06 record unclassified.
- [x] Correct Texas §21.06's unsupported secular-purpose classification. Its statutory text and *Lawrence* legal status remain separate from the **unresolved 1973 provision-specific motive**.
- [x] Label Montana's 1972 convention account **provisional** in the state profile, law record, public search result and related status indexes. Distinguish OCR/secondary corroboration from uninspected original primary pages.
- [x] Add reader-level source limitations, record confidence and honest coverage disclosure. Qualify an Alabama officeholder's historical pastoral role rather than asserting present membership.
- [x] Incorporate #248 into the #240 merge ancestry without changing its deployed Gender Over Time HTML or contrast test. Neither file appears in the proposed #240 diff.
- [x] Pass the corpus and research-governance workflows on the [source-correction snapshot `c528356`](https://github.com/imanisworld/religion-knowledge/commit/c528356e028d366b3e9c22142ec57ad739e03230). **Every subsequent commit still requires current-head validation.**

## Release checklist — required before publishing #240

- [ ] **Source gate:** obtain independent original-source review **or** an **explicit owner decision accepting the recorded limitations** for a *qualified first-pass Religion & Law release*. Earlier approvals for Prophecy and Illness do not authorize this release.
- [ ] Record the release decision, scope, reviewer/owner, date and the exact unresolved limitations in [the release-readiness review](reviews/2026-10-20-release-readiness.md). Do not mark unverified historical claims as verified to close the gate.
- [ ] On the final release candidate, verify the latest `main` ancestry, absence of merge conflicts and preservation of the #248 readability changes. Never deploy a stale branch or overwrite a newer public design.
- [ ] Confirm **both** `Validate religion corpus` and `Validate Research Governance` are green on the **final head SHA**; check generated Search, page/source visibility and laptop/phone navigation.
- [ ] Once authorized and green, mark #240 ready and merge it to `main`. Until then keep it draft and unmerged; do not describe draft changes as live.
- [ ] Verify the post-merge `main` deployment workflow and, where accessible, the public Religion & Law reader. Do not equate a successful CI result with independently verified public rendering.
- [ ] After confirmed merge, close superseded drafts **#218, #219, #221, #223, #225** with links to #240. Keep them open for traceability while #240 is unmerged.
- [ ] After deployment, update canonical [repository status](../../STATUS.md), this file and the [module README](README.md) with the final merge/deploy evidence and any remaining research queue.

## Research backlog — source or coverage work, separate from qualified-release approval

- [ ] **Montana 1972:** independently inspect original convention *Vol. VI* pp. 2007–2032 (especially Campbell pp. 2030–31 and Loendorf pp. 2025–27) and *Vol. II* Education/Public Lands committee reports. Keep the March 9 Kelleher 13–79 vote distinct from Campbell's March 11 13–79 vote. Update confidence only after direct passage review.
- [ ] **Texas §21.06:** inspect the 1973 HB 514 hearings/tapes and available SB 34 drafting/legislative materials for **provision-specific motive**. Missing SB 34 documents and no located religious testimony do not establish absence of religious involvement. Do not restore an A–E classification without a verified passage.
- [ ] **Maine 1959 Sunday vehicle sales:** complete original House/Senate legislative-record page checks; retain the documented dealer/competitive interests **and** the Lord's Day framing as a mixed, bounded account.
- [ ] **State law coverage:** validate and promote normalized law-level records for the **34 states** currently lacking them, one authority and date at a time; do not promote scaffolds as fully covered.
- [ ] **Cross-state inventories:** expand the 8-state × 4-topic initial inventory to remaining jurisdictions, locate relevant controlling cases, track amendments and verify current statutory text.
- [ ] **Officeholder context:** refresh dated sources and vacancies for the 50 state slots; distinguish present self-reported membership, upbringing, prior ministry, unknown and historical affiliation. Treat officeholder religion as **context**, never causal evidence about a statute.
- [ ] **Comparative coverage:** retain the non-U.S. structural framework as preliminary until individual country laws and current dates receive the same primary-authority checks.

## Operating rules

Use [the release-readiness evidence review](reviews/2026-10-20-release-readiness.md), [gap-closure queue](gap-closure/README.md), [50-state index](us-states/index.md) and the claim registry for claim-level authority. No additional broad expansion or unsourced public promotion while the existing research consolidation/source gate remains in effect.
