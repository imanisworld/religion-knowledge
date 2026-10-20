import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const claims = [
  ['phase5-creation-narratives/claim_kiche_popol_vuh_manuscript_catalog_date.json', 'trad_kiche_maya_religion'],
  ['phase7-transmission/claim_ugarit_baal_cycle_ao16643_inventory.json', 'trad_late_bronze_canaanite_religion'],
  ['phase7-transmission/claim_aksum_endubis_disc_crescent_bm_coin.json', 'trad_aksumite_paganism'],
  ['phase7-transmission/claim_aksum_constantius_frumentius_ath31.json', 'trad_aksumite_christianity'],
  ['phase7-transmission/claim_aksum_christian_cross_bm_coin.json', 'trad_aksumite_christianity'],
  ['phase7-transmission/claim_kongo_afonso_1517_religious_request.json', 'trad_kongo_christianity'],
  ['phase7-transmission/claim_antonianism_1704_1706_met_essay.json', 'trad_antonianism'],
];

const readClaim = file => JSON.parse(readFileSync(path.join('docs/timeline/data/claims', file), 'utf8'));

test('six tradition profiles have seven narrowly scoped draft claims, not published assumptions', () => {
  const subjects = new Set();
  for (const [file, subject] of claims) {
    const record = readClaim(file);
    subjects.add(record.subject_id);
    assert.equal(record.status, 'draft', file + ' must remain in the independent source review gate');
    assert.equal(record.subject_type, 'Tradition');
    assert.equal(record.subject_id, subject);
    assert.ok(record.statement.length > 50);
    assert.ok(record.sources.length >= 1);
    assert.ok(record.does_not_demonstrate?.length >= 2, file + ' must show historical limits');
    assert.ok(record.adversarial_counter?.length > 12);
    for (const source of record.sources) {
      assert.ok(source.citation.includes('https://'), file + ' needs a precise source locator');
      assert.match(source.verification_method, /^(DIRECT_READ|SEARCH_SNIPPET)$/);
      if (source.verification_method === 'SEARCH_SNIPPET') {
        assert.match(source.access_note || '', /not (?:read|checked)|403|paywall|paywalled|search result|indexed/i);
      }
    }
  }
  assert.equal(subjects.size, 6);
});

test('no narrow museum record can be used to assert earliest religion, precise conversion or shared origin', () => {
  const coin = readClaim('phase7-transmission/claim_aksum_endubis_disc_crescent_bm_coin.json');
  const cross = readClaim('phase7-transmission/claim_aksum_christian_cross_bm_coin.json');
  assert.equal(coin.sources[0].verification_method, 'SEARCH_SNIPPET');
  assert.equal(cross.sources[0].verification_method, 'SEARCH_SNIPPET');
  assert.deepEqual(cross.date, { earliest: 340, latest: 540, precision: 'CENTURY' });
  assert.match(cross.statement, /anonymous/i);
  assert.match(coin.statement, /without by itself identifying/i);
  const kiche = readClaim('phase5-creation-narratives/claim_kiche_popol_vuh_manuscript_catalog_date.json');
  assert.match(kiche.notes, /1701–1703/);
  assert.match(kiche.adversarial_counter, /1700–1715/);
});

test('Aksumite letter and Kongo royal request use honestly scoped primary access', () => {
  const ath = readClaim('phase7-transmission/claim_aksum_constantius_frumentius_ath31.json');
  assert.match(ath.sources[0].citation, /Apologia ad Constantium §31/);
  assert.equal(ath.date, null);
  assert.equal(ath.sources[0].verification_method, 'DIRECT_READ');
  assert.match(ath.sources[0].access_note, /English translation/);
  const kongo = readClaim('phase7-transmission/claim_kongo_afonso_1517_religious_request.json');
  assert.equal(kongo.sources[0].type, 'SECONDARY');
  assert.match(kongo.sources[0].access_note, /original Portuguese manuscript and transcription were not read/i);
  const antonian = readClaim('phase7-transmission/claim_antonianism_1704_1706_met_essay.json');
  assert.doesNotMatch(antonian.statement, /Pedro II|Pedro IV/);
  assert.match(antonian.notes, /Pedro II.*Pedro IV/);
});
