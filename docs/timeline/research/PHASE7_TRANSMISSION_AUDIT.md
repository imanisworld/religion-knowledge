# Phase 7 — Transmission Audit

**Status:** Batch 1 independently checked 27 September 2026.

## Rule

Similarity is not evidence of transmission. A canonical relationship edge is created only when named scholarship explicitly argues for historical transmission, engagement, identification, reform, or another allowed relationship. Motif tags remain comparison tools, not causal edges.

## Canonical edges added in Batch 1

### Hurro-Hittite Song of Emergence ↔ Hesiod's Theogony

**Canonical model:** `CULTURAL_FUSION`, HIGH confidence.

The comparative resemblance is stored separately from the causal transmission claim. Amir Gilan (Cambridge, 2021) describes the Song of Emergence as the clearest evidence for Greek reception of Near Eastern mythology and identifies a plausible performance/contact setting around Mount Hazzi. Kostas Vlassopoulos (Cambridge, 2013) explicitly states that a version of the myth was transmitted through intercultural communication and adapted in Hesiod. Ian Rutherford (Oxford, 2020) identifies the north-east Mediterranean / Cilicia-Levant-Cyprus zone as the most likely route if the Kingship in Heaven material reached Greece.

**Limit:** this does not identify a single transmitter, exact date, or direct copying of a surviving Hittite tablet.

### Enūma Eliš ↔ Genesis 1

**Canonical model:** `UNCERTAIN_CONNECTION`, DISPUTED confidence.

David M. Carr (Oxford, 2020) explicitly argues that Genesis 1 shows particular engagement with Enūma Eliš. Alexander Heidel's detailed comparison remains a useful counterweight: direct dependence is not demonstrable from similarities alone. The graph therefore records a disputed connection, not `BORROWING`.

**Limit:** the edge does not mean Genesis copied Enūma Eliš, nor that `tehom` is directly borrowed from Tiamat.

## Strong candidates held for separate modeling

### Canaanite El / Yahweh

Frank Moore Cross, Mark S. Smith, and John Day all argue substantial continuity, convergence, identification, or assimilation between Canaanite religion and early Israelite Yahwism. This is strong enough for Phase 7 research, but the current Timeline lacks the required ancient Levant deity/tradition nodes. Do not force this into an unrelated Narrative edge.

### Baal imagery / Yahwistic imagery

John Day explicitly devotes a chapter to “Yahweh's appropriation of Baal imagery,” and broader scholarship treats Israelite religion as developing partly within a Canaanite religious environment. This should be modeled after the Yahweh/Baal/Canaanite tradition entities exist.

### Atraḫasīs / Genesis flood tradition

The handoff identified a strong Mesopotamian relationship, and John Day argues specifically for Genesis flood dependence on Atraḫasīs. The current Phase 5 narrative set has no Genesis flood Narrative entity. Do not point the edge at Genesis 1 or Eden merely to make the graph connect.

### Zoroastrian / Second Temple Jewish concepts

Contact under Persian rule is historical; concept-level borrowing remains debated and concept-specific. Do not add a single blanket Zoroastrianism → Judaism edge from general resemblance. Research individual concepts and chronology first.

## Do not create an edge from motif similarity alone

Unless later scholarship establishes a historical transmission mechanism, do not create West-Asian transmission edges for:
- Egyptian Atum/Ptah → Genesis 1–2 solely from primordial-water or creation-by-speech motifs
- Norse Ymir → Mesopotamian/Vedic creation
- Popol Vuh → Old World creation narratives
- Māori Ranginui/Papatūānuku → Old World creation narratives
- Anangu Tjukurpa → Old World creation narratives
- Yoruba Ilé-Ifẹ̀ → West Asian creation narratives
- Rig Veda 10.129 → Genesis or Enūma Eliš
- Hesiod → Genesis

## Sources checked in Batch 1

- Amir Gilan, “Let Those Important Primeval Deities Listen,” in *Gods and Mortals in Early Greek and Near Eastern Mythology* (Cambridge University Press, 2021), DOI 10.1017/9781108648028.003.
- Kostas Vlassopoulos, “The Barbarian repertoire in Greek culture,” in *Greeks and Barbarians* (Cambridge University Press, 2013), DOI 10.1017/CBO9781139049368.006.
- Ian Rutherford, *Hittite Texts and Greek Religion: Contact, Interaction, and Comparison* (Oxford University Press, 2020), ch. 7.
- M. L. West, *The East Face of Helicon* (Oxford University Press, 1997), ch. 6.
- David M. Carr, *The Formation of Genesis 1–11: Biblical and Other Precursors* (Oxford University Press, 2020), ch. 1.
- Alexander Heidel, *The Babylonian Genesis*, 2nd ed. (University of Chicago Press, 1963; orig. 1951).
- Frank Moore Cross, *Canaanite Myth and Hebrew Epic* (Harvard University Press, 1973/1997 printing).
- Mark S. Smith, *The Early History of God*, 2nd ed. (Eerdmans, 2002).
- John Day, *Yahweh and the Gods and Goddesses of Canaan* (Sheffield Academic Press, 2000; reprint 2002).

