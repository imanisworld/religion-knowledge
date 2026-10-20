import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPublicCatalog } from '../scripts/build-public-catalog.mjs';

test('public catalog includes existing research collections and source links', () => {
  const html = buildPublicCatalog();
  for (const id of ['deities','traditions','cultures','narratives','writing_systems','people']) {
    assert.match(html, new RegExp('id="'+id+'"'));
  }
  for (const text of ['This research is still being checked.','What do the evidence labels mean?',
    'checked in research','View research file','Cited Persons','Find a name, place, or topic']) {
    assert.ok(html.includes(text), 'Missing contextual wording: '+text);
  }
  const expected = [
    ['Gods and deities', 'Baal / Hadad'],
    ['Religions and traditions','Akan traditional religion'],
    ['Cultures and societies','Akan (Asante)'],
  ];
  for (const [section,name] of expected) {
    assert.ok(html.includes(section), 'Missing section: '+section);
    assert.ok(html.includes(name), 'Missing record: '+name);
  }
  assert.ok((html.match(/<tr>/g) || []).length >= 400,
    'Expected several hundred records including the existing person index');
  assert.equal(html.includes('<a href="app/">App</a>'), false);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /overflow-x:auto/);
  assert.match(html, /<details id="deities" class="group" open>/);
  assert.match(html, /<details id="people" class="group">/);
  assert.match(html, /id="matchCount" aria-live="polite"/);
  assert.match(html, /matching entries/);
});
