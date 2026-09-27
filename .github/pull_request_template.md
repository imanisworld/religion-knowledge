## Summary

<!-- Describe what this PR does in 1–3 sentences. -->

---

## Research Change Checklist

> Complete this section for any PR that adds, modifies, or removes a factual or interpretive claim. Skip if this PR is purely technical (UI, tooling, CI, dependency updates).

### Claim
- **Exact claim text (as it appears or will appear publicly):**
- **File(s) affected (Markdown source + generated HTML):**
- **Claim type:** `direct_textual` / `manuscript_textual_critical` / `historical_date_event` / `historical_interpretation` / `linguistic` / `scholarly_consensus` / `causation_influence` / `theological_confessional` / `ethical_polemical`

### Evidence
- **Primary source(s):** _(author/text + specific locator)_
- **Secondary source(s):** _(full citation + page range + stance)_
- [ ] I have opened and read every source I am citing

### Quality
- **Confidence:** `high` / `medium` / `low` / `contested`
- **Status:** `verified` / `verified_with_qualification` / `needs_qualification` / `disputed`
- [ ] Claim does NOT use prohibited wording ("proves," "all scholars agree," "clearly means," "the Bible originally said," "this was copied from," "the church changed," "beyond doubt," "no serious scholar") — OR exception is documented in the registry entry
- [ ] For `disputed` or `ethical_polemical` claims: strongest opposing argument is included

### Registry and Outputs
- [ ] `claim_id` assigned and entry added/updated in `docs/research/claim-registry.json`
- [ ] `node scripts/validate-claim-registry.mjs` passes locally
- [ ] All affected HTML files regenerated from source Markdown
- [ ] `search-index.json` rebuilt if content changed

### Sensitive Topics (check any that apply)
- [ ] Textual criticism / manuscripts — variant readings acknowledged
- [ ] Judaism / Jewish-Christian relations — anti-Jewish vs. antisemitic distinction maintained
- [ ] Translation disputes — original-language claim vs. translation choice distinguished
- [ ] Causation / influence / borrowing — three-part test met (chronology + transmission channel + meaningful correspondence)
- [ ] Theological/doctrinal claims — attributed to named traditions, not presented as historical fact
- [ ] Comparative religion — similarity distinguished from dependence
