# Swearing prosecutions — consolidated working data, 1695–1705

**Research-only, unpublished as a public reader, not approved as factual production content.** [PR #246](https://github.com/imanisworld/religion-knowledge/pull/246) **merged these control files to `main`**, without promoting any cursing/classism chapter to the public Library or Search. Issue #234 research passes 5–7 supply the transcribed name roster; the 1936 edited calendar is the cited underlying source. This data has **not** been checked against original court manuscripts. Audit date: 20 October 2026. [Current source-work checklist](TODO.md).

## Files

- `appearances.csv`: **355 recorded name appearances** from the 34 indexed pages of a **1936 edited calendar** of Buckinghamshire Quarter Sessions, 1694–1705. One row per *printed name appearance*; names are **not deduplicated**. Each has a stable row ID and printed page or range, audit-comment link, and historical source URL.
- `candidate-duplicates.csv`: 32 **algorithmically suggested identical-name groups**. They are **not verified same-person records**. Inconsistent location, altered trade, and name spelling are important; it is safer to leave uncertainty intact.

## Count reconciliation

| Measure | Result |
| --- | ---: |
| Weighted 1936 index references | 350 |
| Literal name appearances in issue transcripts | **355** |
| Source pages inspected in prior passes | **34 / 34** |
| Pass 5 / 6 / 7 appearances | **111 / 156 / 88** |
| Entries with an explicit fine | **52 / 355** |
| Sum of recorded nominal assessed fines (52 entries only) | **172 shillings** |
| Rows with at least one occupational/rank label recognized by extraction | **134** |
| Rows lacking a recognized occupational/rank label | **221** |

**The 350 ↔ 355 discrepancy is not corrected by silently removing five names.** On printed page 300, the index suggests 54 but the text appears to give 55 names; on page 412, the index cites the page once although five names occur. The index is not a reliable person-count denominator. Nor do 355 name appearances mean 355 unique people or 355 conviction events.

## Repeated-name controls

- **Documented within-session multiplicity:** October 1700's John Clarke appears in both an oath entry and an explicitly second-offence entry. Isaac Ray and Gabriel White each appear in an oath entry and a curse entry. Index p.300 has two Edward Edwards mentions: **same-person identity unresolved**.
- **Documented convictions, one recorded name appearance:** In Easter 1702 the Wendover butcher Thomas Stevens is recorded as having **two convictions**. This is one appearance and multiple convictions.
- **Explicit repeat status:** Ann Russell's earlier conviction (1695) and Thomas Brackley's second conviction (1701). A previous conviction mention is not a uniquely traceable match without records.
- **High-priority but unresolved candidates:** Thomas Dunstan of Hawridge (fiddler, three appearances in 1703); Richard Clarke junior of Great Kimble (two appearances, 1703); Francis Woodcock of Aylesbury (gaoler / under-keeper, 1703/04); John Jessett of Aylesbury (1703); Thomas Brackley of Buckland (May/July 1701); and John Tattum/Tattam of Beirton (name spelling variant).
- **Known potentially different people despite same name:** Thomas Stevens of Great Missenden, *labourer*, in October 1701 versus Thomas Stevens of Wendover, *butcher*, in April 1702. These must not be merged on name alone.
- **Parent vs child:** John, son of Gabriel White, is a different named defendant from Gabriel White; and the “son of Joan Mayden” is not Joan.

## Extracted-row candidate audit (20 October 2026)

All **32** candidate groups have now been cross-checked against the transcription's name, original page locator, session, locality, role and available qualifying text: [group-by-group audit](duplicate-group-review-20261020.md). Three mixed qualified-name groups are explicitly warned against person-merging (John Porter / John Porter junior, John Mayden / John Mayden junior, Nicholas Grainge senior / junior). Thomas Stevens and Michael Baldwin also have conflicting role/location descriptions. Two Edward Edwards `location` fields contained "first appearance"/"second appearance" rather than geographic places; these spurious values were cleared while preserving that context in `name_detail`. Data integrity and collision guards are tested in `tests/cursing-classism-transcription-integrity.test.mjs`.

**This is an extracted-data review, not a primary manuscript or edited-calendar facsimile verification.** It authorizes no person deduplication, revision of event totals, economic-class inference, or public release. The original-image identity check and the scholarly source-review gate remain open.

## Field cautions

- `name` is transcribed from issue extraction and may still contain historical variants; `name_detail` is whatever was put in parentheses or offense annotations in that extraction, not a standardized original court field.
- `role_as_reported` and `location` are convenience **lexical extractions**. Their presence/absence is not a peer-reviewed measure of occupation completeness, economic class, wealth, household role or income.
- `reported_oaths`, `reported_curses`, and `fine_shillings_assessed`: **empty means not explicitly stated**. Not zero. The 32-person 1702 phrase “one oath or curse” cannot be decomposed.
- `relation_marker` is direct textual description only, **not a demographic sex/gender identification** inferred from names.
- `repeat_marker` only reflects explicit words within the extract; empty means **unknown repeat status**.
- Fine totals reflect *assessed* nominal shillings in this incomplete source, not payments or relative economic burden.
- Candidate duplicate spreadsheet is **for manual audit only**; it may contain false positives, omit variant spellings, and cannot establish how many distinct people were prosecuted.

## What the evidence allows

People described as servants, labourers, tradespeople and gentlemen appear. Historical fines were stratified by rank under statutory law, while the calendar documents convictions across groups. **Disproportionate prosecution risk by class remains unknown** because occupational and population denominators, sampling completeness, complaints and actual prosecution selection are not established.

**Governance:** Dataset is a proposed research control artifact. Draft PR only; no merge, public reader, claim-registry promotion, search index, or production deployment until separately verified/reviewed. Evidence and class-effect claims remain under [Issue #234](https://github.com/imanisworld/religion-knowledge/issues/234).

## Subsequent research — Issue #234 passes 9–14 (20 October 2026)

The Buckinghamshire CSV above remains a *single-region name-appearance dataset*. Follow-on research is **separately documented** in [Issue #234](https://github.com/imanisworld/religion-knowledge/issues/234): [repeat-offense and punishment statutes](https://github.com/imanisworld/religion-knowledge/issues/234#issuecomment-6304745340), [1751 original-periodical OCR and Bridewell limitations](https://github.com/imanisworld/religion-knowledge/issues/234#issuecomment-6304873250), [wage-equivalent comparison](https://github.com/imanisworld/religion-knowledge/issues/234#issuecomment-6305109719), and [Northampton fine receipts, stocks and actual-payroll evidence](https://github.com/imanisworld/religion-knowledge/issues/234#issuecomment-6305174882).

**Supported:** Profane-swearing fines varied by legally defined rank; some named people paid fines, some faced stocks when goods could not satisfy penalties, and collected money sometimes went to the parish poor. A 1751 newspaper *reports* a Bridewell commitment and a hard-labour sentence. Gross wage equivalents demonstrate potentially substantial cash burdens but cannot establish individual defendants' earnings. 

**Unresolved:** Original court-manuscript and 1751 facsimile collation; unnamed 1751 defendants' identity, admissions and discharge; discrepant 390-oath / near-£20 rate; representative income-based prosecution/punishment risk. **No general claim that only poor people were prosecuted or that elites invented ancient religious speech prohibitions.** Keep Christian interpretive diversity and historical-original-language checks as separate tasks. See [TODO.md](TODO.md). These findings are **research leads pending formal synthesis and evidence review**, not public-promoted claims.
