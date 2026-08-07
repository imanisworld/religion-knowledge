import fs from 'node:fs';
import path from 'node:path';
import { parseMarkdown, PARSER_VERSION } from './parse-markdown.mjs';

const CANONICAL_FILES = [
  'Bible_Deep_Dive_Master_Notes.md',
  'Field_Guide_Conversation_Reference.md',
  'Glossary.md',
  'Historical_Framework.md',
  'Sources_and_Primary_Texts.md',
  'The_Other_Side.md',
  'Translations.md',
];

function parseArgs(argv) {
  const args = { output: 'data/normalized/records.generated.js' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--output') {
      if (!argv[i + 1]) throw new Error('--output requires a path');
      args.output = argv[i + 1];
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

function buildSummary(records, warnings) {
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
  };
}

const { output } = parseArgs(process.argv.slice(2));
const records = [];
const warnings = [];

for (const sourceFile of CANONICAL_FILES) {
  if (!fs.existsSync(sourceFile)) throw new Error(`Canonical source missing: ${sourceFile}`);
  const content = fs.readFileSync(sourceFile, 'utf8');
  const parsed = parseMarkdown({ sourceFile, content });
  records.push(...parsed.records);
  warnings.push(...parsed.warnings.map((warning) => ({ source_file: sourceFile, ...warning })));
}

validateRecords(records);

const outputPath = path.resolve(output);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
const header = [
  '// GENERATED FILE — DO NOT HAND EDIT.',
  `// Parser version: ${PARSER_VERSION}`,
  '// Regenerate with: npm run generate-records',
  '',
].join('\n');
const body = `window.RELIGION_KNOWLEDGE_RECORDS = ${JSON.stringify(records, null, 2)};\n`;
fs.writeFileSync(outputPath, header + body, 'utf8');

const summary = buildSummary(records, warnings);
console.log(`GENERATION_SUMMARY=${JSON.stringify(summary)}`);
if (warnings.length) console.log(`GENERATION_WARNING_CODES=${JSON.stringify(warnings.reduce((acc, warning) => {
  const key = `${warning.source_file}:${warning.code}`;
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {}))}`);
console.log(`GENERATED_OUTPUT=${path.relative(process.cwd(), outputPath)}`);
