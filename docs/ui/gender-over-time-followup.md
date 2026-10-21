# Gender Over Time — owner-requested UI design follow-up

**Status:** OPEN — requested, not implemented or deployed  
**Recorded:** 20 October 2026 (US Eastern)  
**Affected page:** `gender-over-time.html` / [Gender Over Time](https://religion-knowledge.imanicru-f22.workers.dev/gender-over-time#cases)  
**Canonical branch baseline:** current `main` (rebase at implementation time)

## Owner feedback and non-negotiable distinction

After the neutral readability release [PR #248](https://github.com/imanisworld/religion-knowledge/pull/248), the owner reported that **it was difficult to tell what changed** and explicitly requested **a further UI update**. Do not close this as completed because a palette change deployed, nor because automated checks pass.

- **Done:** #248 — neutral light/dark palette, larger copy, textual evidence labels; merged and deployed. Preserve this baseline and avoid restoring the old pink/low-contrast appearance.
- **QA-only:** [draft PR #251](https://github.com/imanisworld/religion-knowledge/pull/251) — automated Chromium/contrast/overflow tests and screenshot artifacts, still pending human review. It introduces **no new visual design** and cannot fulfill the new request.
- **Open:** An **obviously different, easier-to-use** visual layout and interaction treatment on Gender Over Time, consistent with the site-wide interest in readable laptop-sized pages and preventing endless-scrolling content walls.

## Implementation outline (design proposal, not approved screenshots)

1. **First-screen clarity:** Make the title, page purpose, current section and next action apparent at 1280×800 without requiring an initial long scroll. Retain meaningful content; avoid shrinking essential text.
2. **Visibly stronger hierarchy:** Distinguish case titles, dates/locations, evidence state, concise findings and expandable citations. Use spacing, typographic scale and structured sections, not bright badge colors.
3. **Manageable content length:** Keep one-at-a-time / bounded section-and-case navigation (already available) and ensure no unexpected full-page endless-scroll behavior after navigating or toggling theme.
4. **Usable case cards:** Readable body copy (at least 16 CSS px), clear evidence text, comfortable line length and padding, and actionable source details. More compact density on laptops without cramming.
5. **Consistent light/dark themes:** Retain #248 accessible neutral color tokens. Ensure theme persists appropriately and contrast remains high.
6. **Mobile layout and overflow:** Verify 390×844 viewport, stacked content, navigable local tabs, and table overflow contained inside its own scroller (no whole-page horizontal movement).
7. **Site consistency:** Inspect navigation between research pages so styles and scroll behavior do not unexpectedly revert when users click around.

## Acceptance gates before closing

- [ ] New design implementation PR from current `main`, with **before/after screenshots** showing meaningful structural improvement.
- [ ] Render and review **1280×800 and 390×844** in both light and dark; check theme persistence, cards, evidence labels, tables, keyboard focus, and horizontal overflow.
- [ ] Human visual assessment of updated screenshots; obtain owner feedback and make corrections rather than treating technical CI as proof of satisfaction.
- [ ] All usual research-governance/corpus CI green, no changes to historical claims, and release verified for exact merged commit if published.
- [ ] Update [STATUS.md](../../STATUS.md) and [TODO.md](../../TODO.md) to mark this separate request done **only after** the redesigned UI is actually delivered.

**Scope guard:** No alteration to the historical evidence, citations, source registers, prophecy/illness research, or the cursing/classism queue. The general research consolidation freeze does not prevent presentation and accessibility improvements.
