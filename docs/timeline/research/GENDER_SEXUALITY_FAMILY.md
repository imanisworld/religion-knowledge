# Sex, Gender, Sexuality, Family & Social Roles — Research Extension

**Status:** Research synthesis only. Asserts no historical facts of its own — every claim below
carries its own confidence rating and citation; nothing here is publishable `Claim` content until
it passes the research pipeline in `SPEC.md` §8 (verification already done here by live search,
per §8 step 2; adversarial counter-positions are recorded inline; owner review/status assignment
is still required before anything becomes an app fact).

**Relationship to the rest of the project:** this extends the `GenderSystem` entity (`SPEC.md`
§7.7) and principles P13–P15 — it does not replace them. It also resolves, in whole or in part,
research-backlog items 21–24 (`SPEC.md` §12): Puabi's independent rule, Kubaba's historicity, the
Mesopotamian periodization question, and Mesopotamian women's legal status by period. Compiled from
seven parallel research passes (evidence methodology/terminology risk; gender-diversity traditions;
sexuality-organization scholarship; family/kinship/patriarchy theory; Mesopotamia case-study
re-verification; sport/recreation; dataset discovery), each independently verified by live web
search — not drawn from model memory.

**Method carried through this whole document:** every claim is tagged, where the source material
supports it, with `claim_tier` (OBSERVATION / INTERPRETATION / CAUSAL_EXPLANATION) and a confidence
rating (HIGH / MODERATE / LOW / DISPUTED / UNKNOWN). Items the underlying research could not
confirm are marked **⟨UNVERIFIED⟩** and must not be promoted to app content without a follow-up
check — they are preserved here only so the gap is visible, not lost.

---

## A. Research Landscape

Five overlapping scholarly fields converge on this track, none of which alone covers it:

1. **Bioarchaeology / skeletal-sex-estimation methodology** — morphological vs. genetic sex
   determination, the osteological paradox, and the specific methodological literature on cases
   like Birka grave Bj 581 (§E.1).
2. **Queer historiography / history of sexuality** — anchored by Foucault's act-vs.-identity
   distinction and Halperin's application of it to antiquity; the field's live methodological
   argument is precisely the terminology-risk question this track was built to handle (§G).
3. **Assyriology / ancient Near Eastern gender studies** — a mature field (Harris, Stol, Bahrani,
   Wunsch) with genuinely strong primary-source density for some questions (naditu women, Sippar
   contracts) and genuinely weak evidence for others (Kubaba, Puabi's "independent rule") —
   confirming this project's suspicion that the two need to be pulled apart claim-by-claim, not
   treated as one undifferentiated "Mesopotamian women" picture (§E.2).
4. **Comparative/cross-cultural anthropology** — Murdock's Ethnographic Atlas and its
   descendants (D-PLACE, SCCS), structurally limited by Galton's Problem (non-independence of
   culturally related samples) and by colonial-era ethnographic sourcing (§B, §H).
5. **Economic history of gender-hierarchy origins** — the plough-agriculture / bridewealth-dowry /
   property-and-state-formation causal debate (Boserup, Alesina-Giuliano-Nunn, Goody, Engels,
   Lerner, Sanday, Divale-Harris), which is a genuinely live, unsettled dispute about mechanism,
   not a solved question with one winning theory (§F.1).

No single field integrates all five. The gap this track exists to fill is the same one identified
in `LANDSCAPE.md` for the capabilities project generally: cross-field integration with honest,
per-claim confidence labeling, not new primary research.

---

## B. Dataset Inventory

Datasets already catalogued in `DATASETS.md` (Seshat, Maddison, Clio-Infra, V-Dem, WID, OWID, UCDP,
COW, Polity5, EA/D-PLACE cross-reference, HMD) are not repeated here. New or materially enriched
entries found by this pass:

| Dataset | Maintainer | What's new here | Access | Status |
|---|---|---|---|---|
| SCCS "Division of Labor by Sex" (Murdock & Provost, *Ethnology* 12:203–225, 1973) | — | Per-task 5-point gendered-labor coding (v99–v148); more granular than the general D-PLACE cross-reference already logged | Open | Active |
| D-PLACE gendered-kinship variables (EA012/013, EA009/B018, EA015, EA024/025, B025) | UBC/Kent/Max Planck/AMNH | Specific variable IDs for residence, marriage form, cousin-marriage, family size | Open (Zenodo) | Active |
| eHRAF World Cultures / OCM subject codes | HRAF, Yale | Full-text ethnography indexed to gender/family/marriage/sexuality subject codes, complementing D-PLACE's coded summaries | Paid ($281–$6,259/yr tiered) | Active |
| V-Dem Women's Political Empowerment Index | V-Dem Institute | Sub-index of the already-logged V-Dem project; 1900–2012+ | Open | Active |
| World Bank Women, Business and the Law | World Bank | **Corrects an assumption**: has a real historical panel back to 1970, not modern-only | Open | Active |
| Cambridge Group (CAMPOP) / I-CeM | University of Cambridge | British household/family microdata, 1851–1921 | Mixed | Active |
| Eurasia Project on Population and Family History | Multi-institutional (Lee, Campbell, Bengtsson, Hayami) | Comparative China/Japan/Italy/Belgium/Sweden demographic microdata, 18th–19th c. — genuinely non-Anglo-European | Publications open; raw microdata collaborative | Active (program) |
| NAPP / IPUMS International | Minnesota Population Center | ~110M individuals, 7 countries, 1703–1911 census microdata | Open (registration) | Active |
| Human Fertility Database | Max Planck / Vienna Institute of Demography | Period/cohort fertility by age and birth order, ~30 countries | Open | Active |
| Six Cultures Study (Whiting & Whiting) | Harvard (1954–1988) | Rare *observed* (not reported) child-rearing/gender-socialization data, 14 societies | Publications only, no live database | Closed collection |
| Allen Ancient DNA Resource (AADR) | Reich Lab, Harvard | Molecular (not morphological) sex determination at scale — 17,634 ancient individuals, v66.0 | Open | Active, versioned |
| Trismegistos People | KU Leuven / DARIAH-BE | 375,000+ named individuals, ancient Mediterranean/Near East, with occupation/title/status metadata | Mixed (open API, paid portal since 2020) | Active |
| LaOCOST (Law and Order: Cuneiform Online Sustainable Tool) | Ilan Peled / ORACC | Purpose-built for querying gender regulation in cuneiform legal texts | Open | Currency unconfirmed — verify before relying on it |

