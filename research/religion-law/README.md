# Religion and Law Research

An isolated, source-audited research workspace for mapping legal relationships between religion and law.

## Scope

This project separates five distinct relationships:

1. **A — Explicit religious legal basis:** religion, doctrine, a sacred source, religious court, or religion-specific legal category appears in the legal text.
2. **B — Historical religious origin:** strong evidence connects the original enactment to a religious practice, doctrine, or movement.
3. **C — Mixed religious influence:** religion materially shaped advocacy or legal development alongside nonreligious causes.
4. **D — Religion-limiting rule:** the rule limits establishment, religious tests, coercion, or official religious exercise, or protects religious exercise from government burden.
5. **E — Principally secular documented purpose:** standard legal and policy histories identify primarily nonreligious aims.

## Research rule

A law's text, its historical cause, and its current enforceability are separate questions. No record should call a law ‘caused by religion’ without documenting the relevant historical evidence and material competing explanations.

## Modules

- `methodology.md` — coding and evidence rules
- `schema.json` — machine-readable record schema
- `records/us-federal-starter.json` — normalized federal comparison records
- `records/us-state-starter.json` — normalized state records promoted from verified state profiles (59 classifiable entries)
- `records/pending-causation/us-tx-penal-21-06.json` — retained 1973 Texas §21.06 legal facts and disputed causal classification; intentionally excluded from A–E comparison pending §21.06-specific source passage
- `records/us-md-maryland.json` — earlier Maryland profile, retained for provenance only; its provisions were migrated into `us-state-starter.json` on 20 October 2026 and the reader no longer loads it
- `records/policy-influence.json` — sourced U.S. policy-influence overview; advocacy/public opinion is kept separate from legal causation
- `records/global-legal-structure.json` — sourced U.S.-vs.-global structural comparison rows
- `records/institutional-practice.json` — sourced records separating formal law from official practice, representation patterns, and accommodation frameworks
- `overview-records.schema.json` — schema for the policy, global, and institutional-practice overview datasets
- `context/state-context.schema.json` — schema for state religious-demographic and institutional-power context
- `context/us-state-context.json` — 50 state context slots (50 verified first-pass, with unknown affiliations explicitly retained); demographic/power coverage is tracked independently from legal coverage
- `state-context-methodology.md` — sourcing, non-inference, denominator, and refresh rules for state context
- `us-constitutional-federal.md` — verified initial U.S. module
- `us-state-law.md` — state-law research queue and controls
- `comparative-constitutional-systems.md` — comparative constitutional and institutional queue
- `source-registry.md` — source hierarchy and source hubs
- [`TODO.md`](TODO.md) — **current release gate, completed draft work, ordered next actions and unresolved research**; use this for the #240 handoff
- [`reviews/2026-10-20-release-readiness.md`](reviews/2026-10-20-release-readiness.md) — source audit and limitations controlling any qualified first-pass publication

## Status

**Coverage snapshot, 20 October 2026:** All 50 states have a first-pass profile and eight priority states have expanded profiles. The normalized state-law dataset has **59 records (source-classified) across 16 states**, with **1 additional Texas §21.06 causation file held unclassified** (34 states have no normalized state-law record yet); all eight expanded priority states are now represented. The separate state-context dataset has 50 state slots: **50 have verified first-pass demographic and officeholder coverage**; **0 remain uncoded**. Unknown individual religious affiliations stay unknown rather than inferred. Comparative non-U.S. work remains a research framework rather than a full set of country profiles.

The existing Religion & Law overview is published on `main`. The 50-state context expansion, normalized state-law additions, and corrections in [draft PR #240](https://github.com/imanisworld/religion-knowledge/pull/240) are **not published or approved for merge**. The latest canonical branch already includes PR #248's Gender Over Time readability changes; #240's candidate is reconciled onto that `main` baseline so it must not restore any older interface files. Montana's 1972 historical interpretation remains **provisional** (OCR and later scholarship, independent original pages and committee reports pending); Texas §21.06 remains **unclassified** despite separately established legal status. Individual state and comparative records remain research-scoped according to their recorded verification status; publication of the overview does not mean the research database is complete.

**Next publication decision:** Either an independent source review closes the outstanding gates or the owner **explicitly accepts the recorded limitations for a qualified first-pass release**. Passing CI does not grant that acceptance. The proposed branch's source-confidence snapshot `c528356` passed [corpus CI](https://github.com/imanisworld/religion-knowledge/actions/runs/39525544214) and [research governance CI](https://github.com/imanisworld/religion-knowledge/actions/runs/39525544213); check the *newest branch SHA* again before any merge because status/TODO edits came afterward. Retain superseded draft PRs #218, #219, #221, #223 and #225 until #240 is actually merged, then close them, verify the new `main` Cloudflare deployment, and update canonical status records. See [the checklist](TODO.md).

The comparison table only includes law-level records whose classification and status are supported by the verified source profile. Items whose religion-causation classification is still pending remain in the state profile but are not forced into A–E for display.

State religious demographics and officeholder affiliations are maintained as a separate context layer. They may be compared with legal records, but they are not evidence that religion caused a law; causation still requires the methodology's independent historical evidence.

The policy-influence table answers a different question from A–E causation: it records documented religious public opinion, litigation, or organizational advocacy around a policy area. Presence in that table is **not** evidence that religion caused the resulting law. The institutional-practice table separately records formal rules, official practices, representation patterns, and accommodation frameworks without treating cultural visibility as legal coercion. Source links are typed so legal authorities, polling, advocacy materials, status trackers, government-practice sources, and comparative primary law are visibly distinguishable.
