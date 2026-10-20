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
  ['phase7-transmission/claim_ifa_living_divination_unesco.json', 'trad_ifa_orisa'],
  ['phase7-transmission/claim_ifa_osun_grove_unesco_continuity.json', 'trad_ifa_orisa'],
  ['phase7-transmission/claim_anangu_tjukurpa_law_public_boundary.json', 'trad_anangu_tjukurpa'],
  ['phase7-transmission/claim_tiwi_pukumani_museum_practice.json', 'trad_tiwi_pukumani'],
  ['phase7-transmission/claim_mexica_templo_mayor_1390_offerings_inah.json', 'trad_mexica_religion'],
  ['phase7-transmission/claim_lakota_1967_pipe_story_nmai.json', 'trad_lakota_religion'],
  ['phase7-transmission/claim_haudenosaunee_peace_clan_mothers_nmai.json', 'trad_haudenosaunee_religion'],
  ['phase7-transmission/claim_inca_cusco_ritual_vessel_bm.json', 'trad_inca_state_religion'],
  ['phase7-transmission/claim_hopi_katsina_early_dolls_heard.json', 'trad_hopi_religion'],
  ['phase7-transmission/claim_fon_abomey_royal_sacred_spaces_unesco.json', 'trad_fon_vodun'],
  ['phase7-transmission/claim_shona_matobo_mwari_living_unesco.json', 'trad_shona_religion']
];

const readClaim = file => JSON.parse(readFileSync(path.join('docs/timeline/data/claims', file), 'utf8'));

test('sixteen tradition profiles have eighteen narrowly scoped draft claims, not published assumptions', () => {
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
  assert.equal(subjects.size, 16);
});

test('no narrow museum record can be used to assert earliest religion, precise conversion or shared origin', () => {
  const coin = readClaim('phase7-transmission/claim_aksum_endubis_disc_crescent_bm_coin.json');
  const cross = readClaim('phase7-transmission/claim_aksum_christian_cross_bm_coin.json');
  assert.equal(coin.sources[0].verification_method, 'SEARCH_SNIPPET');
  assert.equal(cross.sources[0].verification_method, 'SEARCH_SNIPPET');
  assert.equal(coin.date_semantics, 'EVENT_DATE', 'Coin date is not first evidence for a religion');
  assert.equal(cross.date_semantics, 'EVENT_DATE', 'Cross-bearing coin date is not a conversion start date');
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


test('ten additional tradition source audits preserve cultural scope and chronological limits', () => {
  const id = name => readClaim('phase7-transmission/claim_' + name + '.json');
  const candidates = [
    'ifa_living_divination_unesco',
    'ifa_osun_grove_unesco_continuity',
    'anangu_tjukurpa_law_public_boundary',
    'tiwi_pukumani_museum_practice',
    'mexica_templo_mayor_1390_offerings_inah',
    'lakota_1967_pipe_story_nmai',
    'haudenosaunee_peace_clan_mothers_nmai',
    'inca_cusco_ritual_vessel_bm',
    'hopi_katsina_early_dolls_heard',
    'fon_abomey_royal_sacred_spaces_unesco',
    'shona_matobo_mwari_living_unesco',
  ];
  assert.equal(candidates.length, 11);
  for (const name of candidates) {
    const record = id(name);
    assert.equal(record.status, 'draft');
    assert.equal(record.claim_tier, 'OBSERVATION');
    assert.ok(record.does_not_demonstrate.some(text => /date|origin|found|centur|earliest|age|ancient|continu/i.test(text)),
      'Chronological scope missing for ' + name);
    assert.ok(record.sources.every(src => src.citation.includes('https://')));
  }
  const mexica = id('mexica_templo_mayor_1390_offerings_inah');
  assert.equal(mexica.date.earliest, 1390);
  assert.equal(mexica.date_semantics, 'EVENT_DATE');
  assert.match(mexica.does_not_demonstrate.join(' '), /not the origin/);
  const anangu = id('anangu_tjukurpa_law_public_boundary');
  assert.match(anangu.statement + anangu.does_not_demonstrate.join(' '), /restricted/i);
  const lakota = id('lakota_1967_pipe_story_nmai');
  assert.equal(lakota.date, null, 'Narrative event should never inherit narrator recording date');
  assert.match(lakota.statement, /1967/);
  const shona = id('shona_matobo_mwari_living_unesco');
  assert.equal(shona.date, null);
  assert.match(shona.does_not_demonstrate.join(' '), /Iron Age/);
  for (const museum of ['inca_cusco_ritual_vessel_bm', 'hopi_katsina_early_dolls_heard']) {
    assert.equal(id(museum).sources[0].verification_method, 'SEARCH_SNIPPET');
  }
});
