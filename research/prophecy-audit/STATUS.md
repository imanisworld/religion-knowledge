# Biblical Prophecy Audit — Status and Handoff

**As of:** October 20, 2026  
**Repository:** `imanisworld/religion-knowledge`  
**Research branch:** `research/prophecy-evidence-20261020`  
**PR:** [#202](https://github.com/imanisworld/religion-knowledge/pull/202)  
**Release decision:** Keep the PR open until the complete selected inventory, internal source checks, and independent review are finished.

## Verified research counts

| Measure | Count | Definition |
|---|---:|---|
| Canonical source-linked case records | **46** | Entries in `records.json`, with matching Markdown, HTML reader cards, and search anchors on this branch |
| Research batches | **8** | Batch history retained in `records.json` |
| Initially internally reviewed | **11** | Earlier assistant content check, not outside academic peer review |
| Later records needing detailed internal review | **35** | Batches 2–8, including source-located and spot-checked cases |
| Classic Matthew fulfillment-formula quotations | **10/10** | A bounded quotation subset, not all Matthew allusions |
| Additional seed candidate locations | **50** | Worklist, **not** a defensible total of all biblical prophecy |
| Candidate locations with dedicated research cases | **29** | Distinct later claims may have a shared earlier textual source |
| Candidate locations linked to earlier cases | **2** | Direct earlier case coverage without duplication |
| Remaining seed candidates pending or partial | **19** | Six Daniel, seven Jesus/Paul imminent-timing texts, three Revelation groupings, and three NT quotation checks |
| Historical oracle candidates researched | **11/11** | Source-located cases; full review still required |
| Independent external review | **0 completed** | Explicitly deferred until the full chosen inventory is complete |
| Main-site release | **Not yet merged** | A PR build or successful CI does not show that the research is in production |

**Counting rule:** The ten Matthean formulas and fifty additional seed locations overlap with the 46 case records. Do not sum these numbers or describe the worklist as all biblical prophecies. Its completeness still needs a discovery audit.

## Batches and review gate

| Batch | Cases | Subjects | Status |
|---|---:|---|---|
| 1 | 11 | Initial cross-category sample | Internally reviewed (outside review still pending) |
| 2 | 6 | Matthew formula quotations | Full review pending |
| 3 | 5 | NT Greek/Hebrew reuses | Full review pending |
| 4 | 3 | Other Matthew quotations | Full review pending |
| 5 | 5 | John 13/19 and Acts 2/3/13 | Source spot-checked; full review pending |
| 6 | 5 | John 12, Romans 9/11, Hebrews 1 | Source spot-checked; full review pending |
| 7 | 6 | Cyrus, Jeremiah's seventy years, Tyre, Isaiah 13 and Nineveh | Source located; full review pending |
| 8 | 5 | Damascus, Obadiah, Jeremiah 49, Haggai 2, Zechariah 14 | Source located; full review pending |
| **Total** | **46** | | |

## Most important evidence limitations

- Isaiah 17's Damascus oracle follows a geopolitical crisis in 735–732 BCE; loss of Aramean kingship was real, while [UNESCO documents continued urban settlement](https://whc.unesco.org/en/list/20/).
- [Obadiah](https://doi.org/10.1177/0309089214567376) and [Jeremiah 49](https://doi.org/10.1177/030908928200702406) overlap in wording. They are separate biblical cases but not necessarily independent witnesses. Idumaean identity continued beyond the fall of Edom's polity.
- Haggai 2's `khemdat kol-haggoyim` with a plural verb is commonly rendered as the nations' treasures ([NET notes](https://classic.net.bible.org/passage.php?passage=hag+2%3A6-9)); a singular messianic application is a later reading.
- Zechariah 14's future Jerusalem scene is apocalyptic, involving the Mount of Olives, cosmic signs, living waters, and a universal pilgrimage. A complete historically observed fulfillment has not been established.
- A historically documented event does not establish the date its oracle was first composed. An author citing earlier words documents that author's interpretation, which is distinct from outside evidence of a miracle.
- Full claim review requires checking critical text, manuscript variants, relevant scholarly passages and competing Jewish/Christian interpretations. Citation existence and CI passing do not settle academic claims.

## Handoff and next checkpoint

Follow [TODO.md](TODO.md) for the 19 tracked unfinished loci. Finish those, then run an inventory discovery/deduplication audit. Verify **35 later cases** claim-by-claim; revisit earlier cases when needed. Rebuild and check the reader and search index before assembling the single external review packet. Do not merge until the outside reviewer returns findings and corrections are reconciled.

**Source links:** [records.json](records.json) · [inventory.json](inventory.json) · [index.md](index.md) · [REVIEW.md](REVIEW.md) · [TODO.md](TODO.md)
