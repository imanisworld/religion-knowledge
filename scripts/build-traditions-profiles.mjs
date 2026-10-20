/**
 * Evidence-type-aware reading profiles from the Timeline tradition records.
 * This reader does not upgrade source claims or infer foundation dates.
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'docs/timeline/data/entities/traditions';
const e = value => String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const clean = value => String(value ?? '').replace(/\s+/g,' ').trim();

export function traditionRecords(root = process.cwd()) {
  const folder = path.join(root, BASE);
  return fs.readdirSync(folder).filter(file => file.endsWith('.json'))
    .flatMap(file => {
      const data = JSON.parse(fs.readFileSync(path.join(folder,file),'utf8'));
      return Array.isArray(data) ? data : [data];
    }).sort((a,b) => a.name.localeCompare(b.name, 'en'));
}

export function period(range) {
  if (!range || !Number.isFinite(range.earliest) || !Number.isFinite(range.latest)) return '';
  const { earliest:a, latest:b } = range;
  const fmt = y => y < 0 ? Math.abs(y)+' BCE' : y+' CE';
  if (a === b) return fmt(a);
  if (a < 0 && b < 0) return Math.abs(a)+'–'+Math.abs(b)+' BCE';
  if (a > 0 && b > 0) return a+'–'+b+' CE';
  return fmt(a)+' to '+fmt(b);
}

function evidence(row, id, heading, options = {}) {
  if (!row) return '';
  const date = period(row.range);
  const narrative = clean(row.note || row.method);
  if (!date && !narrative) return '';
  const status = options.estimated ? 'Estimate — not independently dated' :
    options.internal ? 'Tradition-internal account' :
    date ? 'Research-record date' : 'Date unresolved';
  return '<div class="evidence-item"><dt>'+e(heading)+'</dt><dd>' +
    '<span class="evidence-date">'+e(date || 'Date not established')+'</span>' +
    '<span class="evidence-status">'+e(status)+'</span>' +
    (narrative ? '<p>'+e(narrative)+'</p>' : '') + '</dd></div>';
}
function notes(row) {
  return row.notes ? '<p>'+e(row.notes)+'</p>' :
    '<p>No detailed interpretation has been verified in this research record.</p>';
}
function links(row) {
  const items = (row.source_links || []).filter(link => /^https:\/\//.test(link.url));
  if (!items.length) {
    return '<p class="missing">A directly checked public source link has not yet been attached to this record. The summary remains a working research entry.</p>';
  }
  return '<ul class="sources">'+items.map(x=>'<li><a href="'+e(x.url)+'" target="_blank" rel="noopener noreferrer">'+
    e(x.label)+'</a><p>'+e(x.supports)+'</p></li>').join('')+'</ul>';
}
function similar(row, allIds) {
  const targets = (row.relationships || []).filter(r => allIds.has(r.target_id));
  if (!targets.length) return '';
  return '<section class="references"><h3>Linked research records</h3><p>These links show records associated in the research data. Historical influence is not established by the link alone.</p><ul>'+
    targets.map(t=>'<li><a href="#'+e(t.target_id)+'">'+e(allIds.get(t.target_id))+'</a> <span class="subtle">— relationship requires its own evidence review</span></li>').join('')+'</ul></section>';
}
function profile(row, ids) {
  const d = row.dating || {};
  const written = period(d.earliest_written_attestation?.range);
  const manuscript = period(d.surviving_manuscript_date?.range);
  const archaeological = period(d.earliest_archaeological_evidence?.range);
  const periodPreview = written ? ['Written reference in research',written] :
    manuscript ? ['Surviving manuscript in research',manuscript] :
    ['Written dating', 'Not yet established'];
  const region = row.region?.length ? row.region.join(' · ') : 'Region not specified';
  const tags = row.category_tags?.length ? row.category_tags.map(t=>e(t.replace(/_/g,' '))).join(' · ') : 'Not classified';
  const dating = [
    evidence(d.earliest_archaeological_evidence,row.id,'Archaeological context'),
    evidence(d.earliest_written_attestation,row.id,'Written attestation'),
    evidence(d.surviving_manuscript_date,row.id,'Surviving manuscript or documented copy'),
    evidence(d.estimated_composition,row.id,'Estimated text composition',{estimated:true}),
    evidence(d.estimated_oral_origin,row.id,'Estimated oral antecedents',{estimated:true}),
    evidence(d.tradition_internal_claim,row.id,"Tradition's own historical account",{internal:true})
  ].filter(Boolean).join('');
  return '<article class="tradition-profile" id="'+e(row.id)+'" data-tradition-id="'+e(row.id)+'" tabindex="-1">' +
    '<header class="profile-heading"><p class="kicker">Historical profile · research in progress</p>'+
    '<h2>'+e(row.name)+'</h2><p class="region">'+e(region)+'</p></header>'+
    '<div class="summary-grid"><div><strong>'+e(periodPreview[1])+'</strong><span>'+e(periodPreview[0])+'</span></div>'+
    '<div><strong>'+e(archaeological || 'Unresolved')+'</strong><span>Archaeological context (if dated)</span></div></div>'+
    '<section><h3>What the timeline establishes</h3><p>'+e(d.dating_summary || 'No historical timeline summary has been reviewed for this tradition.')+'</p>'+
    '<p class="guardrail">Dates shown here describe specific sources or estimates. They do not establish a religion’s founding date, a single unchanging form, or when its practice ended.</p></section>'+
    '<section><h3>Types of historical evidence</h3>'+
    (dating ? '<dl class="evidence-list">'+dating+'</dl>' :
      '<p class="missing">No dated source or defensible origin date is established in this research entry.</p>')+
    '</section>'+
    '<section><h3>People, place and working classifications</h3>'+
    '<dl class="compact-list"><div><dt>Region documented</dt><dd>'+e(region)+'</dd></div>'+
    '<div><dt>Research labels</dt><dd>'+tags+'</dd></div></dl>'+
    '<p class="subtle">These broad labels are indexing aids. They are not a complete description of community beliefs, practices, or identity.</p></section>'+
    '<section><h3>Beliefs, practices and historical change</h3>'+
    '<p class="missing">A stand-alone, source-checked summary of ceremonies, beliefs and continuity has not yet been completed for this entry. See the working notes below for what researchers have recorded or questioned.</p>'+
    '<details class="working-notes"><summary>Read working research notes</summary>'+notes(row)+'</details></section>'+
    '<section><h3>Sources and verification</h3>'+links(row)+
    '<p class="subtle">Links verify only the specific evidence described alongside them. Historical interpretation and claims about influence still require passage-level checks.</p></section>'+
    similar(row,ids)+
    '</article>';
}

export function buildTraditionsPage() {
  const records = traditionRecords();
  if (records.length < 20) throw new Error('Missing tradition data');
  const ids = new Map(records.map(row=>[row.id,row.name]));
  const listing = records.map(row=>{
    const d = row.dating || {};
    const year = period(d.earliest_written_attestation?.range) ||
      period(d.surviving_manuscript_date?.range) || 'Date unresolved';
    return '<button class="tradition-item" type="button" data-select="'+e(row.id)+'" '+
      'aria-controls="'+e(row.id)+'" aria-pressed="false">'+
      '<span>'+e(row.name)+'</span><small>'+e(year)+' · '+e(row.region?.join(', ') || 'Location not given')+'</small></button>';
  }).join('');
  const profiles = records.map(row=>profile(row,ids)).join('\n');
  return '<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8">'+
    '<meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<title>Religions &amp; Traditions · Religion Knowledge</title>'+
    '<link rel="stylesheet" href="site-shell.css"><link rel="stylesheet" href="traditions.css">'+
    '<script>try{document.documentElement.dataset.theme=localStorage.getItem("religion-knowledge-theme")||"light"}catch(e){document.documentElement.dataset.theme="light"}</script>'+
    '</head><body class="rk-with-sitebar rk-traditions-page">'+
    '<a class="skip" href="#main">Skip to research</a>'+
    '<header class="rk-sitebar"><div class="rk-sitebar-inner">'+
    '<a class="rk-brand" href="index.html">Religion Knowledge<small>Research library</small></a>'+
    '<nav class="rk-global-nav" aria-label="Site navigation"><a href="index.html">Library</a>'+
    '<a href="history.html">History</a><a href="religion-law.html">Religion &amp; Law</a>'+
    '<a href="search.html">Search</a></nav>'+
    '<button type="button" class="rk-site-control" id="theme" aria-label="Change color theme">Theme</button></div></header>'+
    '<main id="main" class="traditions-main"><div class="traditions-intro">'+
    '<p class="breadcrumbs"><a href="catalog.html#traditions">← Gods, Religions &amp; People</a></p>'+
    '<div class="intro-row"><div><p class="eyebrow">Historical evidence by tradition</p><h1>Religions &amp; Traditions</h1></div>'+
    '<p>Explore '+records.length+' research records one at a time. Read the dates alongside the kind of evidence that survives; unknown origins remain unknown.</p></div></div>'+
    '<div class="traditions-workspace">'+
    '<aside aria-label="Choose a tradition"><details class="chooser" id="traditionChooser" open>'+
    '<summary>Browse traditions <span>'+records.length+' records</span></summary>'+
    '<label for="traditionSearch">Find a tradition or region</label>'+
    '<input type="search" id="traditionSearch" placeholder="Name or region" autocomplete="off">'+
    '<p id="traditionMatches" class="subtle" role="status" aria-live="polite"></p>'+
    '<div class="tradition-list" id="traditionList">'+listing+'</div></details></aside>'+
    '<div class="profile-column">'+
    '<nav class="profile-controls" aria-label="Browse tradition profiles">'+
    '<span id="profileCount" aria-live="polite"></span>'+
    '<div><button type="button" id="prev" aria-label="Previous tradition">Previous</button>'+
    '<button type="button" id="next" aria-label="Next tradition">Next</button></div></nav>'+
    '<div class="profiles" id="traditionProfiles">'+profiles+'</div>'+
    '</div></div>'+
    '<p class="footnote">Research is ongoing. <a href="sources.html">Source methods</a> · '+
    '<a href="comparisons.html">Comparison tables</a> · '+
    '<a href="catalog.html#traditions">All research collections</a>.</p>'+
    '</main><script src="traditions.js"></script></body></html>';
}
