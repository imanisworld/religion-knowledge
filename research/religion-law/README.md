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
- `records/us-state-starter.json` — normalized state records promoted from verified state profiles
- `records/us-md-maryland.json` — earlier Maryland structured baseline pending migration to the common schema
- `records/policy-influence.json` — sourced U.S. policy-influence overview; advocacy/public opinion is kept separate from legal causation
- `records/global-legal-structure.json` — sourced U.S.-vs.-global structural comparison rows
- `records/institutional-practice.json` — sourced records separating formal law from official practice, representation patterns, and accommodation frameworks
- `overview-records.schema.json` — schema for the policy, global, and institutional-practice overview datasets
- `context/state-context.schema.json` — schema for state religious-demographic and institutional-power context
- `context/us-state-context.json` — 50-state context records; demographic/power coverage is tracked independently from legal coverage
- `state-context-methodology.md` — sourcing, non-inference, denominator, and refresh rules for state context
- `us-constitutional-federal.md` — verified initial U.S. module
- `us-state-law.md` — state-law research queue and controls
- `comparative-constitutional-systems.md` — comparative constitutional and institutional queue
- `source-registry.md` — source hierarchy and source hubs

## Status

This module is published on `main`. Individual state and comparative records remain research-scoped according to their recorded verification status; publication does not mean the database is complete.

The comparison table only includes law-level records whose classification and status are supported by the verified source profile. Items whose religion-causation classification is still pending remain in the state profile but are not forced into A–E for display.

State religious demographics and officeholder affiliations are maintained as a separate context layer. They may be compared with legal records, but they are not evidence that religion caused a law; causation still requires the methodology's independent historical evidence.

The policy-influence table answers a different question from A–E causation: it records documented religious public opinion, litigation, or organizational advocacy around a policy area. Presence in that table is **not** evidence that religion caused the resulting law. The institutional-practice table separately records formal rules, official practices, representation patterns, and accommodation frameworks without treating cultural visibility as legal coercion. Source links are typed so legal authorities, polling, advocacy materials, status trackers, government-practice sources, and comparative primary law are visibly distinguishable.
