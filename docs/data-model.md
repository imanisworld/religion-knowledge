# Data Model

Each knowledge item is an atomic record. Do not flatten whole conversations into a single untraceable summary.

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
  "status": "OPEN",
  "position_status": null,
  "created_date": null,
  "original_date": null,
  "source_file": null,
  "source_conversation": null,
  "source_reference": null,
  "parent_id": null,
  "related_ids": [],
  "tags": [],
  "citation": null,
  "attribution_confidence": "PROVEN",
  "attribution_evidence": {
    "method": "exported_role",
    "value": "user"
  },
  "review_required": false
}
```

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

## Integrity constraints

1. IDs must be unique and durable.
2. Raw source records must not be mutated by normalized-data edits.
3. `MY_WORDS`, `MY_POSITION`, and `MY_QUESTION` require explicit attribution evidence to the user.
4. `CLAUDE` and `CHATGPT` must remain distinct origins.
5. `INFERENCE` cannot be represented as `VERBATIM`.
6. Unknown attribution becomes `REVIEW_REQUIRED`; it is never guessed.
7. Parent and related IDs must resolve to existing records before release.
8. Duplicate detection must mark candidates without deleting source-distinct records.
9. AI-generated topic metadata must be distinguishable from author-supplied topic labels.

## Source manifest

Each imported raw file should eventually have a manifest entry containing:

- source filename
- SHA-256
- import timestamp
- parser name/version
- produced record IDs
- warnings/errors
- source type

This manifest is the audit trail from application records back to the original material.
