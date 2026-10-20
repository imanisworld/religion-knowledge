import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const pages = ['prophecy-audit.html','gender-over-time.html','patterns-synthesis.html',
  'translation-evidence.html','personal-belief-history.html'];
test('all long specialist pages use the shared progressive topic navigation', () => {
  for (const file of pages) {
    const html=fs.readFileSync(file,'utf8');
    assert.match(html, /<main\b[^>]*\bdata-research-pager\b/,file);
    assert.match(html, /src="research-page-nav.js"/,file);
    assert.match(html, /href="research-page-nav.css"/,file);
  }
  const logic=fs.readFileSync('research-page-nav.js','utf8');
  assert.match(logic, /addEventListener\('hashchange'/);
  assert.match(logic, /addEventListener\('popstate'/);
  assert.match(logic, /article\.case/);
  assert.match(logic, /table tbody/);
  assert.doesNotMatch(logic, /fetch\(|innerHTML\s*=\s*location/);
});
test('Religion and Law keeps state routes, source data and filter behavior with bounded results', () => {
  const html=fs.readFileSync('religion-law.html','utf8');
  for (const phrase of ['const ROOT=', 'stateSearch', 'renderComparisonBody()',
    'LAW_ROWS_PER_PAGE=10', 'window.ResearchPageNav.attach(', 'paginateLawReference()',
    "root" ]) {
    if (phrase === 'root') continue;
    assert.ok(html.includes(phrase), 'Missing '+phrase);
  }
  assert.match(html, /renderComparisonBody\(\)\};?/);
  assert.match(html, /id="law-row-pager"/);
  assert.match(html, /src="research-page-nav.js"/);
});
const folder='dist/reader-site';
test('deployment excludes internal research controls but includes linked public research material', () => {
  assert.ok(fs.existsSync(path.join(folder,'research-page-nav.js')));
  assert.ok(fs.existsSync(path.join(folder,'research-page-nav.css')));
  const required=[
    'research/religion-law/us-states/index.md',
    'research/religion-law/us-states/indiana.md',
    'research/religion-law/us-states/wyoming.md',
    'research/religion-law/records/us-state-starter.json',
    'research/religion-law/context/us-state-context.json',
    'research/religion-law/us-constitutional-federal.md',
    'research/gender-over-time/index.md',
    'research/gender-over-time/records.json',
    'research/translation-evidence/index.md',
    'research/synthesis/index.md',
  ];
  for (const file of required)assert.ok(fs.existsSync(path.join(folder,file)),'Missing public dependency: '+file);
  const forbidden=[
    'research/illness-explanations/STATUS.md',
    'research/illness-explanations/PRE-REVIEW.md',
    'research/illness-explanations/REVIEW.md',
    'research/prophecy-audit/STATUS.md',
    'research/prophecy-audit/REVIEW.md',
    'research/prophecy-audit/TODO.md',
    'research/prophecy-audit/batch-10-imminence-staging.json',
    'research/religion-law/us-states/anchor-state-status.md',
    'research/religion-law/us-states/profile-template.md',
  ];
  for (const file of forbidden)assert.equal(fs.existsSync(path.join(folder,file)),false,'Internal file leaked: '+file);
  const dirs=fs.readdirSync(path.join(folder,'research'));
  assert.deepEqual(dirs.sort(),['gender-over-time','religion-law','synthesis','translation-evidence'].sort());
});
