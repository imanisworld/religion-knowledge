# Religions & Traditions: broader source pass, batch 3

**Date:** October 20, 2026  
**Coverage:** 10 additional traditions, 11 new atomic Claims. Cumulative new-source audit coverage: **16 of 27 traditions, 18 draft claims**. Remaining **11 traditions** still require a new source pass.  
**Public impact:** None. Claims stay `draft`; no canonical origin dates or verification statuses change.

## Checked source passages (limited to content shared publicly by institutions)

| Tradition | Direct evidence and specific locator | What can be said | What cannot be concluded |
| --- | --- | --- | --- |
| Ifá/Òrìṣà | [UNESCO film metadata and description](https://www.unesco.org/archives/multimedia/document-3742), publisher Ifa Group of Oyo (2004); [UNESCO Osun-Osogbo listing](https://whc.unesco.org/en/list/1118/), description and living-site sections | Public, contemporary descriptions of Ifá divination; active Osun shrine and changing twentieth-century sculptural interventions | Neither UNESCO recognition year nor a modern public practice dates origins of Ifá or all Yoruba religion |
| Aṉangu Tjukurpa | [Parks Australia, Tjukurpa](https://uluru.gov.au/discover/culture/tjukurpa/), law/spirituality and knowledge transmission sections | Aṉangu publicly describe Tjukurpa as ongoing land responsibility, law and cosmology; explicit boundaries protect restricted knowledge | An archaeological occupation date cannot date sacred stories, and public materials never license restricted disclosure |
| Tiwi Pukumani | [Australian Museum, Burial—Pukumani](https://australian.museum/about/history/exhibitions/death-the-last-taboo/burial-pukumani-tiwi-islands/), Pedro Wonaeamirri testimony and funerary description (updated 2018) | Tutini posts, songs and dances are discussed publicly; contemporary ceremonies sometimes include Christian elements | No origin year, no unchanged pre-contact ceremony, and no claim to reproduce the whole ceremonial system |
| Mexica | [INAH Templo Mayor Museum](https://lugares.inah.gob.mx/en/node/5284), museum's description of twin shrines and Stage II burial urns (c.1390 CE) | INAH directly associates a dated building phase and funerary materials with the Mexica sacred complex | Stage II does not date the origin of the Mexica belief system |
| Lakota | [Smithsonian NMAI, Oceti Sakowin Homelands](https://americanindian.si.edu/nk360/plains-belonging-homelands/oceti-sakowin), publicly shared White Buffalo Calf Woman account attributed to John Lame Deer (1967) | A named twentieth-century telling of a sacred pipe narrative | The storyteller's recording date is not the event's date; do not reproduce restricted rituals |
| Haudenosaunee | [Smithsonian NMAI, Practice of Peace](https://americanindian.si.edu/nk360/american-revolution-perseverance/students/chapter-5/), Great Law and clan-mother explanations | Great Law, clan-mother responsibilities and ceremonial/social governance publicly described | This does not settle the contested date of Confederacy foundation |
| Inca state religion | [British Museum, cocha vessel Am1991,Q.4](https://www.britishmuseum.org/collection/object/E_Am1991-Q-4), indexed curatorial passage suggesting relation to Coricancha | Probable interpretation of a specific late-fifteenth-century carved vessel | Search result only (direct museum page 403); Coricancha attribution and function are not proven |
| Hopi | [Heard Museum, Katsina Dolls](https://heard.org/collection/katsina-dolls/), indexed overview of early objects | Museum attributes some dolls to late 1800s; public gift-making account | Search result only (direct page failed); dolls do not date the origin of katsina ceremonial practice |
| Fon Vodun (royal landscape context) | [UNESCO Abomey royal palaces](https://whc.unesco.org/en/list/323), authenticity and protection sections | Specific Aja-Fon royal ritual sites, tombs and respected sacred spaces in a kingdom whose palaces span 1625–1900 | Palace dates are not founding dates for all Fon Vodun |
| Shona / Mwari | [UNESCO Matobo Hills](https://whc.unesco.org/en/list/306/), brief synthesis and criterion (vi) | Contemporary sacred landscape and Mwari oracular shrine tradition; UNESCO says it *may* extend to the Iron Age | The modal 'may' cannot be promoted to historical certainty; far older rock art is not evidence for present Mwari rites |

## Access and ethical controls

- **Direct page reading:** UNESCO media archive (Ifá), UNESCO Osun/Abomey/Matobo, Parks Australia, Australian Museum, Mexico's INAH, Smithsonian NMAI.
- **Indexed catalog text, direct page blocked:** British Museum Am1991,Q.4 (403); Heard Museum Katsina Dolls (retrieval error). These are recorded as `SEARCH_SNIPPET`, never `DIRECT_READ`.
- **Community authority:** Indigenous sites publicly distinguish general knowledge from restricted/initiated practice. No new content expands those boundaries; additional context requires source-community authorization.
- **Date semantics:** Only INAH's explicitly dated **Templo Mayor Stage II c.1390 CE** receives `date_semantics=EVENT_DATE`. The dates of modern educational recordings, modern sculptures, museum accession histories, or stated legendary events cannot become origins of religions.
- **Contestation:** A direct museum text establishes how that museum interprets evidence. It is not automatic independent corroboration for all claims about history, local religion, or living communities.
- **Source-review gate:** All 18 new research claims (including batches 1–2) remain **draft**. No evidence category, confidence, or source identification licenses automatic promotion.

## Remaining 11 traditions needing fresh source review

`trad_arrernte_altyerre`, `trad_dine_bahane`, `trad_early_israelite_yahwism`, `trad_guarani_religion`, `trad_juhoansi_trance_healing`, `trad_kongo_traditional_religion`, `trad_tasmanian_aboriginal_religion`, `trad_warlpiri_jukurrpa`, `trad_xam_cosmology`, `trad_yolngu_wangarr`, `trad_akan_traditional_religion`.

Those entries may already contain earlier notes or claims; “remaining” means **no new narrowly verified source addition within this three-batch PR**, not absence of all existing documentation. Prioritize community-issued public materials and textual witnesses; avoid rebuilding restricted narratives from colonial collectors.

## Check and review gates

1. Run `node docs/timeline/scripts/validate-timeline.mjs` and `node --test docs/timeline/tests/traditions-new-evidence-gate.test.mjs`.
2. Confirm every claim has a source URL, a correct `DIRECT_READ` or `SEARCH_SNIPPET` access method and a `does_not_demonstrate` limitation.
3. Independently check each quoted site against source passage, documentary metadata and cultural disclosure constraints before considering any status upgrade.
4. Retain unresolved differences and institutional interpretations as uncertainty rather than turning them into invented origin dates.
