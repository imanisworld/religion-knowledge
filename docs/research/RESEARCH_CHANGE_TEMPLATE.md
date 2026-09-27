# Research Change Checklist

Use this checklist for any pull request that adds, modifies, or removes a factual or interpretive claim in this repository. Copy it into your PR description.

---

## Claim Summary

- **What claim is being added or changed?** (exact wording)
- **Which file(s) are affected?** (Markdown source + any generated HTML)
- **Is the search index (`search-index.json`) rebuilt by this change?**

---

## Claim Classification

- [ ] `direct_textual`
- [ ] `manuscript_textual_critical`
- [ ] `historical_date_event`
- [ ] `historical_interpretation`
- [ ] `linguistic`
- [ ] `scholarly_consensus`
- [ ] `causation_influence`
- [ ] `theological_confessional`
- [ ] `ethical_polemical`

---

## Evidence

- **Primary source(s):** (author/text, specific locator — page, verse, section, or URL)
- **Secondary source(s):** (full citation + page range + stance: supports / qualifies / contradicts)
- **Source I have actually opened and read:** yes / no — _if no, this PR cannot be merged_

---

## Confidence and Status

- **Confidence level:** high / medium / low / contested
- **Claim status:** verified / verified_with_qualification / overstated / disputed / needs_qualification
- **If confidence is `contested` or status is `disputed`:** strongest opposing argument supplied? yes / no

---

## Wording Check

- [ ] Claim does NOT use prohibited wording ("proves," "all scholars agree," "clearly means," "the Bible originally said," "this was copied from," "the church changed," "they believed" [applied to a diverse group], "beyond doubt," "no serious scholar")
- [ ] OR: prohibited wording is present AND a `prohibited_wording_exception` is supplied in the claim registry entry

---

## Registry

- [ ] A `claim_id` has been assigned
- [ ] The claim is entered or updated in `docs/research/claim-registry.json`
- [ ] `node scripts/validate-claim-registry.mjs` passes locally

---

## Generated Outputs

- [ ] All affected HTML files have been regenerated from source Markdown
- [ ] `search-index.json` has been rebuilt if content changed
- [ ] No generated file diverges from its source

---

## Sensitive-Topic Review

Check any that apply and confirm the relevant standard is met:

- [ ] **Textual criticism / manuscripts** — variant readings acknowledged; no claim that a disputed reading is settled
- [ ] **Judaism / Jewish-Christian relations** — anti-Jewish vs. antisemitic distinction maintained; community diversity acknowledged; Martyn *aposynagogos* framed as contested reconstruction
- [ ] **Translation disputes** — original-language claim distinguished from translation choice; competing renderings noted
- [ ] **Causation / influence / borrowing** — three-part test met: chronological possibility + contact/transmission channel + meaningful correspondence
- [ ] **Theological/doctrinal claims** — attributed to named traditions, not presented as historically demonstrable fact
- [ ] **Comparative religion** — similarity distinguished from dependence; parallel motifs not treated as proof of copying
