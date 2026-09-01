import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_ROOT = path.join(ROOT, 'docs', 'timeline', 'data');
const OUTPUT = path.join(ROOT, 'timeline-app', 'data.js');

const ENTITY_TYPES = new Map([
  ['populations', 'Population'],
  ['cultures', 'Culture'],
  ['polities', 'Polity'],
  ['traditions', 'Tradition'],
  ['deities', 'Deity'],
  ['gender_systems', 'GenderSystem'],
  ['writing_systems', 'WritingSystem'],
  ['texts', 'Text'],
  ['narratives', 'Narrative'],
  ['knowledge_states', 'KnowledgeState'],
  ['persons', 'Person'],
  ['media_eras', 'MediaEra'],
  ['hypotheses', 'Hypothesis'],
]);

async function walkJson(dir) {
  const out = [];
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return out;
    throw error;
  }

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walkJson(full));
    else if (entry.isFile() && entry.name.endsWith('.json')) out.push(full);
  }
  return out;
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

function dateStart(record) {
  const date = record?.date || record?.date_range || record?.period || null;
  return Number.isFinite(date?.earliest) ? date.earliest : Number.POSITIVE_INFINITY;
}

const entityFiles = await walkJson(path.join(DATA_ROOT, 'entities'));
const claimFiles = await walkJson(path.join(DATA_ROOT, 'claims'));

const entities = [];
for (const file of entityFiles) {
  const value = await readJson(file);
  const records = Array.isArray(value) ? value : [value];
  const parent = path.basename(path.dirname(file));
  const entityType = ENTITY_TYPES.get(parent) || parent;
  for (const record of records) {
    entities.push({ ...record, _entity_type: entityType, _source_path: path.relative(ROOT, file) });
  }
}

const claims = [];
for (const file of claimFiles) {
  const value = await readJson(file);
  const records = Array.isArray(value) ? value : [value];
  for (const record of records) {
    claims.push({ ...record, _source_path: path.relative(ROOT, file) });
  }
}

entities.sort((a, b) => String(a.id || '').localeCompare(String(b.id || '')));
claims.sort((a, b) => dateStart(a) - dateStart(b) || String(a.id || '').localeCompare(String(b.id || '')));

const statuses = Object.create(null);
for (const claim of claims) statuses[claim.status || 'UNKNOWN'] = (statuses[claim.status || 'UNKNOWN'] || 0) + 1;

const payload = {
  generated_at: new Date().toISOString(),
  source: 'docs/timeline/data',
  entities,
  claims,
  meta: {
    entity_count: entities.length,
    claim_count: claims.length,
    claim_statuses: statuses,
  },
};

await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
await fs.writeFile(OUTPUT, `window.TIMELINE_RESEARCH_DATA = ${JSON.stringify(payload)};\n`, 'utf8');
console.log(`TIMELINE_UI_DATA=${JSON.stringify(payload.meta)}`);
