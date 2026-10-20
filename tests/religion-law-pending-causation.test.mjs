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
  assert.match(match.text, /motive unresolved/);
});