**Confirmed gaps (report as gaps, not to be papered over):**
- **No open, structured, pre-modern LGBTQ/gender-diversity archive exists.** Digital Transgender
  Archive and ONE Archives are both 20th-century-only; the one partial exception (Gale's "Sex and
  Sexuality, Sixteenth to Twentieth Century," reaching the 1500s) is a paid digitized-book
  collection, not a structured dataset.
- **No comparative historical family-law database exists** beyond D-PLACE's coded summary
  variables. CEFL and the Max Planck Institute for Comparative and International Private Law
  produce harmonization texts, not queryable historical datasets.
- **No systematic sport/recreation-participation-by-sex/class dataset exists for any pre-modern
  period.** The only large sports dataset found ("120 Years of Olympic History," Kaggle) is a
  hobbyist scrape of a fan-run site, elite-competition-only, 1896-present.
- **DINAA** (checked specifically per the research brief) is a site-location index, not a skeletal/
  osteological database — does not fill the sex-estimation-at-scale gap the way AADR does.

---

## C. Evidence Matrix — What Each Evidence Type Can and Cannot Establish

| Evidence type | Can establish | Cannot establish | Confidence | Key methodological source |
|---|---|---|---|---|
| Skeletal morphology (pelvis/skull) | Probabilistic adult biological sex (~90–98% pelvis-based) | Sex in subadults; gender identity; social role. Documented cultural bias in "gracile/robust" scoring (Phillip Walker) | MODERATE–HIGH (adult, complete skeleton); LOW (fragmentary/subadult) | Bioarchaeological review literature, 2024–2026 |
| Ancient DNA (aDNA) | Chromosomal sex with high reliability, independent of preservation-driven morphological bias | Gender identity or social role — a separate inferential step | HIGH (sufficient DNA yield) | *Genes* 17(7):726, 2026; PMC10454762 |
| Isotope analysis | Childhood geographic origin (Sr/O); diet | Cause of movement (marriage vs. trade vs. captivity are all consistent with "non-local") | MODERATE (origin); LOW–MODERATE (social inference from it) | PMC7725410 |
| Burial/grave goods | Documented association between an individual and objects | Occupation, gender identity, or status symbolism *by itself* — competing readings required (see Birka case, §E.1) | LOW (interpretation layer); the underlying OBSERVATION is solid | General gender-archaeology literature |
| Administrative/occupational records (cuneiform, Linear B) | Named individuals, occupations, ration quantities with high precision | Free/enslaved status not always stated; subjective experience never | HIGH (recorded facts); LOW–MODERATE (status inference) | Linear B/Pylos scholarship; Sumerian ration-list studies |
| Legal codes | Elite/state normative expectations | Actual behavior or prevalence — the central prescriptive/descriptive gap (§D.1) | — | — |
| Marriage/property documents | Actual transactions, actual legal outcomes | — | HIGH where corpus is large (e.g. Neo-Babylonian, 16,000+ texts) | Wunsch; Harris |
| Religious/ritual-office records | Named office-holders, formal titles | Full scope of informal religious authority — record is geographically/chronologically uneven | MODERATE–HIGH (named holders); LOW (population-level prevalence) | Winter 1987; Connelly 2007 |
| Ethnography | Culturally-transmitted description | Colonial-era ethnography is now understood to *impose* Western categories as much as describe indigenous ones (Oyèwùmí's critique, §G) — treat as biased evidence, not a transparent record | DISPUTED, case by case | Oyèwùmí 1997 |
| Linguistics/kinship reconstruction | Probable descent/residence pattern for a reconstructed proto-society | Individual lived experience or regional variation within it | MODERATE (majority scholarly view, still an inference from vocabulary) | Comparative Indo-European kinship scholarship |

**The osteological paradox** (Wood, Milner, Harpending, Weiss, *Current Anthropology* 33(4),
1992) applies directly here: skeletal samples over-represent those who died from a given stress
episode and under-represent resilient survivors. A sex-differential in skeletal stress markers is
therefore compatible with *opposite* underlying realities (worse treatment, or higher underlying
resilience masking equal/worse treatment) and cannot be read as a direct CAUSAL_EXPLANATION without
independent corroboration. Reaffirmed in DeWitte & Stojanowski's 2015 20-years-later reassessment.

---

## D. Historical Comparison Framework

### D.1 Prescriptive vs. descriptive evidence

The distinction is well established in the historiography-of-evidence literature: a law
prohibiting behavior X is compatible with X being rare (successfully suppressed) **or** common
enough to need active suppression — the text alone cannot decide between these. Three concrete,
verified cases of documented behavior diverging from prescriptive norms:

1. **Rome** — formal patriarchal legal structure (paterfamilias authority) coexisted with *sine
   manu* marriage, under which wives retained property control described in the literature as
   functioning as "a legal fiction that in practice allowed Roman women more freedom and
   independence" than the formal ideology implied; divorce was frequent despite moralizing
   authorial condemnation.
2. **Ottoman Syria/Palestine** — Judith E. Tucker, *In the House of the Law* (UC Press, 1998),
   using actual sharia-court records, documents *khul'* (wife-initiated divorce) as a real, used,
   negotiated mechanism — directly contradicting a popular flat reading of "women couldn't divorce
   under Islamic law."
3. **Middle Assyrian Laws** — general ANE legal-history scholarship (Stol 2016) notes the code
   "explains how women should act" but not what they did daily; naditu women's actual Sippar
   contract behavior (§E.2) independently shows economic activity well beyond what a surface
   reading of the law collections predicts. *(The exact quoted framing for the MAL point could not
   be pinned to one named scholar — ⟨UNVERIFIED⟩ attribution, though the underlying pattern is
   solid.)*

### D.2 Terminology risk — see §G (kept as its own section given its weight in this track).

### D.3 Sexuality-organization axes (not object-gender-preference)

Verified across multiple societies that the socially salient axis was **role/status**, not
partner sex:

- **Greece**: active/passive (erastes/eromenos), age-structured, citizen-status-bound. *Kinaidos*
  was a term of gender-deviance (loss of self-mastery), not "orientation" (Halperin 1990; Dover
  1978/1989, foundational but substantially revised — see §F.2).
- **Rome**: citizen-status-bound active/passive — penetrating a slave or non-citizen of either sex
  was unremarkable; a citizen male being penetrated was the disgrace (Craig Williams, *Roman
  Homosexuality*, 1999/2010, "the penetrative paradigm" — confirmed as the standard framework).
- **Adultery law asymmetry**: verified across three independent legal traditions spanning ~1,700
  years — Code of Hammurabi §129, the Middle Assyrian Laws, and Rome's *lex Julia de adulteriis
  coercendis* (18 BCE) — adultery is consistently defined by the **married status of the woman**,
  regardless of the man's own marital status. The paternity/lineage-certainty rationale is
  consistent with this pattern across all three but was not found stated as a shared causal claim
  by one scholar comparing all three — flag the "why" as ⟨INFERENCE⟩, the pattern itself as
  DOCUMENTED.
- **Slavery structured sexual vulnerability differently by mechanism, not just degree**: Rome
  treated non-consensual sex with someone else's slave as property damage to the owner, not an
  offense against the person; U.S. chattel slavery (via the 1662 Virginia *partus sequitur
  ventrem* statute) converted rape into a direct wealth-generating act by tying a child's status to
  the mother's — a structurally different, and arguably worse, mechanism with no clean Roman
  parallel found.
- **Masculinity as performance, independent of partner-sex** — Maud Gleason, *Making Men* (1995),
  and Amy Richlin (*The Garden of Priapus*, 1983, and later essays) both apply a performance-based
  reading directly to ancient evidence (physiognomic literature, rhetorical training), avoiding
  Butler as a historical-evidence citation per the task's own instruction.

### D.4 The 20-dimension measurement framework (not a single "gender equality score")

Confirmed as sound and worth carrying forward unmodified: sex estimation, gender categories,
gender presentation, labor, political authority, religious authority, property, inheritance,
marriage, divorce, household authority, reproduction, sexual behavior, sexual categories, gender
diversity, kinship, residence, legal status, violence, education/literacy, sport/military — each
independently evidenced, never aggregated into one index. This mirrors and extends the existing
`GenderSystem` entity's six-dimension design (`SPEC.md` §7.7) rather than replacing it.

---

## E. Case Studies

### E.1 The Birka "warrior woman" (grave Bj 581) — the paradigm methodology case

**OBSERVATION** (HIGH confidence): Hedenstierna-Jonson et al., "A female Viking warrior confirmed
by genomics," *American Journal of Physical Anthropology* 164(4), 2017 — aDNA established two X
chromosomes, no Y, on an individual buried with a full weapon set, two horses, and gaming pieces.

**INTERPRETATION vs. CAUSAL_EXPLANATION, contested**: the excavating team's own 2019 follow-up
(Price et al., *Antiquity* 93(367)) defends a "warrior" reading. Named methodological pushback:
Fedir Androshchuk ("Female Viking Revisited," *Viking and Medieval Scandinavia* 14, 2018) and
Judith Jesch (2017 blog, standing academic reputation, University of Nottingham) both flag: (a)
the grave was excavated in 1878 under conditions raising possible commingling with other burials,
(b) gaming pieces as evidence of tactical command is speculative, (c) no trauma consistent with
combat is documented on the skeleton. **Competing readings that must all be carried, per this
project's `does_not_demonstrate[]` field**: occupation (fought as a warrior) / status-symbolism
(elite rank without combat) / inherited heirloom / ritual afterlife provisioning. Chromosomal sex
is HIGH-confidence; "she was a warrior by occupation" is INTERPRETATION requiring corroboration
this case does not yet have; "this reflects a fluid Viking gender system" would be a
CAUSAL_EXPLANATION requiring evidence well beyond one grave.

### E.2 Mesopotamia — Enheduanna, Puabi, Kubaba, and women by period/class

This directly resolves `SPEC.md` §12 items 21, 22, 23, 24.

**Enheduanna** — OBSERVATION (HIGH): contemporary Akkadian-period seals independently confirm she
existed and held the office of en-priestess of Nanna at Ur, daughter of Sargon (Disk of
Enheduanna, Penn Museum; household-staff seal impressions). **DISPUTED (this is the key finding)**:
that she *personally composed* the hymns attributed to her (Exaltation of Inanna, Temple Hymns).
These survive only in Old Babylonian copies 500+ years after her lifetime. Paul Delnero (Johns
Hopkins) states the attribution "almost certainly served to invest these compositions with...
authority... rather than to document historical reality." Annette Zgoll and Sophus Helle (Yale UP,
*Enheduana: The Complete Poems of the World's First Author*, 2023) independently frame the
attribution as an Old Babylonian-period authorizing convention, not evidence of 2300 BCE personal
authorship. **Corrected framing for any future corpus use**: "the earliest literary compositions
attributed by name to an individual, surviving only in copies made 500+ years after her lifetime;
specialists treat the attribution as a scribal/ideological convention rather than settled evidence
of personal composition" — not an unqualified "first author in history."

**Puabi** — OBSERVATION (HIGH): rich tomb (PG 800), Royal Cemetery of Ur, cylinder seal reading
"Puabi, nin/eresh" (queen or lady — genuine lexical ambiguity, not resolved). Associated
death-pit sacrifice, originally read by Woolley as peaceful/voluntary, since revised via CAT-scan
trauma analysis to violent. **LOW/DISPUTED**: "ruled independently in her own right." No king-list
entry, administrative text, or year-name names her as ruling monarch — the claim rests entirely on
tomb wealth plus the absence of a named husband on one seal, both of which are compatible with
"royal consort" as an equally or more parsimonious alternative. This is exactly the
correlated-facts-into-causal-story error CLAUDE.md already flags as a repeated project failure
mode; treat "Puabi ruled independently" as unsupported until independent textual corroboration
surfaces.

**Kubaba** — the weakest of the three claims. OBSERVATION (HIGH): the Sumerian King List names her
as ruling Kish for 100 years, using *lugal* ("king") rather than a queen-consort title in some
readings. **LOW confidence that this reflects real history**: the SKL is a composite propaganda
document compiled centuries after the periods it describes, with openly legendary reign-lengths in
its early sections (one figure over 40,000 years), and is read by mainstream Assyriology as
constructed substantially to legitimize the Isin dynasty's later hegemony claim. **There is no
independent Early Dynastic-period corroboration of Kubaba's existence** — she appears exclusively
in a source already documented as unreliable for exactly this kind of claim. The later cult
goddess Kubaba of Carchemish (attested ~1400 BCE, roughly a millennium later) is explicitly stated
in current scholarship as **not establishable** as the same tradition — "due to spatial and
temporal differences, a connection... cannot be established." **If the corpus ever treats Kubaba as
an unqualified historical ruling queen, that is an overstatement matching the exact pattern
CLAUDE.md's "things that have gone wrong before" section warns against.**

**Mesopotamian women by period/class — resolves item 24**: the record is genuinely
status-stratified, not a single arc.
- Code of Ur-Nammu (~2100 BCE) already specifies monetized divorce compensation.
- Code of Hammurabi (~1754 BCE) §§150/172 give widows dowry-plus-inheritance-share protections and
  standing to bring tribunal claims.
- **Naditu women of Old Babylonian Sippar** (Rivkah Harris, 1961/1962/1975) are the strongest
  documented case of female economic agency in the corpus: parties to nearly 70% of surviving
  Sippar contract texts, owning/managing real estate and extending loans — but this autonomy is
  tied to a specific temple-legal status (largely unmarried, temple-affiliated), not evidence of
  general free-commoner women's autonomy in the same period. Generalizing from naditu evidence to
  "Old Babylonian women" broadly would itself be an unsupported extrapolation.
- Neo-Babylonian/early Achaemenid record (Cornelia Wunsch; 16,000+ published legal/administrative
  texts) shows women with full legal capacity in property, trade partnerships, and credit —
  citation not independently re-read this pass, flagged for a direct follow-up before quoting it
  with page-level specificity.

### E.3 Gender-diversity traditions (kept separate per tradition, never collapsed into one "third gender")

- **South Asian hijra**: distinct from overlapping-but-different *kothi*, *jogappa*, *aravani*
  categories (Gayatri Reddy). Earliest evidence in the Kama Sutra (*tritiya-prakriti*) and
  Mahabharata; Mughal-court institutional role. Jessica Hinchy (2019) documents the 1871 Criminal
  Tribes Act as a joint product of colonial administrators *and* local elite reformist anxiety, not
  simply an imported British imposition. Current legal status diverges sharply by country: India's
  2014 NALSA recognition is criticized by Indian legal scholars as contradicted by the 2019
  Transgender Persons Act's certification requirement; Pakistan's 2009 court recognition and
  Bangladesh's 2013 recognition took different institutional pathways (judicial vs. executive).
- **Indigenous North America**: "Two-Spirit" is confirmed as a 1990 Winnipeg-conference English
  coinage (Myra Laramee/Albert McLeod) — an intertribal umbrella term, not a retrieval of one
  precontact concept. Nation-specific traditions verified separately: Diné nádleehí (Wesley
  Thomas), Lakota winkte (ceremonial functions legitimated by vision/dream), Zuni lhamana (the
  well-documented individual case of We'wha, via Matilda Coxe Stevenson's direct fieldwork
  contact), Mohave alyha/hwame (Devereux 1937 — flagged as secondhand oral reconstruction even at
  time of recording, not direct observation of an intact institution). Walter Williams (1986) is
  named and criticized (Harry Hay; Jean-Guy Goulet 1997) for conflating these roles with a modern
  "gay" category and for adding unwarranted conclusions to his Athapaskan source material; Sabine
  Lang (1998) makes the explicit corrective the project already suspected — the older "berdache"
  umbrella term flattened genuinely divergent, status-varying institutions.
- **Polynesia**: Samoan fa'afafine and Tongan fakaleitī are confirmed as distinct, not
  interchangeable — different etymology (fakaleitī derives partly from English "lady," and the
  earlier indigenous Tongan term was *tangata fakafefine*). Both scholars documenting them (Niko
  Besnier, Johanna Schmidt) note contemporary identity in both cases has been reshaped by
  Westernization/migration and should not be assumed continuous with precontact norms.
- **Mesopotamian ritual personnel** (assinnu, kurgarrû, gala/kalû): real cuneiform/etymological
  basis for institutionalized gender ambiguity (Ilan Peled, 2016, full monograph treatment) — but
  the *extent* is actively and legitimately contested. Julia Assante directly challenges both this
  literature and the broader "sacred prostitution" thesis (see §F.3); only a small number of texts
  (four, per one source) link assinnu to prophecy specifically. Treat as a live, unresolved
  scholarly disagreement, not a settled finding either way.
- **African traditions**: Igbo *igba ohu* (woman-woman marriage; Ifi Amadiume, 1987, based on her
  own fieldwork in her natal Nnobi community) and Lovedu/Balobedu Rain Queen marriage (Krige &
  Krige, 1943) are both confirmed as **kinship/property/lineage institutions**, not sexuality or
  gender-identity categories in the modern sense — this matches the project's own pre-flagged
  caution exactly. A specific colonial suppression campaign targeting *igba ohu* by name was **not
  found and should not be asserted** — the well-documented pattern is broader missionary-imposed
  marriage-norm change, not a targeted policy against this specific institution.
- **Bugis five-gender system** (South Sulawesi): makkunrai/oroané/calalai/calabai/bissu confirmed
  accurate (Sharyn Graham Davies). Bissu held a genuine formal political-religious court office
  (royal-regalia guardianship) pre-Islamization; decline tied to Islamization, the 1950s Darul
  Islam rebellion, and post-1998 rising conservatism. Fewer than 40 active bissu remain today per
  recent anthropological reporting. *(The claim that bissu were specifically targeted in the
  1965–66 Indonesian mass killings is ⟨UNVERIFIED⟩ — sourced only to one secondary summary.)*
- **Colonial legal export, general pattern**: Human Rights Watch's *This Alien Legacy* (Alok Gupta,
  2008) confirms Section 377 of the 1860 Indian Penal Code as the direct textual ancestor of
  sodomy statutes in 30+ countries, introduced without local consultation. Anjali Arondekar's
  "Without a Trace" (*Journal of the History of Sexuality* 14, 2005) and Jessica Hinchy's work both
  make the required dual point explicitly: colonial records are simultaneously the richest
  available evidence *and* records saturated with the moral panic they need to be read critically
  against.

### E.4 Sexuality-organization scholarship — see §D.3 above (already integrated to avoid duplication).

### E.5 Sport and recreation as an access axis

- **Panhellenic Games**: the married-women-banned-on-pain-of-death rule is documented (Pausanias
  5.6.7–8, 2nd c. CE, writing 500+ years after the practice) but Pausanias himself states the
  penalty was never actually enforced — treat as legally attested, practically inert, not evidence
  of routine executions. The Heraean Games (girls' footraces at Olympia) rest on Pausanias as the
  sole surviving source — existence documented, scale/prominence genuinely uncertain. **Kyniska of
  Sparta (396 BCE)** won as chariot-team *owner*, not driver — the distinction is load-bearing and
  confirmed by every source; she was the first woman recorded as an Olympic victor in any capacity,
  followed by several Ptolemaic queens (Berenike I, Arsinoe II, Berenice II, Bilistiche) as owners
  across the 3rd century BCE, per Posidippus's own epigrams — a recurring, not one-off, pattern
  among extremely wealthy women.
- **Roman gladiatorial combat**: the Halicarnassus relief ("Amazon" and "Achillia," British Museum
  object G,1847-0424-19) is a real, museum-held primary artifact documenting female gladiators;
  Septimius Severus's 200 CE ban (Cassius Dio) confirms the practice had reached "very
  distinguished women," not only enslaved performers. Gladiators generally were overwhelmingly
  enslaved/condemned; *auctorati* (freeborn volunteers) were a real, legally distinct, stigmatized
  (infamia-bearing) minority — precise proportional breakdown by status is **not well established**
  and should not be quoted as a hard figure.
- **Combat sports specifically**: no solid evidence found for women's participation in Greek
  boxing/wrestling/pankration — the Atalanta-wrestling motif is mythological/iconographic fantasy,
  not evidence of an actual institution. Report the absence itself as the finding.
- **Mesoamerican ballgame**: the sacrifice-of-losers claim is real but site/context-specific
  (Chichén Itzá, El Tajín iconography; post-Classic ethnohistoric accounts), not a universal rule —
  Maya kings are documented playing recreationally, for political display, and for divination, and
  surviving losses without being sacrificed. The popular "every loser was sacrificed" framing is a
  documented overstatement per current Mesoamericanist scholarship.
- **Scythian/Sarmatian "Amazon" burials**: genuinely strong archaeology, distinct from and
  predating the Greek literary Amazon myth — over 100–300 female weapon-burials recorded across the
  Pontic-Caspian steppe (Pokrovka kurgans, Jeannine Davis-Kimball), with combat-trauma evidence in
  some cases. Adrienne Mayor's *The Amazons* (Princeton UP, 2014) citation is confirmed accurate;
  reception found in this pass was positive, though a specialist BMCR review text could not be
  directly fetched to check for critique — treat as a soft negative finding, not confirmation no
  critique exists.
- **Hawaiian surfing (he'e nalu)**: genuine class stratification — commoners excluded from certain
  chiefly breaks, board type (olo vs. alaia) directly encoding status. Not gender-restricted in the
  way spectating was in the Mediterranean — women surfed at the highest levels, documented in both
  Finney's foundational 1959 work and Walker's more recent Hawaiian-language-sourced corrective
  (2011).
- **Sparta's agoge and girls' physical training**: confirmed in both Xenophon (near-contemporary)
  and Plutarch (writing 500+ years later); genuinely unusual relative to the rest of Greece. The
  required methodological caution is well-founded and is itself an active, named position in
  current Spartan studies (Cartledge, Hodkinson) — the "empowered Spartan woman" trope has been
  comparatively under-scrutinized even as other Spartan exceptionalism myths have been aggressively
  revised; treat any Spartan-women claim with the same source-critical caution as other
  Spartan-mirage material.

---

## F. Major Scholarly Debates

### F.1 Patriarchy-origin theories — genuinely competing, none settled

| Theory | Core claim | Named critique |
|---|---|---|
| Plough agriculture (Boserup 1970; Alesina, Giuliano & Nunn, *QJE* 128(2), 2013) | Plough cultivation favors male strength, shifting labor division and encoding it culturally | Reverse-causality and draft-animal-husbandry confounds acknowledged in the literature itself; Vu (2026 replication) reinforces the core finding but shows cultural persistence is conditional on climate stability, not universal |
| Goody's diverging devolution (1976, 1990) | Eurasian plough/property intensity → dowry ("vertical," both-sex inheritance); African shifting cultivation → bridewealth ("horizontal") | Tambiah (Goody's own co-author) found dowry-at-elite/bridewealth-at-base coexisting within single South Asian societies, undercutting the clean regional binary; Heady & Yalçın-Heckmann (2019) argue kinship may drive property/state formation as much as the reverse |
| Engels (1884) | Private property + paternity certainty → female subordination | Widely regarded as outdated relative to current ethnographic/archaeological standards; Leacock (1981) and Sacks (1979) explicitly retain his property-based logic while discarding his unilinear evolutionary staging |
| Lerner, *The Creation of Patriarchy* (1986) | Patriarchy institutionalized c. 3100–600 BCE via early state formation and appropriation of reproductive capacity | Bahrani (2001) argues Lerner's textual-legal evidence base is incomplete without the visual/material record; the adjacent Eller (2000) vs. Marler/Dashú (2005–2006) dispute over Gimbutas's "Old Europe" matriarchy thesis indirectly stress-tests what, if anything, preceded Lerner's starting point |
| Sanday, *Female Power and Male Dominance* (1981) | Male dominance is a situational response to ecological stress/scarcity, not inherent | No specific methodological critique was located and independently verified in this pass — flag as a real gap, not as an uncontested finding |
| Divale & Harris, "Population, Warfare, and the Male Supremacist Complex" (1976) | Chronic warfare → female infanticide → male-skewed sex ratios → patrilocality/polygyny | Fjellman (1979) and a further statistical-methodology critique challenge the sampling/statistical procedures directly — an internal-validity critique, not just interpretive disagreement |

Note: a distinct "demographic pressure" theory (independent of Divale-Harris) was sought per the
research brief but could not be confirmed as existing separately in the literature searched — treat
Divale-Harris as covering this ground rather than asserting a separate named theory exists.

### F.2 Greek pederasty — Dover/Halperin's "penetration and power" model vs. Davidson's challenge

Kenneth Dover (1978) and David Halperin (1990) established active/passive role and power hierarchy
as the organizing frame for Greek male sexual ethics; James Davidson (*The Greeks and Greek Love*,
2007) mounted a substantial later challenge, arguing the Dover/Foucault/Halperin tradition
over-reads court cases and vase evidence and detects an implicit reductive bias in it. Reception is
genuinely split (BMCR treats Davidson as serious if polemical; other reviewers read it as
reactionary). Dover's own art-historical methodology (reading vase imagery as direct behavioral
evidence) has separately drawn methodological criticism in a 2023 centenary volume. Treat this as a
live disagreement about method, not a settled question with Dover/Halperin simply correct.

### F.3 "Sacred prostitution" — a substantially discredited myth, not settled fact

Stephanie Budin, *The Myth of Sacred Prostitution in Antiquity* (2008), argues the institution never
existed anywhere it is claimed for, tracing the belief to a rhetorical misreading of Herodotus's
Babylon account. Reception is described in the located sources as substantially mainstreaming
(joined by independent work from Arnaud and Pirenne-Delforge), though full acceptance is not
universal — some scholars accept Budin on Corinth specifically while remaining open to some form of
ritualized sexuality in parts of the ancient Near East. No full frontal rebuttal of Budin's book was
located in this pass; if the corpus needs a genuine dissenting voice, Julia Assante's earlier,
independent work on *qadishtu* is the most likely candidate and needs a direct follow-up search.

### F.4 Enheduanna, Puabi, and Kubaba — see §E.2. All three popular claims are weaker than commonly
stated, in ascending order of overstatement (Enheduanna's existence is solid, her personal
authorship is not; Puabi's elite status is solid, her independent rule is not; Kubaba's existence
in the record is solid, her historicity as a real ruler is genuinely doubtful).

### F.5 Terminology controversies as live disputes, not settled precedent — see §G.

---

## G. Terminology Risks

**Foundational claim** (DOCUMENTED): Michel Foucault, *The History of Sexuality, Vol. 1* (1976/78)
— the shift from act-based category ("the sodomite," a temporary aberration anyone might commit) to
identity-based category ("the homosexual," a species of person) is dated to the 19th century
(Foucault cites Westphal 1870 as the pivot). This is the theoretical foundation for treating any
modern sexual-orientation or gender-identity label applied to a pre-modern individual as, by
default, an INTERPRETATION at best — often CONTESTED — unless the historical community itself used
an equivalent category.

**Applied to antiquity**: David Halperin (1990) extends Foucault directly to Greek evidence,
arguing "homosexuality"/"gay" as applied to ancient Greeks is anachronistic — Greek sexual ethics
were organized around political/social relations (active/passive, citizen/non-citizen), not
individual psychological identity.

**Two concrete, verified cases of a specific terminology choice being publicly/academically
contested by name:**

1. **"Berdache" → "Two-Spirit"** (§E.3) — the older anthropological term (etymologically tied to
   "boy prostitute") was rejected by Indigenous communities as colonial and sexuality-reductive; a
   1993 follow-up conference produced an explicit assertion of Indigenous interpretive authority
   over the replacement term itself — and current scholarship now also questions whether
   "Two-Spirit" over-generalizes across genuinely distinct traditions.
2. **Elagabalus "transgender" labeling, 2020s live dispute** — North Hertfordshire Museum publicly
   labeled the Roman emperor Elagabalus (r. 218–222 CE) transgender based on a Cassius Dio line
   ("Call me not Lord, for I am a Lady"). Named historians (Shushma Malik, Cambridge, via *The
   Conversation* 2023) push back directly: the sources are uniformly hostile and use "acting as a
   woman" as a stock insult (the ancient *cinaedus* category — tied to accusations of moral
   degeneracy, not a gender-identity category) — the claim cannot be taken at face value as
   autobiographical testimony. This is a strong, current, directly-on-point case.

