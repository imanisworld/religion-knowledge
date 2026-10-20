import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPublicCatalog } from '../scripts/build-public-catalog.mjs';

test('public catalog includes existing research collections and source links', () => {
  const html = buildPublicCatalog();
  for (const id of ['deities','traditions','cultures','narratives','writing_systems','people']) {
    assert.match(html, new RegExp('id="'+id+'"'));
  }
  for (const text of ['Research inventory · incomplete','Linked-claim counts describe review status',
    'Empty or missing entries do not establish','Research record','Cited Persons']) {
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
});
