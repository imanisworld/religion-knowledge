# Independent Review Brief — Illness Explanations

**Prepared:** 20 October 2026  
**PR:** [#213](https://github.com/imanisworld/religion-knowledge/pull/213)  
**Current status:** Ready to hand to a reviewer; **not yet independently reviewed**. The research expansion freeze prohibits publication.

## Review target

Read [index.md](index.md), [STATUS.md](STATUS.md), and the 13 `IL-*` entries in `docs/research/claim-registry.json` on this **draft branch**, not an older copy from `main`.

### Exact task for an independent reviewer

Review each claim as a historian of ancient Mediterranean religion and history of medicine would. Do not assume the module's interpretation is correct. Review passages in their original literary contexts; distinguish a textual narrator's causal claims from observable illness, contagion, diagnosis, institutional motives, or modern science.

For **each claim ID**, report:

1. **Verdict:** holds, holds with qualification, needs correction, unsupported, or unresolved.
2. **Source examined:** author, title, exact verse/page/section, edition/translation, URL if available. Distinguish a directly read primary text from a secondary scholar's quotation of a primary source, from an abstract.
3. **Problem/correction:** quote the exact problematic words from the staged module, then supply replacement wording, if needed.
4. **Opposing interpretation:** the strongest defensible scholarly or traditional alternative, with named source and the precise reason for disagreement.
5. **Evidence still missing:** original-language ambiguity, text dating, primary manuscript, cited full chapter, or comparative data; do not fill gaps with guesses.

**Fail-closed rule:** If access to a book, inscription, original-language edition, or article is blocked, mark it **unverified** and do not credit it as page-level verification. Do not infer broader religious practice from one biblical verse. Do not diagnose ancient patients from stories.

## Thirteen claims requiring verdicts

| ID | Review focus |
|---|---|
| `IL-DEUT-001` | Deut 28:21–22 (v. 20 is curses and confusion, not disease), illness as covenant curse; distinguish narrative vs medical claim |
| `IL-NUM-001` | Num 16:46–50 (context 16:41–50), incense, plague, atonement, divine anger |
| `IL-MARK-001` | Mark 9:17–29, spirit and seizure-like symptoms; avoid retroactive medical diagnosis |
| `IL-JOHN-001` | John 9:1–3, rejection of parents'/person's sin and continuing theological explanation |
| `IL-JOB-001` | Job 4:7–8, 8:4–6, 42:7; does overall Job challenge retribution? What exactly does epilogue reject? |
| `IL-SIRACH-001` | Sirach 38:1–15, physician/medicine and prayer/purification; dating and canon traditions |
| `IL-HIPMED-001` | Anonymous *On the Sacred Disease* §1–2, treatment, “divine” language, physiological theory, approximate date |
| `IL-HIPBLAME-001` | *On the Sacred Disease* §1 accusation about practitioners claiming credit for cures and transferring blame for deaths |
| `IL-MESMED-001` | Scurlock 2018: diagnostic roles, `āšipu`/`asû`, what can be asserted from abstract versus chapter pages |
| `IL-MARI-001` | Feder's 2019 account of Mari letters; verify primary tablet editions, dates, infection, separation, shared objects |
| `IL-TZARAAT-001` | `ṣāraʿat` in Lev 13–14; Hansen disease conflation; infectious vs ritual logic; compare Feder 2017/2019 |
| `IL-SNOW-001` | Snow's 1854 waterborne cholera research; avoid oversimplified pump-handle causal myth |
| `IL-KOCH-001` | Koch's 1882 TB finding, organism/cause wording and date; broader germ-theory history |

**Adversarial pre-review:** [PRE-REVIEW.md](PRE-REVIEW.md) is an internal pass over all 13 claims. It is **not** independent review. Use it as a list of disputes to settle, not as verdicts. Its main findings: John 9:3 punctuation (Poirier 2006), the Sirach 38:15 Hebrew/Greek difference (Zapff 2011), and an unconfirmed Hippocratic credit/blame sentence (`IL-HIPBLAME-001`).

## Pre-review findings to check (20 October 2026)

An internal consistency pass found five problems before independent review. Items 1, 2 and 4 are corrected on this branch; items 3 and 5 are open. Confirm or overturn each.

1. **Fragment claim texts (corrected).** `IL-MARI-001` and `IL-TZARAAT-001` stored partial sentences ("discusses early eighteenth-century BCE letters…", "the ancient descriptions do not fit one modern diagnosis."). Both now hold complete sentences taken from the module's wording. Check that each still says exactly what the module says.
2. **Verse ranges (corrected).** The registry cited Deut 28:20–22 and Num 16:41–50, while the module's table cites 28:21–22 and 16:46–50. Verse 20 of Deut 28 concerns curses and confusion, not disease. In Num 16, the wrath and the start of the plague are at v. 46, and the plague is stopped by v. 48. Both registry locators now match the table, keeping 16:41–50 as context. This was checked through ESV verse results only, because the NABRE and NRSVue pages could not be reached; **confirm the verse numbering in the cited translations.**
3. **Scurlock attribution (open, marked unverified).** The module said Scurlock (2018) "describes `āšipu` and `asû` specialists and documents familiarity with contagion" on the strength of the abstract alone. The abstract could not be reached to confirm that it says this. The module now marks both points **unverified**. Check the abstract, and the chapter pages if they are available; either restore the attribution with a locator or remove it.
4. **Feder camp label (corrected).** Feder was labelled `[JEWISH/ANCIENT NEAR EAST STUDIES]` in §3 and `[CRITICAL]` in §4. Both now read `[CRITICAL]`, a label for his method, not his identity. Confirm the label is appropriate.
5. **Registry reconciliation with PR #212 (open).** See `STATUS.md` §3a. This affects merge, not the review verdicts.

## Located material and access limitations

**Text directly inspected internally:** Deut 28 (USCCB NABRE), Num 16 (NRSVue), Mark 9 (USCCB), John 9 (NRSVue), Job 42:7 (NRSVue), Sirach 38 (USCCB), Hippocratic *On the Sacred Disease* §1 (Perseus/Adams translation), Feder's 2017 and 2019 studies, CDC 2004 John Snow and CDC 1982 Koch accounts, National Academies `A Theory of Germs` chapter.

**Partial access / review required:** Scurlock, “Mesopotamian Beginnings for Greek Science?” (2018), pp. 35–46 **abstract only**; Lawrence, *Sense and Stigma in the Gospels* (2013), ch. 5, pp. 98–123 **abstract only**; *The Cambridge Ancient History* medicine chapter **summary only**; cuneiform originals of Mari letters **not personally checked**. Greek/Hebrew term analyses **not completed**.

**Recommended open-source references:** [Perseus *On the Sacred Disease*](https://beta.perseus.tufts.edu/urn:cts:greekLit:tlg0627.tlg027.perseus-eng2/), [Feder on early contagion](https://www.thetorah.com/article/tumah-ritual-impurity-or-fear-of-contagious-disease), [Feder on tzaraat](https://www.thetorah.com/article/tzaraat-in-light-of-its-mesopotamian-parallels), [Sirach 38](https://bible.usccb.org/bible/sirach/38), [Oxford Scurlock abstract](https://academic.oup.com/edited-volume/34644/chapter-abstract/295182564), [Oxford Lawrence abstract](https://academic.oup.com/book/4088/chapter-abstract/145789629).

## Return format and writeback

Return a concise matrix: `claim_id | current wording | direct evidence | correction | verdict | unverified`. Include citations and an overall list of any surviving major interpretive differences.

Review is advisory: **do not merge, deploy, change the live site, or alter the repository** without permission. Source verification and correction should be committed back to PR #213, followed by refreshed registry/checks and status updates. The review document itself does not mean that outside review happened.
