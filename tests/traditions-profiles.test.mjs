import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { buildTraditionsPage, traditionRecords, period } from '../scripts/build-traditions-profiles.mjs';

const profiles = traditionRecords();
const html = buildTraditionsPage();

test('all existing traditions have one research profile and a usable chooser', () => {
  assert.equal(profiles.length, 27, 'No traditions dropped or silently added');
  assert.equal((html.match(/class="tradition-profile"/g)||[]).length, profiles.length);
  assert.equal((html.match(/class="tradition-item"/g)||[]).length, profiles.length);
  assert.match(html, /Religions &amp; Traditions/);
  assert.match(html, /Find a tradition or region/);
  assert.match(html, /id="traditionSearch"/);
  assert.match(html, /id="prev"/);
  assert.match(html, /id="next"/);
  for(const row of profiles) {
    assert.ok(html.includes('id="'+row.id+'"'),'Missing profile: '+row.id);
    assert.ok(html.includes('data-select="'+row.id+'"'),'Missing chooser button: '+row.id);
    assert.ok(html.includes(row.name.replace(/&/g,'&amp;').replace(/'/g,'&#39;')),
      'Missing displayed name: '+row.name);
  }
});

test('dating fields describe types of evidence and never create fake founding dates', () => {
  assert.equal(period(null),'');
  assert.equal(period({earliest:-1400,latest:-1200}),'1400–1200 BCE');
  assert.equal(period({earliest:1700,latest:1715}),'1700–1715 CE');
  assert.equal(period({earliest:356,latest:356}),'356 CE');
  assert.match(html, /Dates shown here describe specific sources or estimates/);
  assert.match(html, /Archaeological context/);
  assert.match(html, /Written attestation/);
  assert.match(html, /Estimated oral antecedents/);
  assert.match(html, /Tradition-internal account/);
  assert.match(html, /Date not established/);
  assert.match(html, /A source-specific summary of beliefs and practices has not yet been independently checked/);
  assert.match(html, /A full source-checked account of ceremonies and continuity remains/);
  assert.match(html, /Open supporting source ↗/);
  assert.match(html, /relationship requires its own evidence review/);
  assert.doesNotMatch(html, /github\.com/);
});

test('corrected Akan, Popol Vuh and Ugaritic evidence remains qualified and source linked', () => {
  const byName = new Map(profiles.map(p=>[p.id,p]));
  const akan = byName.get('trad_akan_traditional_religion');
  const kiche = byName.get('trad_kiche_maya_religion');
  const ugarit = byName.get('trad_late_bronze_canaanite_religion');
  assert.equal(akan.dating.earliest_written_attestation.range, null,
    'Bibliographic publication alone must not verify an unlocated religious passage');
  assert.match(akan.dating.earliest_written_attestation.note,/Dutch.*1703.*English.*1705/);
  assert.deepEqual([kiche.dating.surviving_manuscript_date.range.earliest,kiche.dating.surviving_manuscript_date.range.latest],[1700,1715]);
  assert.match(kiche.dating.surviving_manuscript_date.note,/Newberry Library/);
  assert.deepEqual([ugarit.dating.earliest_written_attestation.range.earliest,ugarit.dating.earliest_written_attestation.range.latest],[-1400,-1200]);
  for(const row of [akan,kiche,ugarit]) {
    assert.ok(row.public_profile_facts?.length >= 1);
    for(const fact of row.public_profile_facts) {
      assert.ok(fact.evidence_scope.length > 50);
      assert.ok(row.source_links.some(src=>src.url===fact.source_url));
      assert.ok(html.includes(fact.statement.replace(/&/g,'&amp;').replace(/'/g,'&#39;')));
    }
    assert.ok(row.source_links.length >= 2);
    for (const source of row.source_links) {
      assert.ok(source.url.startsWith('https://'),'Sources need usable HTTPS URLs');
      assert.ok(source.supports && source.supports.length > 25,'Source link should explain scope');
      assert.ok(html.includes(source.url.replace(/&/g,'&amp;')));
    }
  }
  assert.match(html,/1700–1715 CE/);
  assert.match(html,/1400–1200 BCE/);
});

test('navigation only shows the active profile and preserves direct links', () => {
  const script=fs.readFileSync('traditions.js','utf8');
  const styles=fs.readFileSync('traditions.css','utf8');
  assert.doesNotThrow(()=>new vm.Script(script));
  assert.match(script,/profiles\.forEach\(\(p,i\) =>/);
  assert.match(script,/p\.hidden = i !== index/);
  assert.match(script,/history\.pushState/);
  assert.match(script,/addEventListener\('hashchange',restore\)/);
  assert.match(script,/addEventListener\('popstate'/);
  assert.match(script,/el\.dataset\.theme/);
  assert.match(styles,/@media\(min-width:850px\) and \(min-height:640px\)/);
  assert.match(styles,/height:calc\(100dvh - var\(--rk-nav-h,56px\)\)/);
  assert.match(styles,/\.tradition-profile\[hidden\]\{display:none!important\}/);
  assert.match(styles,/@media\(max-width:849px\), \(max-height:639px\)/);
});
