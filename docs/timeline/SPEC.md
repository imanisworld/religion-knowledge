# Timeline App — Phase 1 Specification: Architecture, Data Model, Research Requirements

**Status:** Draft for owner review. Converts `docs/timeline/HANDOFF.md` (a ChatGPT-conversation
synthesis, unverified) into buildable architecture per that document's own §63/§66 instruction.
**This document asserts zero historical claims.** Every date or example that appears below is
marked *illustrative — unverified* and exists only to show a data shape. Nothing here may be
promoted into application content without passing the research pipeline in §8.

**Relationship to this repo:** The timeline app is a separate product from the Bible Deep Dive
corpus, but it inherits this project's control layer wholesale: verify-by-search before
recording, claim-level citations, explicit uncertainty, camp/position labels for interpretive
disputes, "earliest surviving ≠ first ever," and the documented-vs-inference separation. The
corpus's own audited material (Israelite religion, Asherah/monolatry development, canon
formation, translation history) is a candidate *seed region* for Phase 4 — with the advantage
that it is already audited. Nothing in `docs/timeline/` participates in the corpus build:
these files are outside the eight-source allowlist, the reader pipeline, and the search index.

---

## 1. Non-negotiable principles (design invariants)

These are enforced by the data model, not by editorial goodwill. Each maps to a schema
mechanism below.

| # | Principle | Enforced by |
|---|---|---|
| P1 | Earliest-surviving ≠ first-ever. No absolute "first" claims. | `date_semantics` enum on every dated field (§5.2); lint rejects `FIRST_EVER` |
| P2 | Absence of evidence is not evidence of absence. | `evidence_absence_note` required when a lane/period renders empty (§6.4) |
| P3 | No linear progression narratives (animism→polytheism→monotheism; ignorance→enlightenment). | Traditions are graph nodes with typed edges, never ranked stages (§7) |
| P4 | No default center. Abrahamic/European/literate traditions get no privileged position. | Lane order is user-configurable; default sort is alphabetical, not "historical importance" |
| P5 | Modern geographic categories are not ancient identities. "Middle East" banned as an ancient-period lane. | Lane vocabulary is period-scoped (§4); lint rejects banned labels in pre-modern contexts |
| P6 | Confidence is data, never tone. | Required `confidence` enum + `scholarly_disagreement` on every claim (§6) |
| P7 | Interpretation is separated from evidence. | `evidence[]` vs `interpretations[]` are distinct arrays; interpretations carry camp labels |
| P8 | Oral traditions get the five-date treatment, never one fake-precise date. | `TraditionDating` object required for every tradition (§5.3) |
| P9 | "Myth" is a genre label applied consistently to living and dead traditions alike, or not at all. | Controlled vocabulary: `creation_narrative`, `cosmology`, `sacred_narrative` (§7.3) |
| P10 | The science/religion comparison is run without a predetermined verdict. The owner's hypothesis (HANDOFF §58) is stored as a hypothesis object with support/complication links, not as schema bias. | `Hypothesis` entity type (§7.6) |
| P11 | No historical content generated from model memory. | Research pipeline §8; every claim carries `verification` metadata; unverified claims cannot reach `published` status |
| P12 | Scale must be felt. | Log-zoom time model (§3); lane density indicators; the "recorded history is tiny" visual is a launch requirement (§9.1) |
| P13 *(owner addition, post-handoff)* | Observation, interpretation, and causal explanation are three different claims. "Absence of women's voices" (a description of the surviving record) is never evidence for "women's voices were deliberately silenced" (a causal explanation needing its own evidence). | `claim_tier` enum on every claim (§6.6); validator forbids a `CAUSAL_EXPLANATION` claim whose only evidence is the observation it explains |
| P14 *(owner addition, post-handoff)* | Do not infer an entire social system from the visibility of one exceptional individual — and do not erase exceptional individuals because they conflict with a simplified narrative. | `does_not_demonstrate[]` field on claims (§6.7); Person-scoped claims cannot be promoted to Culture-scoped generalizations without independent evidence |
| P15 *(owner addition, post-handoff)* | Gender systems are historical institutions that change over time, not a timeless background condition — and "patriarchy" is not a boolean. | `GenderSystem` entity with six independently dated/evidenced dimensions (§7.7); a single `patriarchy` field does not exist in the schema |

