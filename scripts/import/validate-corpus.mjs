import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parseMarkdown, PARSER_VERSION } from './parse-markdown.mjs';

const root = process.cwd();
const excludedMarkdown = new Set(['README.md', 'CLAUDE.md']);
const rootFiles = fs.readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .sort();

const markdownFiles = rootFiles.filter((name) => name.endsWith('.md') && !excludedMarkdown.has(name));
const htmlFiles = rootFiles.filter((name) => name.endsWith('.html'));

if (markdownFiles.length === 0) {
  throw new Error('No canonical root Markdown corpus files found.');
}

const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');
const normalizeStem = (name) => name
  .replace(/\.(md|html)$/i, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const aliases = new Map([
  ['bible deep dive master notes', ['master notes']],
  ['field guide conversation reference', ['field guide']],
  ['glossary', ['glossary']],
  ['historical framework', ['history', 'historical framework']],
  ['method and reference', ['method reference']],
  ['sources and primary texts', ['sources', 'sources and primary texts']],
  ['the other side', ['other side', 'the other side']],
  ['translations', ['translations']],
]);

const canonicalByStem = new Map(markdownFiles.map((name) => [normalizeStem(name), name]));
const derivedRepresentations = [];
const unclassifiedHtml = [];

for (const html of htmlFiles) {
  const stem = normalizeStem(html);
  let canonical = canonicalByStem.get(stem) ?? null;
  if (!canonical) {
    for (const [mdStem, htmlAliases] of aliases) {
      if (htmlAliases.includes(stem) && canonicalByStem.has(mdStem)) {
        canonical = canonicalByStem.get(mdStem);
        break;
      }
    }
  }
  if (canonical) derivedRepresentations.push({ html, canonical });
  else unclassifiedHtml.push(html);
}

const manifest = [];
const results = [];
const allRecords = [];
const allWarnings = [];

for (const sourceFile of markdownFiles) {
  const content = fs.readFileSync(path.join(root, sourceFile), 'utf8');
  const parsed = parseMarkdown({ sourceFile, content });
  manifest.push({
    path: sourceFile,
    sha256: sha256(content),
    size_bytes: Buffer.byteLength(content),
    parser_version: PARSER_VERSION,
    role: 'canonical_markdown',
  });
  results.push({
    source_file: sourceFile,
    records: parsed.records.length,
    warnings: parsed.warnings.length,
    review_required: parsed.records.filter((r) => r.review_required).length,
  });
  allRecords.push(...parsed.records);
  allWarnings.push(...parsed.warnings.map((warning) => ({ source_file: sourceFile, ...warning })));
}

const ids = new Set();
const duplicateIds = [];
for (const record of allRecords) {
  if (ids.has(record.id)) duplicateIds.push(record.id);
  ids.add(record.id);
}

const brokenRelations = [];
for (const record of allRecords) {
  for (const related of record.related_ids ?? []) {
    if (!ids.has(related)) brokenRelations.push({ id: record.id, related });
  }
}

const provenanceCounts = Object.fromEntries(
  ['MY_WORDS', 'MY_POSITION', 'MY_QUESTION', 'CLAUDE', 'CHATGPT', 'SOURCE', 'INFERENCE', 'REVIEW_REQUIRED']
    .map((key) => [key, allRecords.filter((r) => r.provenance_type === key).length]),
);
const representationCounts = Object.fromEntries(
  ['VERBATIM', 'PARAPHRASE', 'SUMMARY', 'INFERENCE']
    .map((key) => [key, allRecords.filter((r) => r.representation_type === key).length]),
);
const recordTypeCounts = {};
for (const record of allRecords) recordTypeCounts[record.record_type] = (recordTypeCounts[record.record_type] ?? 0) + 1;

const unsafeUserAttribution = allRecords.filter((record) =>
  ['MY_WORDS', 'MY_POSITION', 'MY_QUESTION'].includes(record.provenance_type)
  && record.attribution_evidence?.method === 'none'
);
const inferenceAsVerbatim = allRecords.filter((record) =>
  (record.provenance_type === 'INFERENCE' || record.representation_type === 'INFERENCE')
  && record.representation_type === 'VERBATIM'
);
const missingSource = allRecords.filter((record) => !record.source_file || !record.source_reference);

const summary = {
  corpus_files: markdownFiles.length,
  html_files: htmlFiles.length,
  parser_version: PARSER_VERSION,
  total_records: allRecords.length,
  total_warnings: allWarnings.length,
  review_required: allRecords.filter((r) => r.review_required).length,
  provenance_counts: provenanceCounts,
  representation_counts: representationCounts,
  record_type_counts: recordTypeCounts,
  duplicate_ids: duplicateIds.length,
  broken_relations: brokenRelations.length,
  unsafe_user_attribution: unsafeUserAttribution.length,
  inference_as_verbatim: inferenceAsVerbatim.length,
  missing_source_linkage: missingSource.length,
  derived_html_representations: derivedRepresentations.length,
  unclassified_html: unclassifiedHtml.length,
  per_file: results,
};

console.log('CORPUS_VALIDATION_SUMMARY=' + JSON.stringify(summary));
console.log('CORPUS_MANIFEST=' + JSON.stringify(manifest));
console.log('DERIVED_HTML=' + JSON.stringify(derivedRepresentations));
console.log('UNCLASSIFIED_HTML=' + JSON.stringify(unclassifiedHtml));
console.log('WARNING_CODES=' + JSON.stringify(allWarnings.reduce((acc, warning) => {
  const key = `${warning.source_file}:${warning.code}`;
  acc[key] = (acc[key] ?? 0) + 1;
  return acc;
}, {})));

const hardFailures = [];
if (allWarnings.length) hardFailures.push(`parser warnings: ${allWarnings.length}`);
if (duplicateIds.length) hardFailures.push(`duplicate IDs: ${duplicateIds.length}`);
if (brokenRelations.length) hardFailures.push(`broken relationships: ${brokenRelations.length}`);
if (unsafeUserAttribution.length) hardFailures.push(`unsafe user attribution: ${unsafeUserAttribution.length}`);
if (inferenceAsVerbatim.length) hardFailures.push(`inference represented as verbatim: ${inferenceAsVerbatim.length}`);
if (missingSource.length) hardFailures.push(`missing source linkage: ${missingSource.length}`);

if (hardFailures.length) {
  throw new Error('Corpus validation failed: ' + hardFailures.join('; '));
}
