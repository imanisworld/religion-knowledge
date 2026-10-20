# Religions & Traditions — research and publication status
Last updated: 20 October 2026

## Scope
The public Traditions index contains **27 canonical records** in `docs/timeline/data/entities/traditions/`. The new one-at-a-time historical reader is generated from those records in `scripts/build-traditions-profiles.mjs` to `traditions.html`. The existing `catalog.html#traditions` remains an index and links to each profile.

**Three records have added, institutionally identifiable source links and very narrowly source-supported descriptive statements. Twenty-four do not yet have a checked public source-specific profile summary.** This count concerns the newly added public source-link layer and does not establish that prior timeline assertions have been independently confirmed. Do not elevate registry source statuses from this UI work.

## Reviewed bibliography and narrow source descriptions
- **Akan religion** (`trad_akan_traditional_religion`): A. van Dantzig's comparison housed by the University of Ghana identifies Bosman's Dutch 1703 and English 1705 editions. **The precise passage about the Nyame/abosom/asamanfo system has not been checked**. Therefore the record's earliest-written-attestation range is `null`; a book publication date cannot be used as the religion's beginning or a verified first mention. The Ghana Journal of Religion and Theology's 2022 abstract supports a narrow description of Rattray's treatment of sunsum. Sources: https://ugspace.ug.edu.gh/items/6407fa6a-8d73-42fe-b9bc-3940cfcf35b3 and https://www.ajol.info/index.php/gjrt/article/view/230066.
- **K'iche' Maya / Popol Vuh** (`trad_kiche_maya_religion`): The Newberry Library's guide dates Ximénez's surviving transcription broadly to **c. 1700–1715**, rather than this project's previous narrower 1701–1703 claim. This is a **copy date**, neither an oral-origin date nor a verification of all iconographic interpretations. Institutional sources: https://www.newberry.org/collection/research-guide/popol-vuh and https://www.loc.gov/item/2021668226.
- **Ugaritic / Late Bronze Canaanite textual horizon** (`trad_late_bronze_canaanite_religion`): The French Ministry of Culture's Ugarit site history, Chicago Ras Shamra Tablet Inventory, and Göttingen's textual corpus identify the site, manuscripts, and Baal Cycle tablet sequence (KTU 1.1–1.6). This does **not** show that every Canaanite group shared identical practices or that later texts borrowed directly. Sources: https://archeologie.culture.gouv.fr/en/ugarit-ras-shamra ; https://ochre.lib.uchicago.edu/RSTI/ ; https://eupt.uni-goettingen.de/Korpus.html.

## Evidence rules for the other 24
1. Distinguish dated attestation, archaeological context, manuscript survival, estimated composition, estimated oral history, and internal traditional accounts.
2. No fixed founding date unless the specific tradition and form have dated support. **Regional human occupation does not date present named rituals or beliefs.**
3. Record named original passages, inscriptions, museum objects, informants, or source page locations before marking detailed belief/practice statements checked. Modern interpretations and colonial mediation need attribution and counter-review.
4. Do not infer extinction or uninterrupted continuity from breaks in written records. Contemporary practice requires its own source check.
5. Record relationships as links to research dossiers; possible common features are not established borrowing or cultural fusion.
6. Preserve unknowns and explicit evidence limits rather than manufacturing dates for sorting, maps, or public displays.

## Next source-audit queue
- Check the precise Bosman primary passage and later Rattray/Danquah interpretations against printed pages and Akan scholarship; retain the missing-date status until passage-level proof is obtained.
- Check manuscript dating, catalog records and selected `Popol Vuh` textual passages against the actual preserved copy; separate nineteenth/twentieth-century editorial reconstructions from manuscript features.
- Verify specific Ugaritic tablet passages (e.g. KTU 1.1–1.6) and claims about links to early Israelite religion independently, including alternative scholarly interpretations.
- For the remaining 24, audit the earliest available source for each tradition's distinctive cosmology and practice, then build community/location, historical-change, and living-continuity summaries with verifiable sourcing.

## Publication verification
The site deployment pipeline now includes `tests/traditions-profiles.test.mjs`, generated-page link validation, and `scripts/test-traditions-browser.sh` at 1280×800 and 390×844. Checks passing mean **UI behavior and code validity**, not full source-verification of 27 traditions.

Tracking: [issue #220](https://github.com/imanisworld/religion-knowledge/issues/220) (profiles), [issue #196](https://github.com/imanisworld/religion-knowledge/issues/196) (original comparison grids). Publication branch: `feat/traditions-evidence-profiles-20261020`.
