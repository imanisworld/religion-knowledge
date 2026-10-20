# PR #212 reconciliation: source-gate decision (20 October 2026)

**Current disposition: HOLD DRAFT; do not merge.** Review compared draft PR #212 with main and the source-audit records in PR #216. GitHub reports mergeable and latest pre-reconciliation head checks green (reader validation, registry, Workers Builds), but shows **no review submissions**. The PR's own text requires explicit owner approval; that approval was not given merely by asking for reconciliation.

## Six person promotions proposed by #212 (main 194/171; draft 200/165)

| Person | Verifiable material already cited | Source gate for full interpretation | Required correction |
|---|---|---|---|
| E. P. Sanders | 1977 book title, p. 75 covenantal nomism and p. 409 on 4 Ezra quoted in **secondary blog/review**, original pages not inspected | **HOLD** | Read authenticated Sanders original pp. 75, 409; keep source-specific position unresolved until then, or restrict documented bio to bibliography. |
| Thomas R. Schreiner | Institutional profile, 1984 JETS article; original Eerdmans catalog proves **1988 Israel's Law and the Church's Faith belongs to Stephen Westerholm** | **NARROW correction substantiated** | Keep author/work bibliographic correction; check his original JETS pp. 151–160 before asserting detailed exegesis. |
| Mark A. Seifrid | Official biography and original book bibliographies; publisher calls his book a challenge to New Perspective | **BIBLIOGRAPHY ONLY** | Author passage required before particular New Perspective criticism is called checked. |
| Peter Stuhlmacher | Tübingen obituary confirms death 5 April 2025; 2001 book and subject verified by publisher/reviewer | **BIBLIOGRAPHY ONLY** | Read original 2001 author chapter before promoting theological interpretation. |
| Stephen Westerholm | Eerdmans original books (1988/2004) confirm authorship; **reviewer**, not author, describes his traditionalist thesis | **BIBLIOGRAPHY ONLY** | Inspect original 2004 introduction/conclusion (specific pages) or explicitly limit claim to verified bibliography. |
| N. T. Wright | Original 1978 Tyndale lecture PDF and firsthand 'Paul and Caesar' article support some claims; 1997 ecclesiology/soteriology quote linked through Ligonier **secondary citation** | **PARTIAL / HOLD quoted 1997 claim** | Check original 1997 What Saint Paul Really Said page or remove that quote pending source; date/lecture can be documented narrowly. |

**Decision:** The change to 200/165 cannot currently be certified under the owner's rule that **every attribution requires a verifiable original source passage before promotion**. Latest CI passes structural and reader consistency; it does not perform historical edition-level checking. Markers and derived output are synchronized *with one another*, but their evidentiary support must be reconciled.

## Five-source gate and #216 overlap

1. **Archer:** web-hosted author text rejects one specific Numbers-clan interpretation; variable retypeset vs printed pagination. Hold original-edition reconciliation; avoid saying every alternative rejected.
2. **Barton:** Marcion/Harnack author text found in a hosted reprint. Match chapter/edition and printed pages; **Micah 6 attribution still lacks any direct Barton passage**.
3. **Briggs:** a Joshua/Ai publication and online calculations are identified; this does not establish an authored Numbers-census paper. Keep held.
4. **MacDonald:** original book pp. 5–9 still unread; hold.
5. **MacIntyre:** source audit #216 located actual 1959 Philosophical Review pp. 451–468, supporting a narrow future promotion; do not silently bypass existing public source-gate test.

## Concrete integration work remaining

- Revise or split the **six status-marked public entries** so that bibliography-only facts cannot implicitly certify uninspected specific interpretations; update six individual evidence entries in claim registry.
- Regenerate site readers, search index, normalized data and status counts from Markdown using repo scripts. **Do not hand-edit generated HTML**.
- Update and run source-gate tests, npm test, reader-sync, claim registry, site build and browser smoke tests.
- Obtain independent reviewer confirmation, or the owner's **explicit documented, claim-specific acceptance** of allowed limitations before merging. Original pull request specifically says do not merge without explicit approval.
- PR #216 contains evidence notes on 110 of original 171 unresolved names; coordinate evidence decisions without merging unrelated research changes.
- **No claim made that this file itself fixed the six promoted person records.** They remain in PR #212's working branch. **Main still has 194 documented, 171 unresolved** at the reviewed snapshot.

**Reconciliation outcome:** branch differences and source blockers are recorded; publishing the six promotions is **blocked**, not approved. After source-gated changes are made and tests rerun, PR #212 may return for merge decision.
