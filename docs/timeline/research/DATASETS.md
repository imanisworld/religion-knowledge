# Timeline App — Dataset Inventory (Deliverable B / H)

**Status:** Research documentation. Every entry below was verified by live web search against primary dataset documentation, journal publications, or institutional pages — not generated from model memory. Where a limitation or critique is named, it is attributed to a specific named scholar/publication where one was found; where verification failed or was incomplete, that is stated explicitly rather than smoothed over. **This document asserts no historical facts of its own** — it inventories other people's research infrastructure so `docs/timeline/SPEC.md`'s research pipeline (§8) has real sources to verify claims against, instead of starting from nothing.

**Companion document:** `docs/timeline/research/LANDSCAPE.md` covers the analytical synthesis (existing-research landscape, measurement map, systems/institutions map, literature map, data gaps, recommended MVP) that this inventory feeds.

**A note on duplication across research domains:** several datasets (V-Dem, WID, the Ethnographic Atlas/D-PLACE) turned up independently across multiple research passes because they're used for more than one purpose. Each appears once below, in the section matching its primary use, with cross-references noted where relevant to a second domain.

---

## 1. Cross-cutting comparative-historical databases

### Seshat: Global History Databank
| Field | Detail |
|---|---|
| Organization/authors | Evolution Institute; PI Peter Turchin, with Daniel Hoyer, Pieter François, Kevin Feeney, Harvey Whitehouse |
| Research domain | Comparative historical sociology / "cliodynamics" — social complexity, state formation, warfare, religion |
| Variables | ~200 variables aggregated into 9 "Complexity Characteristics": polity population, territory, capital population, hierarchy levels, government/military/legal/infrastructure sophistication, plus ritual/religion codes |
| Geographic coverage | ~30–46 "Natural Geographic Areas," a stratified world sample, not full global coverage |
| Temporal coverage | Neolithic (~10,000 BCE) through 1900 CE, ~100-year time steps (Equinox2020 release) |
| Unit of analysis | Polity-century |
| Method | Expert-coded from secondary historical/archaeological literature, each datapoint carrying a source citation and confidence flag |
| Primary vs. secondary | Secondary — a synthesis layer over existing historiography/archaeology, not original fieldwork |
| Access | Web interface (seshat-db.com); bulk data on Zenodo (DOI 10.5281/zenodo.6642229, "Equinox2020": 47,400 records, 374 polities) |
| License | CC BY-NC-SA |
| Current status | Active |
| Strengths | Only databank attempting deep-time (10,000 BCE+), cross-continental, quantitatively codable social-complexity data; every datapoint cited |
| Limitations | Critics flag "data pasting" (extending known values across time gaps) and "data filling" (interpolation) as underdisclosed; NGA sample not randomly drawn |
| Citation | Turchin, P. et al. 2015. "Seshat: The Global History Databank." *Cliodynamics* 6(1):77–107; Turchin, P. et al. 2020. "The Equinox2020 Seshat Data Release." *Cliodynamics* 11(1):41–50 |
| URL | https://seshat-db.com/ |

### Maddison Project Database (2023 update)
| Field | Detail |
|---|---|
| Organization/authors | Groningen Growth and Development Centre (GGDC); Jutta Bolt and Jan Luiten van Zanden, continuing Angus Maddison's project |
| Research domain | Long-run comparative economic history |
| Variables | Real GDP (multiple benchmark-year variants), population, GDP per capita |
| Geographic coverage | 169 countries and aggregate regions |
| Temporal coverage | 1 CE–2022 for headline series; continuous annual series generally only from 1820–1950 onward; a 13-country subset reaches centuries earlier |
| Unit of analysis | Country-year |
| Method | Benchmark PPP comparisons extrapolated backward/forward using proxy series (wages, prices, output indicators, tax records) |
| Primary vs. secondary | Secondary/modeled |
| Access | Free download (Excel/Stata), GGDC site and Dataverse (DOI 10.34894/INZBF2) |
| License | Free for research/educational use with attribution |
| Current status | Active |
| Strengths | Only source offering continuous, methodologically unified GDP-per-capita comparisons across two millennia and nearly all countries |
| Limitations | Pre-1820 (often pre-1870) figures are model extrapolations, not measurements. Gregory Clark's 2009 review called Maddison's pre-1820 figures "fictions... as real as the relics peddled around Europe in the Middle Ages" — a critique still cited against the earliest centuries of the series |
| Citation | Bolt, J. and van Zanden, J.L. 2024. "Maddison style estimates of the evolution of the world economy: A new 2023 update." *Journal of Economic Surveys* |
| URL | https://www.rug.nl/ggdc/historicaldevelopment/maddison/ |

### Clio-Infra
| Field | Detail |
|---|---|
| Organization/authors | International Institute of Social History (IISH), Amsterdam; coordinated by Jan Luiten van Zanden (companion volume: van Zanden et al., eds., *How Was Life? Global Well-Being since 1820*, OECD 2014) |
| Research domain | Long-run global economic and social history: wages, heights, education, inequality, life expectancy, literacy, numeracy |
| Variables | ~58 indicators including real wages, GDP per capita, income (Gini) inequality, stature, numeracy (age-heaping), life expectancy, education |
| Geographic coverage | ~200 countries, uneven density (best for Europe/former colonial administrations) |
| Temporal coverage | Nominally 1500–2010; project's own documentation states its primary focus is "the past 200 years," and that data get progressively more conjectural further back |
| Unit of analysis | Country-year |
| Method | Thematic scholarly "collaboratories" harmonize disparate primary sources (payroll/wage records, military recruitment archives, tax records) into panel indicators |
| Primary vs. secondary | Mixed — underlying records are primary, published panels are secondary harmonizations |
| Access | Free, IISH Dataverse and clio-infra.eu |
| License | No single stated blanket license — consult and cite the original source per indicator |
| Current status | Active but reduced update cadence (most series last substantially updated in the 2010s) |
| Strengths | Broadest simultaneous coverage of *social* (not just monetary) welfare indicators over the long run, cross-linked to source documentation |
| Limitations | Real-wage series criticized for non-representativeness (excludes informal/female/rural labor) and lack of standardized methodology across contributing scholars |
| Citation | van Zanden, J.L. et al., eds. 2014. *How Was Life? Global Well-Being since 1820*. OECD Publishing |
| URL | https://clio-infra.eu/ |

### V-Dem (Varieties of Democracy)
| Field | Detail |
|---|---|
| Organization/authors | V-Dem Institute, University of Gothenburg; PI Staffan I. Lindberg |
| Research domain | Comparative democracy and political-regime measurement |
| Variables | 600+ attributes/531 indicators aggregated into 251 indices across electoral, liberal, participatory, deliberative, egalitarian, and majoritarian/consensual conceptions of democracy; includes a Freedom of Expression sub-index used as a censorship proxy (see §5 below and Gap F.4 in LANDSCAPE.md) |
| Geographic coverage | 202 countries |
| Temporal coverage | 1789–present for some indices |
| Unit of analysis | Country-year (some indicators event-level) |
| Method | 4,200+ country experts rate ordinal indicators via structured questionnaires; aggregated with a Bayesian item-response measurement model producing point estimates *with uncertainty intervals* |
| Primary vs. secondary | Primary in the sense of original expert elicitation, though the judgments elicited are themselves interpretations of historical record |
| Access | Free bulk download (CSV/Stata/R), R package `vdemdata`, API |
| License | CC BY-SA 4.0 |
| Current status | Active, annual release each March |
| Strengths | Most granular, multidimensional democracy dataset available; explicit per-datapoint uncertainty (rare among comparative indices) |
| Limitations | V-Dem's own methodology papers acknowledge differential item functioning — experts from different backgrounds apply the same scale differently, even after model correction |
| Citation | Coppedge, M. et al. "V-Dem Dataset v14." Varieties of Democracy Project |
| URL | https://www.v-dem.net/data/the-v-dem-dataset/ |

