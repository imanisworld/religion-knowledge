import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('unresolved Texas §21.06 motive stays outside classified A–E comparisons', () => {
  const records = JSON.parse(readFileSync('research/religion-law/records/us-state-starter.json', 'utf8'));
  const pending = JSON.parse(readFileSync('research/religion-law/records/pending-causation/us-tx-penal-21-06.json', 'utf8'));
  const texas = readFileSync('research/religion-law/us-states/texas.md', 'utf8');
  const index = JSON.parse(readFileSync('search-index.json', 'utf8'));

  assert.ok(!records.some(row => row.id === 'US-TX-PENAL-21-06'), 'unverified causation must not be classified as E or any A–E code');
  assert.equal(pending.id, 'US-TX-PENAL-21-06');
  assert.equal(pending.classification_status, 'undetermined_not_promoted');
  assert.ok(!Object.hasOwn(pending.record, 'classification'), 'pending record must carry no live A–E classification');
  assert.equal(pending.record.status, 'unenforceable', 'Lawrence status remains independent of causation');
  const registry = JSON.parse(readFileSync('docs/research/claim-registry.json', 'utf8'));
  const claim = registry.find(entry => entry.claim_id === 'RL-TX2106-001');
  assert.ok(claim, 'The audited historical-motive claim retains its provenance record');
  assert.equal(claim.status, 'needs_qualification');
  assert.equal(claim.confidence, 'contested');
  assert.match(claim.claim_text, /provision-specific enactment motive remains unresolved/);
  assert.ok(!claim.public_locations.some(x=>x.file==='research/religion-law/records/us-state-starter.json'));
  assert.match(texas, /§21\.06-specific motive unresolved/);
  assert.match(texas, /pending-causation\/us-tx-penal-21-06\.json/);
  const match = index.find(row => row.url === 'religion-law.html#state=texas');
  assert.ok(match, 'Texas search result exists');
  assert.match(match.text, /(?:motive|causation) unresolved/);
});

test('provisional Montana historical evidence and state-law coverage remain visible', () => {
  const file = p => readFileSync(p, 'utf8');
  const montana = file('research/religion-law/us-states/montana.md');
  const index = file('research/religion-law/us-states/index.md');
  const gap = file('research/religion-law/gap-closure/README.md');
  const anchor = file('research/religion-law/us-states/anchor-state-status.md');
  const reader = file('religion-law.html');
  const records = JSON.parse(file('research/religion-law/records/us-state-starter.json'));
  const mt = records.find(r => r.id === 'US-MT-CONST-ARTX-S6');
  assert.ok(mt);
  assert.equal(mt.confidence, 'medium');
  assert.match(mt.scope_note, /original Vol\. VI page images/);
  assert.match(mt.scope_note, /Vol\. II committee records/);
  assert.match(montana, /1972 convention historical-causation assessment provisional/);
  assert.match(index, /34 states have no such records yet/);
  assert.match(index, /1973 §21\.06-specific motive unresolved/);
  assert.match(anchor, /Texas §21\.06's motive and Montana's 1972/);
  assert.match(gap, /Unresolved motive/);
  assert.match(gap, /Provisional historical reading/);
  assert.match(reader, /Scope &amp; evidence limits/);
  assert.match(reader, /r\.scope_note/);
  assert.match(reader, /states without normalized law records/);
  assert.match(reader, /Texas §21\.06 is deliberately withheld/);
});
