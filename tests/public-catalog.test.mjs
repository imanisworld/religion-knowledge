import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPublicCatalog } from '../scripts/build-public-catalog.mjs';

test('catalog keeps its full research coverage while linking public readers', () => {
  const html = buildPublicCatalog();
  for (const id of ['deities','traditions','cultures','narratives','writing_systems','people']) {
    assert.match(html, new RegExp('id="' + id + '"'));
  }
  for (const label of ['This research is still being checked.','What do the evidence labels mean?',
    'Read research notes','Cited Persons','Find a name, place, or topic']) {
    assert.ok(html.includes(label), 'Missing context or control: ' + label);
  }
  for (const name of ['Baal / Hadad','Akan traditional religion','Akan (Asante)','Enūma Eliš','Cuneiform'])
    assert.ok(html.includes(name), 'Missing entity ' + name);
  assert.ok((html.match(/<tr role="row" data-catalog-row>/g) || []).length >= 100,
    'Expected the full comparative entity list');
  assert.ok((html.match(/<li data-catalog-row>/g) || []).length >= 300,
    'Expected all people in the Cited Persons index');
  assert.match(html, /href="cited-persons\.html#person-/);
  assert.equal(html.includes('<a href="app/">App</a>'), false);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<details id="deities" class="group" open>/);
  assert.match(html, /<details id="people" class="group">/);
  assert.match(html, /id="matchCount" aria-live="polite"/);
  assert.match(html, /matching entries/);
});

test('public catalog opens research notes on-site, without GitHub detours or phone-side scrolling', () => {
  const html = buildPublicCatalog();
  assert.doesNotMatch(html, /github\.com|View research file|swipe a table sideways|table-scroll/);
  assert.match(html, /<details class="entry-more"><summary>Read research notes<\/summary>/);
  assert.match(html, /role="table" class="catalog-table"/);
  assert.match(html, /role="rowheader" scope="row" data-label="Entry"/);
  assert.match(html, /data-label="Region"/);
  assert.match(html, /data-label="Overview"/);
  assert.match(html, /@media\(max-width:720px\)/);
  assert.match(html, /\.catalog-table tbody,.catalog-table tr,.catalog-table th,.catalog-table td\{display:block/);
  assert.match(html, /querySelectorAll\("\[data-catalog-row\]"\)/);
});


test('religions & traditions list has visible documented periods with evidence-type labels', () => {
  const html = buildPublicCatalog();
  const traditions = html.match(/<details id="traditions" class="group"[\s\S]*?(?=<details id="cultures" class="group")/);
  assert.ok(traditions, 'Missing traditions collection');
  const content = traditions[0];
  assert.match(content, /class="catalog-table traditions-table"/);
  assert.match(content, /<th role="columnheader" scope="col">Documented period<\/th>/);
  assert.match(content, /data-label="Documented period"/);
  assert.match(content, /No verified written date/); // Akan passage-level date remains unresolved
  assert.match(content, /1400–1200 BCE/); // Ugaritic Bronze Age tablets
  assert.match(content, /1700–1715 CE/); // custodian's broader Popol Vuh manuscript range
  assert.match(content, /No verified written date/); // early Yahwism needs no invented start
  assert.match(content, /Written sources in this research/);
  assert.match(content, /Surviving manuscript in this research/);
  assert.match(content, /It is not a founding date or an end date/);
  assert.match(content, /Historical timeline and uncertainty/);
  assert.match(content, /Archaeological context — not automatically an origin date/);
  assert.match(content, /Oral-tradition dating — method and uncertainty/);
  assert.match(content, /Traditional or internal account/);
  assert.match(html, /traditions-table thead th:nth-child\(3\)\{width:19%\}/);
  assert.match(html, /data-label="Documented period"/);
  assert.match(html, /href="traditions.html#trad_akan_traditional_religion"/);
  assert.match(html, /href="traditions.html"/);
  assert.doesNotMatch(html, /github\.com/);
});


test('every entity category exposes dating evidence or explicitly reports the missing date', () => {
  const html = buildPublicCatalog();
  const groups = ['deities', 'traditions', 'cultures', 'narratives', 'writing_systems'];
  const slices = new Map(groups.map((id, i) => {
    const start = html.indexOf('<details id="' + id + '" class="group"');
    const next = i + 1 < groups.length ? html.indexOf('<details id="' + groups[i + 1] + '" class="group"') : html.indexOf('<details id="people" class="group"');
    assert.ok(start >= 0 && next > start, 'Category missing or reordered: ' + id);
    return [id, html.slice(start, next)];
  }));
  for (const id of groups) {
    const block = slices.get(id);
    const label = id === 'traditions' ? 'Documented period' : 'Date / evidence';
    assert.ok(block.includes('data-label="' + label + '"'), id + ' must show its dating column');
    assert.ok(block.includes('<th role="columnheader" scope="col">' + label + '</th>'),
      id + ' must label dates for desktop readers');
    assert.match(block, /How to read (these )?dates:/);
    const rowCount = (block.match(/<tr role="row" data-catalog-row>/g) || []).length;
    const dateCount = (block.match(new RegExp('data-label="' + label + '"', 'g')) || []).length;
    assert.ok(rowCount > 0, id + ' must contain records');
    assert.equal(dateCount, rowCount, id + ' must show a date or explicit gap for every row');
  }

  assert.match(slices.get('deities'), /1400–1200 BCE/);
  assert.match(slices.get('deities'), /Dated portrayal in this research|Earliest written evidence recorded/);
  assert.match(slices.get('deities'), /Date not established/);
  assert.match(slices.get('cultures'), /1–700 CE/);
  assert.match(slices.get('cultures'), /No reliable date recorded here/);
  assert.match(slices.get('narratives'), /700–600 BCE/);
  assert.match(slices.get('narratives'), /1700–1715 CE/);
  assert.match(slices.get('writing_systems'), /3350 BCE/);
  assert.match(slices.get('writing_systems'), /1821 CE/);
  assert.match(slices.get('writing_systems'), /end date not established/);
  assert.match(html, /Biographical dates appear only where an entry explicitly records them/);
});


test('catalog exposes supported motifs, script origin classifications, source limitations and meaningful person warnings', () => {
  const html = buildPublicCatalog();
  const section = (name, next) => {
    const i = html.indexOf('<details id="' + name + '" class="group"');
    const j = html.indexOf('<details id="' + next + '" class="group"', i + 1);
    assert.ok(i >= 0 && j > i, 'Missing category: ' + name);
    return html.slice(i, j);
  };
  const narratives = section('narratives','writing_systems');
  const writing = section('writing_systems','people');
  const traditions = section('traditions','cultures');
  const people = html.slice(html.indexOf('<details id="people" class="group"'));

  assert.match(narratives, /Narrative themes recorded in this research/);
  assert.match(narratives, /earth clay human, flood/);
  assert.match(narratives, /maize plant creation/);
  assert.match(narratives, /Shared themes alone do not establish borrowing/);
  assert.match(writing, /Writing system development — research classification/);
  assert.match(writing, /stimulus diffusion/);
  assert.match(writing, /Proposed script ancestry \(under review\)/);
  assert.match(writing, /Aramaic Script \(disputed\)/);
  assert.match(writing, /needs its own evidence check/);
  assert.match(traditions, /Linked sources and their limits/);
  assert.match(traditions, /University of Chicago — Ras Shamra Tablet Inventory/);
  assert.match(traditions, /not evidence every Canaanite cult was identical/);
  assert.match(people, /Source or context warning/);
  assert.doesNotMatch(people, /Background context included/);
  assert.doesNotMatch(html, /github\.com/);
});
