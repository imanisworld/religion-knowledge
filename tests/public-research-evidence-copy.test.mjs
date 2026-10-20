import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const prophecy = readFileSync('prophecy-audit.html', 'utf8');
const illness = readFileSync('illness-explanations.html', 'utf8');
const search = JSON.parse(readFileSync('search-index.json', 'utf8'));

test('public research readers disclose evidence limits without repository workflow text', () => {
  for (const [label, html] of [['prophecy', prophecy], ['illness', illness]]) {
    assert.match(html, /About the evidence:/i, label + ' should explain evidence in plain language');
    assert.match(html, /original-language/i, label + ' should explain language-source limits');
    assert.doesNotMatch(html, /\bowner\b|\bwaived\b|PR #\d+|claim registry|github\.com\//i, label + ' leaks internal release details');
    assert.doesNotMatch(html, /href="research\//i, label + ' links readers to research worklogs');
    assert.doesNotMatch(html, /review pending|editorial and verification gate/i, label + ' shows an internal review queue');
  }
});

test('prophecy case studies remain browseable with original historical cautions', () => {
  assert.equal((prophecy.match(/<article class="case">/g) || []).length, 65);
  assert.equal((prophecy.match(/<p class="meta">/g) || []).length, 65);
  assert.equal(search.filter(x => x.doc === 'Biblical Prophecy Audit').length, 70);
  assert.match(prophecy, /Some original-language witnesses and scholarly works have not been checked in full/);
  assert.match(prophecy, /historical miracle unverified/i);
  assert.ok(prophecy.includes('21 additional potential topics'));
});

test('illness comparisons keep sources and readable limits while removing worklist language', () => {
  assert.equal((illness.match(/<h2 id="illness-\d+"/g) || []).length, 9);
  assert.equal((illness.match(/class="evidence-card"/g) || []).length, 6);
  assert.equal(search.filter(x => x.doc === 'Illness Explanations').length, 9);
  assert.match(illness, /Sources and evidence limits/);
  assert.match(illness, /The primary Mari tablets were not examined/);
  assert.match(illness, /Scurlock and Lawrence/);
  assert.ok(illness.includes('href="field-guide.html"'));
  assert.ok(illness.includes('href="master-notes.html"'));
});
