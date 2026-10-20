import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync('illness-explanations.html', 'utf8');
const source = readFileSync('research/illness-explanations/index.md', 'utf8');
const registry = JSON.parse(readFileSync('docs/research/claim-registry.json', 'utf8'));
const claims = Array.isArray(registry) ? registry : (registry.claims || registry.records || registry.entries || []);

test('illness source study is complete, qualified, and represented in the public reader', () => {
  assert.equal((source.match(/^## \d+\./gm) || []).length, 9);
  assert.equal((html.match(/<h2 id="illness-\d+"/g) || []).length, 9);
  assert.equal((html.match(/class="evidence-card"/g) || []).length, 6);
  assert.ok(html.includes('Sources and evidence limits'));
  assert.ok(html.includes('Some original-language and scholarly sources remain unchecked'));
  assert.ok(html.includes('This survey has not undergone an outside specialist review.'));
  assert.doesNotMatch(html, /\bowner\b|waived|PR #|claim registry|Editorial and verification gate/i);
  assert.ok(html.includes('Nineteenth-century'));
  assert.ok(!html.includes('github.com/'));
  for (const phrase of ['John 9:1–3', 'Sirach 38:1–15', 'Hippocratic', 'Feder', 'Koch']) {
    assert.ok(html.includes(phrase), 'Missing research passage: ' + phrase);
  }
});

test('illness registry preserves thirteen unique staged IDs with review limits', () => {
  const ids = claims.map(x => x.claim_id);
  assert.equal(new Set(ids).size, ids.length);
  const illness = claims.filter(x => x.claim_id?.startsWith('IL-'));
  assert.equal(illness.length, 13);
  assert.equal(illness.filter(x => x.status === 'verified').length, 4);
  assert.equal(illness.filter(x => x.status === 'verified_with_qualification').length, 9);
  assert.ok(illness.every(x => /independent review pending|external independent review pending|AI review|source check/i.test(x.reviewer + ' ' + x.notes)));
});

test('illness module is registered in library, build, and Search', () => {
  const search = JSON.parse(readFileSync('search-index.json', 'utf8'));
  const links = search.filter(x => x.doc === 'Illness Explanations');
  assert.equal(links.length, 9);
  assert.ok(links.every(x => x.url.startsWith('illness-explanations.html#illness-')));
  const siteScript = readFileSync('scripts/build-reader-site.mjs', 'utf8');
  assert.ok(siteScript.includes("'illness-explanations.html'"));
  assert.ok(siteScript.includes("'research/illness-explanations'"));
  const homepage = readFileSync('dist/reader-site/index.html', 'utf8');
  assert.ok(homepage.includes('href="illness-explanations.html"'));
  assert.ok(readFileSync('comparisons.html', 'utf8').includes('illness-explanations.html#illness-2'));
  assert.ok(html.includes('@media(max-width:730px)') && html.includes('grid-template-columns:1fr'));
});
