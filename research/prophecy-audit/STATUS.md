# Biblical Prophecy Audit — Status and Handoff

**As of:** 2026-10-20  
**Repository:** `imanisworld/religion-knowledge`  
**Working branch:** `research/prophecy-evidence-20261020`  
**Pull request:** [#202](https://github.com/imanisworld/religion-knowledge/pull/202)  
**Release decision:** keep PR open. No research claim that all biblical prophecy has been audited; independent specialist review is deliberately deferred until the declared inventory has been completed and checked.

## Status at this checkpoint

| Measure | Value | Interpretation |
|---|---:|---|
| Source-located case records | **41** | Individually documented claims in `records.json`, not necessarily independently verified conclusions |
| Batches recorded | **7** | Sequential research groups, with statuses preserved |
| Cases in internally reviewed Batch 1 | **11** | These received a previous assistant review; this is **not** external academic peer review |
| Later cases awaiting full detailed internal review | **30** | Sources located and wording drafted, some given an initial spot-check only |
| Matthew's standard formula quotations | **10/10** | Bounded subcollection researched, not all possible Matthew scriptural citations |
| Additional candidate claim locations | **50** | An explicitly incomplete seed inventory, **not** the number of all biblical prophecies |
| Candidate locations with their own case record | **24** | Included in `records.json` |
| Candidate locations covered by an earlier case | **2** | No duplicate case created |
| Candidate locations without claim-specific completion | **24** | 21 pending research and 3 partial cross-references |
| External specialist review | **0 completed** | Intentionally deferred by user |
| Merged / live | **No at this research checkpoint** | GitHub and production should be rechecked before any later status claim |

**Important accounting:** The 50 candidate locations overlap with some of the 41 case records. Never add `41 + 50` as a meaningful total. The formula subset also overlaps with the case records. These counts answer different questions.

## Research batches

| Batch | Cases | State | Focus |
|---|---:|---|---|
| batch-1 | 11 | internally reviewed | Initial cross-category starter cases |
| batch-2 | 6 | research complete internal review pending | Complete Matthew's ten classic fulfillment-formula quotation cases |
| batch-3 | 5 | research complete internal review pending | Five high-value NT adaptations of prophetic Hebrew/Greek texts |
| batch-4 | 3 | research complete internal review pending | Additional Matthew references beyond the ten formulas |
| batch-5 | 5 | source spot checked full review pending | John 13/19 and Acts 2/3/13 |
| batch-6 | 5 | source spot checked full review pending | John 12, Romans 9/11 and Hebrews 1 |
| batch-7 | 6 | source located full review pending | Historical oracles: Cyrus, 70 years, Tyre, Babylon and Nineveh |

The latest batch studies: **Isaiah 44:28–45:1 (Cyrus)**, **Jeremiah 25:11–12 and 29:10 (seventy years)**, **Ezekiel 26 (Tyre)**, **Isaiah 13 (Medes/Babylon)**, **Nahum 1–3 (Nineveh)**. These cases distinguish independently established events from the dates of prophetic writing, biblical imagery, and the scope of claimed fulfillment.

## Evidence and publication rules

1. An earlier passage's wording, its historical setting, later reuse, and an external source for an event must each be separately recorded. Dating the narrated event does **not** date the prophecy's literary composition.
2. Distinguish **documented historical event**, **scholarly inference**, **later religious interpretation**, and **unverified supernatural claim**. Cite specific scholars and texts.
3. A biblical narrator citing a verse is proof of **the narrator's interpretation**, not an independent attestation of the narrated event.
4. Do not call every literary lament a prediction or every poetic image a literal timetable. Conditional warnings require their own classification.
5. Preserve an unresolved item if no reliable source confirms it. Source-located/spot-checked is a lower standard than complete claim-by-claim source audit.
6. No claim of a definitive total for “all prophecies” until an explicit inclusion universe and discovery pass have been independently audited.

## Where the truth lives

- **Canonical cases:** [records.json](records.json) — all individual source-to-claim research entries.
- **Coverage inventory:** [inventory.json](inventory.json) — classic Matthew formula subcorpus plus remaining seed candidates.
- **Human-readable research:** [index.md](index.md) — synchronized case details and citations.
- **Website reader:** [prophecy-audit.html](../../prophecy-audit.html) — mobile-accessible research card reader.
- **Independent review handoff:** [REVIEW.md](REVIEW.md) — corrections, debates, and outside-check requirements.
- **Remaining work:** [TODO.md](TODO.md) — actionable next research and release checks.
- **Search:** [search-index.json](../../search-index.json) — generated links to individual case sections.

## Next checkpoint and definition of done

The immediate next research groups are five still-pending historical oracles — Isaiah 17, Obadiah, Jeremiah 49, Haggai 2, Zechariah 14 — followed by sixteen Daniel / New Testament / Revelation apocalyptic candidates and three NT citations with only partial related cases. Complete those 24 locations, re-run discovery against additional scholarly claim inventories, fill any newly discovered cases, and then conduct the comprehensive internal review of the newer records.

**External review trigger:** after the inventory coverage is complete and audited, with all pages/sources synchronized and technical checks green; give the independent reviewer `records.json`, `inventory.json`, `index.md`, and `REVIEW.md`. External feedback must be reconciled before proposing a merge, unless the owner explicitly chooses another release policy.

**Last verified at this document write:** case and coverage counts from the branch. CI and mergeability are time-sensitive; verify them from GitHub rather than assuming the result of an earlier commit carries over.
