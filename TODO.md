# Repository To-Do — verified working queue

**Checkpoint:** 20 October 2026 (US Eastern) · [Status](STATUS.md) · Canonical branch: `main`

This lists **work still open**, not a request to reopen deployed fixes. Review the current `main` before each branch; respect the general research consolidation freeze and the narrow, separately authorized releases. GitHub workflow success does **not** substitute for manual visual review or historical source verification.

## Priority 1 — make the Gender Over Time UI visibly better (owner-requested; OPEN)

The owner says that after [deployed PR #248](https://github.com/imanisworld/religion-knowledge/pull/248), **the difference is difficult to see and a further UI update is wanted**. Treat this as an **outstanding design/UX request**, not a completed UI release. See the [design follow-up brief](docs/ui/gender-over-time-followup.md).

- [ ] Prepare a **clearly distinguishable** revised page layout (not another minor color adjustment). Improve first-screen orientation, scannable content hierarchy, case-card spacing, evidence-label comprehension and readable density at laptop size.
- [ ] Maintain bounded section/case navigation instead of an unbounded vertical wall of content; ensure readers can navigate and return without losing position or theme.
- [ ] Build from **current `main`**, preserving #248's neutral high-contrast palettes and existing accessible text labels; leave verified historical claims, citations and dataset contents untouched.
- [ ] Compare **actual rendered before/after views** at 1280×800 and 390×844 in **light and dark**. Check horizontal overflow, case readability, table behavior, navigation, and consistency as users click between sections/pages.
- [ ] Get explicit visual feedback on the **new design**, resolve any issues, and only then mark this additional request done. The QA-only PR #251 cannot close this task.

### Existing deployed refinement and its separate QA

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

- [x] **Cited Persons first-pass triage complete:** All 171 unresolved entries were inventoried and reviewed at triage level in [merged PR #216](https://github.com/imanisworld/religion-knowledge/pull/216), with 14 batch files and a source-readiness register. **Do not restart the 171-entry triage.**
- [ ] **Cited Persons passage-verification gate (only where evidence is still missing):** The current canonical markers remain **194 documented / 171 unresolved of 365**. Follow the [existing per-person readiness register](docs/research/cited-persons-source-readiness-20261020.md) to finish exact original-author/page evidence or corrections; do not repeat completed scouting, source discovery, or recorded print checks. The older [PR #212](https://github.com/imanisworld/religion-knowledge/pull/212) is **closed/unmerged**. No promotion merely from a completed triage.
- [ ] **Prophecy Audit:** Follow the separate [21-lead discovery and original-text checklist](research/prophecy-audit/TODO.md). The 65-case bounded edition is already merged/deployed; new lead research remains source-gated.
- [ ] **Illness Explanations:** Continue the module's unresolved [original-language, tablet and primary-study checks](research/illness-explanations/STATUS.md); do not restate the AI-reviewed edition as independent external verification.
- [ ] **Religion & Law:** Verify gaps in the [state coverage/status layer](research/religion-law/README.md) before expanding public conclusions.
- [ ] **Operational hygiene:** Resolve legacy `wrangler.toml` deprecation safely, decide how to display commit/date identifiers on public pages, and prepare a versioned release only after documented quality gates. See [STATUS.md](STATUS.md).

**Not queued to redo:** PR #248's successful deployment and palette fix; the completed Cited Persons **triage** from PR #216; earlier completed prophecy/illness merges; cursing research dataset already merged to `main`. **The subsequent owner-requested UI redesign remains open.**