### World Inequality Database (WID.world)
| Field | Detail |
|---|---|
| Organization/authors | World Inequality Lab (Paris School of Economics); Thomas Piketty, Emmanuel Saez, Gabriel Zucman, 100+ contributors |
| Research domain | Income and wealth distribution |
| Variables | Pre-tax/post-tax national income distribution, wealth distribution, top income/wealth shares, capital vs. labor income shares |
| Geographic coverage | 216 countries/territories |
| Temporal coverage | Tax-based income series from ~1870–1880 for Germany/Denmark/Sweden; wealth series from ~1750–1800 for France/Sweden/Britain via inheritance/estate records; a global wealth-accumulation series 1800–2025 released in 2025; pre-continuous-coverage global/regional estimates exist only at four benchmark years — **1820, 1850, 1880, 1910** |
| Unit of analysis | Country-year, decile/percentile-year |
| Method | Distributional National Accounts (DINA): combines national accounts, household surveys, and fiscal/tax data via generalized Pareto interpolation; historical wealth specifically uses the income-capitalization method and estate-multiplier techniques on inheritance-tax/probate records |
| Primary vs. secondary | Mixed — tax records are primary administrative data, published distributional series are a secondary modeled reconstruction |
| Access | Free bulk download and interactive query tool |
| License | Stated "open source"; no separately verified machine-readable license tag |
| Current status | Active, annual updates (major 2025 update) |
| Strengths | Only source systematically reconciling tax, survey, and national-accounts data into comparable distributional series across a very large country set |
| Limitations | **This is a live, actively contested empirical dispute, not a settled dataset.** Gerald Auten & David Splinter, "Income Inequality in the United States," *Journal of Political Economy* (2023), reconstruct the underlying US tax-data series correcting for underreporting, missing transfers, and tax-code changes, and find the top-1% pre-tax share rose only from 9% to 14% since 1960 (not 9% to 20% as in the Piketty-Saez series), with virtually no rise after accounting for taxes and transfers — a direct empirical rebuttal of the standard "capitalism mechanically raises inequality" reading of WID's own data. WID has published rebuttals; the dispute is unresolved as of this research pass. Separately, Matthew Rognlie ("Deciphering the Fall and Rise in the Net Capital Share," Brookings Papers, 2015) shows that once depreciation is properly netted out, WID/Piketty's r>g mechanism does not hold as claimed. Pre-1900s tax-based series also capture only the filing population by construction. |
| Citation | Alvaredo, F., Chancel, L., Piketty, T., Saez, E., Zucman, G., eds. *World Inequality Report 2022* |
| URL | https://wid.world/ |

### Our World in Data (OWID) — aggregator, not a primary source
| Field | Detail |
|---|---|
| Organization/authors | University of Oxford (Global Change Data Lab); founded by Max Roser |
| Research domain | Cross-cutting aggregation — health, economics, environment, conflict, demography, education |
| Method | **Not a data producer.** Cleans, harmonizes, and re-derives data drawn from third-party sources — republishes Maddison, V-Dem, UCDP/PRIO, WID, World Bank, UN, WHO series among many others |
| Access | Free interactive charts and full CSV/API download |
| License | CC BY 4.0 for OWID's own presentation; underlying data retains its original license, flagged per chart |
| Strengths | Excellent single point of discovery and rapid orientation before going to primary sources |
| Limitations | Re-derivation can subtly diverge from the origin release if not re-checked; citing OWID as a terminal source obscures which underlying dataset (with its own limitations) actually generated the number. **The app should cite through to the origin dataset, not stop at OWID, per OWID's own citation guidance.** |
| URL | https://ourworldindata.org/ |

### UCDP (Uppsala Conflict Data Program)
| Field | Detail |
|---|---|
| Organization/authors | Department of Peace and Conflict Research, Uppsala University |
| Research domain | Armed conflict and organized violence |
| Variables | State-based armed conflict, non-state conflict, one-sided violence; battle-related deaths, actors, type/intensity, geolocated events |
| Geographic coverage | 190+ countries |
| Temporal coverage | State-based conflict from 1946; Georeferenced Event Dataset (GED) from 1989; most recent publication covers "Organized violence 1989–2025" |
| Unit of analysis | Individual violent event (GED), dyad-year, conflict-year, country-year |
| Method | Coded from news media, NGO/IGO reports, and other secondary sourcing against a strict 25-battle-related-deaths-per-year inclusion threshold, with named coders and source logs per event |
| Primary vs. secondary | Secondary — compiled from reporting, not original casualty investigation |
| Access | Free download |
| Current status | Active, ongoing annual updates |
| Strengths | Longest-running, most widely used georeferenced global conflict-event dataset; distinguishes state-based/non-state/one-sided violence without double counting |
| Limitations | Dependent on media/report visibility — a PRIO-affiliated reassessment found only ~53% event overlap against US military records in Afghanistan and only ~28.5% of deadly insurgent-initiated 2008 Afghanistan events reported in international news; a separate 2025 *Journal of Global Security Studies* critique ("Uncounted Dead") argues UCDP's classification rules systematically undercount state-perpetrated civilian killings by classifying them as "battle-related" rather than one-sided violence |
| Citation | Sundberg, R. and Melander, E. 2013. "Introducing the UCDP Georeferenced Event Dataset." *Journal of Peace Research* 50(4):523–532 |
| URL | https://ucdp.uu.se/ |

### PRIO Battle Deaths Dataset (and its relation to UCDP)
| Field | Detail |
|---|---|
| Organization/authors | Peace Research Institute Oslo |
| Coverage | 1946–2008, then **frozen** — 1989-forward battle-death coverage is now UCDP's, per above |
| Method | Compiled from press reports, NGO/IO estimates, cross-checked against conflict-specific sources; explicit, restrictive "contested combat" definition |
| Limitations | PRIO and UCDP both explicitly warn against concatenating the two series as one continuous run — their definitions diverge |
| Citation | Lacina, B. & Gleditsch, N.P. 2005. "Monitoring Trends in Global Combat." *European Journal of Population* 21(2–3):145–166 |
| URL | https://www.prio.org/data/1/ |

### Correlates of War (COW) Project
| Field | Detail |
|---|---|
| Organization/authors | Founded by J. David Singer (Michigan); war-data hosting transferred to Paul Poast (Chicago) as of July 2026 |
| Research domain | Interstate/intrastate war, national capabilities, alliances, trade, contiguity |
| Variables | War onset/termination/battle deaths; National Material Capabilities (military expenditure/personnel, energy consumption, iron/steel production, population/urban population — NMC v7, June 2026); Militarized Interstate Disputes; alliances; territorial change |
| Geographic coverage | All recognized state-system members globally |
| Temporal coverage | 1816–2007 (core War Data); NMC extended annually since 1816 |
| Unit of analysis | War-level, dyad-year, state-year |
| Method | A "war" requires ≥1,000 annual battle fatalities and a recognized system member, per COW's own state-system criteria (historically anchored to 19th–early-20th-century European recognition) |
| Primary vs. secondary | Secondary — compiled from historical/diplomatic records, not original casualty documentation |
| Access | Free download |
| Strengths | Longest-established, most widely replicated interstate-conflict dataset in political science; strict, published, replicable coding rules |
| Limitations | The 1,000-death threshold is far higher than UCDP's 25-death threshold, producing a systematically different "war universe" between the two projects — not directly comparable without reconciliation. Kristian Gleditsch and Michael Ward (1999, *International Interactions*) directly critiqued COW's state-system membership criteria as excluding many actual belligerents and published a revised state list now widely used alongside COW's own |
| Citation | Sarkees, M.R. and Wayman, F. 2010. *Resort to War: 1816–2007*. CQ Press |
| URL | https://correlatesofwar.org/ |

### Polity5 (successor to Polity IV)
| Field | Detail |
|---|---|
| Organization/authors | Center for Systemic Peace; Monty G. Marshall and Ted Robert Gurr |
| Variables | Composite POLITY score (-10 to +10) from executive recruitment competitiveness/openness, executive constraints, political competition/participation regulation |
| Coverage | 167+ states, population ≥500,000; 1800–2018 (**data frozen at 2018**) |
| Method | Small expert-coder team applies a structured codebook, aggregated via a fixed additive/subtractive formula |
| Limitations | Gerardo Munck and Jay Verkuilen (2002, *Comparative Political Studies*) — the canonical critique — argue the aggregation rule is an unjustified, ad hoc weighting scheme that double-counts related attributes and doesn't meet its own measurement criteria. No confirmed post-2018 successor exists; V-Dem's indices are increasingly used as the de facto continuation |
| Citation | Marshall, M.G. and Gurr, T.R. 2020. *Polity5*. Center for Systemic Peace |
| URL | https://www.systemicpeace.org/inscrdata.html |

