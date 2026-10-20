/**
 * Public comparative entity index, generated from the canonical Timeline data.
 * This is an index of research records, not a publication or confirmation of
 * every linked claim. Cross-cultural influence requires its own sourced claim.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASE = 'docs/timeline/data/entities';
const REPO = 'https://github.com/imanisworld/religion-knowledge/blob/main/';
const TYPES = [
  { dir: 'deities', title: 'Gods and deities', intro: 'Recorded divine figures across the cultures currently covered by the research.', tags: false },
  { dir: 'traditions', title: 'Religions and traditions', intro: 'Religious and cosmological traditions, including traditions with multiple classifications.', tags: true },
  { dir: 'cultures', title: 'Cultures and societies', intro: 'Communities represented in the timeline research.', tags: false },
  { dir: 'narratives', title: 'Creation and sacred narratives', intro: 'Surviving or recorded narratives in the research dataset.', tags: false },
  { dir: 'writing_systems', title: 'Writing systems', intro: 'Written evidence and its limitations are part of the historical comparison.', tags: false },
];
const esc = (x) => String(x ?? '').replace(/&/g, '&amp;')
  .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');
const clean = (x) => String(x ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .sort((a,b) => a.name.localeCompare(b.name))
    .flatMap((f) => f.isDirectory() ? walk(path.join(dir, f.name)) :
      f.isFile() && f.name.endsWith('.json') ? [path.join(dir,f.name)] : []);
}
function claimCounts() {
  const byEntity = new Map();
  for (const file of walk('docs/timeline/data/claims')) {
    const parsed = read(file);
    for (const c of Array.isArray(parsed) ? parsed : [parsed]) {
      if (!c?.subject_id) continue;
      const x = byEntity.get(c.subject_id) || { verified: 0, published: 0, other: 0 };
      if (c.status === 'verified') x.verified++;
      else if (c.status === 'published') x.published++;
      else x.other++;
      byEntity.set(c.subject_id, x);
    }
  }
  return byEntity;
}
function entities(dir) {
  const base = path.join(ROOT, BASE, dir);
  return walk(base).flatMap(file => {
    const parsed = read(file);
    return (Array.isArray(parsed) ? parsed : [parsed]).map(row => ({
      ...row, _file: path.relative(ROOT, file).split(path.sep).join('/')
    }));
  }).sort((a,b) => String(a.name).localeCompare(String(b.name)));
}
function personRows() {
  const source = fs.readFileSync('cited-persons.html','utf8');
  return [...source.matchAll(/<p id="(person-[^"]+)">([\s\S]*?)<\/p>/g)]
    .map(match => {
      const name = (match[2].match(/<strong>([\s\S]*?)<\/strong>/) || [,''])[1];
      return { id: match[1], name: clean(name),
        flagged: /class="flag-tag"/.test(match[2]) };
    });
}
function entityTable(group, claims) {
  const records = entities(group.dir);
  if (!records.length) throw new Error('Missing entities for '+group.dir);
  const cols = group.tags ?
    '<th scope="col">Name</th><th scope="col">Research region</th><th scope="col">Category tags</th><th scope="col">Linked claims</th><th scope="col">Source record</th>' :
    '<th scope="col">Name</th><th scope="col">Research region</th><th scope="col">Linked claims</th><th scope="col">Source record</th>';
  const rows = records.map(r => {
    const counts = claims.get(r.id) || {verified:0,published:0,other:0};
    const tally = counts.published+' published · '+counts.verified+' verified in research'+
      (counts.other ? ' · '+counts.other+' other' : '');
    const region = Array.isArray(r.region) ? r.region.join(', ') : 'Unspecified';
    const tag = group.tags ? '<td>'+esc((r.category_tags || []).join(', ') || 'Unclassified')+'</td>' : '';
    return '<tr><th scope="row">'+esc(r.name || r.id)+'</th><td>'+esc(region)+'</td>'+tag+
      '<td>'+esc(tally)+'</td><td><a href="'+esc(REPO+encodeURI(r._file))+'" target="_blank" rel="noopener noreferrer">Research record</a></td></tr>';
  }).join('\n');
  return '<section id="'+esc(group.dir)+'" class="group"><div class="section-head"><h2>'+esc(group.title)+
    '</h2><span>'+records.length+' records</span></div><p>'+esc(group.intro)+
    '</p><div class="table-scroll" role="region" aria-label="'+esc(group.title)+' table" tabindex="0"><table><thead><tr>'+
    cols+'</tr></thead><tbody>'+rows+'</tbody></table></div></section>';
}
function peopleTable() {
  const people = personRows();
  if (people.length < 300) throw new Error('Cited Persons source changed unexpectedly');
  return '<section id="people" class="group"><div class="section-head"><h2>People cited in the research</h2><span>'+
    people.length+' entries</span></div><p>Writers, researchers, theologians and historical figures mentioned in the biblical research. This is a separate citation index, not a complete history-of-humanity people database. Some entries remain unresolved.</p>'+
    '<div class="table-scroll" role="region" tabindex="0" aria-label="People cited in the research table"><table><thead><tr><th scope="col">Person</th><th scope="col">Important context flag</th><th scope="col">Read entry</th></tr></thead><tbody>'+
    people.map(p => '<tr><th scope="row">'+esc(p.name)+'</th><td>'+(p.flagged?'Flagged for context':'—')+
      '</td><td><a href="cited-persons.html#'+esc(p.id)+'">View reference</a></td></tr>').join('\n')+
    '</tbody></table></div></section>';
}
export function buildPublicCatalog() {
  const claims = claimCounts();
  const groups = TYPES.map(g=>entityTable(g,claims)).join('\n');
  const nav = TYPES.map(g=>'<a href="#'+g.dir+'">'+esc(g.title)+'</a>').join('')+
    '<a href="#people">People cited</a>';
  return '<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8">'+
    '<meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>Gods, Religions, Cultures &amp; People · Religion Knowledge</title>'+
    '<link rel="stylesheet" href="site-shell.css">'+
    '<style>:root{--f-body:system-ui,sans-serif}*{box-sizing:border-box}html{scroll-padding-top:7rem}'+
    'body{margin:0;background:var(--ground);color:var(--ink);font:16px/1.55 var(--f-body)}'+
    'main{max-width:1140px;padding:3.2rem 1.2rem 6rem;margin:auto}'+
    'h1,h2{font-family:Georgia,serif;letter-spacing:-.025em;font-weight:500}h1{font-size:clamp(2.3rem,6vw,3.8rem);line-height:1.1;margin:.4rem 0 .7rem}'+
    '.lede{max-width:76ch;color:var(--ink2)}.jump{display:flex;gap:.8rem 1.1rem;flex-wrap:wrap;margin:1.8rem 0 3rem;border-block:1px solid var(--rule);padding:1rem 0}'+
    '.jump a{font-size:.85rem;color:var(--accent)}.group{margin:0 0 3rem;scroll-margin-top:7rem}'+
    '.section-head{display:flex;align-items:baseline;justify-content:space-between;gap:.8rem}.section-head h2{font-size:clamp(1.65rem,4vw,2.1rem);margin:0}.section-head span{color:var(--ink2);font-size:.8rem;white-space:nowrap}'+
    '.group>p{color:var(--ink2);font-size:.9rem;margin:.3rem 0 .95rem}'+
    '.table-scroll{width:100%;overflow-x:auto;border:1px solid var(--rule);border-radius:6px}'+
    'table{width:100%;min-width:680px;border-collapse:collapse;background:var(--paper)}th,td{text-align:left;vertical-align:top;padding:.75rem .9rem;border-bottom:1px solid var(--rule);font-size:.88rem}'+
    'thead th{font-size:.72rem;text-transform:uppercase;letter-spacing:.07em;color:var(--ink2);background:var(--ground)}tbody th{font-weight:600;min-width:170px}'+
    'tbody tr:last-child>*{border-bottom:0}td{color:var(--ink2)}td a{color:var(--accent)}'+
    '.status{border-left:3px solid var(--accent);padding:.75rem 1rem;margin:1.7rem 0;background:var(--paper);font-size:.9rem}'+
    'input[type=search]{max-width:32rem;width:100%;border:1px solid var(--rule);padding:.65rem .75rem;background:var(--paper);color:var(--ink);border-radius:6px;font:inherit}'+
    '.controls{margin-bottom:1.2rem}.controls label{display:block;font-size:.85rem;margin-bottom:.35rem}'+
    '.skip{position:absolute;left:-9999px}.skip:focus{left:1rem;top:1rem;padding:.5rem;background:var(--paper);z-index:110}'+
    '@media(max-width:720px){main{padding:2rem 1rem 4rem}.section-head{align-items:start}.table-scroll{margin-inline:0}th,td{padding:.6rem .7rem}}'+
    '</style><script>try{document.documentElement.dataset.theme=localStorage.getItem("religion-knowledge-theme")||"light"}catch(e){}</script></head>'+
    '<body class="rk-with-sitebar"><a class="skip" href="#main">Skip to tables</a>'+
    '<header class="rk-sitebar"><div class="rk-sitebar-inner"><a class="rk-brand" href="index.html">Religion Knowledge<small>Research library</small></a>'+
    '<nav class="rk-global-nav" aria-label="Site navigation"><a href="index.html">Library</a><a href="search.html">Search</a><a href="religion-law.html">Religion &amp; Law</a><a href="history.html">History</a></nav>'+
    '<button class="rk-site-control" id="theme" type="button" aria-label="Toggle theme">Theme</button></div></header>'+
    '<main id="main"><p><a href="comparisons.html">← Comparison tables</a></p><h1>Gods, religions, cultures &amp; people</h1>'+
    '<p class="lede">Browse the historical research records collected so far. Names and regions are catalog metadata, and this is a partial geographic and chronological sample. Links open the underlying source records.</p>'+
    '<div class="status"><strong>Research inventory · incomplete.</strong> A verified research claim has not necessarily passed the independent audit required for final publication. Linked-claim counts describe review status, not historical certainty. Empty or missing entries do not establish that a culture, religion, or deity did not exist. Similarity is not evidence of borrowing.</div>'+
    '<nav class="jump" aria-label="Jump to a collection">'+nav+'</nav>'+
    '<div class="controls"><label for="filter">Filter visible table rows</label><input id="filter" type="search" autocomplete="off" placeholder="Search a name, region, or category"></div>'+
    groups+peopleTable()+
    '<p class="lede">Dates of surviving texts, proposed dates of traditions, and religious influence require separate evidence. The <a href="history.html">Historical Framework</a> and <a href="sources.html">Sources &amp; Primary Texts</a> explain those questions. The <a href="cited-persons.html">Cited Persons</a> reader includes additional context and unresolved references.</p></main>'+
    '<script>(()=>{const f=document.getElementById("filter");f.addEventListener("input",()=>{const v=f.value.toLocaleLowerCase().trim();document.querySelectorAll("tbody tr").forEach(row=>{row.hidden=!!v&&!row.textContent.toLocaleLowerCase().includes(v)});});document.getElementById("theme").addEventListener("click",()=>{let d=document.documentElement;d.dataset.theme=d.dataset.theme==="dark"?"light":"dark";try{localStorage.setItem("religion-knowledge-theme",d.dataset.theme)}catch(e){}})})();</script></body></html>';
}