---

## 2. System shape

Three layers, deliberately decoupled:

1. **Claim store** — flat, append-only collection of `Claim` objects (JSON files or SQLite),
   each independently sourced and statused. This is the research product.
2. **Entity graph** — `Population`, `Culture`, `Polity`, `Tradition`, `Text`, `Deity`,
   `Narrative`, `KnowledgeState`, `GenderSystem`, `Person`, `WritingSystem`, `MediaEra`,
   `Hypothesis` nodes plus typed edges. Entities *aggregate* claims; they assert nothing
   on their own.
3. **Presentation** — the zoomable timeline, lanes, panels, and query interface. Renders
   only `published` claims; renders uncertainty markers as first-class UI, not footnotes.

The corpus repo's proven pattern applies: canonical data → generator → validated build
artifacts → CI drift check. Validators are written *before* content exists (Phase 1 exit
criterion), so the first researched claim lands in an already-enforcing system — the corpus
learned this order the hard way.

---

## 3. Time model

- **Internal representation:** signed astronomical year (integer, negative = BCE, no year 0
  handling exposed to users; UI formats as BCE/CE and "years ago" contextually — "years ago"
  above 10,000 BP, calendar dates below).
- **Every date is a range + distribution hint:** `{earliest, latest, central, precision}`
  where `precision ∈ {YEAR, DECADE, CENTURY, MILLENNIUM, ORDER_OF_MAGNITUDE}`. Point dates
  are stored as degenerate ranges. Radiometric-style ranges keep their published error bars.
- **Zoom levels** (log-scaled; each level declares which entity/claim categories render):

  | Level | Window | Renders |
  |---|---|---|
  | Z0 | ~10M years | hominin lineages, climate epochs |
  | Z1 | ~1M years | Homo populations, dispersals, technologies |
  | Z2 | ~100K years | population coexistence, symbolic-behavior evidence, migrations |
  | Z3 | ~10K years | agriculture, settlements, ritual sites |
  | Z4 | ~5K years | polities, writing systems, named individuals, deities, texts |
  | Z5 | ~1K years | traditions, transmissions, knowledge states, empires |
  | Z6 | ~100 years | media eras, documentation volume, named ordinary voices |
  | Z7 | ~decade | modern documentation/preservation events |

  A claim declares `zoom_min`/`zoom_max`; the renderer never shows a millennium-precision
  claim at Z7 as if it were a dated event.
- **The scale visual (launch requirement):** at every zoom-out, previously visible content
  collapses into a labeled sliver whose proportional size stays honest. No log-scale trick
  may make writing's ~5K years look comparable to the ~300K-year sapiens span without an
  explicit mode switch the user performs knowingly.

## 4. Region / lane model

- Lanes are **visualization conveniences, versioned by period** — a lane set is
  `{lane_id, label, valid_from, valid_to, successor_lanes[]}`. "Iranian Plateau" can hand
  off to "Persia" to "Iran" across period boundaries without implying continuity of identity.
- **Starting lane vocabulary** (from HANDOFF §20, subdividable, never mergeable upward into
  vaguer labels): Africa (with sub-lanes: Egypt, Nubia/Kush, Horn of Africa/Aksum, North
  Africa, West Africa, Central Africa, Sahel, East Africa, Southern Africa), Mesopotamia,
  Levant, Anatolia, Iranian Plateau / Central Asia, Arabian Peninsula, South Asia, East Asia,
  Southeast Asia, Europe, North America, Mesoamerica, South America / Andes, Australia,
  Melanesia, Micronesia, Polynesia.
- **Banned as ancient-period lanes:** "Middle East," "Near East" (allowed only as a
  historiographical term inside prose with scare quotes), "the West," modern nation-states
  before their existence. Lint enforces.
- Egypt renders inside the Africa lane group. Cross-lane interaction edges (Egypt↔Levant)
  carry the relationship; lane placement does not.
- An entity may span lanes (`lanes[]`), and lane membership itself carries `confidence`.

## 5. Dating semantics (the anti-false-precision layer)

### 5.1 `date_semantics` enum — required on every dated claim