### Boix–Miller–Rosato (BMR) Dichotomous Democracy Coding
| Field | Detail |
|---|---|
| Organization/authors | Carles Boix (Princeton), Michael K. Miller (GWU), Sebastian Rosato (Notre Dame) |
| Method | Binary democracy/non-democracy classification via explicit, rule-based contestation and participation criteria (not expert-survey aggregation) |
| Coverage | 219–222 countries, 1800–2020 (v4.0 extended) |
| Strengths | Simple, transparent, replicable — a robustness check preferred over Polity precisely for lower researcher discretion |
| Limitations | Dichotomous coding loses gradation (partial/hybrid regimes) that Polity/V-Dem capture |
| Citation | Boix, C., Miller, M.K., Rosato, S. "A Complete Data Set of Political Regimes, 1800–2007." *Comparative Political Studies* 46(12) (2013): 1523–1554 |
| URL | https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/FJLMKT |

### Freedom House — Freedom in the World
| Field | Detail |
|---|---|
| Organization | Freedom House; methodology originated by Raymond Gastil (1972) |
| Variables | 25 indicators, Political Rights (0–40) + Civil Liberties (0–60) → 0–100 composite; Free/Partly Free/Not Free |
| Coverage | ~195 countries + ~15 territories; 1972–present |
| Method | Expert/analyst scoring against a standardized questionnaire |
| Strengths | Longest continuously-run, single-methodology democracy/rights index (54 years) |
| Limitations | Documented ideological-lean concerns flagged by some scholars given its US-based-NGO origin; methodology revisions across eras complicate strict comparability; not historical beyond 1972 |
| URL | https://freedomhouse.org/report/freedom-world |

### Ethnographic Atlas / D-PLACE / Standard Cross-Cultural Sample
*(Full detail in §4 Gender below — this triad serves both institutional-comparison and gender-measurement use cases.)*

### Additional cross-cutting sources found, tabled briefly
| Name | Note |
|---|---|
| eHRAF (Human Relations Area Files) | Yale-maintained full-text, paragraph-indexed ethnographic/archaeological source library (361+ cultures, 107+ archaeological traditions). **Subscription-only, not open access** — a real constraint for an openly redistributable app. https://hraf.yale.edu/ |
| Comparative Constitutions Project (CCP) / Constitute | Elkins, Ginsburg, Melton (2005–). Codes primary constitutional text (not enforcement/practice) for every independent country, 1789–2022, 799+ constitutional systems. Free, CC BY-NC 3.0. Must be paired with an outcome measure (e.g. V-Dem), not used alone. https://comparativeconstitutionsproject.org/ |
| Cross-National Time-Series (CNTS) Data Archive | Banks/Wilson tradition, now Databanks International. 194 variables incl. a domestic-conflict-events series (assassinations, strikes, coups, riots), 1815–2023. **Commercial/proprietary, not open data.** https://www.cntsdata.com/ |
| Database of Religious History (DRH) | UBC, PI Edward Slingerland — the field's most serious structured historical-religion database (see §5 below). |
| HYDE (History Database of the Global Environment) | PBL Netherlands Environmental Assessment Agency / Utrecht; gridded population and land-use reconstruction, 10,000 BCE–2023 CE, 5-arcminute resolution. Free via DANS. Reliability scales inversely with time depth — pre-1000 CE figures reflect modeled plausibility, not measurement. https://www.pbl.nl/en/hyde-history-database-of-the-global-environment |
| Cliopatria | Geospatial database of political entities, 3400 BCE–2024 CE (1,600+ entities), published 2024/2025 — complements Seshat/COW with continuous geospatial polity boundaries. Relevant for mapping-heavy rendering. |

---

## 2. Health, demography, bioarchaeology

### Global History of Health Project (and predecessor Western Hemisphere Project)
| Field | Detail |
|---|---|
| Organization/authors | Richard H. Steckel (Ohio State), Jerome C. Rose (Arkansas); global phase with George Milner, Clark Larsen, Joerg Baten, Charlotte Roberts |
| Research domain | Skeletal health history — stature, pathology, mortality from human remains |
| Variables | Stature, dental pathology, enamel hypoplasia, cribra orbitalia/porotic hyperostosis, periosteal reaction, degenerative joint disease, trauma, age, sex — synthesized into a composite "Health Index" |
| Geographic coverage | Western Hemisphere phase: the Americas, 5000 BC–19th c. Global phase: Europe, Paleolithic–early 20th c. |
| Unit of analysis | Individual skeleton |
| Method | Standardized macroscopic paleopathological scoring across excavated/curated skeletons by trained collectors, per a published codebook |
| Primary vs. secondary | Primary (original skeletal data collection) |
| Access | Codebook and summary publications freely available; **live public download status of record-level data could not be confirmed in this research pass** — egress to the project's institutional page was blocked; treat as unconfirmed pending direct verification |
| Current status | Likely dormant — most citable flagship materials date to the early-to-mid 2000s; no confirmed post-2015 activity found |
| Strengths | Largest attempt at a cross-cultural, deep-time skeletal-health synthesis; standardized codebook enables cross-excavator comparison; produced the field-defining *Backbone of History* volume |
| Limitations | The composite "Health Index" has been criticized for conflating heterogeneous lesion types into one score; project continuity itself now uncertain |
| Citation | Steckel, R.H. & Rose, J.C., eds. 2002. *The Backbone of History: Health and Nutrition in the Western Hemisphere*. Cambridge University Press |

### Human Mortality Database (HMD)
| Field | Detail |
|---|---|
| Organization | UC Berkeley Dept. of Demography + Max Planck Institute for Demographic Research, Rostock, with INED (Paris) |
| Coverage | 40+ countries with high-quality vital statistics; mid-18th/19th c. (data-quality-dependent) to present |
| Method | Compilation and standardized recalculation of official vital-statistics death/population counts into life tables |
| Access | Free, registration required |
| Strengths | Gold-standard data-quality control, transparent Methods Protocol v6 |
| Limitations | Coverage skewed toward high-income/high-data-quality states — limited utility for non-Western or pre-modern populations |
| URL | https://www.mortality.org |

### Anthropometric history (Steckel/Komlos tradition)
| Field | Detail |
|---|---|
| Originators | Robert Fogel (NBER, originating the field), Richard Steckel, John Komlos |
| Method | Regression of mean stature on birth year/region from military conscription/enlistment records, prison registers, slave manifests, passport applications, correcting for known sample-selection |
| Coverage | Primarily Europe and the Americas, 18th–20th c. |
| Access | No unified open portal; the Union Army Data Set is free via NBER; most conscript-height series are in individual papers |
| Limitations | Well-documented selection bias — minimum-height enlistment cutoffs distort mean-height trends over time as who qualifies as a "conscript" or "student" itself changes |
| Citation | Steckel, R.H. 2009. "Biological Measures of the Standard of Living." *Journal of Economic Perspectives* 22(1):129–152 |
| URL | https://www.nber.org/research/data/union-army-data-set |

### Princeton European Fertility Project
| Field | Detail |
|---|---|
| Organization | Princeton Office of Population Research; Ansley Coale, Susan Cotts Watkins |
| Variables | Coale's indices If (overall fertility), Ig (marital fertility), Im (nuptiality), Ih (illegitimate fertility), by province |
| Coverage | ~700 European provinces, ~1870–1960 |
| Limitations | Applies only where vital registration existed — excludes most of the world and most of history |
| Citation | Coale, A.J. & Watkins, S.C., eds. 1986. *The Decline of Fertility in Europe*. Princeton University Press |
| URL | https://oprdata.princeton.edu/archive/pefp/ |