**The Boswell controversy** (John Boswell, *Christianity, Social Tolerance, and Homosexuality*,
1980) is a documented case where a scholar's terminology choice — treating "gay people" as a
continuous transhistorical category across a millennium — became the central point of dispute
independent of his archival findings, drawing criticism from multiple directions simultaneously.

**Oyèwùmí's colonial-ethnography critique**: Oyèrónkẹ́ Oyěwùmí, *The Invention of Women* (1997),
argues binary biologically-grounded gender-as-hierarchy is itself a colonial-era imposition on
Yorùbá society (originally organized by seniority/age, not sex difference) — with the direct
implication that colonial-era ethnographic descriptions of "traditional" gender systems may reflect
colonial categorical imposition as much as indigenous reality. The thesis is influential but
contested on methodological/generalizability grounds — treat as DISPUTED, not settled.

**The recommended default**: describe evidence directly ("a male individual is documented having
sexual relations with men") rather than applying a modern identity label, unless the historical
community itself used an equivalent category — while noting a genuine, live minority position
("strategic anachronism," explicitly flagged and distinguished from naive backward-projection)
exists as an alternative in current queer historiography.

---

## H. Data Gaps

1. No open, structured, pre-modern LGBTQ/gender-diversity archive exists (§B).
2. No comparative historical family-law database exists beyond D-PLACE's coded summaries (§B).
3. No systematic sport/recreation-participation-by-sex/class dataset exists for any pre-modern
   period (§B, §E.5).
4. Precise gladiator status proportions (enslaved/condemned vs. *auctorati*) are not established at
   the level of a citable figure (§E.5).
5. Mesoamerican ballgame access by class (broad community vs. elite-restricted) was not resolved by
   available search results (§E.5).
6. A demographic-pressure theory of gender-role rigidity, independent of the Divale-Harris warfare
   thesis, could not be confirmed as existing in the literature searched (§F.1).
7. Direct primary-source confirmation for several items was blocked by this session's network
   egress restrictions (Wikipedia, Cambridge Core/*Antiquity*, PMC, several university press pages)
   — these are flagged inline throughout §E as ⟨UNVERIFIED⟩ or "verified via secondary summary, not
   primary read," and need a follow-up pass with working fetch access before any load-bearing quote
   is taken from them.
8. Named critique of Peggy Sanday's *Female Power and Male Dominance* was not located (§F.1).
9. A single canonical monograph specifically centering female slavery/concubinage in elite
   household formation (as opposed to touching it within broader Mesopotamian gender studies) was
   not confirmed (§E.2 adjacent, family/kinship agent report).
10. Neo-Babylonian women's-legal-capacity citation (Wunsch) needs a direct re-read before
    page-level quotation (§E.2).

---

## I. Recommended MVP

**Tier 1 — ingest as claims now, high confidence:**
- The prescriptive/descriptive distinction and its three verified case studies (§D.1).
- The Birka Bj 581 case as the canonical `does_not_demonstrate[]` worked example (§E.1) — this is
  exactly the kind of individual-case-study the `GenderSystem` entity's P14 treatment requires.
- Enheduanna's existence/office (HIGH) separated cleanly from her personal authorship (DISPUTED) —
  a direct, ready-to-write audit-style correction (§E.2).
- Puabi's elite status (HIGH) separated from her independent rule (LOW/DISPUTED) (§E.2).
- Kubaba's SKL-only sourcing and the field's own documented skepticism (§E.2) — resolves backlog
  item 22 outright.
- Naditu women's Sippar economic autonomy, explicitly scoped to their specific temple-legal status,
  not generalized to Old Babylonian women broadly (§E.2).
- The adultery-law asymmetry pattern across Hammurabi/MAL/Rome (§D.3).
- Kyniska/owner-vs-driver and the Ptolemaic-queen pattern (§E.5).

**Tier 2 — deep-time proxies requiring mandatory confidence downgrades:**
- Any gender-diversity-tradition claim tied to a single ethnographic source recorded decades or
  centuries after the practice it describes (Mohave alyha/hwame via Devereux 1937 is the clearest
  case) — carry the recording-date-vs-estimated-age-of-tradition distinction explicitly.
- Scythian/Sarmatian weapon-burial-to-Amazon-myth connections — archaeology is HIGH confidence, the
  connection to Greek literary reception is INTERPRETATION.
- Any claim sourced only to Pausanias (Heraean Games; the married-women-death-penalty rule) —
  single-source, centuries-later testimony.

**Tier 3 — do not ingest as data, use as qualitative claims with heavy hedging:**
- The full patriarchy-origin causal debate (§F.1) — genuinely unsettled; store as competing
  `Hypothesis` objects per `SPEC.md` §7.6, never as a resolved Claim.
- The "sacred prostitution" debate (§F.3) — Budin's revisionism is well-supported but not
  unanimous; do not present as fully closed.
- Every item flagged ⟨UNVERIFIED⟩ throughout §E — hold for a follow-up research pass with working
  fetch access before any of it is written into a Claim.

---

## J. Sources

Full citations are given inline throughout §C–§H at first use (author, title, publisher/journal,
year); this section is a consolidated index of the most load-bearing works, not a duplicate
bibliography.

**Methodology/terminology**: Foucault, *The History of Sexuality Vol. 1* (1976/78); Halperin, *One
Hundred Years of Homosexuality* (1990); Boswell, *Christianity, Social Tolerance, and Homosexuality*
(1980); Wood, Milner, Harpending, Weiss, "The Osteological Paradox," *Current Anthropology* 33(4)
(1992); DeWitte & Stojanowski (2015).

**Gender-diversity traditions**: Reddy, *With Respect to Sex*; Nanda, *Neither Man Nor Woman*
(1990); Hinchy, *Governing Gender and Sexuality in Colonial India* (2019); Thomas, in *Two-Spirit
People* (1997); Devereux, *Human Biology* 9 (1937); Williams, *The Spirit and the Flesh* (1986);
Lang, *Men as Women, Women as Men* (1998); Besnier & Alexeyeff (eds.), *Gender on the Edge* (2014);
Peled, *Masculinities and Third Gender* (2016); Amadiume, *Male Daughters, Female Husbands* (1987);
Krige & Krige, *The Realm of a Rain-Queen* (1943); Davies, *Challenging Gender Norms* (2007); HRW,
*This Alien Legacy* (2008); Arondekar, "Without a Trace," *JHS* 14 (2005).

**Sexuality organization**: Dover, *Greek Homosexuality* (1978/1989); Davidson, *The Greeks and
Greek Love* (2007); Williams, *Roman Homosexuality* (1999/2010); Budin, *The Myth of Sacred
Prostitution in Antiquity* (2008); Cohen, *Athenian Prostitution* (2015); McGinn, *Prostitution,
Sexuality, and the Law in Ancient Rome* (1998); Brown, *The Body and Society* (1988); Gleason,
*Making Men* (1995); Richlin, *The Garden of Priapus* (1983).

**Mesopotamia**: Hallo & van Dijk (1968); Zgoll, *IRAQ* (2024); Helle, *Enheduana* (Yale UP, 2023);
Delnero (Johns Hopkins, via *The New Yorker* 2022); Woolley excavation reports (via Morgan Library,
Penn Museum); Harris, "The Naditu Laws" (1961), *Ancient Sippar* (1975); Stol, *Women in the Ancient
Near East* (2016); Van De Mieroop, *A History of the Ancient Near East*.

**Patriarchy-origin theories**: Boserup (1970); Alesina, Giuliano & Nunn, *QJE* 128(2) (2013); Vu,
*JAE* (2026); Goody (1976, 1990); Tambiah & Goody (1973); Engels (1884); Leacock (1981); Sacks
(1979); Lerner, *The Creation of Patriarchy* (1986); Bahrani, *Women of Babylon* (2001); Eller
(2000); Marler (2006); Dashú (2005); Sanday (1981); Divale & Harris, *American Anthropologist* 78(3)
(1976); Fjellman (1979).

**Sport/recreation**: Pausanias 5.6.7–8, 5.16, 6.1.6; Xenophon, *Agesilaus* / *Constitution of the
Spartans*; Plutarch, *Life of Lycurgus*; Cassius Dio, *Roman History*; Mayor, *The Amazons* (2014);
Finney, *Journal of the Polynesian Society* 68(4) (1959); Walker, *Waves of Resistance* (2011);
Ollier, *Le Mirage Spartiate* (1933–43); Hodkinson, "Female Property Ownership and Status in
Classical and Hellenistic Sparta"; Pomeroy, *Spartan Women* (2002).

**Datasets**: see §B table for individual maintainer/access/citation details.
