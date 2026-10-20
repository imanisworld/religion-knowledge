import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync('Cited_Persons.md', 'utf8');
const status = readFileSync('STATUS.md', 'utf8');
const lawReadme = readFileSync('research/religion-law/README.md', 'utf8');

test('Cited Persons progress counts agree with actual status markers', () => {
  const rows = source.split(/\r?\n/).filter(line => /^⟨(?:DOCUMENTED|UNRESOLVED)⟩ /.test(line));
  const documented = rows.filter(line => line.startsWith('⟨DOCUMENTED⟩')).length;
  const unresolved = rows.filter(line => line.startsWith('⟨UNRESOLVED⟩')).length;
  assert.ok(rows.length > 300, 'Unexpectedly small person index');
  assert.ok(source.includes(documented+' documented, '+unresolved+' unresolved'),
    'Canonical Cited Persons header no longer matches entries');
  assert.ok(status.includes(documented+' documented / '+unresolved+' unresolved'),
    'Status summary does not match canonical person index');
  assert.ok(status.includes('of '+rows.length),
    'Status summary does not include current total');
});

test('Religion & Law progress counts reflect structured records', () => {
  const context = JSON.parse(readFileSync('research/religion-law/context/us-state-context.json', 'utf8'));
  const laws = JSON.parse(readFileSync('research/religion-law/records/us-state-starter.json', 'utf8'));
  const complete = context.filter(row => row.coverage_status === 'verified_first_pass').length;
  const pending = context.filter(row => row.coverage_status === 'not_coded').length;
  const states = new Set(laws.map(row => row.subnational_jurisdiction).filter(Boolean)).size;
  assert.equal(context.length, 50, 'Context file should retain all 50 state slots');
  assert.equal(complete + pending, context.length, 'All context slots must have recognized coverage');
  for (const doc of [status, lawReadme]) {
    assert.ok(doc.includes(laws.length+' state-law records') || doc.includes(laws.length+' records'),
      'Research status must accurately report state law count');
    assert.ok(doc.includes(states+' states'), 'Research status must accurately report represented states');
    assert.ok(doc.includes(complete+' have verified first-pass') || doc.includes('only '+complete),
      'Research status must accurately report completed context states');
    assert.ok(doc.includes(pending+' remain') || doc.includes(pending+' remain uncoded'),
      'Research status must accurately report incomplete context states');
  }
});