### Paleodemography — the field's methodological reference (not a live database)
Hoppa, R.D. & Vaupel, J.W., eds. 2002. *Paleodemography: Age Distributions from Skeletal Samples*. Cambridge Studies in Biological and Evolutionary Anthropology 31. Contains the "Rostock Manifesto," the field's methodological consensus statement on age-at-death estimation from skeletal remains. Age-estimation methods it consolidated have since been shown to systematically underestimate adult age in older individuals — a limitation the field continues to address post-2002 (DeWitte & Stojanowski 2015, "The Osteological Paradox 20 Years Later").

### Bioarchaeological proxies — what each can and cannot tell us

| Proxy | Can tell us | Cannot tell us | Key controversy | Best source |
|---|---|---|---|---|
| **Skeletal stature** | Population-level cumulative net-nutrition signal for a birth cohort | Which specific factor (diet/disease/workload) drove a change; individual health | Temple & Goodman (2014, *AJPA*) argue the field conflates "stress" and "health"; Komlos-tradition conscript samples carry documented selection bias | Steckel 2009, *JEP* |
| **Dental caries** | Broad diet/subsistence shifts (esp. the forager→farmer transition) | Which specific crop/food; protein/micronutrient sufficiency | 2022 Central Germany Neolithic study warns against flattening real intra-group variation into a simple forager-vs-farmer narrative | Larsen 2015, *Bioarchaeology* (2nd ed.) |
| **Enamel hypoplasia** | That a systemic developmental stress episode occurred, roughly when in childhood | The specific cause (malnutrition/infection/fever/weaning all look alike); severity of the underlying stress | Hassett (2012) found no reliable relationship between defect size and stress severity/duration |  |
| **Skeletal trauma** | Fracture presence/pattern, healing stage | Motive, perpetrator, or the broader social scale/meaning of violence without wider context | Redfern (2017) interrogates whether the field over/under-attributes "violence" from bone alone | Redfern 2017, *Injury and Trauma in Bioarchaeology* |
| **Stable isotopes** (C/N/Sr/O) | Broad dietary category, trophic level, non-local origin, weaning timing | Specific foods; precise geographic origin without a good local isotopic baseline | Reitsema (2013) argues physiological state (illness, pregnancy) confounds the "isotopes = diet" assumption | Reitsema 2013, *AJHB* |
| **Ancient DNA** | Population movements/admixture, direct biological kinship, pathogen presence/strain | Cultural identity or language; disease severity/prevalence (absence ≠ absence of disease); low-coverage kinship calls are software-dependent and inconsistent | Active ethics literature on sampling/consent is a live methodological fault line, not settled practice | Skoglund & Mathieson 2018, *Annual Review of Genomics and Human Genetics* |
| **Paleopathology generally** | That a chronic condition was present in a population, comparatively | **The osteological paradox**: only individuals who survived long enough for a disease to leave a bony trace show one — a population with *more* visible lesions can be the *healthier* one | Wood, Milner, Harpending, Weiss 1992, *Current Anthropology* — the field-defining critique, still actively engaged three decades on | DeWitte & Stojanowski 2015 |

**Cross-cutting warning, confirmed independently across every proxy above:** cemetery skeletal samples are not random draws from the once-living population — differential mortuary treatment by age/sex/status, near-universal underrepresentation of infants, and excavation/curation choices all compound. "Earliest surviving evidence" for any of these proxies is a function of preservation, excavation history, and study effort concentrated in temperate/arid, well-excavated regions (Europe, parts of the Near East, the Andes) — never a measure of "earliest actual occurrence."

---

## 3. Economic history: wages, inequality, land, labor

### Historical Prices and Wages (HPW)
Decentralized clearinghouse hosted by IISH (Amsterdam), 13th c.–present, densest 16th–19th c. Hundreds of independently submitted series, **not harmonized** into one index — real breadth, but requires user-side reconciliation. https://iisg.amsterdam/en/research/projects/hpw

### Global Price and Income History Group (GPIH) / Allen–Unger Database
| Field | Detail |
|---|---|
| Organization/authors | Robert C. Allen (Oxford/NYU Abu Dhabi) and Richard W. Unger (UBC) built the price database; wider GPIH network directed by Peter Lindert (UC Davis) |
| Method | Allen's (2001) standardized subsistence-basket methodology converts wages/prices to comparable silver-equivalent "welfare ratios" across currencies/regions |
| Coverage | European, Middle Eastern, Asian (China, Japan, India) cities; price series to 964 CE, welfare-ratio studies mostly 1300s–1900s |
| Limitations — **a live, named methodological dispute**: Judy Stephenson (2018) argues Allen's London wage data reflect contract/subcontracted day-rates overstating actual worker pay; Allen rebutted ("Real Wages Once More," 2017/2018); Humphries & Weisdorf's "Unreal Wages?" (2019) argue for annual rather than day-wage series, yielding materially different Great-Divergence timing |
| Citation | Allen, R.C. 2001. "The Great Divergence in European Wages and Prices from the Middle Ages to the First World War." *Explorations in Economic History* 38(4):411–447 |
| URL | https://gpih.ucdavis.edu/ |

### Historical Gini reconstruction — Milanovic/Lindert/Williamson "social tables" + Clio-Infra
| Field | Detail |
|---|---|
| Organization/authors | Branko Milanovic (CUNY/World Bank), Peter Lindert, Jeffrey Williamson |
| Variables | Gini coefficient; **Inequality Extraction Ratio (IER)** and **Inequality Possibility Frontier (IPF)** — the max Gini theoretically extractable given a subsistence-minimum constraint |
| Coverage | 28+ pre-industrial societies (Roman Empire, Byzantium, Mughal India, Qing China, colonial New Spain, England, British India), irregular cross-sectional snapshots ~14 CE–1947, **not a continuous series** |
| Method | Reconstructs distribution from historians' pre-existing "social tables" (class-based income breakdowns) |
| Why the IER metric exists at all: precisely because raw Gini comparison across societies with very different subsistence constraints is misleading — a methodological admission of the precision gap this whole inventory keeps surfacing |
| Limitations | Relies on secondary, uneven-quality social tables; income-only; sparse point estimates, not a real time series |
| Citation | Milanovic, B., Lindert, P.H., Williamson, J.G. "Pre-Industrial Inequality." *The Economic Journal* 121(551) (2011): 255–272 |

### Kohler, Smith et al. — archaeological house-size Gini project
| Field | Detail |
|---|---|
| Organization/authors | Timothy Kohler (Washington State), Michael Smith (Arizona State), Amy Bogaard, multi-institutional Santa Fe Institute-linked team |
| Variables | House floor area (m²) as wealth proxy; Gini per site-occupation phase |
| Coverage | 63 archaeological sites, North America/Mesoamerica/Eurasia, post-Neolithic through pre-modern |
| Access | Supplementary data with the Nature publication |
| Current status | A formal **Corrigendum** was subsequently published correcting an error in the original paper; a 2024 PNAS paper in the same tradition found agglomeration/productivity are "poor predictors of inequality," complicating the original causal story |
| Strengths | The deepest time-depth wealth-inequality proxy available, predating written/tax records by millennia |
| Limitations | Excludes livestock/movable wealth/land/slaves; Gini on floor area is not comparable to a monetized wealth Gini; the causal claim (large domesticable animals → Eurasian inequality) is contested |
| Citation | Kohler, T.A., Smith, M.E., Bogaard, A., et al. "Greater post-Neolithic wealth disparities in Eurasia than in North America and Mesoamerica." *Nature* 551 (2017): 619–622. Corrigendum: *Nature* (2018) |
| URL | https://www.nature.com/articles/nature24646 |

### Slave Voyages (Trans-Atlantic and Intra-American Slave Trade Databases)
| Field | Detail |
|---|---|
| Organization/authors | Consortium led by Emory University (David Eltis, founding PI), origins at Harvard's W.E.B. Du Bois Institute, 57 contributing archives |
| Variables | Voyage dates, vessel data, embarkation/disembarkation ports, mortality, financiers; African Names Database adds individual name/age/sex/origin for 91,491 individuals |
| Coverage | Atlantic World, 1514–1866 |
| Method | ~40 years of cumulative archival harmonization across Portuguese, British, French, Spanish, Dutch, American, Brazilian records |
| Strengths | The most heavily vetted quantitative dataset for any slave trade anywhere — ~35,000 voyages, an estimated 66–80% of all transatlantic slaving expeditions |
| Limitations | ~20–34% of actual voyages remain undocumented, disproportionately Portuguese/Brazilian and pre-1650; **does not cover the trans-Saharan, Red Sea, or Indian Ocean slave trades** — global comparative slavery claims cannot rest on this dataset alone |
| URL | https://www.slavevoyages.org/ |

