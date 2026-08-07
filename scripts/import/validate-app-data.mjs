import fs from 'node:fs';
import vm from 'node:vm';

const chunkFiles = [
  'data/normalized/generated/records.master.js',
  'data/normalized/generated/records.field-guide.js',
  'data/normalized/generated/records.glossary.js',
  'data/normalized/generated/records.history.js',
  'data/normalized/generated/records.sources.js',
  'data/normalized/generated/records.other-side.js',
  'data/normalized/generated/records.translations.js',
];

const sandbox = { window: {} };
vm.createContext(sandbox);

for (const file of ['data/normalized/records.js', ...chunkFiles]) {
  if (!fs.existsSync(file)) throw new Error(`Missing app data script: ${file}`);
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
}

const records = sandbox.window.RELIGION_KNOWLEDGE_RECORDS;
if (!Array.isArray(records)) throw new Error('App data scripts did not create RELIGION_KNOWLEDGE_RECORDS');

const manifest = JSON.parse(fs.readFileSync('data/normalized/generated/manifest.json', 'utf8'));
if (records.length !== manifest.records) {
  throw new Error(`App loaded ${records.length} records; manifest expects ${manifest.records}`);
}

const ids = new Set(records.map((record) => record.id));
if (ids.size !== records.length) throw new Error(`Duplicate record IDs in app data: ${records.length - ids.size}`);

const sourceCounts = new Map();
for (const record of records) {
  sourceCounts.set(record.source_file, (sourceCounts.get(record.source_file) || 0) + 1);
  if (!record.source_file || !record.source_reference) throw new Error(`Missing source linkage: ${record.id}`);
  if (record.attribution_evidence?.method === 'multiple_explicit_markers' && record.provenance_type !== 'REVIEW_REQUIRED') {
    throw new Error(`Multiple-marker record did not fail closed: ${record.id}`);
  }
}

for (const chunk of manifest.chunks) {
  const actual = sourceCounts.get(chunk.source_file) || 0;
  if (actual !== chunk.records) {
    throw new Error(`${chunk.source_file}: app loaded ${actual}, manifest expects ${chunk.records}`);
  }
}

const html = fs.readFileSync('app/index.html', 'utf8');
let lastPosition = -1;
for (const file of chunkFiles) {
  const src = `../${file}`;
  const position = html.indexOf(src);
  if (position < 0) throw new Error(`app/index.html does not load ${src}`);
  if (position <= lastPosition) throw new Error(`Chunk scripts are out of order around ${src}`);
  lastPosition = position;
}

const overridesPosition = html.indexOf('../data/review/overrides.js');
const appPosition = html.indexOf('src="app.js"');
if (overridesPosition < lastPosition) throw new Error('Review overrides must load after normalized chunks');
if (appPosition < overridesPosition) throw new Error('app.js must load after review overrides');

const counts = records.reduce((acc, record) => {
  acc[record.provenance_type] = (acc[record.provenance_type] || 0) + 1;
  return acc;
}, {});

console.log(`APP_DATA_VALIDATION=${JSON.stringify({ records: records.length, unique_ids: ids.size, provenance_counts: counts })}`);
