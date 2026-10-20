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
  assert.ok((html.match(/<tr data-catalog-row>/g) || []).length >= 100,
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
  assert.match(html, /data-label="Entry"/);
  assert.match(html, /data-label="Region"/);
  assert.match(html, /data-label="Overview"/);
  assert.match(html, /@media\(max-width:720px\)/);
  assert.match(html, /\.catalog-table tbody,.catalog-table tr,.catalog-table th,.catalog-table td\{display:block/);
  assert.match(html, /querySelectorAll\("\[data-catalog-row\]"\)/);
});
