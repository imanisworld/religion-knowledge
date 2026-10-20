import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync('dist/reader-site/index.html', 'utf8');
const groupOrder = ['explore-title', 'topics-title', 'bible-title', 'evidence-title', 'personal-title'];
const linksByGroup = new Map([
  ['explore-title', ['catalog.html','comparisons.html','search.html']],
  ['topics-title', ['history.html','religion-law.html','gender-over-time.html','patterns-synthesis.html']],
  ['bible-title', ['translations.html','translation-evidence.html','master-notes.html','field-guide.html','other-side.html']],
  ['evidence-title', ['sources.html','cited-persons.html','method-reference.html','glossary.html']],
  ['personal-title', ['personal-belief-history.html']],
]);

test('homepage introduces the library before detailed reading and ends with sources', () => {
  const sections = [...html.matchAll(/<section aria-labelledby="([^"]+)">([\s\S]*?)<\/section>/g)];
  assert.deepEqual(sections.map(m => m[1]), groupOrder);
  for (const section of sections) {
    const links = [...section[2].matchAll(/<a class="card" href="([^"]+)">/g)].map(m => m[1]);
    assert.deepEqual(links, linksByGroup.get(section[1]), 'Homepage order changed: '+section[1]);
  }
});

test('the public navigation is consistently ordered', () => {
  const nav = html.match(/<nav class="rk-global-nav"[^>]*>([\s\S]*?)<\/nav>/);
  assert.ok(nav, 'Missing public site navigation');
  assert.deepEqual([...nav[1].matchAll(/href="([^"]+)"/g)].map(m=>m[1]), [
    'index.html','history.html','religion-law.html','search.html'
  ]);
});

test('every homepage reading and discovery entry is linked exactly once', () => {
  const links = [...html.matchAll(/<a class="card" href="([^"]+)">/g)].map(m=>m[1]);
  assert.equal(links.length, 17);
  assert.equal(new Set(links).size, links.length);
  assert.ok(html.includes('href="catalog.html"'));
  assert.ok(html.includes('href="comparisons.html"'));
});

test('existing public pages follow the same navigation sequence', () => {
  const files=['master-notes','field-guide','history','sources','other-side','translations',
    'translation-evidence','method-reference','glossary','cited-persons','religion-law',
    'gender-over-time','patterns-synthesis','personal-belief-history','search','comparisons'];
  for(const file of files){
    const s=readFileSync(file+'.html','utf8');
    const nav=s.match(/<nav class="rk-global-nav"[^>]*>([\s\S]*?)<\/nav>/);
    assert.ok(nav,'Missing navigation in '+file);
    assert.deepEqual([...nav[1].matchAll(/href="([^"]+)"/g)].map(m=>m[1]),[
      'index.html','history.html','religion-law.html','search.html'
    ],'Navigation order changed on '+file);
  }
});