## Batch 2 — Ancient Levant modeling

**Status:** independently checked 27 September 2026.

### Canonical entities added

- Late Bronze Age Canaanite religion (Ugaritic textual horizon)
- Early Israelite Yahwism (pre-exilic Iron Age)
- El / Ilu (Canaanite-Ugaritic)
- Baal / Hadad (Ugaritic storm god)
- Yahweh (early Israelite)
- Ugaritic Baal Cycle (KTU 1.1–1.6)

### Canonical relationships added

#### Canaanite religious matrix → Early Israelite Yahwism

**Edge:** `CULTURAL_FUSION`, HIGH confidence.

Mark S. Smith explicitly argues that Israelite religion developed at least partly from Canaanite religion rather than beginning as a clean religious-cultural rupture. Theodore J. Lewis treats El worship, Yahweh's origin, and the Canaanite cultural continuum as related but separable historical questions.

**Limit:** this does not make every Israelite community identical and does not settle Yahweh's ultimate geographic origin.

#### El ↔ Yahweh

**Model:** Deity `identifications[]`, HIGH confidence.

The edge represents historical convergence/assimilation: Yahweh came to absorb or be identified with El's titles, functions, and senior status. It is deliberately **not** a claim that Yahweh and El were always one deity. A southern-origin Yahweh remains compatible with later convergence.

#### Baal/Canaanite imagery → Early Israelite Yahwism

**Edge:** `CULTURAL_FUSION`, HIGH confidence.

John Day's scholarship explicitly treats Yahweh's appropriation of Baal imagery, while Psalm 29 scholarship identifies adapted Canaanite/Baalistic storm and kingship language. The model therefore records cultural inheritance/appropriation rather than direct literary borrowing from the surviving Ugaritic tablets.

**Limit:** not every storm-war motif is uniquely Baal-derived, and the exact transmission route is not known for each biblical text.

### Explicit non-node decision

No standalone “divine council tradition” entity is created. The divine council is modeled as a comparative structural feature within Canaanite/Ugaritic and Israelite materials, not as a historical tradition with its own discrete community or transmission chain.

### Held

- Yahweh's southern origin / Shasu-Yhw / Kenite-Midianite hypotheses: historically important but still separate from the El/Yahweh convergence edge.
- Genesis Flood / Atraḫasīs / Gilgamesh XI: next Phase 7 batch.
- Zoroastrian concept-level influence: still held concept-by-concept; no blanket edge.

## Batch 3 — Flood transmission

**Status:** independently checked 27 September 2026.

### Canonical entities added

- Genesis 6–9 Flood Narrative
- Gilgamesh Tablet XI flood account

### Canonical relationships added

#### Atraḫasīs → Gilgamesh Tablet XI

**Edge:** `BORROWING`, HIGH confidence.

Jeffrey H. Tigay's literary analysis treats Atraḫasīs as the source of the flood story inserted into the later Gilgamesh epic. Andrew George's critical work likewise places Tablet XI within the older Atraḫasīs flood tradition.

**Limit:** intermediate manuscript stages are not fully recoverable.

#### Atraḫasīs → Genesis Flood

**Edge:** `CULTURAL_FUSION`, MODERATE confidence.

John Day argues that the non-P/Yahwist Genesis flood is closer to Atraḫasīs than to Gilgamesh and explicitly evaluates direct versus indirect Mesopotamian dependence. David Carr argues that both the pre-P and Priestly Genesis flood narratives were modeled on earlier Mesopotamian flood traditions especially represented by Atraḫasīs and Gilgamesh XI.

**Limit:** the exact transmission chain is not documented. This edge does not claim direct access to a specific Atraḫasīs tablet and does not exclude mediation through Gilgamesh, oral circulation, or other Mesopotamian flood traditions.

### Held

#### Gilgamesh Tablet XI → Genesis Flood

Specific details such as bird release and mountain landing make this a live comparative candidate, but the present evidence does not justify a second directed edge on top of the stronger Atraḫasīs/Mesopotamian-source model. Keep as research-only unless a focused source pass establishes a defensible independent transmission claim.

#### Babylonian Exile as context

Historically important as a contact environment, but the current Timeline schema has no Event entity type. Do not force the exile into a Polity, Tradition, or Narrative node merely to visualize context. A future schema pass can decide whether historical context/events deserve their own entity type.

#### Zoroastrian concept-level transmission

No blanket edge. The returned audit finds cosmic dualism the strongest concept-level candidate, but still DISPUTED; resurrection is explicitly weaker. Keep these as research holds unless a later concept-specific pass produces an edge that clears the causation bar.