- `EVENT_DATE` — the thing happened then (rare; mostly modern).
- `EARLIEST_SURVIVING_EVIDENCE` — oldest physical evidence currently known.
- `EARLIEST_WRITTEN_ATTESTATION` — oldest text mentioning it.
- `SURVIVING_MANUSCRIPT_DATE` — date of the physical witness (can be far later than composition).
- `ESTIMATED_COMPOSITION` — scholarly estimate of when a text/tradition was composed.
- `TRADITION_INTERNAL_CLAIM` — when the tradition itself says it happened (stored, labeled, never plotted as history).
- `ESTIMATED_ORAL_ORIGIN` — reconstructed earlier oral history, always with method noted.

`FIRST_EVER` does not exist in the vocabulary. UI copy templates render
`EARLIEST_SURVIVING_EVIDENCE` as "earliest currently known…" automatically.

### 5.2 `TraditionDating` object — required for every tradition/narrative

```json
{
  "earliest_archaeological_evidence": {"range": null, "note": ""},
  "earliest_written_attestation":     {"range": null, "note": ""},
  "surviving_manuscript_date":        {"range": null, "note": ""},
  "estimated_composition":            {"range": null, "method": "", "disputed": false},
  "tradition_internal_claim":         {"range": null, "note": ""},
  "estimated_oral_origin":            {"range": null, "method": "", "confidence": "LOW"},
  "dating_summary": "one honest sentence, e.g. 'Earliest securely documented X; earlier origins probable; how much earlier unknown.'"
}
```

Any of the six may be null; the summary sentence is mandatory. This implements HANDOFF §36–37
directly.

## 6. Evidence & confidence model

### 6.1 Evidence types (enum, multiple per claim)
`ARCHAEOLOGY, ANCIENT_DNA, WRITTEN_PRIMARY, INSCRIPTION, ORAL_TRADITION, ART_ICONOGRAPHY,
MATERIAL_CULTURE, ASTRONOMICAL, SCIENTIFIC_ANALYSIS, LATER_HISTORICAL_ACCOUNT, LINGUISTIC,
ETHNOGRAPHIC, COMPARATIVE_RECONSTRUCTION`

### 6.2 Confidence (enum, required)
`HIGH` (multiple independent lines / broad consensus) · `MODERATE` · `LOW` · `DISPUTED`
(substantial scholarly disagreement — requires ≥2 `interpretations[]` with camp labels) ·
`UNKNOWN` (evidence does not permit an answer — a legitimate terminal state, renderable).

### 6.3 Source records
Each claim carries `sources[]`: `{type: PRIMARY|SECONDARY, citation, author, year, venue,
contemporary_with_event: bool, independent_corroboration: bool, verified_by, verified_date,
verification_method: DIRECT_READ|CONVERGING_SECONDARY|SEARCH_SNIPPET, access_note}`.
`verification_method` matters: this project's own experience shows egress-blocked sources get
verified via converging secondary description, and that limitation must travel with the claim
(the corpus already does this — e.g., its Alter-quotation and Lindars-article flags).

