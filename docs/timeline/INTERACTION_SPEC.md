# Timeline App — Interaction & Accessibility Contract

**Status:** Companion design specification to `SPEC.md`. This document asserts zero historical claims. It defines how researched timeline data may be presented and manipulated without turning uncertainty, absence, scale, or accessibility into misleading UI.

## 1. Purpose

`SPEC.md` defines the research model and presentation requirements. This file defines the interaction contract that every timeline implementation must satisfy, regardless of whether the renderer is DOM, SVG, Canvas, WebGL, or a hybrid.

The central design rule is:

> The visual timeline may be richer than the accessible representation, but it may never contain information or controls that exist only through pointer gestures, hover, color, or pixels.

## 2. Interaction invariants

| # | Requirement |
|---|---|
| I1 | **Direct manipulation is optional, never required.** Drag, pinch, wheel, hover, and canvas gestures may enhance the experience but every operation must also exist as a visible/focusable control. |
| I2 | **Every meaningful view is bookmarkable.** Time range, zoom level, active lanes, active layers, comparison mode, and selected entity/claim must survive reload and round-trip through the URL. |
| I3 | **Progressive disclosure is mandatory.** The timeline surface shows only `what`, `when`, `where`, and `confidence`. Claim tier, date semantics, evidence details, interpretations, sources, and `does_not_demonstrate[]` move into the inspector. |
| I4 | **No hover-only information.** Anything revealed on hover is also reachable by focus, tap, or the inspector. |
| I5 | **Absence states are explicit and distinguishable.** “Not researched yet,” “researched but no surviving evidence represented,” and “data exists but is filtered out” are three different UI states. Blank space may not silently stand for any of them. |
| I6 | **Uncertainty is not encoded by color alone.** Confidence and dating uncertainty require text, shape/stroke, or pattern redundancy. |
| I7 | **Reduced motion is honored.** With `prefers-reduced-motion: reduce`, zoom/pan transitions become immediate state changes. No essential meaning depends on animation. |
| I8 | **The visual renderer has a DOM-equivalent representation.** If Canvas/WebGL is used, a synchronized semantic list/table exposes the same visible claims/entities and source access. |
| I9 | **Scale truth remains visible.** A linear “truth strip” always shows the current viewport against the full human-history span. Log or nonlinear working views must be explicitly labeled as such. |
| I10 | **Mobile is not a shrunken desktop.** Mobile uses the same data and state model but a different control/layout strategy designed for touch, limited width, and bottom-sheet inspection. |
| I11 | **No default civilizational center.** Interaction defaults must preserve `SPEC.md` P4: no privileged lane, religion, writing tradition, continent, or named canon. |
| I12 | **No visual channel carries two unrelated meanings.** Example: if hue identifies content layer, confidence must use stroke/pattern/text rather than a second hue scale. |

## 3. Information hierarchy

### 3.1 Timeline surface — only four questions

A visible item should answer, at a glance:

1. **What is it?** — short label + entity/claim type icon.
2. **When?** — position/range on the time axis; uncertainty visible as range/precision, never fake point precision.
3. **Where?** — lane placement and, where relevant, cross-lane edge.
4. **How confident are we?** — redundant confidence grammar.

The surface should **not** try to simultaneously display claim tier, evidence type, scholarly camps, source count, date semantics, `does_not_demonstrate[]`, verification method, and relationship vocabulary. Those belong in detail views.

### 3.2 Inspector — the evidence view

Selecting an item opens an inspector in this order:

1. **Title + entity/claim type**
2. **Date range** and plain-language date label
3. **Why it is dated this way** (`date_semantics`, precision, method where present)
4. **Confidence** and scholarly disagreement status
5. **What the claim says**
6. **Claim tier:** Observation / Interpretation / Causal explanation
7. **Evidence** — evidence types and supporting items
8. **Interpretations** — named camps/positions when relevant
9. **What this does NOT demonstrate** — render `does_not_demonstrate[]` as a dedicated section, never as fine print
10. **Sources and verification method**
11. **Related entities / transmission / relationship edges**

For an empty-evidence state, the same inspector pattern explains why the cell is empty and what kind of absence is being represented.

## 4. Desktop layout contract

Desktop should use four conceptual regions:

```text
┌──────────────────────────────────────────────────────────────────┐
│ Product / Search / View mode / Share                            │
├──────────────────────────────────────────────────────────────────┤
│ Linear truth strip + current viewport                           │
├──────────────┬───────────────────────────────────┬───────────────┤
│ Lane/layer   │ Timeline working viewport         │ Inspector     │
│ controls     │                                   │ when selected │
│              │                                   │               │
├──────────────┴───────────────────────────────────┴───────────────┤
│ Explicit time controls: Earlier · Later · − Zoom · + Zoom       │
└──────────────────────────────────────────────────────────────────┘
```

