# Site-wide public field-visibility audit — 20 October 2026

## Scope and findings

This handoff checks the **structured Timeline entity store against the catalog and its adjoining public readers**. It also identifies the separate Cited Persons, Gender Over Time, law, research-reader, claims, and traditions output paths. It is an **inventory of visibility and provenance**, rather than a source-level validation of every archaeological, religious, gender or historical statement.

The canonical Timeline entity tree has **179 source records across 10 entity families**. Only **five families, totaling 128 records**, are listed on the public comparative catalog today. The remaining **five families contain 51 records** that are not indexed there. Some of the subject matter appears elsewhere in separately curated public pages; the same source records must not be assumed to be mirrored there.

| Canonical family | Records | Present in catalog? | Disposition and next work |
|---|---:|---|---|
| Deities | 37 | Yes | Domains/regions shown; period/attestation and richer descriptions are addressed by **draft #239**. Proposed identifications need individual verification. |
| Religions / traditions | 27 | Yes | Documented written periods shown; a linked historical profile exposes more dating forms and limited source-checked facts. Cross-tradition relationships are still evidence-gated. |
| Cultures / societies | 23 | Yes | Names/regions/notes shown. Structured `date_range` currently hidden; date/evidence column included in the reconciled catalog release branch. |
| Creation narratives | 17 | Yes | Name/text/region and some date notes shown. Motifs and separate composition/manuscript dates included in the reconciled catalog release branch; borrowing links remain **unverified hypotheses** until underlying claim IDs are checked. |
| Writing systems | 24 | Yes | Names/type/notes visible. Origin classification, tentative ancestry and dated witness are included in the reconciled catalog release branch; the presence of a `descends_from` entry does not prove ancestry. |
| Gender systems | 21 | No direct per-record listing | **Hold for source and culture-specific review**: six dimensions per culture, varied confidence, and missing passages. The separate Gender Over Time public research module has **39 different records** and is not equivalent to these Timeline entries. |
| Knowledge states | 3 | No | **Hold for cultural permission/provenance and source review**. Some records explicitly exclude restricted traditional knowledge; do not convert outsider analytical bins into communities' own descriptions. |
| Historical polities | 9 | No | Could become a dated, source-bounded catalog family after reviewer checks and explicit route design; some related context appears in History and Religion & Law, but **these nine rows are not published there by direct mapping**. |
| Human populations | 6 | No | Human-evolution chronology, disputed taxonomic status and possible gene-flow links need expert citation and uncertainty labeling. General history material elsewhere does not certify source parity. |
| Texts, inscriptions, witnesses | 12 | No | **Promising separate evidence index** (e.g. Behistun), but each text's inscription/composition/witness dates and decipherment status must stay distinct and be checked before publication. The current catalog's *writing systems* listing does not include these text records. |

**Cited Persons:** a separately maintained public reader/search index with 365 people and research status warnings. **Do not derive biographical dates from a publication date** or treat an author's verified bibliography as verifying every theological claim. The source-to-public record tests live in `tests/public-cited-persons-*.test.mjs`.

**Other public pages:** Markdown study readers use a generated reader pipeline and separate pagination/index tests. Gender Over Time, Religion & Law, comparative tables and traditions profiles have distinct research source pipelines. This audit **does not establish full source-by-source parity for all their articles**. Doing so needs a subsequent module-specific field map, not an ungrounded promise that everything in `research/` is already public.

## Field-level control

`scripts/audit-public-field-visibility.mjs` enumerates all ten family directories, loads their JSON Schema files, checks every defined and encountered top-level source field against **`CATEGORY_POLICY`**, and fails on a new family or unclassified field. Its report identifies: currently shown catalog fields, partially exposed fields, draft-#239 fixes, internal keys, independently displayed source facts, and claims deliberately withheld for review. It checks the presence of the named public routes and returns **actual source-record counts**, not an invented coverage percentage.

`tests/public-field-visibility.test.mjs` confirms the full 179/128/51 inventory, retains the 39 vs 21 gender-dataset distinction, ensures withheld categories are not silently rendered as if source-vetted, and requires an explicit explanation for every field. Add new schema fields or family routes **only with an accompanying public-display or deliberate-withholding decision**.

Run locally with:

```sh
node scripts/audit-public-field-visibility.mjs
node scripts/audit-public-field-visibility.mjs --json
node --test tests/public-field-visibility.test.mjs
```

CI runs the audit early, **before unrelated browser-navigation smoke tests**, so failures elsewhere do not hide missing field policy.

## Next controlled release decisions

1. **Verify the reconciled catalog changes:** date/evidence columns, narrative motifs, script-origin labels and limited direct source links; retain contested influence edges behind author-passage review. Verify its separate catalog tests, global CI gate and the deployed site.
2. **Add a clear public coverage disclosure** explaining that the catalog currently indexes five Timeline families, while additional families remain under source review. Avoid displaying sensitive culture-specific knowledge as default search results.
3. **Prioritize twelve historical texts and nine polities for future public indices** only after verifying record-specific witness dates/claim provenance. Keep the 21 gender assessments and three knowledge-state records in a separate, careful review with restricted-knowledge safeguards.
4. **Audit the separate module transforms** (law, gender, illness, prophecy, synthesis, translations) to determine which *specific fields* are omitted from their public readers. Distinguish deliberate editorial summaries from silent loss and source-access blocks.
5. **Fix the independent reader-navigation CI failure** observed on the main branch before claiming full deployment readiness. Passing the new field-inventory check alone does not establish a full green build.

## Boundaries

- No historical claims, dates, private or sensitive material are promoted into the catalog by the audit.
- A stored relationship/claim ID is **not** sufficient evidence of borrowing, cultural dependence, a translated word's meaning, or an event's historicity.
- Machine checks establish that fields have an explicit **display decision**, not that displayed historical conclusions are true.
- The reconciled release branch combines the catalog updates and this audit; neither is live until CI, review, merge and production verification. The present audit is **documentation and governance tooling only**, with no merge or deployment claim.
