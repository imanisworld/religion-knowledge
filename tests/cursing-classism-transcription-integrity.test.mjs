import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ROOT = 'research/cursing-classism/';
function csv(path) {
  let text = fs.readFileSync(ROOT + path, 'utf8').replace(/^\uFEFF/, '');
  const rows = [];
  let line = [], part = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { part += '"'; i++; }
      else if (c === '"') quoted = false;
      else part += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { line.push(part); part = ''; }
    else if (c === '\n') { line.push(part); rows.push(line); line = []; part = ''; }
    else if (c !== '\r') part += c;
  }
  if (line.length || part) { line.push(part); rows.push(line); }
  const [fields, ...records] = rows;
  return records.map(record => Object.fromEntries(fields.map((key, i) => [key, record[i] || ''])));
}
const entries = csv('appearances.csv');
const proposed = csv('candidate-duplicates.csv');
const byId = new Map(entries.map(x => [x.id, x]));

test('353+ source mentions remain separate, no inferred unique-person count', () => {
  assert.equal(entries.length, 355);
  assert.equal(byId.size, 355);
  assert.deepEqual([...new Set(entries.map(x => x.batch))].sort(), ['5','6','7']);
  const fineValues = entries.filter(x => x.fine_shillings_assessed !== '').map(x => Number(x.fine_shillings_assessed));
  assert.equal(fineValues.length, 52);
  assert.equal(fineValues.reduce((sum, n) => sum + n, 0), 172);
  assert.ok(entries.every(x => !Object.hasOwn(x, 'same_person_id')), 'do not silently merge historical people');
});

test('all 32 candidate name groups preserve their appearance IDs and flag qualified-name collisions', () => {
  assert.equal(proposed.length, 32);
  const seen = new Set();
  for (const group of proposed) {
    const ids = group.ids.split(';');
    assert.equal(Number(group.appearances), ids.length);
    assert.ok(group.status, group.name + ' missing review status');
    for (const id of ids) {
      assert.ok(byId.has(id), group.name + ' refers to missing ' + id);
      assert.ok(!seen.has(id), id + ' added to two candidate groups');
      seen.add(id);
      const row = byId.get(id);
      if (row.name !== group.name) {
        assert.match(group.status, /QUALIFIER COLLISION|DISTINCT QUALIFIERS/,
          'Different named people must be explicitly held: ' + group.name + '/' + row.name);
      }
    }
  }
  assert.match(proposed.find(x => x.name === 'Nicholas Grainge senior').status, /DISTINCT QUALIFIERS/);
  assert.match(proposed.find(x => x.name === 'Thomas Stevens').status, /CONFLICTING ROLES/);
  assert.match(proposed.find(x => x.name === 'Michael Baldwin').status, /DIFFERENT LOCALITY/);
});

test('narrative qualifiers do not become invented geographical locations', () => {
  for (const id of ['BK168', 'BK178']) {
    assert.equal(byId.get(id).location, '');
    assert.match(byId.get(id).name_detail, /appearance/);
  }
});

test('research-only audit preserves the source verification hold', () => {
  const note = fs.readFileSync(ROOT + 'duplicate-group-review-20261020.md', 'utf8');
  assert.match(note, /original page images.*not re-examined/i);
  assert.match(note, /No person deduplication authorized/i);
  assert.match(note, /52 explicit fines and 172 assessed shillings/);
});
