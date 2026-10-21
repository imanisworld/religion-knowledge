# Repository To-Do — verified working queue

**Checkpoint:** 20 October 2026 (US Eastern) · [Status](STATUS.md) · Canonical branch: `main`

This lists **work still open**, not a request to reopen deployed fixes. Review the current `main` before each branch; respect the general research consolidation freeze and the narrow, separately authorized releases. GitHub workflow success does **not** substitute for manual visual review or historical source verification.

## Priority 1 — close remaining *review* of implemented Gender Over Time UI

**Already implemented, not a fresh build queue:** [PR #210](https://github.com/imanisworld/religion-knowledge/pull/210) improved fonts/table readability across the website; [PR #235](https://github.com/imanisworld/religion-knowledge/pull/235) added section-by-section and case-by-case pagination for Gender Over Time and related research pages; [PR #248](https://github.com/imanisworld/religion-knowledge/pull/248) delivered accessible, neutral light/dark colors, larger case text and clear evidence labels and was deployed. The owner thought the UI work was already done, which these merges confirm. The status incorrectly duplicated this work as an unimplemented redesign in PR #254.

- [x] Implement shared accessible typography, mobile tables and readable table style: **merged #210**.
- [x] Replace endless scrolling on specialist research pages with bounded section/case navigation and preserve deep links: **merged #235**.
- [x] Implement neutral, high-contrast Gender Over Time readability improvements: **merged/deployed #248**, [deployment run 39524339537](https://github.com/imanisworld/religion-knowledge/actions/runs/39524339537).
- [x] Build separate automated laptop/phone, light/dark UI checks and generate four screenshots: [draft QA PR #251](https://github.com/imanisworld/religion-knowledge/pull/251), [passing test run](https://github.com/imanisworld/religion-knowledge/actions/runs/39525306997). Creating tests is completed; **PR #251 itself is still unmerged**.
- [ ] **Review actual screenshots / live page** to understand the owner's feedback that the differences were hard to recognize; check both modes and viewport sizes, text labels, cards, navigation and overflow. This is visual acceptance, not an instruction to redo the design.
- [ ] Review/merge **QA-only PR #251** after manual screenshot verification and current-main reconciliation; preserve the released #248 layout and its current palette.
- [ ] **Only if an actual problem remains after comparing the implemented page**, scope a specific follow-up UI change and seek owner feedback on the result. Do not invent or automatically reopen a general redesign task.

[UI implementation and feedback record](docs/ui/gender-over-time-followup.md).

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

**Not queued to redo:** Completed website UI changes in PRs **#210, #235 and #248**, completed Cited Persons triage in #216, earlier prophecy/illness merges, and the cursing/classism dataset merged to `main`. A **visual review/feedback check** remains for the existing UI; another design implementation is not automatically assumed.
