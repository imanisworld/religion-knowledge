# Repository To-Do — verified working queue

**Checkpoint:** 20 October 2026 (US Eastern) · [Status](STATUS.md) · Canonical branch: `main`

This lists **work still open**, not a request to reopen deployed fixes. Review the current `main` before each branch; respect the general research consolidation freeze and the narrow, separately authorized releases. GitHub workflow success does **not** substitute for manual visual review or historical source verification.

## Priority 1 — finish the Gender Over Time UI release QA

- [x] Merge the neutral, readable light/dark design and visible evidence labels: [PR #248](https://github.com/imanisworld/religion-knowledge/pull/248), merge commit `2a61696f`.
- [x] Confirm the matching successful Cloudflare run: [39524339537](https://github.com/imanisworld/religion-knowledge/actions/runs/39524339537).
- [x] Add automated Chromium rendering/overflow/font/contrast checks at **1280×800** and **390×844**, both themes: [draft PR #251](https://github.com/imanisworld/religion-knowledge/pull/251), [successful Actions run](https://github.com/imanisworld/religion-knowledge/actions/runs/39525306997). Screenshot artifacts exist.
- [ ] **Manually review the four screenshot artifacts** for case spacing, label readability, typography, clipping and navigation at both widths/themes. Record result on PR #251; fix real failures on that branch.
- [ ] Review and merge PR #251 only after manual screenshot gate and current-main reconciliation. Until then it remains **draft/unmerged**. Keep the already-deployed #248 palette intact.
- [ ] Independently check the public page in a real laptop/phone browser if available. **Deployment is confirmed, not personally viewed in this environment.**

## Priority 2 — source-gated Cursing / Cussing / Classism research

- [x] Record 14 research passes and primary/secondary-source limits in [Issue #234](https://github.com/imanisworld/religion-knowledge/issues/234).
- [x] Merge **research-only** Buckinghamshire transcription-control material (355 appearances, 32 candidate same-name groups): [PR #246](https://github.com/imanisworld/religion-knowledge/pull/246).
- [ ] Continue remaining source checks in the [topic-specific checklist](research/cursing-classism/TODO.md), including facsimiles, repeat identities, competing Christian readings, financial outcomes and class comparison.
- [ ] Prepare a clearly attributed draft historical synthesis **in research/backlog only**; distinguish documented cases, contemporary allegations, scholarly interpretation, and unresolved questions. Do not publish merely because the research data is on `main`.
- [ ] Obtain specific owner authorization / a scoped exception before creating or publishing a major new public reader, and enforce current-main source review and CI.

## Priority 3 — outstanding repository evidence and controls

- [ ] **Cited Persons:** 194 documented / 171 unresolved of 365. First verify original passages for Archer, Barton, Briggs, MacDonald and MacIntyre; **no promotion on bibliography or secondhand paraphrase alone**. [PR #212](https://github.com/imanisworld/religion-knowledge/pull/212) is **closed/unmerged**, not an active merge gate.
- [ ] **Prophecy Audit:** Follow the separate [21-lead discovery and original-text checklist](research/prophecy-audit/TODO.md). The 65-case bounded edition is already merged/deployed; new lead research remains source-gated.
- [ ] **Illness Explanations:** Continue the module's unresolved [original-language, tablet and primary-study checks](research/illness-explanations/STATUS.md); do not restate the AI-reviewed edition as independent external verification.
- [ ] **Religion & Law qualified release:** [PR #240](https://github.com/imanisworld/religion-knowledge/pull/240) is **draft / source-gate hold**, not merged or deployed. Obtain **explicit owner acceptance of documented first-pass limits** or independent review; verify latest-main integration and both CI checks on final head; merge and confirm Cloudflare delivery only when approved. Then close superseded #218/#219/#221/#223/#225 and update canonical status. [Detailed source/release checklist](research/religion-law/TODO.md). The proposed 59 state-law records cover only 16 states; 34 lack normalized records, Texas §21.06 motive remains unclassified, and Montana 1972 reconstruction remains provisional.
- [ ] **Operational hygiene:** Resolve legacy `wrangler.toml` deprecation safely, decide how to display commit/date identifiers on public pages, and prepare a versioned release only after documented quality gates. See [STATUS.md](STATUS.md).

**Not queued to redo:** PR #248 styling and its successful deployment; earlier completed prophecy/illness merges; cursing research dataset already merged to `main`.
