# Human History Timeline — DOM-first research prototype

This directory is an **internal research preview**, not a public or production Timeline release.

It exists to prove the interaction model against real repository data before choosing a heavier renderer such as Canvas or WebGL. Historical claims remain owned by `docs/timeline/data/**` and governed by `docs/timeline/SPEC.md`; this UI does not create or promote historical claims.

## What it implements

- linear truth strip showing the current viewport against the full dated claim span;
- explicit Earlier / Later / Zoom / Jump controls;
- alphabetical regional lanes with no default geographic center;
- claim/layer filters and search;
- URL-round-trippable range, zoom, lanes, layers, search, view mode, and selection;
- focusable DOM timeline marks;
- synchronized list representation;
- detail inspector with claim tier, date semantics, confidence, evidence, interpretations, `does_not_demonstrate[]`, sources, and verification metadata;
- redundant confidence styling rather than color-only encoding;
- light/dark theme, reduced-motion support, forced-colors support, and phone-safe layouts.

## Important coverage rule

The current research data does not yet provide complete lane × period research-coverage metadata. Therefore an empty lane in this prototype is deliberately labeled:

> Not represented in the current filtered dataset. Coverage status is unknown; no historical absence is inferred.

Do **not** replace that wording with “nothing existed,” “no evidence exists,” or similar language until the research pipeline can prove which absence state applies.

## Build and run

Generate the browser data bundle from the current Timeline JSON:

```bash
node timeline-app/build-data.mjs
```

Then serve the repository root with any static HTTP server. For example:

```bash
python3 -m http.server 8766
```

Open `/timeline-app/` from that server.

`timeline-app/data.js` is generated and intentionally gitignored. Research agents can continue changing `docs/timeline/data/**` without also editing a UI artifact.

## Validation

Run syntax checks, generate the current bundle, then execute the phone browser smoke test:

```bash
node --check timeline-app/app.js
node --check timeline-app/build-data.mjs
node timeline-app/build-data.mjs
bash timeline-app/test-browser.sh
```

The smoke test runs at a 390×844 Chromium viewport and verifies:

- timeline lanes render from real verified/published claim data;
- the truth-strip viewport exists;
- a claim opens the inspector;
- the synchronized list view contains claim controls.

## Publishing boundary

This prototype currently includes claims whose Timeline status is `verified` or `published`. A persistent UI banner states that verified research may not yet be promoted to published content.

Before any public deployment, make an explicit owner decision about whether production should show:

- `published` only, or
- `verified` + `published` with a clearly labeled research-preview mode.

Do not remove that distinction implicitly.

## Relationship to the interaction contract

The intended design contract is `docs/timeline/INTERACTION_SPEC.md` (proposed separately). This prototype implements the first DOM/state/accessibility stages of that contract. It intentionally does **not** yet implement:

- drag/pinch direct manipulation;
- density aggregation/clustering;
- network/transmission view;
- complete research-coverage absence states;
- production deployment.

Those should be added only after the current DOM/state model proves stable against the growing research dataset.
