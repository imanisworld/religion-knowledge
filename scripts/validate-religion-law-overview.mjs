import fs from 'node:fs';

const ROOT = 'research/religion-law/records';
const inputs = [
  { file: `${ROOT}/policy-influence.json`, kind: 'policy', prefix: 'POL-', fields: ['id','issue','government_question','religion_involvement','legal_status','sources','last_verified','confidence','scope_note'] },
  { file: `${ROOT}/global-legal-structure.json`, kind: 'global', prefix: 'GLOBAL-', fields: ['id','issue','us_structure','global_structure','sources','last_verified','confidence','scope_note'] },
];
const sourceTypes = new Set(['legal','polling','advocacy','status_tracker','comparative','comparative_primary','research']);
const confidence = new Set(['high','medium','low','contested']);
const seen = new Set();
const errors = [];
let total = 0;

for (const input of inputs) {
  let rows;
  try {
    rows = JSON.parse(fs.readFileSync(input.file, 'utf8'));
  } catch (error) {
    errors.push(`${input.file}: cannot parse JSON: ${error.message}`);
    continue;
  }
  if (!Array.isArray(rows) || !rows.length) {
    errors.push(`${input.file}: expected a non-empty array`);
    continue;
  }
  total += rows.length;
  for (const [index, row] of rows.entries()) {
    const at = `${input.file}[${index}]`;
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      errors.push(`${at}: expected object`);
      continue;
    }
    const allowed = new Set(input.fields);
    for (const key of input.fields) {
      if (row[key] === undefined || row[key] === null || row[key] === '' || (Array.isArray(row[key]) && !row[key].length)) {
        errors.push(`${at}: missing ${key}`);
      }
    }
    for (const key of Object.keys(row)) {
      if (!allowed.has(key)) errors.push(`${at}: unknown field ${key}`);
    }
    if (typeof row.id === 'string') {
      if (!row.id.startsWith(input.prefix)) errors.push(`${at}: id must start with ${input.prefix}`);
      if (seen.has(row.id)) errors.push(`${at}: duplicate id ${row.id}`);
      seen.add(row.id);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(row.last_verified || '')) errors.push(`${at}: last_verified must be YYYY-MM-DD`);
    if (!confidence.has(row.confidence)) errors.push(`${at}: invalid confidence ${row.confidence}`);
    if (!Array.isArray(row.sources) || !row.sources.length) {
      errors.push(`${at}: sources must be a non-empty array`);
    } else {
      for (const [sourceIndex, source] of row.sources.entries()) {
        const sat = `${at}.sources[${sourceIndex}]`;
        if (!source || typeof source !== 'object' || Array.isArray(source)) {
          errors.push(`${sat}: expected object`);
          continue;
        }
        for (const key of ['label','url','type']) if (!source[key]) errors.push(`${sat}: missing ${key}`);
        for (const key of Object.keys(source)) if (!['label','url','type'].includes(key)) errors.push(`${sat}: unknown field ${key}`);
        if (source.url && !/^https:\/\//.test(source.url)) errors.push(`${sat}: URL must use https`);
        if (source.type && !sourceTypes.has(source.type)) errors.push(`${sat}: invalid source type ${source.type}`);
      }
    }
  }
}

if (errors.length) {
  console.error('Religion & Law overview validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Religion & Law overview validation passed: ${total} records, ${seen.size} unique IDs.`);
