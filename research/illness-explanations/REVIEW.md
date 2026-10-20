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
| `IL-DEUT-001` | Deut 28:20–22, illness as covenant curse; distinguish narrative vs medical claim |
| `IL-NUM-001` | Num 16:41–50, incense, plague, atonement, divine anger |
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

## Located material and access limitations

**Text directly inspected internally:** Deut 28 (USCCB NABRE), Num 16 (NRSVue), Mark 9 (USCCB), John 9 (NRSVue), Job 42:7 (NRSVue), Sirach 38 (USCCB), Hippocratic *On the Sacred Disease* §1 (Perseus/Adams translation), Feder's 2017 and 2019 studies, CDC 2004 John Snow and CDC 1982 Koch accounts, National Academies `A Theory of Germs` chapter.

**Partial access / review required:** Scurlock, “Mesopotamian Beginnings for Greek Science?” (2018), pp. 35–46 **abstract only**; Lawrence, *Sense and Stigma in the Gospels* (2013), ch. 5, pp. 98–123 **abstract only**; *The Cambridge Ancient History* medicine chapter **summary only**; cuneiform originals of Mari letters **not personally checked**. Greek/Hebrew term analyses **not completed**.

**Recommended open-source references:** [Perseus *On the Sacred Disease*](https://beta.perseus.tufts.edu/urn:cts:greekLit:tlg0627.tlg027.perseus-eng2/), [Feder on early contagion](https://www.thetorah.com/article/tumah-ritual-impurity-or-fear-of-contagious-disease), [Feder on tzaraat](https://www.thetorah.com/article/tzaraat-in-light-of-its-mesopotamian-parallels), [Sirach 38](https://bible.usccb.org/bible/sirach/38), [Oxford Scurlock abstract](https://academic.oup.com/edited-volume/34644/chapter-abstract/295182564), [Oxford Lawrence abstract](https://academic.oup.com/book/4088/chapter-abstract/145789629).

## Return format and writeback

Return a concise matrix: `claim_id | current wording | direct evidence | correction | verdict | unverified`. Include citations and an overall list of any surviving major interpretive differences.

Review is advisory: **do not merge, deploy, change the live site, or alter the repository** without permission. Source verification and correction should be committed back to PR #213, followed by refreshed registry/checks and status updates. The review document itself does not mean that outside review happened.