The inspector may collapse when nothing is selected. The timeline remains the dominant surface.

### Required visible controls

- Earlier
- Later
- Zoom out
- Zoom in
- Jump to period/date
- Choose lanes
- Choose layers
- Reset view
- Search
- Share/copy current view
- Switch to accessible list view

Pointer/wheel/pinch controls are additive shortcuts, not substitutes.

## 5. Mobile layout contract

At approximately 390×844 and similar phone sizes:

- Header contains product identity, Search, and a compact View/Options control.
- The **linear truth strip remains visible** but compact.
- Time controls remain reachable without horizontal page overflow.
- Lane selection opens a bottom sheet/drawer.
- Users may pin a small comparison set of lanes for simultaneous viewing; additional lanes remain available through the lane selector rather than forcing an unreadable all-lanes stack.
- Selecting an item opens a bottom-sheet inspector that can expand to full height.
- The timeline itself may scroll vertically through active lanes, but the page must not require accidental two-dimensional document scrolling.
- All fixed controls honor `env(safe-area-inset-*)`.
- Minimum interactive target: approximately 44×44 CSS px unless a larger surrounding target provides the same hit area.

### Mobile comparison rule

Simultaneous comparison remains a core requirement, but readability wins over showing every selected lane at once. The UI should support a small pinned comparison set and make the existence of additional selected/available lanes explicit.

## 6. Time navigation and scale

### 6.1 Two scale representations, deliberately separate

**Linear truth strip:**
- Always linear.
- Shows the full supported human-history span and the current working viewport.
- Exists to preserve `SPEC.md` P12: recorded history must remain visibly tiny relative to deep human time.

**Working viewport:**
- May use the zoom model from `SPEC.md` §3.
- May aggregate/collapse content as the user zooms out.
- If the renderer uses any nonlinear/log transformation inside the working view, the mode must be visibly labeled.

### 6.2 Zoom behavior

- Zoom focuses on the selected item when one exists; otherwise it focuses on the visible center.
- Zooming out aggregates dense content rather than drawing illegible overlapping labels.
- Aggregates report what they contain (for example, count + dominant categories) and can be opened/zoomed into.
- A millennium-precision claim must never become a false point event at decade zoom.
- Date ranges and precision remain inspectable at every zoom level.

### 6.3 Keyboard model

When timeline navigation has focus:

- `ArrowLeft` / `ArrowRight`: move earlier/later by a small deterministic step.
- `Shift + ArrowLeft` / `Shift + ArrowRight`: move by a larger step.
- `+` / `=`: zoom in.
- `-`: zoom out.
- `Enter`: open the currently focused item.
- `Escape`: close inspector/sheet and return focus to the originating item.

Visible buttons remain the authoritative controls; keyboard shortcuts are accelerators.

## 7. URL/state contract

The exact URL syntax is implementation-defined, but the following state must round-trip:

- start/end time or equivalent viewport center/window
- zoom level
- active lanes
- active content layers
- display mode (timeline/network/list/etc.)
- selected entity/claim, when applicable
- active search/filter state

Example shape only:

```text
/timeline?from=-2500&to=-500&z=4&lanes=egypt,levant&layers=writing,religion&selected=claim-123
```

Opening the URL must restore the same conceptual view without relying on local storage.

## 8. Confidence and uncertainty grammar

The timeline must not turn confidence into a decorative badge that disappears at density.

Recommended redundant grammar:

| Confidence | Surface treatment |
|---|---|
| HIGH | solid mark/stroke + accessible label |
| MODERATE | solid but visually lighter mark + accessible label |
| LOW | dashed/dotted treatment + accessible label |
| DISPUTED | visibly split/contrasting boundary treatment + `Disputed` label in focus/inspector |
| UNKNOWN | hollow/outline treatment + `Unknown` label in focus/inspector |

Exact styling may change. The invariant is redundancy: color alone cannot carry the state.

Date uncertainty is shown primarily through **range width/precision**, not by making text vaguely translucent.

Claim tier is intentionally **not** a primary timeline color system. It becomes explicit in the inspector so Observation → Interpretation → Causal Explanation cannot be confused by a noisy three-color overlay.

## 9. Evidence-absence states

There are at least three visually distinct states:

### A. Not researched yet

> This lane/period has not yet passed the research pipeline.

This is a product/data-coverage state, not a historical statement.

### B. Researched; no surviving evidence represented

Compact surface treatment such as a neutral hatch/marker:

> No surviving evidence represented

Opening it shows the lane/period `evidence_absence_note` and the methodological warning from `SPEC.md` P2.

### C. Evidence exists but is hidden by filters

The cell should indicate that filters are suppressing content and provide a clear way to reset/reveal it.

These states must never collapse into identical empty space.

## 10. Layers and visual channels

Timeline-level visual channels should remain intentionally scarce.

