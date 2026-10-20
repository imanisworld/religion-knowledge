# Biblical Prophecy Audit — Status and Handoff

**As of:** October 20, 2026  
**Repository:** `imanisworld/religion-knowledge`  
**Research branch:** `research/prophecy-evidence-20261020`  
**PR:** [#202](https://github.com/imanisworld/religion-knowledge/pull/202)  
**Release rule:** Stay open/unmerged until the inventory is defined and completed, internal accuracy passes, and the requested independent external review is resolved.

## Source-of-truth counts

| Measure | Count | Meaning |
|---|---:|---|
| Canonical research records | **59** | In `records.json`, `index.md`, the HTML reader and Search, on the PR branch |
| Research batches | **10** | Stored with IDs and review status in `records.json` |
| Originally internally reviewed | **11** | Initial assistant source audit, not independent peer review |
| Later records requiring full source verification | **48** | Batches 2–10, including newly source-located cases |
| Classic Matthew fulfillment formulas | **10/10** | Specific scholarly-defined quotation subset |
| Additional seed claim locations | **50** | Non-exhaustive working set, never a count of every biblical prophecy |
| Seed locations with distinct targeted records | **42** | Some source texts are reused with different later applications |
| Seed locations covered by earlier linked cases | **2** | Already addressed by source-specific earlier cases |
| Pending/partly related seed locations | **6** | Three Revelation groupings and three other NT quotation checks |
| Historical-oracle seed cases | **11/11** | Located; full review still necessary |
| Daniel-vision seed cases | **6/6** | Located; full review still necessary |
| Jesus/Paul timing seed cases | **7/7** | Located; full review still necessary |
| Independent specialist review | **Not completed** | Defer until complete defined inventory |
| Live release | **Not merged** | PR branch/preview contents are not production evidence |

These categories overlap. Adding 59 + 50 + 10 would be inaccurate; the 50 locations are a discovery seed mapped onto records, and the full biblical inventory is still incomplete.

## Batch register

| Batch | Cases | Topic | Review |
|---|---:|---|---|
| 1 | 11 | First text and historical sample | Initial internal review |
| 2 | 6 | Matthew fulfillment formulas | Full review pending |
| 3 | 5 | Luke/Acts/John/Hebrews uses | Full review pending |
| 4 | 3 | Other Matthew claims | Full review pending |
| 5 | 5 | John and Acts | Source spot-check only |
| 6 | 5 | John, Romans, Hebrews | Source spot-check only |
| 7 | 6 | Cyrus, Babylon, Tyre, Nineveh | Source located |
| 8 | 5 | Damascus, Edom, Haggai, Zechariah | Source located |
| 9 | 6 | Daniel 2, 7, 8, 9, 11, 12 | Source located |
| 10 | 7 | Temple, generation, mission, kingdom, high priest, Paul | Source located |
| **Total** | **59** | | |

## Most important timing and evidence limitations

- **Mark 13:2:** Temple destruction in 70 CE is independently evidenced; Gospel composition relative to 70 CE and literal completeness of stone removal are debated. Temple sanctuary and surviving platform/retaining walls are different structures.
- **Mark 13:30:** The Greek `hē genea hautē` means 'this generation' in a context containing both the Temple crisis and cosmic Son of Man imagery. Whether 'all these things' includes the entire culminating scene changes the verdict; [Edsall 2025](https://doi.org/10.1177/0142064X241289867) examines the reception and ambiguity.
- **Matthew 10:23:** The limit on completing Israel's towns is explicit; the referent of the Son of Man 'coming' is debated. [Löfstedt](https://doi.org/10.58546/se.v90i1.25546) argues for resurrection/exaltation over the final end.
- **Mark 9:1:** 'Some standing here' establishes a lifespan test. Transfiguration, resurrection/exaltation, Spirit and final return are alternative interpretations, not a single established historical event.
- **Mark 14:62:** The 'you will see' audience, Psalm 110 and Daniel 7's heavenly movement matter. [Smith and Vaillancourt 2022](https://doi.org/10.15699/jbl.1413.2022.6) argue both enthronement and later return are in view.
- **1 Thessalonians 4:15–17:** Paul's first-person plural suggests expectation, but [Novum Testamentum 2024](https://brill.com/view/journals/nt/66/2/article-p231_5.xml?language=en) defends multiple grammatical possibilities; no categorical year or personal-survival prediction is independently specified.
- **1 Corinthians 15:51:** Greek witnesses have substantial changes to negative wording; [NET critical text notes](https://classic.net.bible.org/verse.php?book=1Co&chapter=15&tab=commentaries&theme=wiki&verse=51) list competing manuscript versions. Treat these variants explicitly.

## Next step

Research three Revelation groupings and three NT cross-reference applications; then conduct a full inventory discovery/deduplication pass (the list may grow). Complete detailed claim-level review of 48 newer cases, rectify sources and competing interpretations, and invite **one outside independent review** of the complete defined inventory. Check reader/search consistency and UI on 390px/1440px before any release. Owner approval required for the merge.

**Sources:** [records.json](records.json) · [inventory.json](inventory.json) · [index.md](index.md) · [REVIEW.md](REVIEW.md) · [TODO.md](TODO.md)
