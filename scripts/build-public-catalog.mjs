/**
 * Public comparative entity index, generated from the canonical Timeline data.
 * This is an index of research records, not a publication or confirmation of
 * every linked claim. Cross-cultural influence requires its own sourced claim.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASE = 'docs/timeline/data/entities';
const TYPES = [
  { dir: 'deities', title: 'Gods and deities', intro: 'Gods and other divine figures mentioned in our research.', tags: false },
  { dir: 'traditions', title: 'Religions and traditions', intro: 'Religious and cosmological traditions, including traditions with multiple classifications.', tags: true },
  { dir: 'cultures', title: 'Cultures and societies', intro: 'People and societies represented in our research.', tags: false },
  { dir: 'narratives', title: 'Creation stories', intro: 'Stories about how the world or people began, as recorded in the research.', tags: false },
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

function shorten(value, limit = 155) {
  const text = clean(value);
  return text.length <= limit ? text : text.slice(0, limit).replace(/\s+\S*$/, '') + '…';
}
function plainTag(value) { return String(value ?? '').replace(/_/g, ' ').toLowerCase(); }
function overview(row, group) {
  if (group.dir === 'deities' && row.domain_history?.length) return row.domain_history[0].domain;
  if (group.dir === 'narratives') return row.source_label || row.notes || 'Recorded creation narrative';
  if (group.dir === 'writing_systems') return [row.script_type ? plainTag(row.script_type) + ' writing system.' : '', row.notes || ''].filter(Boolean).join(' ');
  return row.notes || row.dating?.dating_summary || 'Research record; further detail under review.';
}
function detailText(row, counts) {
  const fields = [];
  if (row.notes) fields.push(['Research notes', row.notes]);
  if (row.dating?.dating_summary) fields.push(['Dating and evidence', row.dating.dating_summary]);
  if (row.source_label) fields.push(['Text or source', row.source_label]);
  if (row.language) fields.push(['Original language', row.language]);
  if (row.genre) fields.push(['Genre', plainTag(row.genre)]);
  if (row.script_type) fields.push(['Writing system type', plainTag(row.script_type)]);
  if (row.category_tags?.length) fields.push(['Research categories', row.category_tags.map(plainTag).join(', ')]);
  if (row.domain_history?.length) fields.push(['Historical description', row.domain_history.map(d => d.domain).join('; ')]);
  const tally = [
    counts.published ? counts.published + ' publicly recorded' : '',
    counts.verified ? counts.verified + ' checked in research' : '',
    counts.other ? counts.other + ' awaiting review' : '',
  ].filter(Boolean).join(' · ') || 'No linked claim checks yet';
  fields.push(['Linked claim checks', tally]);
  return '<dl class="entry-details">' + fields.map(([label, value]) =>
    '<div><dt>' + esc(label) + '</dt><dd>' + esc(value) + '</dd></div>').join('') + '</dl>';
}
function entityTable(group, claims) {
  const records = entities(group.dir);
  if (!records.length) throw new Error('Missing entities for ' + group.dir);
  const rows = records.map(row => {
    const counts = claims.get(row.id) || { verified: 0, published: 0, other: 0 };
    const region = Array.isArray(row.region) && row.region.length ? row.region.join(', ') : 'Not specified';
    return '<tr data-catalog-row><th scope="row" data-label="Entry">' + esc(row.name || row.id) + '</th>' +
      '<td data-label="Region">' + esc(region) + '</td>' +
      '<td data-label="Overview"><p class="preview">' + esc(shorten(overview(row, group))) + '</p>' +
      '<details class="entry-more"><summary>Read research notes</summary>' +
      detailText(row, counts) + '</details></td></tr>';
  }).join('\n');
  return '<details id="' + esc(group.dir) + '" class="group"' + (group.dir === 'deities' ? ' open' : '') +
    '><summary class="section-head"><span class="group-title">' + esc(group.title) + '</span><span>' + records.length +
    ' entries</span></summary><p>' + esc(group.intro) +
    '</p><div class="table-wrap"><table class="catalog-table"><thead><tr>' +
    '<th scope="col">Entry</th><th scope="col">Region</th><th scope="col">Overview and evidence</th>' +
    '</tr></thead><tbody>' + rows + '</tbody></table></div></details>';
}
function peopleTable() {
  const people = personRows();
  if (people.length < 300) throw new Error('Cited Persons source changed unexpectedly');
  return '<details id="people" class="group"><summary class="section-head"><span class="group-title">People cited in the research</span><span>' +
    people.length + ' entries</span></summary><p>Find a person and open their background entry in the library. An entry may still need independent verification.</p>' +
    '<div class="people-list"><ul>' +
    people.map(p => '<li data-catalog-row><a href="cited-persons.html#' + esc(p.id) + '">' + esc(p.name) + '</a>' +
      (p.flagged ? '<span>Background context included</span>' : '') + '</li>').join('\n') +
    '</ul></div></details>';
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
    '.group{border-bottom:1px solid var(--rule);padding-bottom:1rem}.section-head{display:flex;align-items:center;justify-content:space-between;gap:.8rem;cursor:pointer;padding:.7rem .2rem}.section-head .group-title{font:500 clamp(1.5rem,4vw,2rem)/1.2 Georgia,serif;color:var(--ink)}.section-head span:last-child{color:var(--ink2);font-size:.84rem;white-space:nowrap}.section-head:focus-visible{outline:2px solid var(--accent);outline-offset:3px}details>summary::marker{color:var(--accent)}'+
    '.group>p{color:var(--ink2);font-size:.9rem;margin:.3rem 0 .95rem}'+
    '.table-scroll{width:100%;overflow-x:auto;border:1px solid var(--rule);border-radius:6px}'+
    'table{width:100%;min-width:680px;border-collapse:collapse;background:var(--paper)}th,td{text-align:left;vertical-align:top;padding:.75rem .9rem;border-bottom:1px solid var(--rule);font-size:.95rem}'+
    'thead th{font-size:.72rem;text-transform:uppercase;letter-spacing:.07em;color:var(--ink2);background:var(--ground)}tbody th{font-weight:600;min-width:170px}'+
    'tbody tr:last-child>*{border-bottom:0}td{color:var(--ink2)}td a{color:var(--accent)}'+
    '.status{border-left:3px solid var(--accent);padding:.75rem 1rem;margin:1.7rem 0;background:var(--paper);font-size:.9rem}'+
    'input[type=search]{max-width:32rem;width:100%;border:1px solid var(--rule);padding:.65rem .75rem;background:var(--paper);color:var(--ink);border-radius:6px;font:inherit}'+
    '.controls{margin-bottom:1.7rem}.controls label{display:block;font-size:.95rem;margin-bottom:.35rem}.scroll-note,.result-count{font-size:.88rem;color:var(--ink2)}.result-count{margin-top:.55rem}.status summary{font-weight:600;cursor:pointer}.status p{margin:.55rem 0 0}'+
    '.skip{position:absolute;left:-9999px}.skip:focus{left:1rem;top:1rem;padding:.5rem;background:var(--paper);z-index:110}'+
    '@media(max-width:720px){main{padding:2rem 1rem 4rem}.section-head{align-items:start}.table-scroll{margin-inline:0}th,td{padding:.6rem .7rem}}'+
    '</style><script>try{document.documentElement.dataset.theme=localStorage.getItem("religion-knowledge-theme")||"light"}catch(e){}</script></head>'+
    '<body class="rk-with-sitebar"><a class="skip" href="#main">Skip to tables</a>'+
    '<header class="rk-sitebar"><div class="rk-sitebar-inner"><a class="rk-brand" href="index.html">Religion Knowledge<small>Research library</small></a>'+
    '<nav class="rk-global-nav" aria-label="Site navigation"><a href="index.html">Library</a><a href="history.html">History</a><a href="religion-law.html">Religion &amp; Law</a><a href="search.html">Search</a></nav>'+
    '<button class="rk-site-control" id="theme" type="button" aria-label="Toggle theme">Theme</button></div></header>'+
    '<main id="main"><p><a href="comparisons.html">← Comparison tables</a></p><h1>Gods, religions, cultures &amp; people</h1>'+
    '<p class="lede">Explore the gods, religions, cultures, stories, and people in our research. Start with the first list, open another section, or search for a name or place.</p>'+
    '<p class="lede"><strong>This research is still being checked.</strong> Some findings need independent review before they can be treated as established.</p>'+
    '<details class="status"><summary>What do the evidence labels mean?</summary><p><strong>Published:</strong> added to the public research. <strong>Checked in research:</strong> a source check was recorded, but independent review may still be pending. <strong>Still to review:</strong> more checking is needed. These lists cover only the material we have researched so far. Similar gods or stories may have developed separately.</p><p>“View research file” opens the supporting data on GitHub. That file may use technical language.</p></details>'+
    '<nav class="jump" aria-label="Jump to a collection">'+nav+'</nav>'+
    '<div class="controls"><label for="filter">Find a name, place, or topic</label><input id="filter" type="search" autocomplete="off" placeholder="For example: Baal, Maya, or West Africa"><p class="result-count" id="matchCount" aria-live="polite"></p><p class="scroll-note">On a phone, swipe a table sideways to see more columns.</p></div>'+
    groups+peopleTable()+
    '<p class="lede">Want to go further? Read the <a href="history.html">Historical Framework</a>, <a href="sources.html">Sources &amp; Primary Texts</a>, or <a href="cited-persons.html">Cited Persons</a> pages. They explain the sources and historical context.</p></main>'+
    '<script>(()=>{const f=document.getElementById("filter");const groups=[...document.querySelectorAll("details.group")];let saved=null;function apply(){const q=f.value.toLocaleLowerCase().trim();if(q&&!saved)saved=new Map(groups.map(g=>[g.id,g.open]));if(!q&&saved){for(const g of groups){g.open=saved.get(g.id)||false;g.hidden=false;}saved=null;}let total=0;for(const g of groups){let found=0;for(const row of g.querySelectorAll("tbody tr")){const show=!q||row.textContent.toLocaleLowerCase().includes(q);row.hidden=!show;if(show)found++;}g.hidden=!!q&&!found;if(q&&found)g.open=true;total+=found;}document.getElementById("matchCount").textContent=q?total+" matching entries":"";}f.addEventListener("input",apply);document.querySelectorAll(".jump a").forEach(a=>a.addEventListener("click",()=>{f.value="";apply();const target=document.getElementById(a.getAttribute("href").slice(1));if(target)target.open=true;}));if(location.hash){const target=document.getElementById(location.hash.slice(1));if(target?.matches("details.group"))target.open=true;}document.getElementById("theme").addEventListener("click",()=>{let d=document.documentElement;d.dataset.theme=d.dataset.theme==="dark"?"light":"dark";try{localStorage.setItem("religion-knowledge-theme",d.dataset.theme)}catch(e){}})})();</script></body></html>';
}