Recommended allocation:

- **Horizontal position / width:** time and date range
- **Vertical position:** lane
- **Icon/shape:** entity or content type
- **Hue/tint:** broad content layer, if needed
- **Stroke/pattern + text:** confidence
- **Connection line:** sourced relationship/transmission edge

Do not also encode claim tier, source type, camp, and verification method directly on every node. Those are inspector/filter dimensions.

## 11. Accessible semantic representation

A nonvisual user must be able to access the same current viewport through a synchronized DOM representation.

Minimum list-view structure:

```text
Current range: 2500–500 BCE
Active lanes: Egypt, Levant
Visible items: 18

Egypt
  2200–2000 BCE — [item]
  1900 BCE — [item]

Levant
  2100–1800 BCE — [item]
```

Each item opens the same inspector information and source links as the visual timeline.

Requirements:

- The current time range and active lanes are programmatically named.
- Panning/zooming updates a polite status region without announcing every animation frame.
- Canvas/WebGL pixels are never the only source of labels, relationships, confidence, or citations.
- Focus order remains logical when the visual renderer reorders/aggregates content.
- Focus returns to the triggering control/item when inspectors and sheets close.
- Forced-colors/high-contrast modes retain selected/focused/confidence states.

## 12. Motion and animation

Animation should explain spatial change, not decorate it.

Allowed uses:
- showing continuity when zoom level changes
- showing where an opened cluster expanded from
- preserving context when a selected item moves into view

Not allowed:
- animated historical “progress” implying inevitable development
- autoplay movement through time as the default experience
- animation required to understand an event or relationship

With reduced motion enabled, all of the above becomes an immediate state transition.

## 13. Network view contract

The network view is a separate mode, not a permanently overlaid second visualization.

- Relationship edges render only when backed by sourced relationship data.
- Edge type is named on focus/selection.
- Motif similarity uses a visually distinct overlay and an explicit statement that similarity does not itself establish influence or transmission.
- Network state is bookmarkable under the same URL/state contract.
- A list/table representation exposes edges for nonvisual navigation.

## 14. Product architecture

The Timeline is a separate product from **Bible Deep Dive**, as already stated in `SPEC.md`.

Do not place the Timeline as if it were simply another Bible reader/document.

A future shared landing architecture may look conceptually like:

```text
Research
├── Bible Deep Dive
└── Human History Timeline
```

The final product name is an owner decision. Shared typography, theme behavior, accessibility conventions, and provenance language are desirable; the Timeline may have a denser visualization-specific visual system.

## 15. Acceptance tests before public UI work is considered complete

### Input/accessibility
- [ ] Entire timeline can be navigated, zoomed, filtered, inspected, and source-opened without a mouse or touch gesture.
- [ ] No information exists only on hover.
- [ ] Screen-reader/list representation exposes the current range, active lanes, visible items, confidence, and source access.
- [ ] Canvas/WebGL, if used, is supplemental to semantic DOM data rather than the semantic source itself.
- [ ] Focus is restored correctly after inspector/drawer closure.
- [ ] Reduced-motion mode removes animated pan/zoom dependence.
- [ ] Confidence remains distinguishable without color.

### State/navigation
- [ ] Copying the URL and reopening it restores time, zoom, lanes, layers, mode, filters, and selection.
- [ ] Back/forward navigation traverses meaningful timeline states without resetting the product.
- [ ] Reset view is always available.

### Mobile
- [ ] 390×844 smoke test has no control overlap or horizontal page overflow.
- [ ] Safe-area insets are honored.
- [ ] Lane selection and inspector are usable with touch and keyboard/switch-style focus.
- [ ] At least a small simultaneous lane comparison remains possible.

### Methodological honesty
- [ ] Linear truth strip remains visible and honest at all zoom levels.
- [ ] `Not researched`, `no surviving evidence represented`, and `filtered out` are visibly distinct.
- [ ] Claim tier is explicit in details but does not create a noisy default overlay.
- [ ] `does_not_demonstrate[]` is first-class detail content.
- [ ] DISPUTED/UNKNOWN claims remain publishable and visible rather than being visually suppressed.
- [ ] Motif similarity cannot be mistaken for a sourced transmission edge.

## 16. Build-order recommendation

Before implementing the full renderer:

1. Build the **URL/state model** and explicit time controls.
2. Build the **linear truth strip**.
3. Build a **DOM-first lane prototype** with real researched data.
4. Build the **inspector** and absence-state system.
5. Build the synchronized **accessible list view**.
6. Add pointer/touch direct manipulation.
7. Add aggregation/density behavior.
8. Only then decide whether DOM/SVG remains sufficient or Canvas/WebGL is justified by measured density/performance.

This order prevents a visually impressive renderer from becoming the architecture before accessibility, uncertainty, state restoration, and methodological honesty are solved.