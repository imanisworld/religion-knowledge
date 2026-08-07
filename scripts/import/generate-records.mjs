import fs from 'node:fs';
import path from 'node:path';
import { parseMarkdown, PARSER_VERSION } from './parse-markdown.mjs';

const MAX_CHUNK_BYTES = 950_000;
const CANONICAL_FILES = [
  ['Bible_Deep_Dive_Master_Notes.md', 'records.master.js'],
  ['Field_Guide_Conversation_Reference.md', 'records.field-guide.js'],
  ['Glossary.md', 'records.glossary.js'],
  ['Historical_Framework.md', 'records.history.js'],
  ['Sources_and_Primary_Texts.md', 'records.sources.js'],
  ['The_Other_Side.md', 'records.other-side.js'],
  ['Translations.md', 'records.translations.js'],
];

function parseArgs(argv) {
  const args = { outputDir: 'data/normalized/generated' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--output-dir') {
      if (!argv[i + 1]) throw new Error('--output-dir requires a path');
      args.outputDir = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function validateRecords(records) {
  const ids = new Set();
  const allIds = new Set(records.map((record) => record.id));
  const errors = [];

  for (const record of records) {
    if (!record.id) errors.push('record missing id');
    if (ids.has(record.id)) errors.push(`duplicate id: ${record.id}`);
    ids.add(record.id);

    if (!record.source_file || !record.source_reference) {
      errors.push(`missing source linkage: ${record.id}`);
    }

    if (record.provenance_type === 'INFERENCE' && record.representation_type === 'VERBATIM') {
      errors.push(`inference represented as verbatim: ${record.id}`);
    }

    if (['MY_WORDS', 'MY_POSITION', 'MY_QUESTION'].includes(record.provenance_type)) {
      const method = record.attribution_evidence?.method;
      if (!['explicit_marker', 'document_provenance', 'manual_review_override'].includes(method)) {
        errors.push(`unsafe user attribution: ${record.id}`);
      }
    }

    for (const relatedId of record.related_ids || []) {
      if (!allIds.has(relatedId)) errors.push(`broken relation: ${record.id} -> ${relatedId}`);
    }
  }

  if (errors.length) {
    throw new Error(`Generated record validation failed:\n${errors.join('\n')}`);
  }
}

function buildSummary(records, warnings, chunks) {
  const provenance = {};
  const recordTypes = {};
  for (const record of records) {
    provenance[record.provenance_type] = (provenance[record.provenance_type] || 0) + 1;
    recordTypes[record.record_type] = (recordTypes[record.record_type] || 0) + 1;
  }
  return {
    parser_version: PARSER_VERSION,
    canonical_files: CANONICAL_FILES.length,
    records: records.length,
    warnings: warnings.length,
    review_required: records.filter((record) => record.review_required || record.provenance_type === 'REVIEW_REQUIRED').length,
    provenance_counts: provenance,
    record_type_counts: recordTypes,
    chunks,
  };
}

function writeChunk(outputDir, sourceFile, outputName, records) {
  const header = [
    '// GENERATED FILE — DO NOT HAND EDIT.',
    `// Source: ${sourceFile}`,
    `// Parser version: ${PARSER_VERSION}`,
    '// Regenerate with: npm run generate-records',
    '',
  ].join('\n');
  const body = `window.RELIGION_KNOWLEDGE_RECORDS = (window.RELIGION_KNOWLEDGE_RECORDS || []).concat(${JSON.stringify(records, null, 2)});\n`;
  const content = header + body;
  const bytes = Buffer.byteLength(content, 'utf8');
  if (bytes > MAX_CHUNK_BYTES) {
    throw new Error(`Generated chunk ${outputName} is ${bytes} bytes, above ${MAX_CHUNK_BYTES}`);
  }
  const outputPath = path.join(outputDir, outputName);
  fs.writeFileSync(outputPath, content, 'utf8');
  return { source_file: sourceFile, file: outputName, records: records.length, size_bytes: bytes };
}

const { outputDir } = parseArgs(process.argv.slice(2));
const absoluteOutputDir = path.resolve(outputDir);
fs.mkdirSync(absoluteOutputDir, { recursive: true });

const allRecords = [];
const warnings = [];
const parsedBySource = new Map();

for (const [sourceFile] of CANONICAL_FILES) {
  if (!fs.existsSync(sourceFile)) throw new Error(`Canonical source missing: ${sourceFile}`);
  const content = fs.readFileSync(sourceFile, 'utf8');
  const parsed = parseMarkdown({ sourceFile, content });
  parsedBySource.set(sourceFile, parsed.records);
  allRecords.push(...parsed.records);
  warnings.push(...parsed.warnings.map((warning) => ({ source_file: sourceFile, ...warning })));
}

validateRecords(allRecords);

const chunks = CANONICAL_FILES.map(([sourceFile, outputName]) =>
  writeChunk(absoluteOutputDir, sourceFile, outputName, parsedBySource.get(sourceFile) || [])
);

const summary = buildSummary(allRecords, warnings, chunks);
fs.writeFileSync(
  path.join(absoluteOutputDir, 'manifest.json'),
  `${JSON.stringify(summary, null, 2)}\n`,
  'utf8'
);

console.log(`GENERATION_SUMMARY=${JSON.stringify(summary)}`);
if (warnings.length) console.log(`GENERATION_WARNING_CODES=${JSON.stringify(warnings.reduce((acc, warning) => {
  const key = `${warning.source_file}:${warning.code}`;
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {}))}`);
console.log(`GENERATED_OUTPUT_DIR=${path.relative(process.cwd(), absoluteOutputDir)}`);