### 6.4 Absence handling
When a lane×period cell has no claims, the renderer shows an explicit
`evidence_absence_note` ("no surviving written sources from this region/period; absence of
evidence here reflects preservation, not absence of culture") rather than blank space.
Default notes per lane/period are part of Phase 1 content (they are methodological, not
historical claims).

### 6.5 Interpretations
`interpretations[]`: `{position, holders: [{name, work, year, camp}], strongest_case,
status: MAJORITY|MINORITY|CONTESTED|FRINGE}`. Camp labels follow the corpus convention
(`[CRITICAL]`, `[CONSERVATIVE-EVANGELICAL]`, etc., extended per field: `[ARCHAEOLOGICAL]`,
`[INDIGENOUS-SCHOLARSHIP]`, …). Position is context, not disqualification.

### 6.6 Claim tiers (owner addition — implements P13)
Every claim carries `claim_tier`:

- `OBSERVATION` — a description of the surviving record ("no texts authored by women
  survive from this context").
- `INTERPRETATION` — a reading of what the record indicates ("literacy was likely
  restricted to scribal classes that mostly excluded women").
- `CAUSAL_EXPLANATION` — an account of why ("women were deliberately excluded from
  scribal training") — requires evidence of its own, distinct from the observation it
  explains.

Validator rules: a `CAUSAL_EXPLANATION` whose `sources[]` merely re-cite the observation
is rejected; the UI renders tiers with distinct visual grammar so an observation is never
readable as an explanation. This rule applies app-wide, not only to the gender track:
observation first, interpretation second, causal claim third.

### 6.7 `does_not_demonstrate[]` (owner addition — implements P14)
Any claim — most valuably case-study claims about individuals — may carry an explicit list
of things this evidence does **not** establish, rendered as a first-class panel, not a
footnote. Worked data-shape example (all facts *illustrative — unverified* pending the §8
pipeline; Enheduanna is already flagged for verification at HANDOFF §14):

```
Person: Enheduanna (~2300 BCE, Mesopotamia — illustrative, unverified)
Position: high priestess of Nanna at Ur; daughter of Sargon of Akkad;
  literary works traditionally attributed to her
demonstrates: elite women could occupy extremely powerful
  religious/political positions
does_not_demonstrate:
  - that ordinary women had equal status
  - that Mesopotamia was non-patriarchal
  - that Enheduanna was being systematically silenced
```

Scope rule: a claim whose subject is a `Person` cannot be promoted into a Culture- or
Tradition-scoped generalization without independent evidence at that wider scope.

## 7. Entity graph

### 7.1 Node types
- **Population** — biological/demographic unit (hominin lineages, ancient-DNA clusters).
  Supports *reconnecting* branches: `gene_flow_edges[]` so interbreeding renders as
  reconnection, never as tree violation (HANDOFF §5).
- **Culture** — archaeological/historical culture; explicitly not equal to Population or Polity.
- **Polity** — political unit; may patron traditions/deities (`patronage` edges).
- **Tradition** — religious/cosmological system *as a time-varying entity*; requires
  `TraditionDating`; category tags from a non-hierarchical set (animism, ancestor veneration,
  polytheism, henotheism, monolatry, monotheism, pantheism, panentheism, non-theistic,
  mixed) — tags, never rungs.
- **Deity/Being** — with `identifications[]` (cross-culture equations, each sourced and
  confidence-rated), `domain_history[]` (domains change over time; no single-word freezing).
- **Text** — with `WritingSystem` link, `decipherment_status`
  (`DECIPHERED|PARTIAL|UNDECIPHERED|DISPUTED`), witness chain (composition vs. manuscript).
- **Narrative** — creation stories etc.; `motif_tags[]` from HANDOFF §31's vocabulary;
  motif similarity is *searchable* but never auto-renders as influence (P3, §31 warning).
- **KnowledgeState** — the "what did they know" panel's backing entity: per culture×period,
  `known[]` / `unknown[]` / `natural_explanations[]` / `supernatural_explanations[]`, each
  item itself a sourced claim. This entity powers the owner's-hypothesis comparison without
  encoding its conclusion.
- **Person** — named individuals; `voice_type` (ruler, worker, merchant, author, letter-writer,
  complainant…) feeding the Voices layer (§9.3).
- **WritingSystem** — `origin_type: INDEPENDENT|STIMULUS_DIFFUSION|ADAPTATION|UNCERTAIN`.
- **MediaEra** — documentation/preservation regimes (manuscript, print, photography, digital…)
  with `durability_profile` per medium (HANDOFF §9).
- **GenderSystem** — gender/kinship/power arrangements per culture×period as a
  time-varying institution, six independent dimensions, no aggregate boolean (see 7.7).
- **Hypothesis** — first-class object (see 7.6).

### 7.2 Edge types
From HANDOFF §43, plus population genetics:
`DESCENT, REFORM, SCHISM, SYNCRETISM, BORROWING, CONQUEST, MISSIONIZATION, TRANSLATION,
STATE_ADOPTION, SUPPRESSION, REVIVAL, CULTURAL_FUSION, DEITY_IDENTIFICATION, DEITY_RENAMING,
SHARED_ANCESTRY, GENE_FLOW, PATRONAGE, UNCERTAIN_CONNECTION`.
Every edge carries `confidence` and `sources[]`. **An influence edge without a source that
asserts the influence is invalid** — motif similarity alone cannot create an edge (Phase 7 rule).

### 7.3 Genre vocabulary
`creation_narrative | cosmology | sacred_narrative | ritual_corpus | legal_corpus |
wisdom_literature | …` applied uniformly to living and dead traditions. The word "myth"
appears only in explanatory prose about the term itself.

### 7.4 Contingency annotations
For "why did X spread" entities: `{structural_conditions[], immediate_causes[],
contingent_events[], plausible_alternatives[], modality: CONTINGENT|CONTESTED}`.
`INEVITABLE` is not an assignable value; `RANDOM` is not an assignable value. The
random/contingent/inevitable distinction is explained once in app methodology copy.

### 7.5 Mechanism vocabulary for spread
`political_patronage, empire, conquest, trade, migration, missionary_activity, literacy,
scripture, translation, education, community_reproduction, institutions, law, colonization,
cultural_adaptation, voluntary_conversion, coerced_conversion` — multi-select per
tradition×period×region, each selection sourced. No single-mechanism reductions.

### 7.6 Hypothesis objects
The owner's core hypothesis (HANDOFF §58) is stored as:
`{id, statement, proposer: OWNER, status: OPEN, supporting_claims[], complicating_claims[],
notes}`. The app can render a hypothesis page showing both columns. The hypothesis never
filters or colors default rendering. Additional hypotheses can be added the same way; none
can reach `status: ESTABLISHED` without the owner explicitly reviewing the evidence page.

### 7.7 GenderSystem entity (owner addition — implements P15)
Per culture×period (versioned over time like every institution — a society's arrangements
in one period say nothing automatic about the next), a `GenderSystem` carries **six
independently dated, independently evidenced, independently confidence-rated dimensions**.
They are different phenomena that can appear at different times with different intensity;
the schema has no field that aggregates them into a "patriarchy: yes/no" value.

| Dimension | Question it answers |
|---|---|
| `gendered_labor` | Were jobs divided by sex? |
| `political_inequality` | Were most rulers/office-holders male? |
| `legal_economic_status` | Could women independently own/inherit property? |
| `household_authority` | Could husbands/fathers legally control women? |
| `gendered_legal_restrictions` | Were women's sexuality/marriages regulated differently? |
| `ideological_patriarchy` | Did texts explicitly portray women as naturally subordinate? |

Each dimension is `{assessment, evidence[], confidence, claim_tier, sources[], change_events[]}`.
Supporting field vocabulary: `gender_roles, property_rights, inheritance_rules,
marriage_authority, political_office, religious_office, legal_status,
evidence_for_patrilineality, evidence_for_matrilineality, evidence_for_gendered_labor,
evidence_for_systematic_male_authority`. Descent-system evidence (patrilineality /
matrilineality) is its own axis — kinship structure and male authority are not the same
question.

The target query this entity exists to answer is not "was this society patriarchal?" but:
**"exactly what authority did men and women possess here, according to what evidence, and
when did those arrangements change?"**

P13 applies with full force here: the surviving record's silences (an `OBSERVATION`) never
auto-generate silencing claims (a `CAUSAL_EXPLANATION`). P14 applies symmetrically:
exceptional individuals neither prove a system nor get erased by one — the
`does_not_demonstrate[]` panel (§6.7) is expected on every individual case study in this
track.

**Corpus seed:** the Field Guide's audited §15 material (women in biblical texts and
interpretation, including the complementarian strongest-case survey) feeds this track's
Levant lane — already run through the verification method this spec requires.

## 8. Research pipeline (the production gate)

Adopted from the corpus's working method; every step already has precedent in this repo.

1. **Claim extraction** — a research target (e.g., a HANDOFF §57 question) is decomposed
   into atomic claims with proposed `date_semantics`.
2. **Verification** — web-search/agent verification against scholarly and institutional
   sources; museum/critical-edition translations for primary texts; named scholars with
   camps for interpretations. Recall is never sufficient. Each verification records
   `verification_method` honestly (§6.3).
3. **Adversarial pass** — the strongest counter-position is located and recorded *before*
   the claim is statused (the corpus's "strongest case for every side" rule).
4. **Status assignment** — `draft → verified → published`; `DISPUTED`/`UNKNOWN` are
   publishable statuses, `unverified` is not.
5. **Owner gate** — batches of new claims ship as audit-gated PRs requiring explicit
   approval, same as corpus scholarly content. Schema/validator/infra changes self-merge
   on green CI, same as corpus infra.
6. **Drift control** — validators check: every claim has sources, confidence,
   date_semantics; every edge has an asserting source; banned vocabulary absent; every
   empty lane×period cell has an absence note; every `DISPUTED` claim has ≥2 interpretations.

## 9. Presentation requirements (build-order priority)

1. **Scale visual** (P12) — the ~300K/~5K/decades proportional graphic; launch-blocking.
2. **Zoomable lanes** — §3/§4; simultaneous rendering is the point (HANDOFF §45's questions
   are the acceptance tests: each must be answerable by direct manipulation).
3. **Voices layer** — when do recoverable individual voices begin, by category (§7.1 Person).
4. **"What did they know?" panel** — KnowledgeState rendering; ✓/✗ lists plus explanation
   modes; never renders a verdict on the hypothesis.
5. **"What survives?" panel** — evidence inventory per culture×period with real counts once
   researched; illustrative numbers never ship.
6. **Confidence rendering** — visual grammar distinguishing HIGH/MODERATE/LOW/DISPUTED/UNKNOWN
   at a glance (the corpus's badge system is the starting point).
7. **Network view** — tradition graph with typed, sourced edges; motif-similarity view is a
   visually distinct overlay that explicitly disclaims influence.

## 10. Phase plan with exit criteria

| Phase | Deliverable | Exit criterion |
|---|---|---|
| 1 (this doc) | Architecture + schema + validators | Validators run green on an empty dataset; owner approves spec |
| 2 | Human evolution claims | Every hominin claim sourced to peer-reviewed paleoanthropology/aDNA; interbreeding rendered as gene flow |
| 3 | Writing systems | Origin-type honestly classified; decipherment statuses complete; no independent-invention overclaims |
| 4 | Religion, region-by-region — **start order: Africa, Australia, Americas, Oceania, then Eurasia** (deliberate inversion of source-availability bias; Abrahamic material last, partly seeded from the already-audited corpus) | Each region has absence-notes where evidence is thin, instead of silent gaps |
| 4G | Gender/kinship/power systems, region-by-region — same Africa-first ordering as Phase 4; runs alongside it | Six dimensions independently evidenced per culture×period; no patriarchy boolean anywhere; every individual case study carries `does_not_demonstrate[]`; the §12 flagged claims resolved before any of them publish |
| 5 | Creation narratives | Every narrative has full `TraditionDating`; motifs tagged; zero influence edges yet |
| 6 | Knowledge states | Each ✓/✗ item sourced; "could reliably observe/calculate/predict" framing per HANDOFF §49 |
| 7 | Transmission edges | Only scholarship-asserted edges; motif similarity remains edge-free |
| 8 | Modern documentation | Media eras + durability + misinformation-era modeling; MySpace-class loss events verified before inclusion |

## 11. Deliberately deferred to the owner

- **Where this lives long-term** — grow inside this repo vs. a new repository. The spec is
  self-contained either way; `docs/timeline/` is movable.
- **Tech stack** — the corpus's stack (static generators + vanilla JS + Workers deploy) is
  sufficient for Phases 1–5; a heavier rendering approach (canvas/WebGL for the zoom UI) is
  a Phase-later decision that shouldn't block research.
- **Scope of Phase 2 start** — whether to begin research at Phase 2 (hominins) or Phase 4
  (religion), where the existing corpus gives a head start.
- **Whether the corpus and timeline share a deployed site.**

## 12. Open research questions

HANDOFF §57's twenty questions are adopted verbatim as the research backlog, tracked as
`Hypothesis`/research-target objects, none pre-answered. Question 15 (knowledge/supernatural
correlation) is the owner's hypothesis and gets the §7.6 treatment.

**Gender-track additions (owner, post-handoff)** — added to the backlog with the owner's own
cautions attached; none may become app facts before careful sourcing:

21. Puabi "ruling in her own right" — the specific claim of independent rule needs sourcing
    beyond the richness of the burial.
22. Kubaba's historical status — she appears in the Sumerian King List, but that list's
    historical reliability varies considerably across rulers and periods; the entry alone
    settles nothing.
23. The dating and trajectory of patriarchal institutionalization — whose periodization,
    on what evidence, with which of the six §7.7 dimensions actually moving when.
24. How women's legal status changed across Mesopotamian periods — period-by-period, with
    primary legal sources, not a single summary arc.
25. The track's governing question everywhere: exactly what authority did men and women
    possess in a given culture×period, according to what evidence, and when did those
    arrangements change?
