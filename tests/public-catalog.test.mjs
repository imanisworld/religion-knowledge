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
  assert.match(content, /1704–1705 CE/); // Akan recorded documentary window
  assert.match(content, /1400–1200 BCE/); // Ugaritic Bronze Age tablets
  assert.match(content, /1701–1703 CE/); // surviving Popol Vuh manuscript
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
  assert.doesNotMatch(html, /github\.com/);
});
