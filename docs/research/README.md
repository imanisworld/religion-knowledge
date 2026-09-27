# Research Documentation

This directory contains the governance layer for research content in the `religion-knowledge` project.

---

## Files

| File | Purpose |
|---|---|
| `claim-registry.json` | The canonical claim-level fact-check ledger. Every important public claim should have an entry here. |
| `claim-registry.schema.json` | The JSON Schema that defines the required structure of every registry entry. |
| `RESEARCH_CHANGE_TEMPLATE.md` | The required checklist for any PR that adds or modifies a factual or interpretive claim. |

The `scripts/validate-claim-registry.mjs` script validates the registry against the schema and enforces operational rules. It runs in CI on every PR and push to `main`.

---

## Claim Types

Every claim entered into the registry must be assigned one of these types. The type determines the evidence standard required.

| Type | Description | Evidence required |
|---|---|---|
| `direct_textual` | What a text literally says | Named edition/translation; exact quotation |
| `manuscript_textual_critical` | Manuscript dates, readings, variants, provenance | Named critical edition or catalogue + qualified secondary scholarship |
| `historical_date_event` | When something happened; what occurred | Named primary evidence where available + reputable modern scholarship |
| `historical_interpretation` | Why something happened; what it meant | Multiple representative sources; degree of consensus stated |
| `linguistic` | What a word or phrase means | Named lexicon/grammar + contextual usage; competing renderings noted |
| `scholarly_consensus` | What scholars broadly agree on | Multiple academic sources; field and degree of agreement defined |
| `causation_influence` | One thing was borrowed from or caused by another | Evidence of chronology, contact/transmission, AND meaningful correspondence — not just resemblance |
| `theological_confessional` | What a tradition holds or teaches | Attributed to named traditions, not asserted as historical fact |
| `ethical_polemical` | A critique or ethical argument | Strongest opposing formulation required; distinguished from historical description |

---

## Evidence Thresholds

- **`direct_textual`:** exact primary-text reference; specified edition/translation; quotation verified word-for-word.
- **`manuscript_textual_critical`:** current critical edition/catalogue (NA28/BHS/LXX) plus qualified secondary scholarship; note disputed readings.
- **`historical_date_event`:** named primary evidence where available; reputable modern historian; traditional dates noted as traditional where unsupported archaeologically.
- **`linguistic`:** lexicon (BDAG, HALOT, or equivalent) plus contextual usage; semantic range acknowledged.
- **`scholarly_consensus`:** minimum two representative academic sources from different schools; define the relevant field.
- **`causation_influence`:** requires three distinct elements — chronological possibility, a plausible contact/transmission channel, and meaningful correspondence. Thematic similarity alone does not qualify.
- **`theological_confessional`:** must be attributed. Never framed as historically demonstrable fact.
- **`ethical_polemical`:** strongest-form presentation of opposing view required. Distinguish critique from historical description.

---

## Confidence Levels

| Level | Meaning | Appropriate public wording |
|---|---|---|
| `high` | Supported by primary evidence and scholarly consensus | "The earliest extant witness is…"; "Scholars broadly date…" |
| `medium` | Supported by significant scholarly work but not without challenge | "Many scholars argue…"; "The dominant view is…" |
| `low` | Plausible but without strong direct evidence | "One interpretation holds…"; "It has been suggested that…" |
| `contested` | Serious scholarly disagreement exists | "Scholars disagree; [position A] while [position B]…" |

---

## Prohibited Wording

The following phrases are banned from public claims unless a `prohibited_wording_exception` field is supplied in the claim registry entry with specific justification:

- "proves" / "proof"
- "all scholars agree"
- "clearly means"
- "the Bible originally said"
- "this was copied from"
- "the church changed"
- "they believed" (when attributing belief to a diverse group across centuries)
- "beyond doubt"
- "no serious scholar"

Each of these formulations may occasionally be defensible, but each requires unusually direct evidence and carefully scoped wording. The prohibition is a gate, not a permanent bar.

---

## Adding a Claim

1. Write the claim in its exact public wording.
2. Assign a stable `claim_id` using the format `PREFIX-TOPIC-NNN` (e.g., `HF-EXILE-001`, `TR-ALMAH-002`).
3. Classify it using the claim type table above.
4. Assign confidence and initial status (`unreviewed` if not yet checked).
5. Add at least one source with a specific locator (page, section, verse — not just a title).
6. For `disputed` or `ethical_polemical` claims, supply a `counterargument`.
7. List every `public_locations` entry where the claim appears.
8. Validate locally: `node scripts/validate-claim-registry.mjs`
9. Open a PR using the Research Change Template.

---

## Review Statuses

| Status | Meaning |
|---|---|
| `verified` | Claim is accurate and well-sourced |
| `verified_with_qualification` | Accurate but needs scoping language in the public text |
| `overstated` | The claim's direction is right but it asserts more certainty than the evidence supports |
| `inaccurate` | The claim is factually wrong; must be corrected before next publication |
| `disputed` | Serious scholarly disagreement exists; claim needs balance |
| `unreviewed` | Not yet independently checked |
| `needs_qualification` | Claim is probably fine but wording is too absolute without a hedge |