### Land-concentration datasets: Deininger–Squire, Frankema, Vanhanen
Deininger & Squire (World Bank, ~108–138 countries, 1890–1996) is the base land-Gini compilation, since superseded in scope by WIID; Ewout Frankema's colonial-focus dataset (105 countries, incl. case studies of Malaysia/Sierra Leone/Zambia) directly tests — and complicates — the influential Engerman–Sokoloff "factor endowments" thesis of comparative development, finding colonial *institutions*, not geography, primarily drove land-inequality outcomes; Vanhanen's series runs 1850–2000. Limitation common to all three: recorded legal ownership routinely diverges from customary/communal use rights in colonial contexts. Citation: Deininger, K. & Squire, L. *Journal of Development Economics* 57(2) (1998): 259–287; Frankema, E. *The Economic History Review* 63(2) (2010): 418–451.

### Deep-time economic proxies

| Proxy | Can tell us | Cannot tell us | Key controversy |
|---|---|---|---|
| **Grain wages / real-wage reconstruction** | Relative urban-laborer purchasing power over time | Household living standards generally (excludes women's/children's earnings, non-wage labor); aggregate output | Stephenson vs. Allen dispute above; Humphries & Weisdorf's day-vs-annual-wage critique |
| **Tax records** | Relative wealth/income distribution among the *taxed* population | Distribution among the untaxed/exempt; informal wealth | Alfani's finding of near-monotonic 1450–1800 European inequality rise is debated as partly reflecting a widening/regressive tax base, not only real change |
| **House/settlement size** | Relative household wealth ranking within a site-phase, at extraordinary time depth | Absolute wealth, movable wealth, continuous trends (data are site-phase snapshots) | The domesticable-animals→inequality causal claim (Kohler et al.) is contested by later work in the same tradition |
| **Coinage** (minting volume, debasement) | Relative monetary expansion/contraction, fiscal stress | Real output directly; coin velocity is unobservable, so "more coins" can't be cleanly separated from "same coins circulating faster" | How much debasement reflects bullion scarcity vs. deliberate seigniorage extraction is genuinely disputed per case |
| **Shipwrecks** (Mediterranean count curve) | A rise-then-fall pattern historically read as tracking Roman-era trade integration | Shipping volume directly; nothing about non-Mediterranean or overland trade | **Actively contested, not settled**: Wilson (in Bowman & Wilson, eds., *Quantifying the Roman Economy*, Oxford 2009) argues the later "decline" may be largely an archaeological artifact (the shift to barrels, which don't survive as identifiable cargo) rather than a real trade decline — the proxy is suggestive for the upswing, unreliable for the downswing |
| **Land records/cadastral surveys** | Land-ownership/parcel-size distribution at a point in time | Non-land wealth, land quality/productivity without matched soil data, actual income under tenancy/sharecropping | Deininger–Squire's land-Gini-predicts-growth finding is contested on reverse causation and omitted institutional variables |

### The pre-modern-GDP precision gap
Every source above converges on the same warning, independently: Clark's critique of Maddison's pre-1820 figures ("fictions... as real as the relics peddled around Europe in the Middle Ages"); the Maddison Project's own working papers acknowledging pre-modern reconstructions involve "leaps of quantitative conjecture"; Milanovic/Lindert/Williamson building the IER specifically because raw Gini comparison across eras is misleading; and the wage-data controversies (Stephenson vs. Allen) showing even the *input* series are contested before any aggregation. **Treat any single pre-modern GDP or inequality figure as one point in a wide, usually unquantified, plausible range — never as a measurement with an error bar**, structurally the same caution this repo's Bible-corpus work already applies to the *ʾeleph* census figures (which range 5,550–72,000 under different scholarly assumptions — the same failure mode, a different field).

*(Note from the researching agent: one frequently-cited paper in this exact debate, Scheidel & Friesen 2009 on the Roman Empire's income distribution, is drawn from established scholarly knowledge rather than freshly re-verified in this pass, because search budget was exhausted before it could be re-confirmed — flagged rather than silently included as verified.)*

---

## 4. Gender and kinship measurement

### Ethnographic Atlas / D-PLACE / Standard Cross-Cultural Sample — the full triad
| | Ethnographic Atlas (EA) | D-PLACE | Standard Cross-Cultural Sample (SCCS) |
|---|---|---|---|
| Authors | George P. Murdock; corrected/digitized by J. Patrick Gray (1998) and Douglas White | Kirby, Gray, Greenhill, Jordan, et al. (2016) | Murdock & White (1969) |
| Purpose | ~90+ coded traits: kinship, marriage, subsistence, religion, division of labor by sex | EA + other coded datasets, linked to Glottolog language-family trees and environmental data | 186-society purposive sample specifically built to reduce **Galton's Problem** (non-independence of culturally/historically related societies) |
| Coverage | Global, ~1,267–1,291 societies | Global, 1,400+ societies | Global, 186 "best-described" societies, one per cultural province |
| Temporal shape | **Single cross-sectional "ethnographic present" snapshot per society** (mostly late 19th–mid 20th c. observation) — not a diachronic time series | Same snapshot logic, inherited | Same |
| Access | Free (Ethnology 1962–1980; Gray's 1998 corrected edition) | Free, d-place.org, GitHub | Free, historically UC Irvine-hosted |
| License | Public-domain/academic-reuse era norms | CC-BY | Open reuse |
| Limitations | Coder subjectivity, non-random society sampling (large/accessible societies overrepresented), missing data, and the underlying ethnographies carry the biases (often colonial-administrator or missionary) of their era |

**Critical limitation for a historical timeline app:** none of the three is actually a time series. A Trobriand Islands entry and a 19th-century Plains-society entry are not "dated" against each other the way tree-ring data is — each is one snapshot at whatever point the society was first ethnographically documented. Use as **cross-sectional structural** data (what descent/residence/marriage/labor system this society had *when observed*), never as evidence of change over time within one society.

The closest available structured cross-cultural **inheritance** variables: EA075/v74 (real property) and EA076/v75 (movable property) — again single-snapshot, not diachronic.

### Women's property/inheritance rights across history — confirmed gap
**No D-PLACE-equivalent structured historical dataset exists.** What's real instead: OECD's **SIGI** (Social Institutions and Gender Index, since ~2009) and its **GID-DB** component code a "discriminatory family code" sub-index with explicit inheritance variables (daughters vs. sons, widows vs. widowers) across up to 179 countries — but these are **present-day cross-sections**, not historical series, reaching back only to the late 20th century. Everything genuinely historical (English coverture and the Married Women's Property Acts, Roman *dos*, Islamic fixed Quranic inheritance shares, Jewish inheritance law) is comparative legal-history scholarship, not structured, ingestible data. **Recommendation:** use EA/D-PLACE inheritance variables as one static structural covariate, explicitly labeled non-diachronic; any true historical time series would need to be built from primary legal-history sources (statute/code promulgation dates) — this is a real field gap, not a search failure.

### Gerda Lerner, *The Creation of Patriarchy* (Oxford UP, 1986) — thesis and named critiques
Thesis: patriarchy is a historically specific Ancient Near East development (~3100–600 BCE), not a timeless condition — agriculture drove kinship toward patrilineality and private property, and men's appropriation of women's *reproductive* labor specifically was the first form of private-property accumulation, later codified in the earliest law codes (Hammurabi). Explicitly an elaboration of Engels' 1884 *Origin of the Family, Private Property and the State*, not an independent invention.

Named critiques:
- **Judith Bennett**, *History Matters: Patriarchy and the Challenge of Feminism* (2006) — proposes "**patriarchal equilibrium**": women's relative status has stayed remarkably stable across radically different modes of production (feudalism → capitalism → industrialism), which implicitly challenges Lerner's tidy single-transition origin story if the *persistence* mechanism is what actually needs explaining.
- **Zainab Bahrani** (Mesopotamia specialist), *Women of Babylon* (2001) — argues Lerner's reading is filtered through Marxist-materialist theory more than close engagement with the Akkadian/Sumerian primary sources, and that the empirical base (2,500 years, one region) is too narrow for the near-universal theoretical claims pitched atop it. *(Caveat: verified only via secondary characterization — direct access to Bahrani's text was blocked in this research pass.)*
- Cynthia Eller's *The Myth of Matriarchal Prehistory* (2000) targets the *Gimbutas*-style prehistoric-matriarchy narrative, not Lerner directly — critics of Eller (Marler & Dashu, 2006) note she barely engages Lerner at all, a tell that Lerner's more careful materialist argument is the harder-to-dismiss version of this family of claims.

### Plough agriculture and gender division of labor — the testable, narrower hypothesis
Ester Boserup (1970) distinguished shifting/hoe agriculture (compatible with simultaneous childcare, women heavily field-involved) from plough agriculture (strength/animal-control-intensive, incompatible with simultaneous childcare, drives women toward home-based work). **Alesina, Giuliano & Nunn, "On the Origins of Gender Roles: Women and the Plough,"** *Quarterly Journal of Economics* 128(2) (2013): 469–530 — **verified real and correctly characterized**: tests the hypothesis using historical plough-adoption data crossed with geoclimatic plough-crop suitability as an instrument, at multiple levels including second-generation US immigrants (isolating cultural transmission from contemporaneous institutions). Finds historical-plough societies show lower female labor-force participation, entrepreneurship, and political representation today, holding even in the immigrant test.

Live replication/critique thread: endogeneity concerns are the standard objection (plough adoption might itself track prior gender norms or development level); Baiardi et al. (2024, *Journal of Applied Econometrics*, ML re-examination) and Vu (2026, same journal, direct replication of the migrant-analysis component) — the most recent (2024–2026) work has **largely reinforced rather than overturned** the core finding while sharpening methodological caveats on causal interpretation.

### Other named theories connecting property/state/warfare/religion to gender hierarchy
- **Engels** (1884) — Lerner's direct predecessor: herded-animal wealth under male control displacing matrilineal/communal kinship.
- **Jack Goody**, *Production and Reproduction* (1976) — a genuinely distinct property/devolution-focused theory: intensive (plough) Eurasian agriculture → dowry/"diverging devolution" (property to daughters too) → tighter control of female sexuality to protect legitimate heirs, vs. extensive (hoe) African agriculture → bridewealth, polygyny, comparatively greater female productive autonomy. A different causal mechanism from Boserup's labor-allocation account — worth its own variable in the app's taxonomy, not collapsed into Boserup.
- **Peggy Reeves Sanday**, *Female Power and Male Dominance* (1981) — cross-cultural study of ~150 tribal societies concluding male dominance is a variable "solution to cultural strain" (ecological stress, migration, origin-myth symbolism), not universal or biologically inevitable — a multi-causal rival to any single-transition narrative.
- **Steven Goldberg**, *The Inevitability of Patriarchy* (1973) — the strongest available biological-determinist counter-position (testosterone-driven status-seeking as a cross-cultural universal); near-universally rejected by subsequent anthropology, including by Sanday's own cross-cultural variation data, but included here per this project's own "strongest case for every side" rule.
- Uruk-period Mesopotamian textual evidence (male occupational/role terms proliferating while female terms compress to a generic category, coinciding with militarized stratified city-states) is a **documented pattern, not a single named theory** — the research pass could not attach one citable monograph specifically to this claim within its search budget; flag accordingly rather than inventing an attribution.

---

## 5. Religion variable decomposition

### Religiosity/participation — modern baseline, and the pre-modern gap
**World Values Survey (WVS)**: religiosity via salience, identification/belonging, and behavior (attendance/prayer frequency) items, ~90–120 countries, **7 waves since 1981 only** — a strictly modern baseline. Even within that window, Remizova, Rudnev & Davidov (2024, *Sociological Methods & Research*) find WVS religiosity measurement is **not fully cross-nationally invariant** — the same composite index doesn't mean the same thing in every country.

**No individual-level equivalent exists for the pre-survey era.** Two documented proxy strategies, both flagged with known validity problems: (1) church membership/attendance administrative records where they exist (early-modern/modern, literate, bureaucratized Christian contexts only — does not extend to antiquity or most non-Christian traditions); (2) wills/religious bequests as a lagging piety proxy (used for medieval/Reformation England), explicitly flagged in the literature as measuring external constraint (what convention and witnesses required a will to say) more than private belief.

### The Database of Religious History (DRH)
| Field | Detail |
|---|---|
| Organization | University of British Columbia; PI Edward Slingerland, with M. Willis Monroe and 488+ expert contributors; Cultural Evolution of Religion Research Consortium, funded by a $4.8M John Templeton Foundation grant — UBC's largest-ever single humanities grant |
| Variables | 230 priority + 220 non-priority coded Yes/No variables with qualitative annotation/citation fields, per religious-group or religious-place entry; multilingual (English/Chinese/French) |
| Coverage | 1,000+ entries as of Feb 2023, growing, entry-driven (not systematically sampled — grows by scholar contribution) |
| Access | Free, open access, bulk CSV, entry-level DOIs |
| License | Open access; the derived Standard Cross-Cultural Sample of Religion is CC BY 4.0 |
| Important distinction | DRH measures **system-level characteristics of religious traditions** (doctrines, institutions, practices) at specified historical points — it is not an individual-level religiosity/participation measure the way WVS is. It's the closest thing to a historical religion dataset, but it answers a different question than "how religious were ordinary people in period X." |
| Citation | Slingerland, Monroe, Muthukrishna. 2023. "The Database of Religious History (DRH): ontology, coding strategies and the future of cultural evolutionary analyses." *Religion, Brain & Behavior* 14(2) |
| URL | https://religiondatabase.org/ |

### Religious freedom / state-religion relationship
| Dataset | Organization | Variables | Coverage | Note |
|---|---|---|---|---|
| **ARDA** (Association of Religion Data Archives) | Penn State/Lilly Endowment | Aggregator of 250+ datasets, incl. hosting the two below; also hosts historical **US Censuses of Religious Bodies, 1906–1936** | Primarily US, 1980s–present, plus the 1906–1936 censuses; international from 2005 | Free, thearda.com |
| **Pew Government Restrictions Index (GRI) / Social Hostilities Index (SHI)** | Pew Research Center | GRI: 20 state-restriction indicators; SHI: 13 societal-hostility indicators (mob violence, religion-motivated crime, harassment) | ~198 countries; annual since 2007 baseline | Also codes apostasy/blasphemy-law status as a binary per country (2019 figures: 40% of countries had blasphemy laws, 11% apostasy laws, concentrated 90%/65% in MENA) — **contemporary legal status, not a historical time series** |
| **Religion and State (RAS) Project** | Jonathan Fox, Bar-Ilan University | Round 3: 117 state religion-policy variables; companion RAS Constitutions dataset: 154 variables on religion clauses, coded yearly 1990–2022 | 183 countries; **1990–2014** | Free via ARDA and QoG datafinder; Fox, *A World Survey of Religion and the State* (Cambridge UP, 2008) |

### Apostasy/heresy law history — confirmed gap
No dataset comparable to RAS/Pew exists specifically for apostasy/heresy across historical time. What's real is comparative legal-history scholarship: *Medieval Heresies: Christianity, Judaism, and Islam* (Cambridge UP, edited volume); a 60-case survey of apostasy/heresy executions in the Mamluk period (1260–1517); the Theodosian Code/Edict of Thessalonica (380 CE) baseline; canon-law typologies (the 13th-century decretist Hostiensis' three-category apostasy classification). Real and citable, but narrative-comparative, not structured/codeable data.

### Religious institutional control of education — confirmed gap
No dedicated cross-cultural quantitative dataset. Real, measurable-in-principle case material exists per tradition (the Nizamiyya madrasas, founded by Seljuk vizier Nizam al-Mulk in the 11th century, explicitly built to counter Isma'ili/Fatimid sectarian rivals and propagate a specific Sunni Shafi'i/Ash'ari line; Nalanda-type Buddhist monastic education; Christian monastic/cathedral schools) but it has not been assembled comparatively — a genuine research gap the app's authors would need to fill themselves from primary institutional records.

### Religion vs. broader ideological/institutional dogmatism — real scholarship makes this comparison
- **Eric Voegelin**, *Die politischen Religionen* (1938) — originated the "political religions" concept analyzing Communism, Fascism, and National Socialism as functional religious substitutes.
- **Emilio Gentile**, *Politics as Religion* (Princeton UP, 2006) — the leading contemporary elaborator: distinguishes pluralistic "civil religion" from totalitarian, monopolistic "political religion," arguing secular entities (the Party, the Race, the Revolution) can structurally replicate religious functions including suppression of competing belief as heresy.
- **Anatoly Khazanov**, "Marxism-Leninism as a Secular Religion" (2008), in *The Sacred in Twentieth-Century Politics* (Palgrave Macmillan) — the most directly on-point source: Soviet Marxism-Leninism as a genuine ideological monopoly replicating religious structure while violently suppressing actual religion (documented figures: 1922–1926, 28 Russian Orthodox bishops and 1,200+ priests killed). Khazanov's sharper finding: the atheist campaign was elite-mandated, not popularly generated, and per his account ultimately **failed to produce genuine ideological conversion** — a secular monopoly can suppress competing belief as effectively as a religious one without necessarily succeeding at replacing it.
- **Concrete epistemic-restriction parallel** *(this pairing is the researching agent's own synthesis of two independently well-sourced cases, flagged as such — not one scholar's formal comparative thesis)*: the Galileo affair (1633, heliocentrism ruled heretical) vs. Lysenkoism (Stalin-era USSR, ~1930s–1960s, Mendelian genetics banned as "counter-revolutionary," an estimated 3,000+ mainstream biologists dismissed/imprisoned/some executed) — both well-documented independently, and the structural parallel (enforced orthodoxy overriding empirical inquiry, backed by state coercive power, under both a religious and a secular-ideological monopoly) is explicit in general secondary commentary on both, even without one paper formally testing this exact pair.

**Net finding relevant to the app's design question:** real, named scholarship (Voegelin → Gentile → Khazanov, plus the Galileo/Lysenko parallel) supports decomposing "religion" into a broader "institutional/ideological dogmatism enforced by coercive power" variable, with religion as one historically dominant but not exclusive instance — provided the app is explicit this is a *structural-functional* argument (similar mechanisms, similar coercive effects), not a claim that secular ideology and religion are identical in content or origin.

---

## 6. State capacity, political institutions, violence

### Historical state/fiscal capacity
Three tiers of maturity, genuinely different in what they can support: **O'Reilly–Murphy State Capacity Index** (1789–2018, derivative of V-Dem sub-indicators, *Economica* 2022) is the longest-running composite but inherits V-Dem's retrospective-expert-coding limitations for early centuries; **Hanson & Sigman's "Leviathan's Latent Dimensions"** (*Journal of Politics* 2021, 177 countries) is the standard political-science reference but **only covers 1960–2015** — not usable for genuinely historical state capacity; **Dincecco's fiscal-capacity dataset** (*Political Transformations and Public Finances: Europe, 1650–1913*, Cambridge UP 2011; 11 Western European states) is the one genuinely early-modern, archivally-compiled source, but Western-Europe-only with no confirmed single centralized download.

### Historical censorship / freedom of inquiry — confirmed gap
**No dedicated, purpose-built cross-national historical dataset exists.** Historical censorship research is overwhelmingly qualitative/archival (Robert Darnton's work on Old Regime French censorship; EGO's thematic essays). The best available proxy is **V-Dem's Freedom of Expression and Alternative Sources of Information Index** (censorship, self-censorship, media bias, harassment of journalists, academic/cultural expression freedom) — genuine multi-century depth (1789–present) but not a censorship-dedicated instrument, and pre-20th-century coding rests on present-day experts reading historical secondary literature, a validity concern V-Dem's own methodology papers acknowledge. Modern-only alternatives (RSF World Press Freedom Index, 2002–present; the Van Belle/Whitten Global Media Freedom Dataset) don't reach back further than the early 2000s.

### Historical religious freedom/restriction
Covered fully in §5 above (Pew GRI/SHI, RAS, ARDA). The **World Religion Database** (Johnson & Grim, eds., Brill) measures religious *demography* (adherence counts), not restriction — do not conflate the two; it is also commercial/subscription, unlike GRI/SHI/RAS.

### Historical homicide-rate reconstruction — Eisner
| Field | Detail |
|---|---|
| Organization/authors | Manuel Eisner, Cambridge Institute of Criminology, with Ohio State's Criminal Justice Research Center hosting the Historical Violence Database (HVD) |
| Variables | Local/regional homicide-rate estimates per 100,000/year |
| Coverage | **Overwhelmingly Western/Northern Europe** (England, Netherlands, Scandinavia, Germany, Italy) — 390 observation points as of 2003, growing to 823 by 2014 |
| Method | Compilation of court records, coroner's rolls, parish/administrative records, aggregated into regional/national long-run series |
| Findings (verified) | Western European homicide rates fell from >10/100,000/year in the 13th–14th centuries (Italy reportedly up to ~70/100,000 in places) to ~1/100,000 or below by the late 20th century — a decline exceeding an order of magnitude, disproportionately concentrated in elite/male public-space violence specifically, not violence uniformly. A c.1880 "trough" pattern shows low rates in industrialized Northern Europe with a high-rate periphery (Iberia, Italy, Greece, Eastern Europe) that converged toward Northern rates by the late 20th century |
| **Explicit geographic-coverage flag** | Confirmed directly: "substantial data gaps" for non-European long-run homicide history — Africa, Asia, and the pre-colonial Americas have no comparable multi-century quantitative source. What exists for those regions (UNODC's Global Study on Homicide) is recent (2006–present) only. **This is a real, significant global-coverage limitation, not a search artifact — represent it as such, don't paper over it or extrapolate.** |
| Named critiques of the "declining violence" thesis and Pinker's use of it | Schwerhoff, Seebröker, Kästner, Voigt, "Hard numbers? The long-term decline in violence reassessed," *Continuity and Change* 36(1) (2021): 1–32 — direct source-critical challenge to whether the decline thesis has a solid empirical foundation at all. Philip Dwyer & Mark Micale, eds., *The Darker Angels of Our Nature: Refuting the Pinker Theory of History and Violence* (2021) — seventeen historians (Japan, Russia, Native America, medieval England, the Ottoman world) arguing Pinker's synthesis mishandles the historiography field-by-field |
| Citation | Eisner, M. "Long-Term Historical Trends in Violent Crime." *Crime and Justice* 30 (2003): 83–142 |

### Imprisonment/state coercion — confirmed gap
**No systematic cross-national historical dataset exists**, comparable to Eisner's homicide reconstruction or BMR's democracy coding. The **World Prison Brief** (ICPR, Birkbeck, University of London — 223 jurisdictions, prison population/rate/occupancy/pre-trial-detention data) is the standard *contemporary* cross-national source, monthly-updated, but not historical in the sense of centuries — it's a maintained current-state census with uneven country-specific backfill. National-level historical series exist (US-specific: BJS data showing the incarceration rate rising from 176/100,000 in 1950 to a 2008 peak of 755/100,000, then declining to 541 by 2022), but this is single-country administrative-record literature, not a cross-national historical panel.

### Democracy/regime-type alternatives
Boix–Miller–Rosato and Freedom House are fully tabled in §1 above. PRIO's conflict/battle-death series and the UCDP/PRIO Armed Conflict Dataset (conflict *incidence*, complementing UCDP-GED's *lethality*) are noted in §1.

---

## 7. History of science, literacy, and knowledge production

### Clio-Infra historical literacy/numeracy series
Detailed in §1 above (van Zanden et al.). Two distinct methods matter for the app's precision-labeling: **signature-vs-mark rates** on marriage registers (pre-19th-c., coarse binary, confounded by variable clerical enforcement of who had to actually sign) and the **age-heaping numeracy proxy** (A'Hearn, Baten & Crayen, "Quantifying Quantitative Literacy," *Journal of Economic History* 69(3) (2009): 783–808 — excess clustering of reported ages at round numbers, scored via the Whipple Index, validated against known literacy rates then extended into periods/regions with no signature data at all).

### Cross-national historical education-enrollment compendia
Three linked, non-unified sources: Benavot & Riddle (1988, 126 nations/colonies, 1870–1940, from colonial administrative reports and League of Nations yearbooks); Lindert (2004, ~50 countries); Lee & Lee (2016, 111 countries, 1820–1945 enrollment extended to 2010 attainment, the Barro-Lee project's continuation). **Limitation confirmed across all three**: colonial-era records systematically undercount informal/religious schooling (madrasas, mission schools, indigenous instruction) outside the formal state system — biasing comparisons toward literate cultures with formal Western-style enrollment bureaucracies. Citation: Lee, J.-W. & Lee, H. "Human Capital in the Long Run." *Journal of Development Economics* 122 (2016): 147–169.

### Isis Current Bibliography / IsisCB Explore
History of Science Society's structured bibliographic index (originated by George Sarton, 1913; ~200,000 interlinked citations, ~4,000+/year). **Indexes scholarly output *about* science, not scientific output itself** — useful for bibliometric study of the field's own attention patterns, not as a proxy for historical scientific activity. Free (IsisCB Explore) / subscription (EBSCO). https://isiscb.org/

### Mapping the Republic of Letters
Stanford (Dan Edelstein, Paula Findlen et al.) — metadata-mapped 17th–18th-century scholarly correspondence networks (Voltaire, Franklin, Linnaeus), built the open-source Palladio visualization tool. Empirically found the "Republic of Letters" self-image of uniform global cosmopolitanism was overstated — the actual network was more clustered/hub-dependent. Tells you about *documented contact*, not idea quality/originality, and systematically undercounts destroyed archives and non-European scholarly networks without comparably preserved letter collections. https://cesta.stanford.edu/research/mapping-republic-letters

### Historical patent counts as an innovation proxy — and why this is a contested proxy, not a clean one
B. Zorina Khan's archive (>100,000 patents, ~65,000 innovation prizes, Britain/France/US, ~1750–1930) is the best-documented long-run patent microdata for the Atlantic economies. **But the culture-neutrality critique is explicit and well-established in the literature, not merely implied**: Christine MacLeod, *Inventing the Industrial Revolution* (Cambridge UP, 1988) — "the distribution of patents is a better guide to the advance of capitalism than to the centres of inventive activity"; Zvi Griliches, "Patent Statistics as Economic Indicators: A Survey," *Journal of Economic Literature* 28(4) (1990): 1661–1707 — catalogs classification/valuation problems that bias raw patent counts even *within* one legal system; Kenneth Pomeranz, *The Great Divergence* (2000) — argues the presumed European "better patent system" advantage is overstated, since comparable institutional features existed in China without a Western-style formal patent apparatus. Patent systems are themselves a specific Western legal invention (England's 1624 Statute of Monopolies onward) — societies without a comparable formal IP regime (most of pre-modern Asia, Africa, the Islamic world, indigenous Americas) generate **zero patent count by construction**, regardless of actual inventive output. **Raw cross-cultural patent comparison measures institutional adoption, not innovation** — this is a load-bearing warning for the app, not a footnote.

### Manuscript/book production as an intellectual-activity proxy
Buringh & van Zanden, "Charting the 'Rise of the West': Manuscripts and Printed Books in Europe... Sixth through Eighteenth Centuries," *Journal of Economic History* 69(2) (2009): 409–445. A 13-century continuous time series with an explicit, testable statistical model (~60% of medieval production variation explained by university/monastery count and urbanization rate). Survivor-bias inherent to any "loss-rate model" is itself a modeling assumption, not an observation, and the study is entirely Europe-internal — it has no built-in comparison mechanism against non-European manuscript traditions (Islamic, Chinese, Mesoamerican) despite being frequently cited in "rise of the West" arguments that implicitly need one.

### Cross-cultural, explicitly non-European history of science — verified capability examples

| Domain | Culture/period | Documented capability | Citation |
|---|---|---|---|
| Astronomy | Babylonian, 7th c. BCE–last centuries BCE | Purely arithmetic (non-geometric) Saros-cycle eclipse-possibility prediction, no mechanical/heliocentric model at all | Steele, J.M. "Eclipse Prediction in Mesopotamia." *Archive for History of Exact Sciences* 54(5) (2000): 421–454 |
| Mathematics | India, classical–medieval, decimal place-value system by ~5th–6th c. CE (Aryabhata), elaborated through the Kerala school (14th–16th c.) | Invention/systematization of decimal place-value and zero-as-number; sine tables and early trigonometric identities feeding into later Islamic and European trigonometry | Plofker, K. *Mathematics in India*. Princeton UP, 2009 |
| Medicine | India, Sushruta Samhita (traditional date ~6th c. BCE, scholarly consensus redaction early centuries CE) | Documented surgical techniques incl. forehead-flap rhinoplasty, cataract couching, bladder-stone treatment, description of >100 surgical instruments and >1,100 conditions, predating comparable European surgical treatises by centuries | PMC11527508 |
| Metallurgy | Northwestern Tanzania (Buhaya/Haya), Early Iron Age, ~1st millennium BCE–early CE | Preheated-air bloomery smelting reaching 1350–1400°C, at least 100°C hotter than contemporary European bloomery furnaces, enabling higher-carbon steel-like iron well before comparable European techniques | Schmidt, P.R. & Avery, D.H. "Complex Iron Smelting and Prehistoric Culture in Tanzania." *Science* 201(4361) (1978): 1085–1089 |
| Navigation | Polynesian/Micronesian wayfinding, tested by David Lewis in the 1960s–70s | Non-instrument open-ocean navigation across thousands of miles via a memorized 200+-point star compass, swell-pattern reading, and dead reckoning — empirically verified in Lewis's own 2,200-nm Tahiti–New Zealand reconstructed voyage | Lewis, D. *We, the Navigators*. University of Hawaii Press, 1972 (rev. 1994) |

### Empirical capability vs. explanation of mechanism — the distinction, with real cases
The app's proposed distinction (a culture can predict/calculate/manipulate accurately while explaining *why* religiously/mythologically) is well-documented, not a modern imposition:
- **Babylonian eclipse prediction** achieved real predictive precision via purely arithmetic period-relations, centuries before any Greek geometric/mechanical model — and operated entirely inside a divinatory framework, tracked because eclipses were omens governed by the gods (*Enūma Anu Enlil*), not because Babylonian scholars held a mechanistic celestial theory. Francesca Rochberg, *The Heavenly Writing: Divination, Horoscopy, and Astronomy in Mesopotamian Culture* (Cambridge UP, 2004) is the standard source establishing that predictive power and divinatory explanation coexisted without contradiction — this was not a "science vs. religion" split for Mesopotamian scholars at all.
- **Maya Venus/eclipse tables** (Dresden Codex, ~11th–12th c. CE data) tracked the 584-day Venus cycle and predicted eclipses to roughly 33 minutes' accumulated error over 400 years, using only long-count arithmetic and observational correction — while structuring a ritual/divinatory calendar (warfare, sacrifice, ceremony timed to Venus's heliacal risings, understood via deity mythology). Anthony Aveni, *Skywatchers of Ancient Mexico* (rev. ed., University of Texas Press, 2001) frames Maya astronomy as "astrology with more accurate arithmetic" rather than proto-physics — the standard source.

Both cases show the same structural pattern: high-precision predictive mathematics sustained by institutions (priestly/temple astronomer classes) whose stated purpose was divinatory, not mechanistic explanation — suggesting predictive accuracy and mechanistic understanding are historically decoupled capacities, each independently attainable to a high level. *(That general pattern-level claim is this project's own inference from the two documented cases; it is not itself a quotation from Rochberg or Aveni making that exact generalization.)*

---

*(End of dataset inventory. See `docs/timeline/research/LANDSCAPE.md` for the analytical synthesis this feeds — measurement map, systems/institutions map, literature map, data gaps, and recommended MVP.)*
