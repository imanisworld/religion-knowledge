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
    return '<tr role="row" data-catalog-row><th role="rowheader" scope="row" data-label="Entry">' + esc(row.name || row.id) + '</th>' +
      '<td role="cell" data-label="Region">' + esc(region) + '</td>' +
      '<td role="cell" data-label="Overview"><p class="preview">' + esc(shorten(overview(row, group))) + '</p>' +
      '<details class="entry-more"><summary>Read research notes</summary>' +
      detailText(row, counts) + '</details></td></tr>';
  }).join('\n');
  return '<details id="' + esc(group.dir) + '" class="group"' + (group.dir === 'deities' ? ' open' : '') +
    '><summary class="section-head"><span class="group-title">' + esc(group.title) + '</span><span>' + records.length +
    ' entries</span></summary><p>' + esc(group.intro) +
    '</p><div class="table-wrap"><table role="table" class="catalog-table"><thead role="rowgroup"><tr role="row">' +
    '<th role="columnheader" scope="col">Entry</th><th role="columnheader" scope="col">Region</th><th role="columnheader" scope="col">Overview and evidence</th>' +
    '</tr></thead><tbody role="rowgroup">' + rows + '</tbody></table></div></details>';
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
    '<style>:root{--f-body:var(--rk-body,system-ui,sans-serif)}*{box-sizing:border-box}html{scroll-padding-top:7rem}'+
    'body{margin:0;background:var(--ground);color:var(--ink);font:16px/1.55 var(--f-body)}'+
    'main{max-width:1140px;padding:3.2rem 1.2rem 6rem;margin:auto}'+
    'h1,h2{font-family:var(--rk-display,Georgia,serif);letter-spacing:-.025em;font-weight:500}h1{font-size:clamp(2.3rem,6vw,3.8rem);line-height:1.1;margin:.4rem 0 .7rem}'+
    '.lede{max-width:76ch;color:var(--ink2)}.jump{display:flex;gap:.8rem 1.1rem;flex-wrap:wrap;margin:1.8rem 0 3rem;border-block:1px solid var(--rule);padding:1rem 0}'+
    '.jump a{font-size:.85rem;color:var(--accent)}.group{margin:0 0 3rem;scroll-margin-top:7rem}'+
    '.group{border-bottom:1px solid var(--rule);padding-bottom:1rem}.section-head{display:flex;align-items:center;justify-content:space-between;gap:.8rem;cursor:pointer;padding:.7rem .2rem}.section-head .group-title{font:500 clamp(1.5rem,4vw,2rem)/1.2 var(--rk-display,Georgia,serif);color:var(--ink)}.section-head span:last-child{color:var(--ink2);font-size:.84rem;white-space:nowrap}.section-head:focus-visible{outline:2px solid var(--accent);outline-offset:3px}details>summary::marker{color:var(--accent)}'+
    '.group>p{color:var(--ink2);font-size:.9rem;margin:.3rem 0 .95rem}'+
    '.table-wrap{width:100%;min-width:0;border-top:1px solid var(--rule)}'+
    '.catalog-table{width:100%;table-layout:fixed;border-collapse:collapse;background:var(--paper)}'+
    '.catalog-table th,.catalog-table td{text-align:left;vertical-align:top;padding:.8rem .8rem;border-bottom:1px solid var(--rule);font-size:.9rem;overflow-wrap:anywhere}'+
    '.catalog-table thead th{font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;color:var(--ink2);background:var(--ground)}'+
    '.catalog-table thead th:nth-child(1){width:27%}.catalog-table thead th:nth-child(2){width:18%}'+
    '.catalog-table tbody th{font-weight:650;color:var(--ink)}.catalog-table td{color:var(--ink2)}'+
    '.catalog-table tbody tr:last-child>*{border-bottom:0}.catalog-table tr[hidden]{display:none}'+
    '.preview{margin:0;line-height:1.48;color:var(--ink)}'+
    '.entry-more{margin:.36rem 0 0}.entry-more summary{width:max-content;max-width:100%;color:var(--accent);font-size:.84rem;font-weight:650;cursor:pointer;text-underline-offset:3px;text-decoration:underline}'+
    '.entry-more[open]{margin-top:.6rem}.entry-details{margin:.6rem 0 .15rem;padding:.75rem 0 .1rem;border-top:1px solid var(--rule)}'+
    '.entry-details div{margin:0 0 .8rem}.entry-details dt{font-size:.7rem;text-transform:uppercase;letter-spacing:.05em;font-weight:750;color:var(--ink2)}'+
    '.entry-details dd{margin:.2rem 0 0;color:var(--ink);font-size:.9rem;line-height:1.55;overflow-wrap:anywhere;white-space:normal}'+
    '.people-list ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 1.5rem}'+
    '.people-list li{border-bottom:1px solid var(--rule);padding:.5rem .3rem;min-width:0}'+
    '.people-list li[hidden]{display:none}.people-list a{font-weight:600;color:var(--ink)}'+
    '.people-list li span{display:block;font-size:.75rem;color:var(--ink2)}'+
    '.status{border-left:3px solid var(--accent);padding:.75rem 1rem;margin:1.7rem 0;background:var(--paper);font-size:.9rem}'+
    'input[type=search]{max-width:32rem;width:100%;border:1px solid var(--rule);padding:.65rem .75rem;background:var(--paper);color:var(--ink);border-radius:6px;font:inherit}'+
    '.controls{margin-bottom:1.7rem}.controls label{display:block;font-size:.95rem;margin-bottom:.35rem}.scroll-note,.result-count{font-size:.88rem;color:var(--ink2)}.result-count{margin-top:.55rem}.status summary{font-weight:600;cursor:pointer}.status p{margin:.55rem 0 0}'+
    '.skip{position:absolute;left:-9999px}.skip:focus{left:1rem;top:1rem;padding:.5rem;background:var(--paper);z-index:110}'+
    '@media(max-width:720px){main{padding:2rem 1rem 4rem}.section-head{align-items:start}.people-list ul{grid-template-columns:1fr}'+
    '.catalog-table,.catalog-table tbody,.catalog-table tr,.catalog-table th,.catalog-table td{display:block;width:100%!important;min-width:0}'+
    '.catalog-table thead{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}'+
    '.catalog-table tr{padding:.75rem .85rem;margin:0 0 .65rem;border:1px solid var(--rule);border-radius:9px;background:var(--paper)}'+
    '.catalog-table th,.catalog-table td{padding:.2rem 0;border:0!important;background:transparent}'+
    '.catalog-table th[scope=row]{font-size:1rem;margin-bottom:.15rem}'+
    '.catalog-table td[data-label=Region]{font-size:.8rem;color:var(--ink2);margin-bottom:.3rem}'+
    '.catalog-table td[data-label=Overview]{font-size:.9rem}'+
    '.table-wrap{border:0;background:transparent}.catalog-table{background:transparent}'+
    '.entry-more summary{padding:.25rem 0}.jump{gap:.6rem 1rem}}'+
    '@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}'+
    '</style><script>try{document.documentElement.dataset.theme=localStorage.getItem("religion-knowledge-theme")||"light"}catch(e){}</script></head>'+
    '<body class="rk-with-sitebar"><a class="skip" href="#main">Skip to tables</a>'+
    '<header class="rk-sitebar"><div class="rk-sitebar-inner"><a class="rk-brand" href="index.html">Religion Knowledge<small>Research library</small></a>'+
    '<nav class="rk-global-nav" aria-label="Site navigation"><a href="index.html">Library</a><a href="history.html">History</a><a href="religion-law.html">Religion &amp; Law</a><a href="search.html">Search</a></nav>'+
    '<button class="rk-site-control" id="theme" type="button" aria-label="Toggle theme">Theme</button></div></header>'+
    '<main id="main"><p><a href="comparisons.html">← Comparison tables</a></p><h1>Gods, religions, cultures &amp; people</h1>'+
    '<p class="lede">Browse short research overviews by category. Open notes directly under an entry, or use the <a href="comparisons.html">comparison tables directory</a> to read longer side-by-side studies.</p>'+
    '<p class="lede"><strong>This research is still being checked.</strong> Some findings need independent review before they can be treated as established.</p>'+
    '<details class="status"><summary>What do the evidence labels mean?</summary><p><strong>Published:</strong> added to the public research. <strong>Checked in research:</strong> a source check was recorded, but independent review may still be pending. <strong>Still to review:</strong> more checking is needed. These lists cover only the material we have researched so far. Similar gods or stories may have developed separately.</p><p>Open “Read research notes” on any entry to see the available context and the status of linked claims without leaving the site.</p></details>'+
    '<nav class="jump" aria-label="Jump to a collection">'+nav+'</nav>'+
    '<div class="controls"><label for="filter">Find a name, place, or topic</label><input id="filter" type="search" autocomplete="off" placeholder="For example: Baal, Maya, or West Africa"><p class="result-count" id="matchCount" aria-live="polite"></p><p class="scroll-note">On a phone, each entry is shown in a readable row. Open research notes for more detail.</p></div>'+
    groups+peopleTable()+
    '<p class="lede">Want to go further? Read the <a href="history.html">Historical Framework</a>, <a href="sources.html">Sources &amp; Primary Texts</a>, or <a href="cited-persons.html">Cited Persons</a> pages. They explain the sources and historical context.</p></main>'+
    '<script>(()=>{const f=document.getElementById("filter");const groups=[...document.querySelectorAll("details.group")];let saved=null;function apply(){const q=f.value.toLocaleLowerCase().trim();if(q&&!saved)saved=new Map(groups.map(g=>[g.id,g.open]));if(!q&&saved){for(const g of groups){g.open=saved.get(g.id)||false;g.hidden=false;}saved=null;}let total=0;for(const g of groups){let found=0;for(const row of g.querySelectorAll("[data-catalog-row]")){const show=!q||row.textContent.toLocaleLowerCase().includes(q);row.hidden=!show;if(show)found++;}g.hidden=!!q&&!found;if(q&&found)g.open=true;total+=found;}document.getElementById("matchCount").textContent=q?total+" matching entries":"";}f.addEventListener("input",apply);document.querySelectorAll(".jump a").forEach(a=>a.addEventListener("click",()=>{f.value="";apply();const target=document.getElementById(a.getAttribute("href").slice(1));if(target)target.open=true;}));if(location.hash){const target=document.getElementById(location.hash.slice(1));if(target?.matches("details.group"))target.open=true;}document.getElementById("theme").addEventListener("click",()=>{let d=document.documentElement;d.dataset.theme=d.dataset.theme==="dark"?"light":"dark";try{localStorage.setItem("religion-knowledge-theme",d.dataset.theme)}catch(e){}})})();</script></body></html>';
}
