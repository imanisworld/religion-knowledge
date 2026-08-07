# Data Model

Each knowledge item is an atomic record. Do not flatten whole conversations or documents into a single untraceable summary.

## Core record

```json
{
  "id": "rk_...",
  "text": "normalized display text",
  "raw_text": "original text when available",
  "provenance_type": "MY_WORDS",
  "representation_type": "VERBATIM",
  "speaker": "user",
  "topics": ["example-topic"],
  "subtopics": [],
  "record_type": "OBSERVATION",
  "status": "OPEN",
  "position_status": null,
  "original_date": null,
  "source_file": "Bible_Deep_Dive_Master_Notes.md",
  "source_section": "§1.3",
  "source_reference": null,
  "parent_id": null,
  "related_ids": [],
  "tags": [],
  "citation": null,
  "attribution_confidence": "PROVEN",
  "attribution_evidence": {
    "method": "explicit_marker",
    "value": "⟨YOURS⟩"
  },
  "review_required": false,
  "parser_version": "manual-foundation-v1"
}
```

## Record types

- `OBSERVATION`
- `POSITION`
- `QUESTION`
- `CLAIM`
- `SOURCE_NOTE`
- `AUDIT`
- `CORRECTION`
- `COUNTERARGUMENT`
- `DEBATE_NOTE`
- `DEFINITION`
- `TIMELINE_EVENT`

## Allowed statuses

Question/workflow status:

- `OPEN`
- `EXPLORING`
- `RESOLVED`
- `REOPENED`

Position status:

- `TENTATIVE`
- `ADOPTED`
- `REJECTED`
- `REVISED`

Audit result examples:

- `HOLDS`
- `PARTIALLY_HOLDS`
- `OVERSTATED`
- `COLLAPSED`
- `REVISED`
- `UNRESOLVED`

## Integrity constraints

1. IDs must be unique and durable.
2. Raw source files must not be mutated by normalized-data edits.
3. `MY_WORDS`, `MY_POSITION`, and `MY_QUESTION` require explicit attribution evidence to the user.
4. `CLAUDE` and `CHATGPT` remain distinct origins.
5. `INFERENCE` cannot be represented as `VERBATIM`.
6. Unknown or explicitly mixed attribution becomes `REVIEW_REQUIRED`; it is never guessed.
7. Parent and related IDs must resolve to existing records before release.
8. Duplicate detection marks candidates without deleting source-distinct records.
9. AI-generated topic metadata must be distinguishable from author-supplied topic labels.
10. Original claim → audit → correction history must remain linked and visible.

## Source manifest

Each canonical source should eventually have a manifest entry containing:

- path
- SHA-256
- file size
- source role/type
- canonical vs. derived classification
- parser name/version
- produced record IDs
- warnings/errors

The manifest is the audit trail from app records back to the committed corpus.
